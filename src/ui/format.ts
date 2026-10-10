// Mise en forme partagée par les composants.
import { AL, CATEGORIES, MOBILITE_HELICO, MT, SOUTIEN_UNITE, TH, UN } from '../data';
import { appuiDef, type AppuiDef, type Capacite, type Effets, type UniteDef } from '../sim';

export const pct = (p: number) => Math.round(p * 100) + ' %';
export const signe = (v: number) => (v > 0 ? '+' : '') + v;

// Couleur d'un niveau 0-100. `inverse` : une valeur haute est bonne (opinion, crédibilité...).
export function couleurNiveau(v: number | null | undefined, inverse = false): string {
  if (v === null || v === undefined) return 'var(--texte-3)';
  const x = inverse ? 100 - v : v;
  return x >= 60 ? 'var(--rouge)' : x >= 35 ? 'var(--ambre)' : 'var(--vert)';
}
export function tonNiveau(v: number, inverse = false): 'rouge' | 'ambre' | 'vert' {
  const x = inverse ? 100 - v : v;
  return x >= 60 ? 'rouge' : x >= 35 ? 'ambre' : 'vert';
}

export interface Puce { texte: string; ton: 'vert' | 'rouge' | 'neutre' }

// Effets d'un choix d'événement, en puces colorées (vert = favorable au joueur).
export function pucesEffets(e: Effets | undefined, dv = 'M€'): Puce[] {
  if (!e) return [];
  const r: Puce[] = [];
  const p = (texte: string, bon: boolean | null) => r.push({ texte, ton: bon === null ? 'neutre' : bon ? 'vert' : 'rouge' });
  if (e.opinion) p('Opinion ' + signe(e.opinion), e.opinion > 0);
  if (e.capital) p('Capital ' + signe(e.capital), e.capital > 0);
  if (e.credibilite) p('Crédibilité ' + signe(e.credibilite), e.credibilite > 0);
  if (e.menaceInt) p('Menace intérieure ' + signe(e.menaceInt), e.menaceInt < 0);
  if (e.budget) p('Budget ' + signe(e.budget) + ' ' + dv, e.budget > 0);
  if (e.enveloppe) p('Enveloppe ' + signe(e.enveloppe) + ' ' + dv + '/mois', e.enveloppe > 0);
  for (const x of e.menace || []) p(MT[x.type].nom + ' ' + signe(x.delta), x.delta < 0);
  for (const x of e.rens || []) p('Renseignement ' + TH[x.theatre].nom + ' ' + signe(x.delta), x.delta > 0);
  for (const x of e.partenaire || []) p('Partenaire ' + TH[x.theatre].nom + ' ' + signe(x.delta), x.delta > 0);
  for (const x of e.pression || []) p('Pression ' + TH[x.theatre].nom + ' ' + signe(x.delta), x.delta > 0);
  for (const x of e.fatigue || []) p('Fatigue ' + (x.unite ? UN[x.unite].nom : CATEGORIES[x.categorie!]) + ' ' + signe(x.delta), x.delta < 0);
  if (e.indispo) p(UN[e.indispo.unite].nom + ' indisponible ' + e.indispo.tours + ' mois', false);
  if (e.allie) p('Appui allié ' + TH[e.allie.theatre].nom, true);
  for (const x of e.relation || []) p('Relation ' + AL[x.allie].nom + ' ' + signe(x.delta), x.delta > 0);
  if (e.appui) p(appuiDef(e.appui.allie, e.appui.appui).nom + ' (' + e.appui.tours + ' mois)', true);
  if (e.crise) p('Ouvre une crise', false);
  if (e.alea) p('Issue incertaine : ' + pct(e.alea.p) + ' favorable', null);
  return r;
}

export function decrireAppui(ap: AppuiDef): string {
  const e = ap.effets, r: string[] = [];
  if (e.rens) r.push('renseignement +' + e.rens);
  if (e.pression) r.push('pression +' + e.pression);
  if (e.opBonus) r.push('opérations +' + Math.round(e.opBonus * 100) + ' %');
  if (e.frappesZoom) r.push('frappes +' + e.frappesZoom);
  if (e.recosZoom) r.push('reconnaissances +' + e.recosZoom);
  if (e.delai) r.push('projection ' + e.delai + ' mois');
  if (e.partenaire) r.push('partenaire +' + e.partenaire);
  if (e.soutien) r.push('soutien +' + e.soutien);
  return r.join(', ');
}

export const COULEURS_CATEGORIE: Record<string, string> = {
  FS: 'var(--rouge-vif)', INT: 'var(--ambre)', TERRE: 'var(--vert)', AIR: 'var(--turquoise)', MER: 'var(--violet)'
};

// Spécialité d'une unité en mots simples : ses points forts (capacités de 7 et plus) et ses rôles particuliers
const LIB_CAPACITE: Record<Capacite, string> = { assaut: 'combat au sol', renseignement: 'renseignement', frappe: 'frappes', discretion: 'actions discrètes', endurance: 'présence durable' };
export function specialite(u: UniteDef): string {
  const roles: string[] = [];
  if (u.protection) roles.push('protection du territoire');
  if (SOUTIEN_UNITE[u.id]) roles.push('soutien logistique');
  if (MOBILITE_HELICO.includes(u.id)) roles.push('mobilité');
  const forts = (Object.keys(u.cap) as Capacite[]).filter(c => c !== 'endurance' && u.cap[c] >= 7).sort((a, b) => u.cap[b] - u.cap[a]).map(c => LIB_CAPACITE[c]);
  const r = [...roles, ...forts].slice(0, 3);
  return r.length ? r.join(', ') : u.cap.endurance >= 7 ? LIB_CAPACITE.endurance : 'polyvalente';
}
