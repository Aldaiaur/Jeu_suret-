// Renseignement : niveau par théâtre, connaissance des menaces, rapports bruités.
import { MT, PARAMS, POIDS_CAPTEUR, SERVICES, TH, THEATRES, TYPES_CAPTEURS } from '../data';
import type { Etat, Menace } from './types';
import { alea, aleaEntre, borner } from './outils';
import { bonusTheatre, fiabilite, mods, nbCapteurs, unitesDans } from './acces';

export function calculerRens(s: Etat): void {
  const md = mods(s);
  for (const T of THEATRES) {
    const th = s.theatres[T.id];
    let r = T.rensBase + md.rensBonus + th.rensBonus + th.rensPermanent;
    for (const sv of SERVICES) {
      const a = s.services[sv.id].affectations[T.id];
      if (!a) continue;
      for (const ty of TYPES_CAPTEURS) r += (a[ty] || 0) * POIDS_CAPTEUR[ty] * sv.efficacite[ty];
    }
    for (const u of unitesDans(s, T.id)) r += u.cap.renseignement * 1.5 * (1 - s.unites[u.id].fatigue / 300);
    r += bonusTheatre(s, T.id).rens;
    th.rens = Math.round(borner(r, 0, 95));
  }
}
export function rensMenace(s: Etat, m: Menace): number {
  const T = MT[m.type];
  let r = s.theatres[m.theatre].rens;
  for (const sv in T.servicesCles) r += T.servicesCles[sv] * nbCapteurs(s, sv, m.theatre);
  return Math.round(borner(r, 0, 98));
}
export function serviceSource(s: Etat, theatre: string): string {
  let best: string | null = null, n = 0;
  for (const sv of SERVICES) { const c = nbCapteurs(s, sv.id, theatre); if (c > n) { n = c; best = sv.id; } }
  if (best) return best;
  return TH[theatre].exterieur ? 'DRM' : 'DGSI';
}
export function estimerMenaces(s: Etat): void {
  s.rapports = [];
  for (const m of s.menaces) {
    const r = rensMenace(s, m);
    if (!m.detectee) {
      const p = r / 110 + m.force / 250;
      if (alea(s) < p) m.detectee = true; else continue;
    }
    const marge = Math.max(PARAMS.margeMin, Math.round((100 - r) * 0.45));
    let bruit = (alea(s) + alea(s) - 1) * marge;
    m.rapportFaux = false;
    if (r < PARAMS.rensFauxRapport && alea(s) < 0.3) {
      bruit += (alea(s) < 0.5 ? -1 : 1) * aleaEntre(s, 15, 30);
      m.rapportFaux = true;
    }
    const prec = m.estimation;
    m.estimation = Math.round(borner(m.force + bruit, 0, 100));
    m.marge = marge;
    const tend = prec === null ? 'première évaluation' : (m.estimation - prec > 4 ? 'en hausse' : (prec - m.estimation > 4 ? 'en baisse' : 'stable'));
    s.rapports.push({ theatre: m.theatre, service: serviceSource(s, m.theatre), fiabilite: fiabilite(r),
      texte: MT[m.type].nom + ' : niveau estimé ' + m.estimation + ' (± ' + marge + '), ' + tend + '.' });
  }
  for (const T of THEATRES) {
    const th = s.theatres[T.id];
    if (th.rens < PARAMS.rensFauxRapport && alea(s) < 0.15) {
      s.rapports.push({ theatre: T.id, service: serviceSource(s, T.id), fiabilite: 'E',
        texte: 'Signalement non recoupé d’une activité suspecte. Source unique, non confirmée.' });
    }
    if (th.crise) s.rapports.push({ theatre: T.id, service: serviceSource(s, T.id), fiabilite: fiabilite(th.rens), texte: 'Crise en cours : ' + th.crise.titre + '.' });
  }
}
