// Dossiers (événements) : à quelle nation ils s'adressent, qui les présente, texte adapté à la nation jouée.
// Un dossier propre à une nation a pour auteur un personnage ; un dossier partagé a pour auteur une fonction
// (« @rens_ext ») et n'est proposé qu'aux nations qui possèdent tout ce qu'il mentionne.
import { EV, NATIONS, PERS, TH } from '../data';
import type { Personnage } from '../data/personnages';
import type { Effets, Etat, EvenementDef, NationDef, RoleAuteur } from './types';

export const ROLES_AUTEUR: RoleAuteur[] = ['chef', 'defense', 'diplomatie', 'interieur', 'rens_ext', 'rens_int', 'etat_major', 'securite', 'cyber'];

export function estPartage(E: EvenementDef): boolean { return E.auteur.startsWith('@'); }
export function roleDe(E: EvenementDef): RoleAuteur | null { return estPartage(E) ? E.auteur.slice(1) as RoleAuteur : null; }

// Références d'un dossier extérieures à la nation : théâtres, unités, alliés absents de sa partie.
export function referencesHorsNation(N: NationDef, E: EvenementDef): string[] {
  const err: string[] = [], T = new Set(N.theatres), U = new Set(N.unites.map(u => u.id)), A = new Set(Object.keys(N.allies));
  const verif = (x: Effets | undefined): void => {
    if (!x) return;
    for (const k of ['rens', 'partenaire', 'pression'] as const) for (const y of (x[k] || [])) if (!T.has(y.theatre)) err.push('théâtre hors partie ' + y.theatre);
    for (const y of (x.fatigue || [])) if (y.unite && !U.has(y.unite)) err.push('unité étrangère ' + y.unite);
    if (x.indispo && !U.has(x.indispo.unite)) err.push('unité étrangère ' + x.indispo.unite);
    for (const y of (x.relation || [])) if (!A.has(y.allie)) err.push('allié absent ' + y.allie);
    if (x.appui && (!A.has(x.appui.allie) || !T.has(x.appui.theatre))) err.push('appui hors partie');
    if (x.allie && !T.has(x.allie.theatre)) err.push('théâtre hors partie ' + x.allie.theatre);
    if (x.crise && TH[x.crise] && !T.has(x.crise)) err.push('crise hors partie ' + x.crise);
    for (const y of (x.puissance || [])) if (y.theatre && !T.has(y.theatre)) err.push('théâtre hors partie ' + y.theatre);
    if (x.alea) { verif(x.alea.succes); verif(x.alea.echec); }
  };
  for (const c of E.choix) verif(c.effets);
  const k = E.cond || {};
  if (k.theatreDeploye && !T.has(k.theatreDeploye)) err.push('condition hors partie ' + k.theatreDeploye);
  if (k.rensMin && !T.has(k.rensMin.theatre)) err.push('condition hors partie ' + k.rensMin.theatre);
  if (k.menace?.theatre && !T.has(k.menace.theatre)) err.push('condition hors partie ' + k.menace.theatre);
  if (k.puissance?.theatre && !T.has(k.puissance.theatre)) err.push('condition hors partie ' + k.puissance.theatre);
  for (const r of [k.relationMin, k.relationMax]) if (r && !A.has(r.allie)) err.push('condition sur allié absent ' + r.allie);
  return err;
}

const cache: Record<string, boolean> = {};
// Le dossier peut-il être proposé à cette nation ?
export function dossierDeNation(N: NationDef, E: EvenementDef): boolean {
  if (!estPartage(E)) return PERS[E.auteur]?.pays === N.id;
  if (E.nations && !E.nations.includes(N.id)) return false;
  const cle = N.id + '/' + E.id;
  if (cache[cle] === undefined) cache[cle] = !!N.roles[roleDe(E)!] && referencesHorsNation(N, E).length === 0;
  return cache[cle];
}

export function auteurDe(s: Etat, E: EvenementDef): Personnage {
  const r = roleDe(E);
  return PERS[r ? (NATIONS[s.nation] || NATIONS.FRA).roles[r] : E.auteur];
}

// Texte du dossier pour la nation jouée : {auteur}, {fonction} et {territoire} remplacés
export function texteDossier(s: Etat, E: EvenementDef): string {
  const A = auteurDe(s, E), N = NATIONS[s.nation] || NATIONS.FRA;
  return E.texte.replace(/\{auteur\}/g, A.nom).replace(/\{fonction\}/g, A.fonction.charAt(0).toLowerCase() + A.fonction.slice(1)).replace(/\{territoire\}/g, TH[N.territoire].nom);
}

export function dossierCourant(s: Etat): EvenementDef | null { return s.evenementCourant ? EV[s.evenementCourant] : null; }
