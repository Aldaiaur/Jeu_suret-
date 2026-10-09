// Évaluations : pression sur les menaces, chances des opérations, moyens de crise, appuis alliés.
import { AL, MT, OP, TH, UN, UNITES } from '../data';
import type { Capacite, Etat, Menace, OperationDef, UniteDef } from './types';
import { arrondi, borner } from './outils';
import { appuiDef, bonusTheatre, enIndisponibilite, menaceParId, mods, nbCapteurs, unitesDans } from './acces';
import { rensMenace } from './renseignement';
import { menaceDeCrise } from './crises';

// ---------- Pression exercée sur une menace ----------
export function pressionMenace(s: Etat, m: Menace): number {
  const T = MT[m.type], th = s.theatres[m.theatre];
  let p = 0;
  for (const u of unitesDans(s, m.theatre)) {
    const f = 1 - s.unites[u.id].fatigue / 200;
    for (const c in T.sensibilite) p += u.cap[c as Capacite] * T.sensibilite[c as Capacite]! * f;
  }
  p += (T.sensibilite.renseignement || 0) * th.rens / 10;
  for (const sv in T.pressionServices) p += nbCapteurs(s, sv, m.theatre) * T.pressionServices[sv];
  p += th.pressionOps + th.pressionBonus + th.partenaire * 0.25 + bonusTheatre(s, m.theatre).pression;
  return Math.max(0, p);
}

// ---------- Évaluation d'une opération (aperçu, sur la base des estimations) ----------
export function participantsOperation(s: Etat, op: OperationDef, theatre: string): UniteDef[] {
  return unitesDans(s, theatre).filter(u => (op.categories.length === 0 || op.categories.includes(u.categorie)) && u.cap[op.capacite] >= op.minCapacite);
}
export interface EvaluationOperation { pSucces: number; risquePertes: number; risqueCollat: number; cout: number; capital: number; participants: string[]; puissance: number }
export function evaluerOperation(s: Etat, opId: string, theatre: string, cible: string | null, reel: boolean): EvaluationOperation {
  const op = OP[opId], md = mods(s), th = s.theatres[theatre];
  const parts = participantsOperation(s, op, theatre);
  let puissance = parts.reduce((a, u) => a + u.cap[op.capacite] * (1 - s.unites[u.id].fatigue / 200), 0);
  if (op.serviceRequis) puissance += nbCapteurs(s, op.serviceRequis, theatre) * 3;
  const m = cible ? menaceParId(s, cible) : null;
  const rens = m ? rensMenace(s, m) : th.rens;
  const force = m ? (reel ? m.force : (m.estimation === null ? 50 : m.estimation)) : 30;
  const pS = borner(0.2 + Math.min(puissance, 30) * 0.025 + rens * 0.004 - force * 0.005 + md.opBonus + bonusTheatre(s, theatre).opBonus, 0.05, 0.95);
  const discr = parts.length ? parts.reduce((a, u) => a + u.cap.discretion, 0) / parts.length : 5;
  const pP = borner(op.risquePertes * (1.4 - discr / 10) * (0.5 + force / 100), 0, 0.9);
  const pC = borner(op.risqueCollat * (1.3 - rens / 100), 0, 0.9);
  return { pSucces: pS, risquePertes: pP, risqueCollat: pC, cout: arrondi(op.cout * md.coutMult), capital: op.capital, participants: parts.map(u => u.id), puissance: arrondi(puissance) };
}

// ---------- Moyens mobilisables pour une crise ----------
export type MoyensCrise =
  | { zoom: true; fs: string[]; fsDispo: string[]; frappe: string[]; possible: boolean }
  | { zoom: false; sur: string[]; dispo: string[]; possible: boolean };
export function moyensCrise(s: Etat, theatre: string): MoyensCrise {
  const T = TH[theatre];
  if (T.carteRegionale) {
    const fs = unitesDans(s, theatre).filter(u => u.categorie === 'FS');
    const fsDispo = UNITES.filter(u => u.categorie === 'FS' && s.unites[u.id].etat === 'disponible' && u.theatres.includes(theatre) && !enIndisponibilite(u, s.tour));
    const frappe = unitesDans(s, theatre).filter(u => u.cap.frappe >= 5 && u.categorie !== 'FS');
    return { zoom: true, fs: fs.map(u => u.id), fsDispo: fsDispo.map(u => u.id), frappe: frappe.map(u => u.id), possible: fs.length + fsDispo.length > 0 };
  }
  const sur = unitesDans(s, theatre);
  const dispo = UNITES.filter(u => s.unites[u.id].etat === 'disponible' && u.theatres.includes(theatre) && !enIndisponibilite(u, s.tour) && (u.cap.assaut >= 5 || u.cap.frappe >= 5));
  return { zoom: false, sur: sur.map(u => u.id), dispo: dispo.map(u => u.id), possible: sur.length + dispo.length > 0 };
}

export function evaluerCriseAbstraite(s: Etat, theatre: string, reel: boolean): { pSucces: number; risquePertes: number; unites: string[]; urgence: string | null } {
  const moy = moyensCrise(s, theatre), th = s.theatres[theatre];
  let ids = moy.zoom ? [] : moy.sur.slice(), urgence: string | null = null;
  if (!ids.length && !moy.zoom && moy.dispo.length) { urgence = moy.dispo[0]; ids = [urgence]; }
  const m = menaceDeCrise(s, theatre);
  const force = m ? (reel ? m.force : (m.estimation === null ? 50 : m.estimation)) : 30;
  const power = ids.reduce((x, id) => x + Math.max(UN[id].cap.assaut, UN[id].cap.frappe) * (1 - s.unites[id].fatigue / 200), 0);
  return { pSucces: borner(0.3 + power * 0.03 + th.rens * 0.003 - force * 0.004 + mods(s).opBonus, 0.1, 0.9), risquePertes: 0.15, unites: ids, urgence };
}

// ---------- Demande d'appui allié ----------
export function evaluerAppui(s: Etat, allieId: string, appuiId: string, theatre: string): { pSucces: number; capital: number; relation: number; duree: number } {
  const A = AL[allieId], ap = appuiDef(allieId, appuiId), rel = s.allies[allieId].relation;
  const interet = A.interets.includes(theatre) ? 0.1 : 0;
  const p = borner(ap.base * (0.35 + rel / 100 * 0.65) * (0.75 + s.ressources.credibilite / 100 * 0.25) + interet, 0.05, 0.95);
  return { pSucces: p, capital: ap.capital, relation: ap.relation, duree: ap.duree };
}
