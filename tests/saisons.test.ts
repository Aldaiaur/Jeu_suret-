import { describe, expect, it } from 'vitest';
import * as M from '../src/sim';
import { THEATRES } from '../src/data';

describe('saisons', () => {
  it('couvrent chaque mois de chaque théâtre', () => {
    for (const T of THEATRES) for (let t = 0; t < 36; t++) expect(M.saisonDu(T.id, t)).toBeDefined();
  });

  it('suivent le calendrier déclaré dans les données', () => {
    expect(M.saisonDu('SAHEL', 6).id).toBe('PLUIES');        // juillet 2015
    expect(M.saisonDu('SAHEL', 12).id).toBe('SECHE');        // janvier 2016
    expect(M.saisonDu('LEVANT', 19).id).toBe('ETE');         // août 2016
    expect(M.saisonDu('EST', 3).id).toBe('RASPOUTITSA_P');   // avril 2015
    expect(M.saisonDu('EST', 23).id).toBe('HIVER');          // décembre 2016
    expect(M.saisonDu('CORNE', 7).id).toBe('MOUSSON_SO');
  });

  it('réduisent la pression terrestre au Sahel pendant les pluies', () => {
    const base = M.nouvellePartie(3, 'normal');
    const m = base.menaces.find(x => x.theatre === 'SAHEL')!;
    const janvier = M.pressionMenace({ ...base, tour: 0 }, m);
    const juillet = M.pressionMenace({ ...base, tour: 6 }, m);
    expect(juillet).toBeLessThan(janvier);
  });

  it('accélèrent la fatigue au Levant en été', () => {
    const fatigueApres = (tour: number) => {
      let s = M.appliquerAction(M.nouvellePartie(5, 'normal'), { type: 'DOCTRINE', id: 'RENS' });
      s = { ...s, tour, file: [], phase: 'jeu' };
      const avant = s.unites.RAFALE.fatigue;
      const n = M.finDeTour(s);
      return n.unites.RAFALE.fatigue - avant;
    };
    expect(fatigueApres(6)).toBeGreaterThan(fatigueApres(0));
  });

  it('sont déterministes', () => {
    expect(M.saisonDu('GUINEE', 4)).toEqual(M.saisonDu('GUINEE', 16));
  });
});
