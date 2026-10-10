import { describe, expect, it } from 'vitest';
import * as M from '../src/sim';
import { UN } from '../src/data';

const depart = () => M.appliquerAction(M.nouvellePartie(11, 'normal'), { type: 'DOCTRINE', id: 'PROJ' });

describe('tactique', () => {
  it('implante les forces au sol au point d’entrée du théâtre', () => {
    const s = depart();
    expect(s.unites.GTIA1.lieu).toBe('GAO');
    expect(s.unites.RAFALE.lieu).toBeNull();
    expect(M.verifierInvariants(s, true)).toEqual([]);
  });

  it('la posture offensive accroît la pression, la réserve la réduit', () => {
    const s = depart();
    const m = s.menaces.find(x => x.theatre === 'SAHEL')!;
    const base = M.pressionMenace(s, m);
    const off = M.appliquerAction(s, { type: 'POSTURE', unite: 'GTIA1', posture: 'offensive' });
    const res = M.appliquerAction(s, { type: 'POSTURE', unite: 'GTIA1', posture: 'reserve' });
    expect(M.pressionMenace(off, m)).toBeGreaterThan(base);
    expect(M.pressionMenace(res, m)).toBeLessThan(base);
  });

  it('la reconnaissance améliore le renseignement du théâtre', () => {
    const s = depart();
    const r = M.appliquerAction(s, { type: 'POSTURE', unite: 'REAPER', posture: 'reconnaissance' });
    expect(r.theatres.SAHEL.rens).toBeGreaterThanOrEqual(s.theatres.SAHEL.rens);
  });

  it('une frappe exige une position identifiée, puis réduit l’activité adverse', () => {
    let s = depart();
    s.theatres.SAHEL.lieux.GOURMA.connu = 10;
    expect(M.missionValide(s, 'M2000D', { type: 'frappe', lieu: 'GOURMA' })).toBe(false);
    s = structuredClone(s);
    s.theatres.SAHEL.lieux.GOURMA.connu = 90;
    expect(M.missionValide(s, 'M2000D', { type: 'frappe', lieu: 'GOURMA' })).toBe(true);
    const avant = s.theatres.SAHEL.lieux.GOURMA.activite;
    s = M.appliquerAction(s, { type: 'MISSION', unite: 'M2000D', mission: 'frappe', lieu: 'GOURMA' });
    s.file = [];
    const n = M.finDeTour(s);
    expect(n.theatres.SAHEL.lieux.GOURMA.activite).toBeLessThan(avant);
  });

  it('respecte les règles d’engagement : aucune frappe sur le territoire national', () => {
    const s = depart();
    for (const id of Object.keys(s.unites)) expect(M.missionsPossibles(s, id).some(o => o.type === 'frappe' && s.unites[id].theatre === 'METRO')).toBe(false);
  });

  it('un soutien insuffisant réduit l’efficacité et renchérit les coûts', () => {
    const s = depart();
    const sout = M.soutienTheatre(s, 'SAHEL');
    const t = structuredClone(s);
    for (const id of ['GTIA2', 'GTIA3', 'CAESAR', 'GAM', 'RH2']) Object.assign(t.unites[id], { etat: 'deployee', theatre: 'SAHEL', lieu: 'GAO' });
    const sout2 = M.soutienTheatre(t, 'SAHEL');
    expect(sout2.demande).toBeGreaterThan(sout.demande);
    expect(sout2.ratio).toBeLessThan(1);
    expect(M.coutMensuelUnite(t, UN.GTIA1)).toBeGreaterThan(M.coutMensuelUnite(s, UN.GTIA1));
    expect(M.multiplicateurUnite(t, UN.GTIA1)).toBeLessThan(M.multiplicateurUnite(s, UN.GTIA1));
  });

  it('les ordres tactiques sont gratuits et ne consomment pas d’action', () => {
    const s = depart();
    const n = M.appliquerAction(s, { type: 'POSTURE', unite: 'GTIA1', posture: 'reconnaissance' });
    expect(n.actionsRestantes).toBe(s.actionsRestantes);
  });

  it('la résolution est déterministe', () => {
    const a = M.finDeTour({ ...depart(), file: [] }), b = M.finDeTour({ ...depart(), file: [] });
    expect(a).toEqual(b);
  });
});
