// Point d'entrée des données : réexporte les tables et fournit des index par identifiant.
import { THEATRES } from './monde';
import { UNITES, SERVICES, ALLIES, OPERATIONS, DOCTRINES } from './france';
import { MENACES } from './menaces';
import { MATERIELS } from './materiels';
import type { EvenementDef } from '../sim/types';
import { EVENEMENTS_BASE } from './evenements';
import { EVENEMENTS_2015 } from './evenements-2015';
import { EVENEMENTS_MENACES } from './evenements-menaces';
import { CAMPAGNE_TRANSSAHARIENNE } from './campagne-transsaharienne';

export * from './monde';
export * from './france';
export * from './menaces';
export * from './cartes-regionales';
export * from './biomes';
export * from './tactique';
export * from './materiels';
export * from './identite-unites';
export * from './nations';
export * from './personnages';
export * from './briefing';

// Tous les événements de la campagne
export const EVENEMENTS: EvenementDef[] = [...EVENEMENTS_BASE, ...EVENEMENTS_2015, ...EVENEMENTS_MENACES, ...CAMPAGNE_TRANSSAHARIENNE];

function indexer<T extends { id: string }>(liste: T[]): Record<string, T> {
  const o: Record<string, T> = {};
  for (const x of liste) o[x.id] = x;
  return o;
}

export const TH = indexer(THEATRES), UN = indexer(UNITES), SV = indexer(SERVICES),
  MT = indexer(MENACES), OP = indexer(OPERATIONS), DOC = indexer(DOCTRINES), EV = indexer(EVENEMENTS), AL = indexer(ALLIES), MAT = indexer(MATERIELS);
