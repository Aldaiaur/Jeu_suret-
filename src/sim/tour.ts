// Fin de tour mensuelle, fin de partie et score.
import { ALLIES, DIFFICULTES, EV, EVENEMENTS, MT, NB_TOURS, PARAMS, TH, THEATRES, UNITES } from '../data';
import type { Etat, Instantane, Score } from './types';
import { alea, aleaEntre, arrondi, borner, choisir, choisirPondere, cloner } from './outils';
import { actionsParTour, appuiDef, coutMensuelUnite, dateDuTour, decider, enIndisponibilite, journaliser, mods, multCroissance, multFatigue, probaVote, unitesDans } from './acces';
import { calculerRens, estimerMenaces, rensMenace } from './renseignement';
import { pressionMenace } from './evaluation';
import { rapatrier } from './actions';
import { appliquerEffets, avancerFile, conditionsRemplies, nettoyerMenaces } from './evenements';
import { creerCrise, menaceDeCrise } from './crises';
import { ajouterMenace } from './partie';

export function finDeTour(s: Etat): Etat {
  if (s.phase !== 'jeu' || s.fin) return s;
  const n = cloner(s);
  const R = n.ressources, md = mods(n), D = DIFFICULTES[n.difficulte];
  const mois = n.tour;
  n.dernierResultat = null; n.dernierBilan = null;

  // 1. Budget
  let depenses = 0;
  for (const u of UNITES) { const e = n.unites[u.id]; if (e.etat === 'deployee' || e.etat === 'projection') depenses += coutMensuelUnite(n, u); }
  R.budget = arrondi(R.budget + R.enveloppe - depenses);
  if (R.budget < 0) {
    R.surcout = arrondi(R.surcout - R.budget);
    const pen = 1 + Math.floor(-R.budget / 20);
    R.capital = borner(R.capital - pen, 0, 100);
    journaliser(n, 'Dépassement de l’enveloppe : ' + arrondi(-R.budget) + ' M€ de surcoût OPEX (capital -' + pen + ').', 'alerte');
    R.budget = 0;
  }

  // 2. Unités
  for (const u of UNITES) {
    const e = n.unites[u.id];
    if (enIndisponibilite(u, n.tour + 1)) {
      if (e.etat === 'deployee' || e.etat === 'projection') rapatrier(n, u.id, 'arrêt technique programmé');
      e.etat = 'indisponible'; e.theatre = null; continue;
    }
    if (e.etat === 'indisponible') {
      if (e.indispo > 0) e.indispo--;
      if (e.indispo <= 0) { e.etat = 'disponible'; journaliser(n, u.nom + ' de nouveau disponible.', 'info'); }
      continue;
    }
    if (e.etat === 'projection') { e.compteur--; if (e.compteur <= 0) { e.etat = 'deployee'; journaliser(n, u.nom + ' opérationnel sur le théâtre ' + TH[e.theatre!].nom + '.', 'info'); } continue; }
    if (e.etat === 'deployee') {
      e.fatigue = borner(e.fatigue + (PARAMS.fatigueDeploiement * (10 - u.cap.endurance) / 5 + 1) * multFatigue(e.theatre!, mois), 0, 100);
      if (e.fatigue >= 100) rapatrier(n, u.id, 'usure, relève impérative');
      continue;
    }
    if (e.etat === 'regeneration') { e.fatigue = borner(e.fatigue - 20, 0, 100); e.compteur--; if (e.compteur <= 0) e.etat = 'disponible'; continue; }
    if (e.etat === 'disponible') e.fatigue = borner(e.fatigue - PARAMS.fatigueRepos, 0, 100);
  }

  // 3. Article 35 de la Constitution
  for (const T of THEATRES) {
    if (!T.exterieur || T.basePermanente) continue;
    const th = n.theatres[T.id];
    if (unitesDans(n, T.id, ['deployee', 'projection']).length) {
      th.toursIntervention++;
      if (th.toursIntervention > PARAMS.dureeAvantVote && !th.voteFait) {
        const p = probaVote(n);
        n.stats.votes++;
        if (alea(n) < p) {
          th.voteFait = true; R.capital = borner(R.capital + 3, 0, 100);
          const t = 'Article 35 : le Parlement autorise la prolongation de l’intervention (' + T.nom + ').';
          journaliser(n, t, 'succes'); decider(n, t);
        } else {
          n.stats.votesPerdus++;
          for (const u of unitesDans(n, T.id, ['deployee', 'projection'])) rapatrier(n, u.id, 'vote négatif du Parlement');
          R.capital = borner(R.capital - 10, 0, 100); R.credibilite = borner(R.credibilite - 5, 0, 100);
          th.toursIntervention = 0;
          const t = 'Article 35 : le Parlement refuse la prolongation (' + T.nom + '). Retrait des forces.';
          journaliser(n, t, 'alerte'); decider(n, t);
        }
      }
    } else { th.toursIntervention = 0; th.voteFait = false; }
  }

  // 4. Évolution des menaces
  const forcesParType: Record<string, number> = {};
  for (const m of n.menaces) forcesParType[m.type] = (forcesParType[m.type] || 0) + m.force;
  calculerRens(n);
  const existantes = n.menaces.slice();
  for (const m of existantes) {
    const T = MT[m.type], TT = TH[m.theatre];
    let croiss = T.croissance * D.croissanceMult * (TT.exterieur ? md.croissanceExtMult : 1) * multCroissance(m.theatre, mois, m.type);
    for (const t in T.alimentePar) croiss += (forcesParType[t] || 0) * T.alimentePar[t];
    croiss *= (1 - m.force / 130);
    const delta = croiss - pressionMenace(n, m) * 0.15 + (alea(n) - 0.5) * 3;
    m.force = borner(Math.round((m.force + delta) * 10) / 10, 0, 100);
    // Expansion vers un théâtre voisin
    if (m.force > T.seuilExpansion && alea(n) < T.probExpansion) {
      const cibles = T.expansion.filter(t => TT.voisins.includes(t));
      if (cibles.length) {
        const dest = choisir(n, cibles);
        const ex = n.menaces.find(x => x.type === m.type && x.theatre === dest);
        if (ex) ex.force = borner(ex.force + 5, 0, 100);
        else ajouterMenace(n, m.type, dest, aleaEntre(n, 12, 20), false);
        m.force = Math.max(1, m.force - 3);
      }
    }
    // Attaque
    if (m.force >= T.seuilAttaque && alea(n) < 0.06 + (m.force - T.seuilAttaque) / 120) {
      const rm = rensMenace(n, m);
      if (!TT.exterieur && alea(n) < rm / 140) {
        m.force = Math.max(0, m.force - 8);
        R.opinion = borner(R.opinion + 2, 0, 100);
        n.stats.dejoues++;
        journaliser(n, 'Les services ont déjoué une action violente (' + MT[m.type].nom + ').', 'succes');
      } else {
        const k = 0.7 + m.force / 150, eff: Record<string, number> = {};
        for (const c in T.attaque) eff[c] = Math.round(T.attaque[c as keyof typeof T.attaque]! * k);
        const res = appliquerEffets(n, eff, []);
        m.force = borner(m.force + T.apresAttaque, 1, 100);
        m.detectee = true;
        n.stats.attaques++;
        journaliser(n, 'Action adverse : ' + MT[m.type].nom + ' (' + TT.nom + '). ' + res.join(', ') + '.', 'alerte');
        if (T.crise && alea(n) < 0.45) creerCrise(n, m.theatre, m.id);
      }
    }
  }
  nettoyerMenaces(n);

  // 5. Menace intérieure
  let cible = 0, prot = 0;
  for (const m of n.menaces) cible += (TH[m.theatre].exterieur ? 0 : MT[m.type].poidsInterieur * m.force) + MT[m.type].impactInterieur * m.force;
  for (const u of UNITES) if (u.protection && n.unites[u.id].etat === 'deployee') prot += u.protection;
  prot = Math.min(prot * md.protectionMult, cible * PARAMS.plafondProtection);
  R.menaceInt = borner(Math.round(R.menaceInt + (cible - prot - R.menaceInt) * 0.35), 0, 100);
  n.menaceInt100 = R.menaceInt >= 100 ? n.menaceInt100 + 1 : 0;

  // 6. Opinion, crédibilité, capital
  const nbExt = THEATRES.filter(T => T.exterieur && unitesDans(n, T.id).length).length;
  R.opinion = borner(Math.round((R.opinion + (50 - R.opinion) * PARAMS.opinionRappel - Math.max(0, R.menaceInt - 55) * 0.1 - Math.max(0, nbExt - 3) * 0.5) * 10) / 10, 0, 100);
  R.credibilite = borner(Math.round((R.credibilite + (50 - R.credibilite) * 0.02 + nbExt * 0.3) * 10) / 10, 0, 100);
  R.capital = borner(R.capital + PARAMS.capitalMensuel + md.capitalMensuel - (R.opinion < 30 ? 1 : 0), 0, 100);

  // 7. Décroissances et crises livrées à elles-mêmes
  for (const T of THEATRES) {
    const th = n.theatres[T.id];
    th.rensBonus = Math.abs(th.rensBonus) <= 2 ? 0 : th.rensBonus - Math.sign(th.rensBonus) * 2;
    th.pressionBonus = Math.round(th.pressionBonus * 0.7);
    th.pressionOps = 0;
    if (th.allie > 0) th.allie--;
    for (const a of th.appuis) a.tours--;
    const finis = th.appuis.filter(a => a.tours <= 0);
    th.appuis = th.appuis.filter(a => a.tours > 0);
    for (const a of finis) journaliser(n, 'Fin de l’appui allié : ' + appuiDef(a.allie, a.appui).nom + ' (' + T.nom + ').', 'info');
    if (th.crise && th.crise.statut === 'libre') {
      const m = menaceDeCrise(n, T.id);
      if (m) m.force = borner(m.force + 4, 0, 100);
      R.credibilite = borner(R.credibilite - 1, 0, 100);
      th.crise.toursLibres--;
      if (th.crise.toursLibres <= 0) { journaliser(n, 'Crise close sans intervention française : ' + th.crise.titre + '.', 'info'); th.crise = null; }
    }
  }

  // 7 bis. Relations avec les alliés : rappel vers la valeur de référence, engagement sur leurs théâtres d'intérêt
  for (const A of ALLIES) {
    const st = n.allies[A.id];
    const engage = A.interets.filter(t => unitesDans(n, t).length > 0).length;
    st.relation = borner(Math.round((st.relation + (A.relation - st.relation) * 0.05 + engage * 0.4 + (R.credibilite - 50) * 0.01) * 10) / 10, 0, 100);
    if (st.cooldown > 0) st.cooldown--;
  }

  // 8. Historique, passage au mois suivant
  n.historique.push(instantane(n));
  n.tour++;
  calculerRens(n);
  estimerMenaces(n);

  // 9. Fin de partie ?
  const f = evaluerFin(n);
  if (f.fini) { terminer(n, f); return n; }

  // 10. Événements (chaînes puis tirage pondéré)
  const dues = n.chaines.filter(c => c.tour <= n.tour);
  n.chaines = n.chaines.filter(c => c.tour > n.tour);
  for (const c of dues) if ((n.compteurEvenements[c.id] || 0) < (EV[c.id].max || 1)) n.file.push({ kind: 'evenement', id: c.id });
  if (alea(n) < PARAMS.probaEvenement) {
    const elig = EVENEMENTS.filter(E => E.poids > 0 && conditionsRemplies(n, E) && !n.file.some(f => f.kind === 'evenement' && f.id === E.id));
    const E = choisirPondere(n, elig, x => x.poids);
    if (E) n.file.push({ kind: 'evenement', id: E.id });
  }
  n.actionsRestantes = actionsParTour(n);
  journaliser(n, '— ' + dateDuTour(n.tour) + ' —', 'tour');
  avancerFile(n);
  return n;
}
export function instantane(s: Etat): Instantane {
  const ext = s.menaces.filter(m => TH[m.theatre].exterieur);
  return {
    tour: s.tour, opinion: s.ressources.opinion, capital: s.ressources.capital, menaceInt: s.ressources.menaceInt,
    credibilite: s.ressources.credibilite, surcout: s.ressources.surcout,
    menaceExt: ext.length ? Math.round(ext.reduce((a, m) => a + m.force, 0) / ext.length) : 0,
    rens: Math.round(THEATRES.reduce((a, T) => a + s.theatres[T.id].rens, 0) / THEATRES.length)
  };
}

// ---------- Fin de partie ----------
export type ResultatFin = { fini: false } | { fini: true; type: 'defaite' | 'bilan'; raison: string };
export function evaluerFin(s: Etat): ResultatFin {
  const R = s.ressources;
  if (R.opinion < 10) return { fini: true, type: 'defaite', raison: 'Le soutien de l’opinion s’est effondré (sous 10). Le gouvernement est contraint de démissionner.' };
  if (R.capital <= 0) return { fini: true, type: 'defaite', raison: 'Le capital politique est épuisé. Vous n’avez plus les moyens de gouverner.' };
  if (s.menaceInt100 >= 3) return { fini: true, type: 'defaite', raison: 'La menace intérieure est restée à son maximum pendant trois mois consécutifs.' };
  if (s.tour >= NB_TOURS) return { fini: true, type: 'bilan', raison: 'Fin du mandat de la démonstration (décembre 2017).' };
  return { fini: false };
}
export function calculerScore(s: Etat): Score {
  const h = s.historique.length ? s.historique : [instantane(s)];
  const moy = (k: keyof Instantane) => h.reduce((a, x) => a + x[k], 0) / h.length;
  const ext = s.menaces.filter(m => TH[m.theatre].exterieur);
  const extFinal = ext.length ? ext.reduce((a, m) => a + m.force, 0) / ext.length : 0;
  const crises = s.stats.crisesInterv ? s.stats.crisesReussies / s.stats.crisesInterv : 0.5;
  const domaines = [
    { nom: 'Sécurité intérieure', valeur: Math.round(100 - moy('menaceInt')), poids: 0.25 },
    { nom: 'Opérations extérieures', valeur: Math.round(borner(100 - extFinal + (crises - 0.5) * 20, 0, 100)), poids: 0.25 },
    { nom: 'Renseignement', valeur: Math.round(moy('rens')), poids: 0.15 },
    { nom: 'Politique intérieure', valeur: Math.round((moy('opinion') + s.ressources.capital) / 2), poids: 0.15 },
    { nom: 'Crédibilité et alliances', valeur: Math.round(moy('credibilite') * 0.7 + ALLIES.reduce((a, A) => a + s.allies[A.id].relation, 0) / ALLIES.length * 0.3), poids: 0.1 },
    { nom: 'Maîtrise budgétaire', valeur: Math.round(borner(100 - s.ressources.surcout / 5, 0, 100)), poids: 0.1 }
  ];
  let total = Math.round(domaines.reduce((a, d) => a + d.valeur * d.poids, 0));
  if (s.fin && s.fin.type === 'defaite') total = Math.round(total * 0.5);
  const mention = total >= 70 ? 'Remarquable' : total >= 55 ? 'Satisfaisant' : total >= 40 ? 'Mitigé' : 'Insuffisant';
  return { domaines, total, mention };
}
export function terminer(s: Etat, f: { type: 'defaite' | 'bilan'; raison: string }): void {
  s.fin = { type: f.type, raison: f.raison, tour: s.tour };
  s.fin.score = calculerScore(s);
  s.phase = 'fin';
  s.zoom = null;
  journaliser(s, (f.type === 'defaite' ? 'Défaite : ' : 'Fin de partie : ') + f.raison, f.type === 'defaite' ? 'alerte' : 'succes');
}
