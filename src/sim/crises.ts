// Crises : ouverture, décision d'intervenir, résolution abstraite (hors carte régionale).
import { CARTES_REGIONALES, MT, PARAMS, TH, UN, UNITES } from '../data';
import type { Action, Etat, Menace, ReponseCriseDef } from './types';
import { alea, borner, choisir } from './outils';
import { coutMult, decider, enIndisponibilite, journaliser, menaceParId, menacesDans, mods } from './acces';
import { calculerRens } from './renseignement';
import { evaluerCriseAbstraite, moyensCrise } from './evaluation';
import { appliquerEffets, avancerFile, nettoyerMenaces } from './evenements';
import { ouvrirZoom } from './zoom';
import { deployerUrgence } from './tactique';

export function creerCrise(s: Etat, theatre: string, menaceId: string): boolean {
  const th = s.theatres[theatre];
  if (th.crise) return false;
  const T = TH[theatre], m = menaceParId(s, menaceId)!;
  let titre = MT[m.type].criseTitre + ' — ' + T.nom;
  let texte = 'La situation se dégrade brutalement sur le théâtre ' + T.nom + ' (' + MT[m.type].nom + '). Une décision d’engagement est attendue.';
  let scenario: string | null = null;
  const C = CARTES_REGIONALES[T.carteRegionale];
  if (C.scenarios.length) {
    const sc = choisir(s, C.scenarios);
    scenario = sc.id; titre = sc.titre; texte = sc.texte;
  }
  th.crise = { titre, texte, menaceId, scenario, statut: 'ouverte', toursLibres: 0 };
  s.file.push({ kind: 'crise', theatre });
  journaliser(s, 'Crise : ' + titre + '.', 'crise');
  return true;
}
export function menaceDeCrise(s: Etat, theatre: string): Menace | null {
  const c = s.theatres[theatre].crise;
  let m = c ? menaceParId(s, c.menaceId) : null;
  if (!m) m = menacesDans(s, theatre).sort((a, b) => b.force - a.force)[0] || null;
  return m;
}
// ---------- Crises hors carte : réponses déclarées par le théâtre ----------
export function reponsesCrise(theatre: string): ReponseCriseDef[] { return CARTES_REGIONALES[TH[theatre].carteRegionale].reponsesCrise || []; }
// Unité qui portera la réponse : déjà sur place, sinon disponible et projetable vers le théâtre
export function porteurReponse(s: Etat, theatre: string, r: ReponseCriseDef): { id: string; urgence: boolean } | null {
  if (!r.requiert) return null;
  const sur = UNITES.find(u => r.requiert!.includes(u.categorie) && s.unites[u.id].etat === 'deployee' && s.unites[u.id].theatre === theatre);
  if (sur) return { id: sur.id, urgence: false };
  const dispo = UNITES.find(u => r.requiert!.includes(u.categorie) && s.unites[u.id].etat === 'disponible' && u.theatres.includes(theatre) && !enIndisponibilite(u, s.tour));
  return dispo ? { id: dispo.id, urgence: true } : null;
}
export function reponsePossible(s: Etat, theatre: string, r: ReponseCriseDef): boolean { return !r.requiert || porteurReponse(s, theatre, r) !== null; }
export function probaReponse(s: Etat, theatre: string, r: ReponseCriseDef, reel: boolean): number {
  const m = menaceDeCrise(s, theatre), th = s.theatres[theatre];
  const force = m ? (reel ? m.force : (m.estimation ?? 50)) : 40;
  return borner(r.p + (th.rens - 40) / 400 + mods(s).opBonus - (force - 50) / 300, 0.1, 0.95);
}
function actReponse(s: Etat, a: Extract<Action, { type: 'CRISE_REPONSE' }>): void {
  const theatre = s.criseCourante!, th = s.theatres[theatre], crise = th.crise!, T = TH[theatre];
  const r = reponsesCrise(theatre)[a.index], res: string[] = [];
  s.stats.crisesInterv++;
  const porteur = porteurReponse(s, theatre, r);
  if (porteur?.urgence) {
    const u = UN[porteur.id];
    deployerUrgence(s, u.id, theatre);
    s.ressources.budget -= u.coutDeploiement * coutMult(s);
    journaliser(s, u.nom + ' projeté en urgence vers ' + T.nom + '.', 'decision');
  }
  appliquerEffets(s, r.effets, res);
  const m = menaceDeCrise(s, theatre);
  if (alea(s) < probaReponse(s, theatre, r, true)) {
    s.stats.crisesReussies++;
    if (m) m.force = Math.max(0, m.force - r.baisseMenace);
    appliquerEffets(s, r.succes, res);
    res.unshift('Crise maîtrisée.');
  } else {
    if (m) m.force = borner(m.force + 3, 0, 100);
    appliquerEffets(s, r.echec, res);
    res.unshift('Réponse sans effet décisif.');
  }
  const txt = r.nom + ' — ' + crise.titre + ' : ' + res.join(' ');
  decider(s, txt); journaliser(s, txt, 'crise');
  s.dernierResultat = { titre: crise.titre, texte: res.join(' ') };
  th.crise = null;
  s.criseCourante = null;
  nettoyerMenaces(s);
  calculerRens(s);
  avancerFile(s);
}

export function actCrise(s: Etat, a: Extract<Action, { type: 'CRISE' | 'CRISE_REPONSE' }>): void {
  if (a.type === 'CRISE_REPONSE') { actReponse(s, a); return; }
  const theatre = s.criseCourante!, th = s.theatres[theatre], R = s.ressources, T = TH[theatre];
  const crise = th.crise!;
  if (!a.intervenir) {
    s.stats.crisesIgnorees++;
    R.opinion = borner(R.opinion - 3, 0, 100);
    R.credibilite = borner(R.credibilite - 4, 0, 100);
    const m = menaceDeCrise(s, theatre);
    if (m) m.force = borner(m.force + 8, 0, 100);
    crise.statut = 'libre';
    crise.toursLibres = PARAMS.toursCriseLibre;
    const txt = 'Pas d’intervention : ' + crise.titre + '. La crise suit son cours (opinion -3, crédibilité -4).';
    decider(s, txt); journaliser(s, txt, 'alerte');
    s.dernierResultat = { titre: crise.titre, texte: txt };
    s.criseCourante = null;
    avancerFile(s);
    return;
  }
  s.stats.crisesInterv++;
  const moy = moyensCrise(s, theatre);
  if (moy.zoom) { ouvrirZoom(s, theatre, moy); return; }
  // Résolution abstraite (théâtre sans carte régionale)
  const evc = evaluerCriseAbstraite(s, theatre, true), ids = evc.unites, p = evc.pSucces;
  if (evc.urgence) {
    const u = UN[evc.urgence];
    deployerUrgence(s, u.id, theatre);
    s.ressources.budget -= u.coutDeploiement * coutMult(s);
    journaliser(s, u.nom + ' projeté en urgence vers ' + T.nom + '.', 'decision');
  }
  const m = menaceDeCrise(s, theatre);
  const res: string[] = [];
  if (alea(s) < p) {
    s.stats.crisesReussies++;
    if (m) m.force = Math.max(0, m.force - 15);
    appliquerEffets(s, { opinion: 4, credibilite: 4, capital: 2 }, res);
    res.unshift('Crise maîtrisée.');
  } else {
    if (m) m.force = borner(m.force + 3, 0, 100);
    appliquerEffets(s, { opinion: -4, credibilite: -3 }, res);
    res.unshift('Intervention sans résultat décisif.');
  }
  if (alea(s) < evc.risquePertes) { s.stats.pertes++; R.opinion = borner(R.opinion - 3, 0, 100); res.push('Pertes dans nos rangs.'); }
  for (const id of ids) s.unites[id].fatigue = borner(s.unites[id].fatigue + 12, 0, 100);
  const txt = 'Intervention — ' + crise.titre + ' : ' + res.join(' ');
  decider(s, txt); journaliser(s, txt, 'crise');
  s.dernierResultat = { titre: crise.titre, texte: res.join(' ') };
  th.crise = null;
  s.criseCourante = null;
  nettoyerMenaces(s);
  calculerRens(s);
  avancerFile(s);
}
