// Actions du joueur : liste des actions permises et application (fonctions pures vues de l'extérieur).
import { AL, DOC, EV, MT, OP, PARAMS, TH, TYPES_CAPTEURS, UN } from '../data';
import type { Action, ChoixDef, Effets, Etat, OperationDef } from './types';
import { alea, borner, cleAction, cloner } from './outils';
import {
  BONUS_PERIODIQUES, actionsParTour, appuiDef, capteursLibres, coutMult, decider, delaiProjection,
  devise, enIndisponibilite, journaliser, menaceParId, menacesDans, nbCapteurs, procedure,
  alliesDe, doctrinesDe, operationsDe, presents, servicesDe, soumisProcedure, theatresDe, unitesDe
} from './acces';
import { calculerRens } from './renseignement';
import { evaluerAppui, evaluerOperation, moyensCrise, participantsOperation } from './evaluation';
import { actChoix, appliquerEffets, nettoyerMenaces } from './evenements';
import { actCrise, reponsePossible, reponsesCrise } from './crises';
import { actZoom, actionsZoom } from './zoom';
import { evaluerFin, terminer } from './tour';
import { actTactique, actionsTactiques, carteDuTheatre, estAuSol } from './tactique';

// ---------- Actions possibles ----------
export function actionsPossibles(s: Etat): Action[] {
  const L: Action[] = [];
  if (s.fin) return L;
  if (s.phase === 'doctrine') { for (const d of doctrinesDe(s)) L.push({ type: 'DOCTRINE', id: d.id }); return L; }
  if (s.phase === 'evenement') {
    const E = EV[s.evenementCourant!];
    E.choix.forEach((c, i) => { if (choixPermis(s, c)) L.push({ type: 'CHOIX', index: i }); });
    return L;
  }
  if (s.phase === 'crise') {
    const rep = reponsesCrise(s.criseCourante!);
    if (rep.length) rep.forEach((r, i) => { if (reponsePossible(s, s.criseCourante!, r)) L.push({ type: 'CRISE_REPONSE', index: i }); });
    else if (moyensCrise(s, s.criseCourante!).possible) L.push({ type: 'CRISE', intervenir: true });
    L.push({ type: 'CRISE', intervenir: false });
    return L;
  }
  if (s.phase === 'zoom') return actionsZoom(s);
  if (s.phase !== 'jeu') return L;

  const R = s.ressources;
  for (const sv of servicesDe(s)) for (const t of sv.theatres) for (const ty of TYPES_CAPTEURS) {
    if (s.services[sv.id].capteurs[ty] <= 0) continue;
    if (capteursLibres(s, sv.id, ty) > 0) L.push({ type: 'CAPTEUR', service: sv.id, theatre: t, capteur: ty, delta: 1 });
    const a = s.services[sv.id].affectations[t];
    if (a && a[ty] > 0) L.push({ type: 'CAPTEUR', service: sv.id, theatre: t, capteur: ty, delta: -1 });
  }
  L.push(...actionsTactiques(s));
  if (s.actionsRestantes <= 0) return L;
  for (const u of unitesDe(s)) {
    const e = s.unites[u.id];
    if (e.etat === 'disponible' && !enIndisponibilite(u, s.tour)) for (const t of u.theatres) L.push({ type: 'DEPLOYER', unite: u.id, theatre: t });
    if (e.etat === 'deployee' || e.etat === 'projection') L.push({ type: 'RAPATRIER', unite: u.id });
  }
  for (const op of operationsDe(s)) {
    if (R.capital <= op.capital) continue;
    for (const T of theatresDe(s)) {
      if (op.theatresInterdits.includes(T.id)) continue;
      if (op.serviceRequis && nbCapteurs(s, op.serviceRequis, T.id) === 0) continue;
      if (!op.serviceRequis && participantsOperation(s, op, T.id).length === 0) continue;
      if (op.cibles === null) L.push({ type: 'OPERATION', op: op.id, theatre: T.id, cible: null });
      else for (const m of menacesDans(s, T.id)) if (m.detectee && op.cibles.includes(m.type)) L.push({ type: 'OPERATION', op: op.id, theatre: T.id, cible: m.id });
    }
  }
  for (const T of theatresDe(s)) {
    const th = s.theatres[T.id];
    if (soumisProcedure(s, T.id) && !th.voteFait && !th.debat && th.toursIntervention > 0 && R.capital > procedure(s).debat.capital) L.push({ type: 'DEBAT', theatre: T.id });
  }
  if (R.capital > 8) L.push({ type: 'BUDGET', sens: 'hausse' });
  if (R.enveloppe > 20) L.push({ type: 'BUDGET', sens: 'baisse' });
  for (const A of alliesDe(s)) {
    if (s.allies[A.id].cooldown > 0) continue;
    for (const ap of A.appuis) {
      if (R.capital <= ap.capital) continue;
      for (const t of presents(s, ap.theatres)) if (!s.theatres[t].appuis.some(x => x.allie === A.id && x.appui === ap.id)) L.push({ type: 'ALLIE', allie: A.id, appui: ap.id, theatre: t });
    }
  }
  return L;
}
export function choixPermis(s: Etat, c: ChoixDef): boolean {
  if (!c.requiert) return true;
  if (c.requiert.categorie) return unitesDe(s).some(u => u.categorie === c.requiert!.categorie && ['disponible', 'deployee'].includes(s.unites[u.id].etat));
  return true;
}

// ---------- Application d'une action ----------
export function appliquerAction(s: Etat, a: Action): Etat {
  const k = cleAction(a);
  if (!actionsPossibles(s).some(p => cleAction(p) === k)) throw new Error('Action non autorisée dans l’état courant : ' + k);
  const n = cloner(s);
  n.dernierResultat = null;
  switch (a.type) {
    case 'DOCTRINE': actDoctrine(n, a); break;
    case 'CAPTEUR': actCapteur(n, a); break;
    case 'DEPLOYER': actDeployer(n, a); break;
    case 'RAPATRIER': actRapatrier(n, a); break;
    case 'OPERATION': actOperation(n, a); break;
    case 'BUDGET': actBudget(n, a); break;
    case 'ALLIE': actAllie(n, a); break;
    case 'CHOIX': actChoix(n, a); break;
    case 'DEBAT': actDebat(n, a); break;
    case 'CRISE': case 'CRISE_REPONSE': actCrise(n, a); break;
    case 'POSITIONNER': case 'POSTURE': case 'MISSION': case 'ANNULER_MISSION': actTactique(n, a); break;
    default: actZoom(n, a);
  }
  const f = evaluerFin(n);
  if (f.fini && f.type === 'defaite') terminer(n, f);
  return n;
}

type ActionDe<T extends Action['type']> = Extract<Action, { type: T }>;

function actDoctrine(s: Etat, a: ActionDe<'DOCTRINE'>): void {
  const D = DOC[a.id], md = D.mods;
  s.doctrine = a.id;
  s.ressources.enveloppe += md.enveloppe;
  s.ressources.opinion = borner(s.ressources.opinion + md.opinion, 0, 100);
  s.ressources.credibilite = borner(s.ressources.credibilite + md.credibilite, 0, 100);
  for (const sv in md.capteursBonus) for (const ty in md.capteursBonus[sv]) {
    const t = ty as keyof typeof md.capteursBonus[string];
    s.services[sv].capteurs[t] += md.capteursBonus[sv][t]!;
  }
  s.phase = 'jeu';
  s.actionsRestantes = actionsParTour(s);
  calculerRens(s);
  decider(s, 'Doctrine retenue : ' + D.nom + '.');
  journaliser(s, 'Doctrine retenue : ' + D.nom + '.', 'decision');
}
function actCapteur(s: Etat, a: ActionDe<'CAPTEUR'>): void {
  const aff = s.services[a.service].affectations;
  if (!aff[a.theatre]) aff[a.theatre] = { HUMINT: 0, SIGINT: 0, IMINT: 0 };
  aff[a.theatre][a.capteur] += a.delta;
  calculerRens(s);
  if (a.delta > 0) decider(s, a.service + ' : capteur ' + a.capteur + ' affecté à ' + TH[a.theatre].nom + '.');
}
function actDeployer(s: Etat, a: ActionDe<'DEPLOYER'>): void {
  const u = UN[a.unite], e = s.unites[a.unite];
  const delai = delaiProjection(s, a.unite, a.theatre);
  e.theatre = a.theatre;
  e.lieu = estAuSol(u) ? carteDuTheatre(a.theatre).depart : null;
  e.posture = 'defensive'; e.mission = null;
  e.etat = delai === 0 ? 'deployee' : 'projection';
  e.compteur = delai;
  s.ressources.budget -= u.coutDeploiement * coutMult(s);
  s.actionsRestantes--;
  calculerRens(s);
  decider(s, 'Déploiement : ' + u.nom + ' vers ' + TH[a.theatre].nom + (delai ? ' (arrivée sous ' + delai + ' mois)' : '') + '.');
  journaliser(s, u.nom + ' engagé vers ' + TH[a.theatre].nom + '.', 'decision');
}
export function rapatrier(s: Etat, id: string, motif: string | null): void {
  const u = UN[id], e = s.unites[id];
  e.etat = 'regeneration';
  e.compteur = u.categorie === 'INT' ? 1 : PARAMS.regenerationTours;
  e.theatre = null; e.lieu = null; e.mission = null; e.posture = 'defensive';
  journaliser(s, u.nom + ' rapatrié' + (motif ? ' (' + motif + ')' : '') + '.', motif ? 'alerte' : 'decision');
}
function actRapatrier(s: Etat, a: ActionDe<'RAPATRIER'>): void {
  const th = s.unites[a.unite].theatre!;
  rapatrier(s, a.unite, null);
  s.actionsRestantes--;
  calculerRens(s);
  decider(s, 'Rapatriement : ' + UN[a.unite].nom + ' depuis ' + TH[th].nom + '.');
}
function actOperation(s: Etat, a: ActionDe<'OPERATION'>): void {
  const op = OP[a.op], ev = evaluerOperation(s, a.op, a.theatre, a.cible, true);
  const th = s.theatres[a.theatre], R = s.ressources;
  R.budget -= ev.cout;
  R.capital -= op.capital;
  s.actionsRestantes--;
  s.stats.operations++;
  th.pressionOps += op.pression;
  for (const id of ev.participants) s.unites[id].fatigue = borner(s.unites[id].fatigue + 5, 0, 100);
  const m = a.cible ? menaceParId(s, a.cible) : null;
  const res: string[] = [];
  const succes = alea(s) < ev.pSucces;
  if (succes) {
    s.stats.succes++;
    if (m) { const d = Math.round(op.degats * (0.6 + alea(s) * 0.8)); m.force = Math.max(0, m.force - d); }
    appliquerEffets(s, transformerEffetOp(op.effetSucces, a.theatre), res);
    res.unshift('Succès.');
  } else {
    if (m) m.force = Math.max(0, m.force - Math.round(op.degats * 0.2));
    R.opinion = borner(R.opinion - 1, 0, 100);
    res.unshift('Échec : objectifs non atteints.');
  }
  if (alea(s) < ev.risquePertes) {
    s.stats.pertes++;
    R.opinion = borner(R.opinion - 3, 0, 100);
    for (const id of ev.participants) s.unites[id].fatigue = borner(s.unites[id].fatigue + 15, 0, 100);
    res.push('Pertes dans nos rangs.');
  }
  if (alea(s) < ev.risqueCollat) {
    s.stats.collat++;
    R.credibilite = borner(R.credibilite - 4, 0, 100);
    R.opinion = borner(R.opinion - 2, 0, 100);
    res.push('Dommages collatéraux signalés.');
    if ((s.compteurEvenements.BAVURE || 0) < EV.BAVURE.max!) s.chaines.push({ id: 'BAVURE', tour: s.tour + 1 });
  }
  const txt = op.nom + ' — ' + TH[a.theatre].nom + (m ? ' (' + MT[m.type].nom + ')' : '') + ' : ' + res.join(' ');
  s.dernierResultat = { titre: op.nom, texte: txt };
  decider(s, txt);
  journaliser(s, txt, succes ? 'succes' : 'alerte');
  nettoyerMenaces(s);
}
function transformerEffetOp(e: OperationDef['effetSucces'], theatre: string): Effets {
  const r: Effets = {};
  for (const k in e) {
    const c = k as keyof OperationDef['effetSucces'];
    if (c === 'partenaire') r.partenaire = [{ theatre, delta: e.partenaire! }];
    else r[c] = e[c];
  }
  return r;
}
function actDebat(s: Etat, a: ActionDe<'DEBAT'>): void {
  s.theatres[a.theatre].debat = true;
  s.ressources.capital -= procedure(s).debat.capital;
  s.actionsRestantes--;
  const t = procedure(s).debat.nom + ' sur l’intervention (' + TH[a.theatre].nom + ') : le gouvernement expose ses objectifs avant le vote.';
  decider(s, t); journaliser(s, t, 'decision');
}
function actBudget(s: Etat, a: ActionDe<'BUDGET'>): void {
  const R = s.ressources;
  if (a.sens === 'hausse') { R.capital -= 8; R.enveloppe += 10; decider(s, 'Rallonge budgétaire obtenue : enveloppe portée à ' + R.enveloppe + ' ' + devise(s) + '/mois.'); }
  else { R.enveloppe -= 10; R.capital = borner(R.capital + 4, 0, 100); decider(s, 'Économies consenties : enveloppe ramenée à ' + R.enveloppe + ' ' + devise(s) + '/mois.'); }
  s.actionsRestantes--;
  journaliser(s, 'Arbitrage budgétaire : enveloppe ' + R.enveloppe + ' ' + devise(s) + '/mois.', 'decision');
}
export function activerAppui(s: Etat, allieId: string, appuiId: string, theatre: string, tours: number): void {
  const ap = appuiDef(allieId, appuiId), th = s.theatres[theatre];
  if (ap.effets.partenaire) th.partenaire = borner(th.partenaire + ap.effets.partenaire, 0, 60);
  if (BONUS_PERIODIQUES.some(k => ap.effets[k])) {
    const ex = th.appuis.find(x => x.allie === allieId && x.appui === appuiId);
    if (ex) ex.tours = Math.max(ex.tours, tours); else th.appuis.push({ allie: allieId, appui: appuiId, tours });
  }
}
function actAllie(s: Etat, a: ActionDe<'ALLIE'>): void {
  const A = AL[a.allie], ap = appuiDef(a.allie, a.appui), R = s.ressources, rel = s.allies[a.allie];
  const ev = evaluerAppui(s, a.allie, a.appui, a.theatre);
  R.capital -= ev.capital;
  s.actionsRestantes--;
  rel.cooldown = 2;
  let txt: string;
  if (alea(s) < ev.pSucces) {
    activerAppui(s, a.allie, a.appui, a.theatre, ap.duree);
    rel.relation = borner(rel.relation - ev.relation, 0, 100);
    txt = A.nom + ' accorde : ' + ap.nom + ' (' + TH[a.theatre].nom + (ap.duree > 1 ? ', ' + ap.duree + ' mois' : '') + ').';
  } else {
    rel.relation = borner(rel.relation - 1, 0, 100);
    R.credibilite = borner(R.credibilite - 1, 0, 100);
    txt = A.nom + ' décline la demande : ' + ap.nom + ' (' + TH[a.theatre].nom + ').';
  }
  s.dernierResultat = { titre: 'Demande d’appui — ' + A.nom, texte: txt };
  decider(s, txt);
  journaliser(s, txt, 'decision');
  calculerRens(s);
}
