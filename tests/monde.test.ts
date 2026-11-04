// Monde partagé, dossiers partagés, horloges de menace et objectifs de mandat.
import { describe, expect, it } from 'vitest';
import * as M from '../src/sim';
import { CARTES_REGIONALES, EV, NATIONS, PARAMS, PUI } from '../src/data';
import type { Etat } from '../src/sim';

const partie = (nation = 'FRA', graine = 5): Etat => {
  const s = M.nouvellePartie(graine, 'normal', nation);
  return M.appliquerAction(s, M.actionsPossibles(s)[0]);
};
// Avance d'un mois en répondant au premier choix possible des dossiers en attente
const mois = (s: Etat): Etat => {
  let n = M.finDeTour(s);
  while (n.phase !== 'jeu' && !n.fin) n = M.appliquerAction(n, M.actionsPossibles(n)[0]);
  return n;
};

describe('monde partagé', () => {
  it('la nation jouée ne figure pas parmi les puissances', () => {
    for (const id in NATIONS) {
      const s = partie(id);
      expect(Object.keys(s.monde.puissances)).not.toContain(id);
      expect(Object.keys(s.monde.puissances).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('part des engagements de janvier 2015', () => {
    const s = partie('FRA');
    expect(M.engagement(s, 'USA', 'LEVANT')).toBe(2);
    expect(M.engagement(s, 'RUS', 'EST')).toBe(2);
    expect(M.engagement(s, 'CHN', 'INDOPAC')).toBe(2);
  });

  it('les puissances pèsent sur les menaces qu’elles combattent', () => {
    const s = partie('FRA');
    const daech = s.menaces.find(m => m.type === 'DAECH')!;
    const sansMonde: Etat = { ...s, monde: { puissances: {} } };
    expect(M.pressionMenace(s, daech)).toBeGreaterThan(M.pressionMenace(sansMonde, daech));
  });

  it('les engagements restent dans les bornes et la capacité sur trois ans', () => {
    let s = partie('GBR', 11);
    for (let t = 0; t < 36 && !s.fin; t++) {
      s = mois(s);
      for (const id in s.monde.puissances) {
        const e = Object.values(s.monde.puissances[id].engagements);
        expect(e.every(x => x >= 0 && x <= M.NIVEAU_MAX)).toBe(true);
        expect(e.reduce((a, x) => a + x, 0)).toBeLessThanOrEqual(PUI[id].capacite);
      }
    }
  });

  it('une puissance alliée partage la relation de l’allié correspondant', () => {
    const s = partie('FRA');
    expect(M.attitude(s, 'USA')).toBe(s.allies.USA.relation);
  });
});

describe('dossiers partagés', () => {
  it('ne sont proposés qu’aux nations qui possèdent ce qu’ils mentionnent', () => {
    expect(M.dossierDeNation(NATIONS.FRA, EV.DP_POLICE_CIEL)).toBe(true);
    expect(M.dossierDeNation(NATIONS.GBR, EV.DP_POLICE_CIEL)).toBe(true);
    expect(M.dossierDeNation(NATIONS.ISR, EV.DP_POLICE_CIEL)).toBe(false);   // pas de théâtre à l'est
    expect(M.dossierDeNation(NATIONS.ISR, EV.DP_FICHIER_COMMUN)).toBe(false); // liste de nations
    expect(M.dossierDeNation(NATIONS.ISR, EV.DP_INGERENCE_ELECTORALE)).toBe(true);
  });

  it('sont présentés par le responsable de la nation jouée', () => {
    const E = EV.DP_INGERENCE_ELECTORALE;
    expect(M.auteurDe(partie('FRA'), E).id).toBe('FRA_ANSSI');
    expect(M.auteurDe(partie('GBR'), E).id).toBe('GBR_GCHQ');
    expect(M.texteDossier(partie('GBR'), E)).toContain('Duncan Freer');
    expect(M.texteDossier(partie('GBR'), E)).not.toContain('{auteur}');
  });
});

describe('horloges de menace', () => {
  it('une menace proche de son seuil prépare une action qui finit par survenir', () => {
    let s = partie('FRA', 21);
    const m = s.menaces.find(x => x.type === 'DAECH')!;
    m.force = 70; m.horloge = PARAMS.preparationAttaque - 1;
    const avant = s.stats.attaques + s.stats.dejoues;
    s = M.finDeTour(s);
    expect(s.stats.attaques + s.stats.dejoues).toBeGreaterThan(avant);
    expect(s.menaces.find(x => x.id === m.id)?.horloge ?? 0).toBe(0);
  });

  it('une menace loin de son seuil voit son horloge reculer', () => {
    let s = partie('FRA', 22);
    const m = s.menaces.find(x => x.type === 'PIRATERIE')!;
    m.force = 5; m.horloge = 3;
    s = M.finDeTour(s);
    expect(s.menaces.find(x => x.id === m.id)?.horloge ?? 0).toBeLessThan(3);
  });
});

describe('objectifs de mandat', () => {
  it('trois objectifs sont fixés avec la doctrine', () => {
    for (const id in NATIONS) {
      const s = partie(id);
      expect(s.mandat.objectifs.length).toBe(3);
      expect(s.mandat.annee).toBe(2015);
      expect(new Set(s.mandat.objectifs.map(o => o.type)).size).toBe(3);
    }
  });

  it('sont évalués en décembre puis renouvelés en janvier', () => {
    let s = partie('FRA', 8);
    for (let t = 0; t < 12 && !s.fin; t++) s = mois(s);
    if (s.fin) return;
    expect(s.mandat.bilans.length).toBe(1);
    expect(s.mandat.bilans[0].annee).toBe(2015);
    expect(s.mandat.annee).toBe(2016);
    expect(s.mandat.objectifs.every(o => o.resultat === 'en_cours')).toBe(true);
  });
});

describe('interventions : terrain et objectif secondaire', () => {
  const ouvrir = (graine: number): Etat => {
    const s = partie('FRA', graine);
    const m = s.menaces.find(x => x.theatre === 'LEVANT')!;
    s.theatres.LEVANT.crise = { titre: 'Offensive contre le front kurde', texte: '', menaceId: m.id, scenario: 'FRONT_KURDE', statut: 'ouverte', toursLibres: 0 };
    s.phase = 'crise'; s.criseCourante = 'LEVANT'; s.file = [];
    return M.appliquerAction(s, { type: 'CRISE', intervenir: true });
  };

  it('le terrain se déduit du lieu et du biome, avec des exceptions déclarées', () => {
    const C = CARTES_REGIONALES.SAHEL;
    expect(M.terrainDuLieu(C, 'IFOGHAS').id).toBe('montagne');
    expect(M.terrainDuLieu(C, 'WAGADOU').id).toBe('foret');
    expect(M.terrainDuLieu(C, 'GAO').id).not.toBe('montagne');
    expect(M.terrainDuLieu(C, 'TOMBOUCTOU').id).toBe('urbain');
  });

  it('chaque intervention propose un objectif secondaire hors des objectifs principaux', () => {
    for (const g of [3, 4, 5, 6]) {
      const s = ouvrir(g);
      expect(s.phase).toBe('zoom');
      const sec = s.zoom!.secondaire;
      if (!sec) continue;
      const principaux = CARTES_REGIONALES[s.zoom!.carte].scenarios.find(x => x.id === s.zoom!.scenario)!.objectifs.map(o => o.lieu);
      expect(principaux).not.toContain(sec.lieu);
      expect(s.zoom!.lieux[sec.lieu].controle).toBe('ennemi');
      expect(M.objectifSecondaire(s)!.consigne).not.toContain('{lieu}');
    }
  });
});
