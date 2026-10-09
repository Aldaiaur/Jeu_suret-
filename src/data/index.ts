// Point d'entrée des données : réexporte les tables et fournit des index par identifiant.
import { THEATRES } from './monde';
import { UNITES, SERVICES, ALLIES, OPERATIONS, DOCTRINES } from './france';
import { MENACES } from './menaces';
import { EVENEMENTS } from './evenements';

export * from './monde';
export * from './france';
export * from './menaces';
export * from './evenements';
export * from './cartes-regionales';

function indexer<T extends { id: string }>(liste: T[]): Record<string, T> {
  const o: Record<string, T> = {};
  for (const x of liste) o[x.id] = x;
  return o;
}

export const TH = indexer(THEATRES), UN = indexer(UNITES), SV = indexer(SERVICES),
  MT = indexer(MENACES), OP = indexer(OPERATIONS), DOC = indexer(DOCTRINES), EV = indexer(EVENEMENTS), AL = indexer(ALLIES);
