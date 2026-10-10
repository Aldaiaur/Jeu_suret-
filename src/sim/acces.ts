// Accesseurs et petites règles dérivées de l'état.
import { AL, ANNEE_DEPART, DOC, MOIS, PARAMS, TH, TYPES_CAPTEURS, UN, UNITES } from '../data';
import type { AppuiDef, Categorie, EffetsAppui, EtatUniteId, Etat, GenreJournal, Mods, SaisonDef, UniteDef } from './types';
import { borner } from './outils';

export function dateDuTour(t: number): string { return MOIS[t % 12] + ' ' + (ANNEE_DEPART + Math.floor(t / 12)); }

// ---------- Saisons (déclarées dans les données de chaque théâtre) ----------
export function saisonDu(theatre: string, tour: number): SaisonDef {
  const m = tour % 12;
  return TH[theatre].saisons.find(x => x.mois.includes(m))!;
}
export function multPression(theatre: string, tour: number, c: Categorie): number { return saisonDu(theatre, tour).effets.pression?.[c] ?? 1; }
export function multFatigue(theatre: string, tour: number): number { return saisonDu(theatre, tour).effets.fatigue ?? 1; }
export function multCout(theatre: string, tour: number): number { return saisonDu(theatre, tour).effets.cout ?? 1; }
export function multCroissance(theatre: string, tour: number, menace: string): number { return saisonDu(theatre, tour).effets.croissance?.[menace] ?? 1; }
export const MODS_NEUTRES: Mods = { rensBonus: 0, capteursBonus: {}, opBonus: 0, enveloppe: 0, delaiMod: 0, coutMult: 1, protectionMult: 1, croissanceExtMult: 1, capitalMensuel: 0, voteBonus: 0, opinion: 0, credibilite: 0 };
export function mods(s: Etat): Mods { return s.doctrine ? DOC[s.doctrine].mods : MODS_NEUTRES; }
export function unitesDans(s: Etat, theatre: string, etats?: EtatUniteId[]): UniteDef[] {
  const e = etats || ['deployee'];
  return UNITES.filter(u => s.unites[u.id].theatre === theatre && e.includes(s.unites[u.id].etat));
}
export function nbCapteurs(s: Etat, service: string, theatre: string): number {
  const a = s.services[service].affectations[theatre];
  if (!a) return 0;
  return TYPES_CAPTEURS.reduce((x, t) => x + (a[t] || 0), 0);
}
export function capteursLibres(s: Etat, service: string, type: keyof Etat['services'][string]['capteurs']): number {
  const sv = s.services[service];
  let pris = 0;
  for (const t in sv.affectations) pris += sv.affectations[t][type] || 0;
  return sv.capteurs[type] - pris;
}
export function menacesDans(s: Etat, theatre: string) { return s.menaces.filter(m => m.theatre === theatre); }
export function menaceParId(s: Etat, id: string) { return s.menaces.find(m => m.id === id) || null; }
export function actionsParTour(s: Etat): number {
  return borner(PARAMS.actionsBase + Math.floor(s.ressources.capital / PARAMS.actionsParCapital), 1, PARAMS.actionsMax);
}
export function enIndisponibilite(u: UniteDef, tour: number): boolean {
  return (u.indisponibilites || []).some(p => tour >= p.debut && tour <= p.fin);
}
export function coutMult(s: Etat): number { return mods(s).coutMult; }
// Article 35 : la jouabilité prime. Le vote reste incertain, mais le joueur voit ce qui le détermine
// et peut le préparer (débat au Parlement). Dans la réalité 2015-2018, tous les votes ont été quasi unanimes.
export function facteursVote(s: Etat, theatre?: string): { lib: string; val: number }[] {
  const R = s.ressources, th = theatre ? s.theatres[theatre] : null;
  const f = [
    { lib: 'Base', val: 0.25 },
    { lib: 'Opinion', val: R.opinion / 100 * 0.45 },
    { lib: 'Capital politique', val: R.capital / 100 * 0.35 },
    { lib: 'Crédibilité', val: (R.credibilite - 50) / 250 }
  ];
  if (mods(s).voteBonus) f.push({ lib: 'Doctrine', val: mods(s).voteBonus });
  if (th?.debat) f.push({ lib: 'Débat au Parlement', val: PARAMS.bonusDebat });
  if (th?.crise) f.push({ lib: 'Crise en cours sur le théâtre', val: 0.05 });
  return f;
}
export function probaVote(s: Etat, theatre?: string): number {
  return borner(facteursVote(s, theatre).reduce((a, x) => a + x.val, 0), 0.05, 0.97);
}
export function fiabilite(r: number): string { return r >= 75 ? 'A' : r >= 55 ? 'B' : r >= 35 ? 'C' : r >= 20 ? 'D' : 'E'; }
export function journaliser(s: Etat, texte: string, genre?: GenreJournal): void {
  s.journal.unshift({ tour: s.tour, texte, genre: genre || 'info' });
  if (s.journal.length > 150) s.journal.length = 150;
}
export function decider(s: Etat, texte: string): void { s.decisions.push({ tour: s.tour, texte }); }

export function appuiDef(allie: string, appui: string): AppuiDef { return AL[allie].appuis.find(a => a.id === appui)!; }
export const BONUS_PERIODIQUES = ['rens', 'pression', 'frappesZoom', 'recosZoom', 'opBonus', 'delai', 'soutien'] as const;
export type BonusTheatre = Record<(typeof BONUS_PERIODIQUES)[number], number>;
export function bonusTheatre(s: Etat, t: string): BonusTheatre {
  const th = s.theatres[t], b: BonusTheatre = { rens: 0, pression: 0, frappesZoom: 0, recosZoom: 0, opBonus: 0, delai: 0, soutien: 0 };
  if (th.allie > 0) { b.rens += 10; b.pression += 6; b.frappesZoom += 1; b.opBonus += 0.05; }
  for (const a of th.appuis) { const ef: EffetsAppui = appuiDef(a.allie, a.appui).effets; for (const k of BONUS_PERIODIQUES) if (ef[k]) b[k] += ef[k]!; }
  b.delai = Math.max(-1, b.delai);
  return b;
}
export function delaiProjection(s: Etat, uniteId: string, theatre: string): number {
  return Math.max(0, UN[uniteId].delai + mods(s).delaiMod + bonusTheatre(s, theatre).delai);
}
