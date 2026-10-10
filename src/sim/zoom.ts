// Zoom régional : moteur générique piloté par CARTES_REGIONALES (1 tour local = 1 semaine).
import { CARTES_REGIONALES, TH, UN } from '../data';
import { unitesDe } from './acces';
import type { ActionZoom, CarteRegionaleDef, Etat, ObjectifEtat, Zoom, ZoomLieu } from './types';
import { alea, aleaEntre, aleaInt, borner, choisir } from './outils';
import { bonusTheatre, coutMult, decider, journaliser, saisonDu, unitesDans } from './acces';
import { calculerRens } from './renseignement';
import type { MoyensCrise } from './evaluation';
import { appliquerEffets, avancerFile, nettoyerMenaces } from './evenements';
import { menaceDeCrise } from './crises';
import { deployerUrgence, estAuSol } from './tactique';

export function voisinsLieu(C: CarteRegionaleDef, id: string): string[] {
  const r: string[] = [];
  for (const [a, b] of C.liens) { if (a === id) r.push(b); else if (b === id) r.push(a); }
  return r;
}
export function ouvrirZoom(s: Etat, theatre: string, moy: Extract<MoyensCrise, { zoom: true }>): void {
  const T = TH[theatre], th = s.theatres[theatre], C = CARTES_REGIONALES[T.carteRegionale!];
  const sc = C.scenarios.find(x => x.id === th.crise!.scenario) || C.scenarios[0];
  let fsIds = moy.fs.slice();
  if (fsIds.length === 0) {
    const u = UN[moy.fsDispo[0]];
    deployerUrgence(s, u.id, theatre);
    s.ressources.budget -= u.coutDeploiement * coutMult(s);
    fsIds = [u.id];
    journaliser(s, u.nom + ' projeté en urgence vers ' + T.nom + '.', 'decision');
    calculerRens(s);
  }
  const rens = th.rens;
  const lieux: Record<string, ZoomLieu> = {};
  let total = 0;
  // La crise part de la situation du théâtre : contrôle des lieux, activité adverse, forces au sol en place
  for (const L of C.lieux) {
    const md = (sc.modifs && sc.modifs[L.id]) || {}, x = th.lieux[L.id];
    const f = x.controle === 'ennemi' ? Math.max(5, Math.round(x.activite * aleaEntre(s, 0.85, 1.15) + (md.force || 0))) : 0;
    total += f;
    const garnison = unitesDe(s).filter(u => estAuSol(u) && !C.forcesCrise.includes(u.categorie) && s.unites[u.id].etat === 'deployee' && s.unites[u.id].theatre === theatre && s.unites[u.id].lieu === L.id);
    const defense = L.defense + garnison.reduce((a, u) => a + (s.unites[u.id].posture === 'defensive' ? 15 : 8), 0);
    lieux[L.id] = { controle: x.controle, force: f, civils: L.civils, defense, ressortissants: md.ressortissants || 0,
      revele: x.controle !== 'ennemi' || x.connu >= 50 || alea(s) < rens / 100, estimee: null, marge: Math.max(5, Math.round((100 - rens) / 3)), dispersion: 0, frappe: false };
  }
  const reserve = Math.round(aleaEntre(s, C.reserveEnnemie[0], C.reserveEnnemie[1]));
  const sa = saisonDu(theatre, s.tour).effets;
  // La saison réduit les frappes disponibles sans jamais supprimer la dernière
  const frappesBase = C.frappes ? moy.frappe.length + bonusTheatre(s, theatre).frappesZoom : 0;
  const frappesMax = frappesBase > 0 ? Math.max(1, frappesBase + (sa.frappesZoom || 0)) : 0;
  const recosMax = Math.max(1, 1 + unitesDans(s, theatre).filter(u => u.cap.renseignement >= 8).length + bonusTheatre(s, theatre).recosZoom + (sa.recosZoom || 0));
  s.zoom = {
    carte: C.id, theatre, scenario: sc.id, titre: sc.titre, semaine: 1, maxSemaines: 6, lieux,
    unites: fsIds.map(id => ({ id, lieu: s.unites[id].lieu && th.lieux[s.unites[id].lieu!].controle !== 'ennemi' ? s.unites[id].lieu! : C.depart, blesse: false, aAgi: false })),
    frappesMax, frappes: frappesMax, recosMax, recos: recosMax, appui: 1,
    forceLocale: Math.round(C.forceLocale.force + th.partenaire * 0.5), reserve,
    forceInitiale: total + reserve, rens, evacuesParLieu: {},
    stats: { pertes: 0, collat: 0, neutralises: 0, evacues: 0 }, journal: []
  };
  majEstimationsZoom(s);
  s.zoom.journal.unshift('Semaine 1 — Activation de la cellule de crise : ' + sc.titre + '.');
  s.phase = 'zoom';
  decider(s, 'Intervention décidée : ' + sc.titre + ' (' + C.nom + ').');
  journaliser(s, 'Intervention décidée : ' + sc.titre + '.', 'crise');
}
function majEstimationsZoom(s: Etat): void {
  const z = s.zoom!;
  for (const id in z.lieux) {
    const L = z.lieux[id];
    if (L.controle === 'ennemi' && L.revele) L.estimee = Math.round(borner(L.force + (alea(s) * 2 - 1) * L.marge, 0, 150));
    else if (L.controle !== 'ennemi') L.estimee = 0;
    else L.estimee = null;
  }
}
export function actionsZoom(s: Etat): ActionZoom[] {
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte], L: ActionZoom[] = [];
  for (const u of z.unites) {
    if (u.aAgi) continue;
    for (const v of voisinsLieu(C, u.lieu)) if (z.lieux[v].controle !== 'ennemi') L.push({ type: 'Z_DEPLACER', unite: u.id, vers: v });
    if (!u.blesse) for (const v of [u.lieu].concat(voisinsLieu(C, u.lieu))) if (z.lieux[v].controle === 'ennemi' && z.lieux[v].force > 0) L.push({ type: 'Z_RAID', unite: u.id, lieu: v });
    const ici = z.lieux[u.lieu];
    if (ici.ressortissants > 0 && (ici.controle !== 'ennemi' || ici.force <= 10)) L.push({ type: 'Z_EVACUER', unite: u.id, lieu: u.lieu });
  }
  for (const id in z.lieux) {
    const l = z.lieux[id];
    if (l.controle !== 'ennemi') {
      if (l.controle === 'neutre' && z.appui > 0 && z.forceLocale > 10 && voisinsLieu(C, id).some(v => z.lieux[v].controle === 'allie')) L.push({ type: 'Z_APPUI', lieu: id });
      continue;
    }
    if (z.recos > 0) L.push({ type: 'Z_RECO', lieu: id });
    if (z.frappes > 0 && l.force > 0) L.push({ type: 'Z_FRAPPE', lieu: id });
    if (z.appui > 0 && z.forceLocale > 10 && voisinsLieu(C, id).some(v => z.lieux[v].controle === 'allie')) L.push({ type: 'Z_APPUI', lieu: id });
  }
  L.push({ type: 'Z_SEMAINE' });
  L.push({ type: 'Z_RETRAIT' });
  return L;
}
export interface EvaluationZoom { pSucces: number; risquePertes: number; risqueCollat: number; degatsMin?: number; degatsMax?: number; att?: number; def?: number }
export function evaluerActionZoom(s: Etat, a: ActionZoom, reel: boolean): EvaluationZoom | null {
  if (!('lieu' in a)) return null;
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte], l = z.lieux[a.lieu];
  const forceVue = () => reel ? l.force : (l.revele && l.estimee !== null ? l.estimee : 30);
  if (a.type === 'Z_RAID') {
    const unit = z.unites.find(u => u.id === a.unite)!, U = UN[unit.id];
    const pow = U.cap.assaut * 4 + U.cap.discretion * 2 + (l.revele ? 10 : -5) - s.unites[unit.id].fatigue / 10;
    const p = borner(0.35 + (pow - forceVue()) / 80, 0.1, 0.9);
    return { pSucces: p, risquePertes: (1 - p) * 0.35, risqueCollat: l.civils * 0.04 };
  }
  if (a.type === 'Z_APPUI') {
    const fs = z.unites.filter(u => !u.blesse && (u.lieu === a.lieu || voisinsLieu(C, a.lieu).includes(u.lieu))).length;
    const att = z.forceLocale + fs * 8 + (l.revele ? 5 : 0);
    const def = l.controle === 'ennemi' ? forceVue() * 1.2 : 0;
    return { pSucces: borner(0.5 + (att - def) / 80, 0.05, 0.95), risquePertes: 0, risqueCollat: 0, att, def };
  }
  if (a.type === 'Z_FRAPPE') {
    const f = 1 - l.dispersion * 0.3;
    return { pSucces: 1, degatsMin: Math.round((l.revele ? 10 : 4) * f), degatsMax: Math.round((l.revele ? 25 : 12) * f), risquePertes: 0,
      risqueCollat: borner(l.civils * 0.08 * (l.revele ? 0.6 : 1.3) + l.dispersion * 0.1, 0, 0.9) };
  }
  return null;
}
export function nomLieu(z: Zoom, id: string): string { return CARTES_REGIONALES[z.carte].lieux.find(l => l.id === id)!.nom; }

export function actZoom(s: Etat, a: ActionZoom): void {
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte];
  const J = (t: string) => z.journal.unshift('Semaine ' + z.semaine + ' — ' + t);
  switch (a.type) {
    case 'Z_DEPLACER': {
      const unit = z.unites.find(u => u.id === a.unite)!;
      unit.lieu = a.vers; unit.aAgi = true;
      J(UN[unit.id].nom + ' se porte sur ' + nomLieu(z, a.vers) + '.');
      break;
    }
    case 'Z_RECO': {
      const l = z.lieux[a.lieu];
      z.recos--;
      l.revele = true; l.marge = 5; l.dispersion = Math.max(0, l.dispersion - 1);
      l.estimee = Math.round(borner(l.force + (alea(s) * 2 - 1) * 5, 0, 150));
      for (const v of voisinsLieu(C, a.lieu)) z.lieux[v].marge = Math.max(5, Math.round(z.lieux[v].marge * 0.7));
      J('Reconnaissance sur ' + nomLieu(z, a.lieu) + ' : effectifs adverses estimés à ' + l.estimee + '.');
      break;
    }
    case 'Z_FRAPPE': {
      const l = z.lieux[a.lieu];
      z.frappes--;
      l.frappe = true;
      const evf = evaluerActionZoom(s, a, true)!;
      const d = Math.min(l.force, Math.round(evf.degatsMin! + alea(s) * (evf.degatsMax! - evf.degatsMin!)));
      l.force -= d; z.stats.neutralises += d;
      const pc = evf.risqueCollat;
      let t = 'Frappe aérienne sur ' + nomLieu(z, a.lieu) + (l.revele ? '' : ' (objectif mal identifié)') + '.';
      if (alea(s) < pc) { z.stats.collat++; t += ' Victimes civiles signalées.'; }
      J(t);
      break;
    }
    case 'Z_RAID': {
      const l = z.lieux[a.lieu], unit = z.unites.find(u => u.id === a.unite)!;
      unit.aAgi = true;
      const U = UN[unit.id];
      const p = evaluerActionZoom(s, a, true)!.pSucces;
      let t: string;
      if (alea(s) < p) {
        let d = Math.round((12 + alea(s) * 18) * (1 - l.dispersion * 0.3));
        d = Math.min(d, l.force);
        l.force -= d; z.stats.neutralises += d; l.revele = true; l.marge = Math.min(l.marge, 8);
        t = 'Raid de ' + U.nom + ' sur ' + nomLieu(z, a.lieu) + ' : réussi.';
        if (l.force <= 0) { l.controle = 'neutre'; l.force = 0; t += ' La position adverse est démantelée.'; }
      } else {
        t = 'Raid de ' + U.nom + ' sur ' + nomLieu(z, a.lieu) + ' : repoussé.';
        if (alea(s) < 0.35) { unit.blesse = true; z.stats.pertes++; t += ' Blessés graves, le détachement est diminué.'; }
      }
      if (alea(s) < evaluerActionZoom(s, a, true)!.risqueCollat) { z.stats.collat++; t += ' Civils touchés lors de l’assaut.'; }
      J(t);
      break;
    }
    case 'Z_APPUI': {
      const l = z.lieux[a.lieu];
      z.appui--;
      const eva = evaluerActionZoom(s, a, true)!, def = eva.def!, p = eva.pSucces;
      if (alea(s) < p) {
        z.stats.neutralises += l.force;
        z.forceLocale = Math.max(0, Math.round(z.forceLocale - def * 0.2));
        l.force = 0; l.controle = 'allie'; l.revele = true; l.dispersion = 0;
        J(C.forceLocale.nom + ' prennent le contrôle de ' + nomLieu(z, a.lieu) + '.');
      } else {
        z.forceLocale = Math.max(0, z.forceLocale - 8);
        l.force = Math.max(0, l.force - 5);
        J('L’offensive de ' + C.forceLocale.nom + ' sur ' + nomLieu(z, a.lieu) + ' échoue.');
      }
      break;
    }
    case 'Z_EVACUER': {
      const l = z.lieux[a.lieu], unit = z.unites.find(u => u.id === a.unite)!;
      unit.aAgi = true;
      z.stats.evacues += l.ressortissants;
      z.evacuesParLieu[a.lieu] = (z.evacuesParLieu[a.lieu] || 0) + l.ressortissants;
      J(l.ressortissants + ' groupe(s) évacué(s) depuis ' + nomLieu(z, a.lieu) + '.');
      l.ressortissants = 0;
      break;
    }
    case 'Z_SEMAINE':
      reactionAdverse(s);
      z.semaine++;
      if (z.semaine > z.maxSemaines) { terminerZoom(s, false); return; }
      break;
    case 'Z_RETRAIT':
      terminerZoom(s, true);
      return;
  }
}
function reactionAdverse(s: Etat): void {
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte];
  const J = (t: string) => z.journal.unshift('Semaine ' + z.semaine + ' — ' + t);
  const ids = C.lieux.map(l => l.id);
  // Renforts
  if (z.reserve > 0) {
    const ennemis = ids.filter(id => z.lieux[id].controle === 'ennemi');
    if (ennemis.length) {
      const cible = choisir(s, ennemis);
      const r = Math.min(z.reserve, aleaInt(s, 5, 12));
      z.reserve -= r; z.lieux[cible].force += r;
      if (z.lieux[cible].revele) J('Renforts adverses signalés vers ' + nomLieu(z, cible) + '.');
    }
  }
  // Repli et dispersion
  for (const id of ids) {
    const l = z.lieux[id];
    if (l.controle !== 'ennemi') continue;
    if (l.force <= 0) { l.controle = 'neutre'; l.force = 0; continue; }
    const vEnn = voisinsLieu(C, id).filter(v => z.lieux[v].controle === 'ennemi');
    if (l.force < 10 && vEnn.length && alea(s) < 0.6) {
      const dest = vEnn.sort((a, b) => z.lieux[b].force - z.lieux[a].force)[0];
      z.lieux[dest].force += l.force; l.force = 0; l.controle = 'neutre';
      J('L’adversaire abandonne ' + nomLieu(z, id) + ' et se replie vers ' + nomLieu(z, dest) + '.');
    } else if (l.frappe && l.civils >= 2 && alea(s) < 0.5) {
      l.dispersion = Math.min(2, l.dispersion + 1); l.revele = false;
      J('À ' + nomLieu(z, id) + ', l’adversaire se disperse parmi la population.');
    }
  }
  // Contre-attaque (au plus une par semaine)
  const attaquants = ids.filter(id => z.lieux[id].controle === 'ennemi' && z.lieux[id].force >= 25)
    .filter(id => voisinsLieu(C, id).some(v => z.lieux[v].controle !== 'ennemi' && v !== C.depart))
    .sort((a, b) => z.lieux[b].force - z.lieux[a].force);
  if (attaquants.length && alea(s) < 0.6) {
    const src = attaquants[0], A = z.lieux[src];
    const cibles = voisinsLieu(C, src).filter(v => z.lieux[v].controle !== 'ennemi' && v !== C.depart);
    const defVal = (v: string) => z.lieux[v].defense + (z.lieux[v].controle === 'allie' ? z.forceLocale * 0.3 : 0) + z.unites.filter(u => u.lieu === v && !u.blesse).length * 10;
    const tgt = cibles.sort((a, b) => defVal(a) - defVal(b))[0];
    const M = z.lieux[tgt];
    const p = borner(0.5 + (A.force * 0.8 - defVal(tgt)) / 80, 0.05, 0.9);
    if (alea(s) < p) {
      M.controle = 'ennemi'; M.force = Math.round(A.force * 0.5); M.revele = true; M.marge = 10;
      A.force = Math.round(A.force * 0.5);
      z.forceLocale = Math.max(0, z.forceLocale - 5);
      for (const u of z.unites.filter(u => u.lieu === tgt)) {
        u.lieu = C.depart;
        if (alea(s) < 0.3) { u.blesse = true; z.stats.pertes++; }
      }
      J('Contre-attaque adverse depuis ' + nomLieu(z, src) + ' : ' + nomLieu(z, tgt) + ' tombe.');
    } else {
      A.force = Math.max(0, A.force - 6);
      J('Contre-attaque adverse sur ' + nomLieu(z, tgt) + ' repoussée.');
    }
  }
  // Détection passive
  for (const id of ids) {
    const l = z.lieux[id];
    if (l.controle === 'ennemi' && !l.revele && alea(s) < z.rens / 200) { l.revele = true; J('Position adverse identifiée à ' + nomLieu(z, id) + '.'); }
    l.frappe = false;
    if (l.marge < Math.round((100 - z.rens) / 3)) l.marge = Math.min(Math.round((100 - z.rens) / 3), l.marge + 3);
  }
  for (const u of z.unites) u.aAgi = false;
  z.frappes = z.frappesMax; z.recos = z.recosMax; z.appui = 1;
  majEstimationsZoom(s);
}
export function objectifsZoom(s: Etat): ObjectifEtat[] {
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte], sc = C.scenarios.find(x => x.id === z.scenario)!;
  return sc.objectifs.map(o => {
    if (o.type === 'tenir') return { texte: 'Tenir ' + nomLieu(z, o.lieu!), atteint: z.lieux[o.lieu!].controle !== 'ennemi' };
    if (o.type === 'controler') return { texte: 'Reprendre ' + nomLieu(z, o.lieu!), atteint: z.lieux[o.lieu!].controle === 'allie' };
    if (o.type === 'evacuer') return { texte: 'Évacuer ' + o.nombre + ' groupe(s) depuis ' + nomLieu(z, o.lieu!), atteint: (z.evacuesParLieu[o.lieu!] || 0) >= o.nombre! };
    return { texte: 'Neutraliser ' + o.valeur + ' % du potentiel adverse', atteint: z.stats.neutralises >= z.forceInitiale * o.valeur! / 100 };
  });
}
function terminerZoom(s: Etat, anticipe: boolean): void {
  const z = s.zoom!, th = s.theatres[z.theatre], C = CARTES_REGIONALES[z.carte];
  const obj = objectifsZoom(s);
  const r = obj.filter(o => o.atteint).length / obj.length;
  const m = menaceDeCrise(s, z.theatre);
  const baisse = Math.round(8 + 20 * r + z.stats.neutralises / 10);
  if (m) m.force = Math.max(0, m.force - baisse);
  const res: string[] = [];
  appliquerEffets(s, {
    opinion: Math.round(9 * r - 3 - z.stats.pertes * 3 - z.stats.collat * 2),
    credibilite: Math.round(10 * r - 4 - z.stats.collat * 2),
    capital: r >= 0.5 ? 3 : -3
  }, res);
  for (const u of z.unites) s.unites[u.id].fatigue = borner(s.unites[u.id].fatigue + 15 + (u.blesse ? 10 : 0), 0, 100);
  s.stats.pertes += z.stats.pertes; s.stats.collat += z.stats.collat;
  if (r >= 0.5) s.stats.crisesReussies++;
  s.dernierBilan = { titre: z.titre, theatre: z.theatre, semaines: Math.min(z.semaine, z.maxSemaines), anticipe, objectifs: obj, taux: r,
    stats: Object.assign({}, z.stats), baisseMenace: m ? baisse : 0, effets: res };
  const txt = 'Bilan — ' + z.titre + ' : ' + obj.filter(o => o.atteint).length + '/' + obj.length + ' objectifs, ' + z.stats.pertes + ' perte(s), ' + z.stats.collat + ' incident(s) collatéral(aux).';
  decider(s, txt); journaliser(s, txt, r >= 0.5 ? 'succes' : 'alerte');
  // Retour à la situation du théâtre : contrôle et activité adverse issus de l'intervention
  for (const id in z.lieux) {
    const l = z.lieux[id], x = th.lieux[id];
    x.controle = l.controle;
    x.activite = l.controle === 'ennemi' ? Math.round(borner(l.force, 1, 100)) : 0;
    x.connu = l.controle === 'ennemi' ? (l.revele ? 70 : Math.min(x.connu, 40)) : 100;
  }
  for (const u of z.unites) s.unites[u.id].lieu = z.lieux[u.lieu].controle === 'ennemi' ? C.depart : u.lieu;
  th.crise = null;
  s.zoom = null;
  s.criseCourante = null;
  nettoyerMenaces(s);
  calculerRens(s);
  avancerFile(s);
}
