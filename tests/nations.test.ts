// Modèle nation : chaque nation jouable se lance, se joue jusqu'au bout et ne voit que ses propres données.
import { describe, expect, it } from 'vitest';
import * as M from '../src/sim';
import { NATIONS, PERS, EV } from '../src/data';
import { jouerParties } from './bot-aleatoire';
import { jouerPrudent } from './bot-prudent';

describe('nations', () => {
  it('les données de chaque nation sont cohérentes', () => {
    expect(M.verifierDonnees()).toEqual([]);
  });

  for (const id of Object.keys(NATIONS)) {
    it(id + ' : la partie ne contient que les forces, services, alliés et théâtres de la nation', () => {
      const N = NATIONS[id], s = M.nouvellePartie(7, 'normal', id);
      expect(s.nation).toBe(id);
      expect(Object.keys(s.unites)).toEqual(N.unites.map(u => u.id));
      expect(Object.keys(s.services)).toEqual(N.services.map(x => x.id));
      expect(Object.keys(s.allies)).toEqual(Object.keys(N.allies));
      expect(Object.keys(s.theatres)).toEqual(N.theatres);
      expect(s.menaces.every(m => N.theatres.includes(m.theatre))).toBe(true);
      expect(M.actionsPossibles(s).map(a => (a as { id: string }).id)).toEqual(N.doctrines.map(d => d.id));
    });

    it(id + ' : parties aléatoires sans blocage ni invariant violé, dossiers de la nation seulement', () => {
      const moteur = { ...M, nouvellePartie: (g: string | number, d: string) => M.nouvellePartie(g, d, id) };
      const r = jouerParties(moteur, 9, ['facile', 'normal', 'difficile']);
      expect(r.every(x => x.fin !== 'non terminée')).toBe(true);
      let s = M.appliquerAction(M.nouvellePartie(3, 'facile', id), M.actionsPossibles(M.nouvellePartie(3, 'facile', id))[0]);
      for (let t = 0; t < 24 && !s.fin; t++) {
        while (s.phase !== 'jeu' && !s.fin) {
          if (s.phase === 'evenement') expect(PERS[EV[s.evenementCourant!].auteur].pays).toBe(id);
          s = M.appliquerAction(s, M.actionsPossibles(s)[0]);
        }
        if (!s.fin) s = M.finDeTour(s);
      }
    });
  }

  it('Royaume-Uni : les forces spéciales échappent au vote des Communes', () => {
    let s = M.nouvellePartie(11, 'normal', 'GBR');
    s = M.appliquerAction(s, M.actionsPossibles(s)[0]);
    s = M.appliquerAction(s, { type: 'DEPLOYER', unite: 'SAS22', theatre: 'LIBYE' });
    s = M.finDeTour(s);
    while (s.phase !== 'jeu') s = M.appliquerAction(s, M.actionsPossibles(s).find(a => a.type !== 'CRISE' || !a.intervenir) || M.actionsPossibles(s)[0]);
    s = M.finDeTour(s);
    expect(s.theatres.LIBYE.toursIntervention).toBe(0);
    expect(M.unitesDans(s, 'LIBYE').map(u => u.id)).toContain('SAS22');
  });

  it('Royaume-Uni : l’effet de levier rend les États-Unis plus accessibles', () => {
    const f = M.nouvellePartie(5, 'normal', 'FRA'), g = M.nouvellePartie(5, 'normal', 'GBR');
    const ef = M.evaluerAppui(f, 'USA', 'ISR', 'LEVANT'), eg = M.evaluerAppui(g, 'USA', 'ISR', 'LEVANT');
    expect(eg.levier).toBe(true);
    expect(eg.pSucces).toBeGreaterThan(ef.pSucces);
    expect(eg.capital).toBeLessThan(ef.capital);
  });

  it('le robot prudent termine ses parties britanniques', () => {
    const r = jouerPrudent(3, ['facile', 'normal', 'difficile'], 'GBR');
    expect(r.every(x => x.fin !== 'non terminée')).toBe(true);
  }, 60000);
});
