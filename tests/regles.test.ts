import { describe, expect, it } from 'vitest';
import * as M from '../src/sim';

const depart = () => M.appliquerAction(M.nouvellePartie(21, 'normal'), { type: 'DOCTRINE', id: 'RENS' });

describe('article 35', () => {
  it('un débat au Parlement facilite le vote, contre une action et du capital', () => {
    let s = depart();
    s = M.appliquerAction(s, { type: 'DEPLOYER', unite: 'GTIA2', theatre: 'LIBYE' });
    s = { ...s, theatres: { ...s.theatres, LIBYE: { ...s.theatres.LIBYE, toursIntervention: 2 } } };
    const avant = M.probaVote(s, 'LIBYE');
    const n = M.appliquerAction(s, { type: 'DEBAT', theatre: 'LIBYE' });
    expect(M.probaVote(n, 'LIBYE')).toBeGreaterThan(avant);
    expect(n.actionsRestantes).toBe(s.actionsRestantes - 1);
    expect(n.ressources.capital).toBeLessThan(s.ressources.capital);
    expect(M.actionsPossibles(n).some(a => a.type === 'DEBAT' && a.theatre === 'LIBYE')).toBe(false);
  });
});

describe('crises hors carte', () => {
  it('proposent les réponses du théâtre et les résolvent', () => {
    const s = depart();
    const m = s.menaces.find(x => x.theatre === 'METRO')!;
    const c = { ...s, phase: 'crise' as const, criseCourante: 'METRO', file: [],
      theatres: { ...s.theatres, METRO: { ...s.theatres.METRO, crise: { titre: 'Test', texte: 'Test', menaceId: m.id, scenario: null, statut: 'ouverte' as const, toursLibres: 0 } } } };
    const L = M.actionsPossibles(c);
    expect(L.filter(a => a.type === 'CRISE_REPONSE').length).toBe(2);
    expect(L.some(a => a.type === 'CRISE' && a.intervenir)).toBe(false);
    const n = M.appliquerAction(c, { type: 'CRISE_REPONSE', index: 1 });
    expect(n.theatres.METRO.crise).toBeNull();
    expect(n.stats.crisesInterv).toBe(c.stats.crisesInterv + 1);
    expect(M.verifierInvariants(n, true)).toEqual([]);
  });
});

describe('score', () => {
  it('compte le contrôle du terrain et des poids qui somment à 1', () => {
    const sc = M.calculerScore(depart());
    expect(sc.domaines.some(d => d.nom === 'Contrôle du terrain')).toBe(true);
    expect(Math.round(sc.domaines.reduce((a, d) => a + d.poids, 0) * 100)).toBe(100);
  });
});

describe('campagne de la route du Fezzan', () => {
  it('enchaîne les dossiers selon les choix', () => {
    let s = M.forcerEvenement(depart(), 'ROUTE_SIGNAL');
    expect(s.evenementCourant).toBe('ROUTE_SIGNAL');
    s = M.appliquerAction(s, { type: 'CHOIX', index: 0 });
    expect(s.chaines.some(c => c.id === 'ROUTE_FILIERE')).toBe(true);
    for (let i = 0; i < 2; i++) {
      s = M.finDeTour({ ...s, file: s.file.filter(f => f.kind === 'evenement' && f.id.startsWith('ROUTE')), phase: 'jeu', evenementCourant: null });
      while (s.phase === 'evenement' && s.evenementCourant !== 'ROUTE_FILIERE') s = M.appliquerAction(s, M.actionsPossibles(s)[0]);
      if (s.evenementCourant === 'ROUTE_FILIERE') break;
    }
    expect(s.evenementCourant).toBe('ROUTE_FILIERE');
  });
});
