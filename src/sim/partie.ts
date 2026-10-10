// Création d'une partie et migration des sauvegardes.
import { ALLIES, DIFFICULTES, MENACES, SERVICES, THEATRES, UNITES } from '../data';
import type { Etat, Menace } from './types';
import { alea, aleaEntre, borner, choisir, cloner, graineVersEntier } from './outils';
import { journaliser } from './acces';
import { calculerRens, estimerMenaces } from './renseignement';
import { carteDuTheatre, estAuSol, lieuxInitiaux } from './tactique';

export function nouvellePartie(graine: string | number, difficulte: string): Etat {
  const d = DIFFICULTES[difficulte] ? difficulte : 'normal';
  const D = DIFFICULTES[d];
  const s: Etat = {
    version: 1, graine: String(graine), rngState: graineVersEntier(graine), difficulte: d, doctrine: null,
    tour: 0, phase: 'doctrine',
    ressources: { budget: D.budgetInitial, enveloppe: D.enveloppe, surcout: 0, capital: D.capital, opinion: D.opinion, menaceInt: D.menaceInt, credibilite: D.credibilite },
    actionsRestantes: 0, unites: {}, services: {}, theatres: {}, allies: {}, menaces: [], prochainIdMenace: 1,
    file: [], evenementCourant: null, criseCourante: null, zoom: null, dernierBilan: null, dernierResultat: null,
    chaines: [], compteurEvenements: {}, journal: [], rapports: [], decisions: [], historique: [],
    menaceInt100: 0, fin: null,
    stats: { operations: 0, succes: 0, pertes: 0, collat: 0, crisesInterv: 0, crisesReussies: 0, crisesIgnorees: 0, attaques: 0, dejoues: 0, votes: 0, votesPerdus: 0 }
  };
  for (const u of UNITES) s.unites[u.id] = { etat: u.depart ? 'deployee' : 'disponible', theatre: u.depart || null, fatigue: u.depart ? 20 : 0, compteur: 0, indispo: 0,
    lieu: u.depart && estAuSol(u) ? carteDuTheatre(u.depart).depart : null, posture: 'defensive', mission: null };
  for (const sv of SERVICES) {
    s.services[sv.id] = { capteurs: Object.assign({}, sv.capteurs), affectations: {} };
    for (const t in sv.affectationInitiale) s.services[sv.id].affectations[t] = Object.assign({ HUMINT: 0, SIGINT: 0, IMINT: 0 }, sv.affectationInitiale[t]);
  }
  for (const T of THEATRES) {
    const engage = UNITES.some(u => u.depart === T.id);
    s.theatres[T.id] = { rens: 0, rensBonus: 0, rensPermanent: 0, partenaire: 0, pressionBonus: 0, pressionOps: 0,
      toursIntervention: engage ? 12 : 0, voteFait: engage, allie: 0, appuis: [], crise: null, lieux: lieuxInitiaux(T.id), rapportTactique: [] };
  }
  for (const A of ALLIES) s.allies[A.id] = { relation: A.relation, cooldown: 0 };
  for (const T of MENACES) {
    const th = choisir(s, T.theatresDepart);
    ajouterMenace(s, T.id, th, aleaEntre(s, T.forceDepart[0], T.forceDepart[1]) * D.forceMult, true);
    for (const sec of T.secondaires) if (alea(s) < sec.p) ajouterMenace(s, T.id, sec.theatre, aleaEntre(s, sec.force[0], sec.force[1]) * D.forceMult, false);
  }
  calculerRens(s);
  estimerMenaces(s);
  journaliser(s, 'Prise de fonctions. Graine ' + s.graine + ', difficulté ' + D.nom + '.', 'info');
  return s;
}
export function ajouterMenace(s: Etat, type: string, theatre: string, force: number, detectee: boolean): Menace {
  const m: Menace = { id: 'M' + (s.prochainIdMenace++), type, theatre, force: Math.round(borner(force, 1, 100)), detectee: !!detectee, estimation: null, marge: 50, rapportFaux: false };
  s.menaces.push(m);
  return m;
}

// Complète une sauvegarde issue d'une version antérieure ou d'un jeu de données enrichi (fonction pure)
export function migrerEtat(s0: Etat): Etat {
  const s = cloner(s0);
  if (!s.allies) s.allies = {};
  for (const A of ALLIES) if (!s.allies[A.id]) s.allies[A.id] = { relation: A.relation, cooldown: 0 };
  for (const T of THEATRES) {
    if (!s.theatres[T.id]) s.theatres[T.id] = { rens: 0, rensBonus: 0, rensPermanent: 0, partenaire: 0, pressionBonus: 0, pressionOps: 0, toursIntervention: 0, voteFait: false, allie: 0, appuis: [], crise: null, lieux: lieuxInitiaux(T.id), rapportTactique: [] };
    if (!s.theatres[T.id].appuis) s.theatres[T.id].appuis = [];
    // Sauvegardes antérieures aux cartes régionales : lieux complétés, lieux disparus retirés
    const ref = lieuxInitiaux(T.id), ex = s.theatres[T.id].lieux || {};
    s.theatres[T.id].lieux = Object.fromEntries(Object.keys(ref).map(k => [k, ex[k] || ref[k]]));
    if (!s.theatres[T.id].rapportTactique) s.theatres[T.id].rapportTactique = [];
    delete (s.theatres[T.id] as unknown as Record<string, unknown>).allieCooldown;
  }
  for (const u of UNITES) {
    if (!s.unites[u.id]) s.unites[u.id] = { etat: 'disponible', theatre: null, fatigue: 0, compteur: 0, indispo: 0, lieu: null, posture: 'defensive', mission: null };
    const e = s.unites[u.id];
    if (!e.posture) e.posture = 'defensive';
    if (e.mission === undefined) e.mission = null;
    if (e.lieu === undefined || (e.lieu && (!e.theatre || !s.theatres[e.theatre].lieux[e.lieu]))) e.lieu = e.theatre && estAuSol(u) ? carteDuTheatre(e.theatre).depart : null;
  }
  for (const sv of SERVICES) if (!s.services[sv.id]) s.services[sv.id] = { capteurs: Object.assign({}, sv.capteurs), affectations: {} };
  for (const j of s.journal) delete (j as unknown as Record<string, unknown>).date;
  for (const d of s.decisions) delete (d as unknown as Record<string, unknown>).date;
  calculerRens(s);
  return s;
}
