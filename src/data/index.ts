// Point d'entrée des données : réexporte les tables et fournit des index par identifiant.
// Les catalogues (unités, services, doctrines) réunissent toutes les nations ; les identifiants sont uniques.
// La liste propre à la partie en cours s'obtient par les accesseurs de src/sim/acces.ts (unitesDe, servicesDe…).
import { THEATRES } from './monde';
import { MENACES } from './menaces';
import { MATERIELS } from './materiels';
import { ALLIES } from './allies';
import { OPERATIONS } from './operations';
import { NATIONS } from './nations';
import type { EvenementDef } from '../sim/types';
import { EVENEMENTS_BASE } from './evenements';
import { EVENEMENTS_2015 } from './evenements-2015';
import { EVENEMENTS_MENACES } from './evenements-menaces';
import { CAMPAGNE_TRANSSAHARIENNE } from './campagne-transsaharienne';
import { EVENEMENTS_GBR } from './evenements-gbr';
import { EVENEMENTS_ISR } from './evenements-isr';
import { DOSSIERS_PARTAGES } from './dossiers-partages';
import { PUISSANCES } from './puissances';

export * from './monde';
export * from './menaces';
export * from './allies';
export * from './operations';
export * from './cartes-regionales';
export * from './biomes';
export * from './tactique';
export * from './materiels';
export * from './identite-unites';
export * from './nations';
export * from './personnages';
export * from './puissances';
export * from './mandat';

// Tous les événements, toutes nations confondues : un dossier n'est proposé qu'à la nation de son auteur,
// ou, pour un dossier partagé (auteur « @fonction »), à toute nation qui possède ce qu'il mentionne
export const EVENEMENTS: EvenementDef[] = [...EVENEMENTS_BASE, ...EVENEMENTS_2015, ...EVENEMENTS_MENACES, ...CAMPAGNE_TRANSSAHARIENNE, ...EVENEMENTS_GBR, ...EVENEMENTS_ISR, ...DOSSIERS_PARTAGES];

export const TOUTES_UNITES = Object.values(NATIONS).flatMap(N => N.unites);
export const TOUS_SERVICES = Object.values(NATIONS).flatMap(N => N.services);
export const TOUTES_DOCTRINES = Object.values(NATIONS).flatMap(N => N.doctrines);

function indexer<T extends { id: string }>(liste: T[]): Record<string, T> {
  const o: Record<string, T> = {};
  for (const x of liste) o[x.id] = x;
  return o;
}

export const TH = indexer(THEATRES), UN = indexer(TOUTES_UNITES), SV = indexer(TOUS_SERVICES),
  MT = indexer(MENACES), OP = indexer(OPERATIONS), DOC = indexer(TOUTES_DOCTRINES), EV = indexer(EVENEMENTS), AL = indexer(ALLIES), MAT = indexer(MATERIELS), PUI = indexer(PUISSANCES);
