import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import * as M from '../src/sim';
import { jouerParties, type ResumePartie } from './bot-aleatoire';

const fichierReference = new URL('./reference-parties.json', import.meta.url);
const reference: ResumePartie[] = JSON.parse(readFileSync(fichierReference, 'utf8'));

describe('données', () => {
  it('ne contiennent aucune référence cassée', () => {
    expect(M.verifierDonnees()).toEqual([]);
  });
});

describe('simulation', () => {
  it('rejoue à l’identique les parties de référence', () => {
    // Après une évolution volontaire des règles : MAJ_REFERENCE=1 npm test (voir CLAUDE.md).
    const parties = jouerParties(M, reference.length, ['facile', 'normal', 'difficile']);
    if (process.env.MAJ_REFERENCE) writeFileSync(fichierReference, JSON.stringify(parties, null, 1) + '\n');
    else expect(parties).toEqual(reference);
  });

  it('est déterministe pour une même graine', () => {
    const a = jouerParties(M, 5, ['normal']), b = jouerParties(M, 5, ['normal']);
    expect(a).toEqual(b);
  });

  it('refuse une action non autorisée', () => {
    const s = M.nouvellePartie(1, 'normal');
    expect(() => M.appliquerAction(s, { type: 'BUDGET', sens: 'hausse' })).toThrow();
  });

  it('ne modifie jamais l’état reçu', () => {
    const s = M.nouvellePartie(7, 'normal');
    const avant = JSON.stringify(s);
    M.appliquerAction(s, { type: 'DOCTRINE', id: 'RENS' });
    expect(JSON.stringify(s)).toBe(avant);
  });
});
