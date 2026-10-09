// Crises : ouverture, décision d'intervenir, résolution abstraite (hors carte régionale).
import { CARTES_REGIONALES, MT, PARAMS, TH, UN } from '../data';
import type { Action, Etat, Menace } from './types';
import { alea, borner, choisir } from './outils';
import { coutMult, decider, journaliser, menaceParId, menacesDans } from './acces';
import { calculerRens } from './renseignement';
import { evaluerCriseAbstraite, moyensCrise } from './evaluation';
import { appliquerEffets, avancerFile, nettoyerMenaces } from './evenements';
import { ouvrirZoom } from './zoom';

export function creerCrise(s: Etat, theatre: string, menaceId: string): boolean {
  const th = s.theatres[theatre];
  if (th.crise) return false;
  const T = TH[theatre], m = menaceParId(s, menaceId)!;
  let titre = MT[m.type].criseTitre + ' — ' + T.nom;
  let texte = 'La situation se dégrade brutalement sur le théâtre ' + T.nom + ' (' + MT[m.type].nom + '). Une décision d’engagement est attendue.';
  let scenario: string | null = null;
  if (T.carteRegionale) {
    const sc = choisir(s, CARTES_REGIONALES[T.carteRegionale].scenarios);
    scenario = sc.id; titre = sc.titre; texte = sc.texte;
  }
  th.crise = { titre, texte, menaceId, scenario, statut: 'ouverte', toursLibres: 0 };
  s.file.push({ kind: 'crise', theatre });
  journaliser(s, 'Crise : ' + titre + '.', 'crise');
  return true;
}
export function menaceDeCrise(s: Etat, theatre: string): Menace | null {
  const c = s.theatres[theatre].crise;
  let m = c ? menaceParId(s, c.menaceId) : null;
  if (!m) m = menacesDans(s, theatre).sort((a, b) => b.force - a.force)[0] || null;
  return m;
}
export function actCrise(s: Etat, a: Extract<Action, { type: 'CRISE' }>): void {
  const theatre = s.criseCourante!, th = s.theatres[theatre], R = s.ressources, T = TH[theatre];
  const crise = th.crise!;
  if (!a.intervenir) {
    s.stats.crisesIgnorees++;
    R.opinion = borner(R.opinion - 3, 0, 100);
    R.credibilite = borner(R.credibilite - 4, 0, 100);
    const m = menaceDeCrise(s, theatre);
    if (m) m.force = borner(m.force + 8, 0, 100);
    crise.statut = 'libre';
    crise.toursLibres = PARAMS.toursCriseLibre;
    const txt = 'Pas d’intervention : ' + crise.titre + '. La crise suit son cours (opinion -3, crédibilité -4).';
    decider(s, txt); journaliser(s, txt, 'alerte');
    s.dernierResultat = { titre: crise.titre, texte: txt };
    s.criseCourante = null;
    avancerFile(s);
    return;
  }
  s.stats.crisesInterv++;
  const moy = moyensCrise(s, theatre);
  if (moy.zoom) { ouvrirZoom(s, theatre, moy); return; }
  // Résolution abstraite (théâtre sans carte régionale)
  const evc = evaluerCriseAbstraite(s, theatre, true), ids = evc.unites, p = evc.pSucces;
  if (evc.urgence) {
    const u = UN[evc.urgence];
    s.unites[u.id].etat = 'deployee'; s.unites[u.id].theatre = theatre;
    s.ressources.budget -= u.coutDeploiement * coutMult(s);
    journaliser(s, u.nom + ' projeté en urgence vers ' + T.nom + '.', 'decision');
  }
  const m = menaceDeCrise(s, theatre);
  const res: string[] = [];
  if (alea(s) < p) {
    s.stats.crisesReussies++;
    if (m) m.force = Math.max(0, m.force - 15);
    appliquerEffets(s, { opinion: 4, credibilite: 4, capital: 2 }, res);
    res.unshift('Crise maîtrisée.');
  } else {
    if (m) m.force = borner(m.force + 3, 0, 100);
    appliquerEffets(s, { opinion: -4, credibilite: -3 }, res);
    res.unshift('Intervention sans résultat décisif.');
  }
  if (alea(s) < evc.risquePertes) { s.stats.pertes++; R.opinion = borner(R.opinion - 3, 0, 100); res.push('Pertes dans nos rangs.'); }
  for (const id of ids) s.unites[id].fatigue = borner(s.unites[id].fatigue + 12, 0, 100);
  const txt = 'Intervention — ' + crise.titre + ' : ' + res.join(' ');
  decider(s, txt); journaliser(s, txt, 'crise');
  s.dernierResultat = { titre: crise.titre, texte: res.join(' ') };
  th.crise = null;
  s.criseCourante = null;
  nettoyerMenaces(s);
  calculerRens(s);
  avancerFile(s);
}
