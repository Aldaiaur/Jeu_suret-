// Tactique : implantation des unités sur la carte régionale, postures, missions, soutien logistique.
// Tout se résout une fois par mois (resoudreTactique) et s'agrège en effets stratégiques :
// pression sur les menaces, renseignement, fatigue, coûts, pertes et dommages collatéraux.
import {
  CARTES_REGIONALES, EV, MISSIONS, MOBILITE_HELICO, PARAMS_TACTIQUE, POSTURES, SOUTIEN_CATEGORIE, SOUTIEN_UNITE, TH, THEATRES, UN, UNITES
} from '../data';
import type { Action, CarteRegionaleDef, Categorie, Etat, EtatLieu, OrdreMission, TypeMission, UniteDef } from './types';
import { alea, borner } from './outils';
import { arrondi } from './outils';
import { bonusTheatre, coutMult, decider, journaliser, menacesDans, multCout, multPression } from './acces';

const SOL: Categorie[] = ['FS', 'TERRE', 'INT'];

export function carteDuTheatre(theatre: string): CarteRegionaleDef { return CARTES_REGIONALES[TH[theatre].carteRegionale]; }
export function estAuSol(u: UniteDef): boolean { return SOL.includes(u.categorie); }
export function voisinsCarte(C: CarteRegionaleDef, id: string): string[] {
  const r: string[] = [];
  for (const [a, b] of C.liens) { if (a === id) r.push(b); else if (b === id) r.push(a); }
  return r;
}
const lienExiste = (C: CarteRegionaleDef, a: string, b: string) => C.liens.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// ---------- État initial ----------
export function lieuxInitiaux(theatre: string): Record<string, EtatLieu> {
  const C = carteDuTheatre(theatre), r: Record<string, EtatLieu> = {};
  for (const l of C.lieux) r[l.id] = { controle: l.controle, activite: l.force ? Math.round((l.force[0] + l.force[1]) / 2) : 0, connu: l.controle === 'ennemi' ? 0 : 100 };
  return r;
}

// ---------- Lecture ----------
export function identifie(s: Etat, theatre: string, lieu: string): boolean {
  return s.theatres[theatre].lieux[lieu].connu >= PARAMS_TACTIQUE.seuilIdentifie;
}
export function unitesDeployeesSur(s: Etat, theatre: string): UniteDef[] {
  return UNITES.filter(u => s.unites[u.id].theatre === theatre && s.unites[u.id].etat === 'deployee');
}
export function mobiliteHelico(s: Etat, theatre: string): boolean {
  return unitesDeployeesSur(s, theatre).some(u => MOBILITE_HELICO.includes(u.id));
}

export interface Soutien { capacite: number; demande: number; ratio: number }
export function soutienTheatre(s: Etat, theatre: string): Soutien {
  const C = carteDuTheatre(theatre);
  let capacite = C.soutien + bonusTheatre(s, theatre).soutien, demande = 0;
  for (const u of UNITES) {
    const e = s.unites[u.id];
    if (e.theatre !== theatre || (e.etat !== 'deployee' && e.etat !== 'projection')) continue;
    demande += SOUTIEN_CATEGORIE[u.categorie];
    capacite += SOUTIEN_UNITE[u.id] || 0;
    if (e.etat === 'deployee' && e.mission) {
      const m = MISSIONS[e.mission.type];
      if (m.soutien < 0) capacite -= m.soutien; else demande += m.soutien;
    }
  }
  return { capacite, demande, ratio: demande <= capacite || demande === 0 ? 1 : capacite / demande };
}
// Effet du soutien sur l'efficacité : une pénurie divise au plus l'effet par deux
export function facteurSoutien(s: Etat, theatre: string): number { return 0.5 + 0.5 * soutienTheatre(s, theatre).ratio; }

// Multiplicateur de pression d'une unité déployée : posture, soutien, saison
export function multiplicateurUnite(s: Etat, u: UniteDef): number {
  const e = s.unites[u.id];
  return POSTURES[e.posture].pression * (e.theatre ? facteurSoutien(s, e.theatre) * multPression(e.theatre, s.tour, u.categorie) : 1);
}

// Lieux où une unité au sol peut s'implanter : non tenus par l'adversaire, reliés à sa position actuelle
// par des lieux non adverses (n'importe lequel avec des hélicoptères sur le théâtre).
export function lieuxAccessibles(s: Etat, uniteId: string): string[] {
  const e = s.unites[uniteId], u = UN[uniteId];
  if (!e.theatre || e.etat !== 'deployee' || !estAuSol(u) || !e.lieu) return [];
  const C = carteDuTheatre(e.theatre), L = s.theatres[e.theatre].lieux;
  const libre = (id: string) => L[id].controle !== 'ennemi';
  if (mobiliteHelico(s, e.theatre)) return C.lieux.filter(l => libre(l.id) && l.id !== e.lieu).map(l => l.id);
  const vus = new Set([e.lieu]), file = [e.lieu];
  while (file.length) {
    const x = file.shift()!;
    for (const v of voisinsCarte(C, x)) if (!vus.has(v) && libre(v)) { vus.add(v); file.push(v); }
  }
  vus.delete(e.lieu);
  return C.lieux.filter(l => vus.has(l.id)).map(l => l.id);
}

// Portée d'une action au sol : lieu tenu, voisin, ou à deux liaisons avec des hélicoptères
function aPortee(s: Etat, uniteId: string, cible: string): boolean {
  const e = s.unites[uniteId], C = carteDuTheatre(e.theatre!);
  if (!e.lieu) return false;
  if (e.lieu === cible) return true;
  const v1 = voisinsCarte(C, e.lieu);
  if (v1.includes(cible)) return true;
  return mobiliteHelico(s, e.theatre!) && v1.some(v => voisinsCarte(C, v).includes(cible));
}

function capaciteOk(u: UniteDef, t: TypeMission): boolean {
  const M = MISSIONS[t];
  if (!M.categories.includes(u.categorie)) return false;
  for (const k in M.capaciteMin || {}) if (u.cap[k as keyof UniteDef['cap']] < M.capaciteMin![k as keyof UniteDef['cap']]!) return false;
  return true;
}

// Ordre de mission valable dans l'état courant ?
export function missionValide(s: Etat, uniteId: string, o: OrdreMission): boolean {
  const e = s.unites[uniteId], u = UN[uniteId];
  if (!e.theatre || e.etat !== 'deployee') return false;
  const C = carteDuTheatre(e.theatre), th = s.theatres[e.theatre], M = MISSIONS[o.type];
  const lieu = C.lieux.find(l => l.id === o.lieu);
  if (!lieu || !capaciteOk(u, o.type)) return false;
  if (M.frappe && !C.frappes) return false;
  if (M.identifie && !identifie(s, e.theatre, o.lieu)) return false;
  const L = th.lieux[o.lieu];
  const sol = estAuSol(u), mer = u.categorie === 'MER';
  switch (o.type) {
    case 'patrouille': return sol ? aPortee(s, uniteId, o.lieu) : mer && !!lieu.littoral;
    case 'escorte': {
      if (!o.vers || !lienExiste(C, o.lieu, o.vers)) return false;
      const B = C.lieux.find(l => l.id === o.vers)!;
      if (L.controle === 'ennemi' || th.lieux[o.vers].controle === 'ennemi') return false;
      return mer ? !!lieu.littoral && !!B.littoral : e.lieu === o.lieu || e.lieu === o.vers;
    }
    case 'axe': return !!o.vers && lienExiste(C, o.lieu, o.vers) && (e.lieu === o.lieu || e.lieu === o.vers) && L.controle !== 'ennemi';
    case 'raid': return L.controle === 'ennemi' && aPortee(s, uniteId, o.lieu);
    case 'frappe': return L.controle === 'ennemi' && (u.categorie !== 'TERRE' || aPortee(s, uniteId, o.lieu));
    case 'appui': return L.controle !== 'allie' && L.activite <= 30 && aPortee(s, uniteId, o.lieu) &&
      (voisinsCarte(C, o.lieu).some(v => th.lieux[v].controle === 'allie') || e.lieu === o.lieu);
    case 'evacuation': return L.controle !== 'ennemi' && (sol ? e.lieu === o.lieu : mer ? !!lieu.littoral : lieu.type === 'base');
  }
}

export function missionsPossibles(s: Etat, uniteId: string): OrdreMission[] {
  const e = s.unites[uniteId];
  if (!e.theatre || e.etat !== 'deployee') return [];
  const C = carteDuTheatre(e.theatre), r: OrdreMission[] = [];
  for (const t of Object.keys(MISSIONS) as TypeMission[]) {
    if (MISSIONS[t].cible === 'lieu') { for (const l of C.lieux) { const o = { type: t, lieu: l.id }; if (missionValide(s, uniteId, o)) r.push(o); } }
    else for (const [a, b] of C.liens) { const o = { type: t, lieu: a, vers: b }; if (missionValide(s, uniteId, o)) r.push(o); }
  }
  return r;
}

// ---------- Aperçu d'une mission (risques visibles avant de décider) ----------
export interface EvaluationMission { pSucces: number; risquePertes: number; risqueCollat: number; cout: number; effet: string }
export function evaluerMission(s: Etat, uniteId: string, o: OrdreMission): EvaluationMission {
  const e = s.unites[uniteId], u = UN[uniteId], th = s.theatres[e.theatre!], C = carteDuTheatre(e.theatre!);
  const L = th.lieux[o.lieu], def = C.lieux.find(l => l.id === o.lieu)!, f = facteurSoutien(s, e.theatre!) * (1 - e.fatigue / 200);
  const M = MISSIONS[o.type], frappeCeMois = UNITES.some(x => s.unites[x.id].mission?.type === 'frappe' && s.unites[x.id].mission?.lieu === o.lieu && s.unites[x.id].theatre === e.theatre);
  const pertesBase = (1.4 - u.cap.discretion / 10) * (escorteActive(s, e.theatre!) ? 0.7 : 1);
  switch (o.type) {
    case 'raid': {
      const p = borner(0.35 + (u.cap.assaut * 4 + u.cap.discretion * 2 + (frappeCeMois ? 15 : 0) + (mobiliteHelico(s, e.theatre!) ? 5 : 0)) * f / 80 - L.activite / 80, 0.1, 0.9);
      return { pSucces: p, risquePertes: borner((1 - p) * 0.3 * pertesBase, 0, 0.9), risqueCollat: def.civils * 0.03, cout: M.cout, effet: 'Activité adverse −15 à −30 en cas de succès' };
    }
    case 'frappe': {
      const d = Math.round((8 + u.cap.frappe * 1.5) * f);
      return { pSucces: 1, risquePertes: 0, risqueCollat: borner(def.civils * 0.05 * (L.connu >= 75 ? 0.6 : 1), 0, 0.9), cout: M.cout, effet: 'Activité adverse −' + d + ' par mois' };
    }
    case 'appui': {
      const p = borner(0.3 + th.partenaire / 100 + u.cap.assaut / 40 - L.activite / 100, 0.05, 0.9);
      return { pSucces: p, risquePertes: 0.03 * pertesBase, risqueCollat: 0, cout: M.cout, effet: 'Les partenaires prennent le lieu en cas de succès' };
    }
    case 'patrouille': return { pSucces: 1, risquePertes: 0.01 * pertesBase, risqueCollat: 0, cout: M.cout, effet: 'Activité adverse −' + Math.round(u.cap.endurance * 0.6 * f) + ' sur le lieu et ses abords, renseignement local' };
    case 'axe': return { pSucces: 1, risquePertes: 0.01 * pertesBase, risqueCollat: 0, cout: M.cout, effet: 'Axe interdit à l’adversaire, pression +3' };
    case 'escorte': return { pSucces: 1, risquePertes: 0.01 * pertesBase, risqueCollat: 0, cout: M.cout, effet: 'Soutien +2, pertes −30 % sur le théâtre' };
    case 'evacuation': return { pSucces: 1, risquePertes: 0, risqueCollat: 0, cout: M.cout, effet: 'Conséquences des pertes réduites de moitié' };
  }
}
function escorteActive(s: Etat, theatre: string): boolean {
  return UNITES.some(u => s.unites[u.id].theatre === theatre && s.unites[u.id].etat === 'deployee' && s.unites[u.id].mission?.type === 'escorte');
}
// Coût mensuel d'une unité engagée : doctrine, saison, et affrètement quand le soutien manque
export function coutMensuelUnite(s: Etat, u: UniteDef): number {
  const e = s.unites[u.id];
  if (!e.theatre) return u.coutMensuel * coutMult(s);
  return u.coutMensuel * coutMult(s) * multCout(e.theatre, s.tour) * (soutienTheatre(s, e.theatre).ratio < 1 ? PARAMS_TACTIQUE.surcoutPenurie : 1);
}
export function coutsMensuels(s: Etat): number {
  let c = 0;
  for (const u of UNITES) { const e = s.unites[u.id]; if (e.etat === 'deployee' || e.etat === 'projection') c += coutMensuelUnite(s, u); }
  return arrondi(c + coutMissions(s));
}
export function coutMissions(s: Etat): number {
  let c = 0;
  for (const u of UNITES) { const e = s.unites[u.id]; if (e.etat === 'deployee' && e.mission) c += MISSIONS[e.mission.type].cout; }
  return c;
}

// ---------- Actions tactiques (gratuites : elles ne consomment pas d'action du mois) ----------
export function actionsTactiques(s: Etat): Action[] {
  const L: Action[] = [];
  for (const u of UNITES) {
    const e = s.unites[u.id];
    if (e.etat !== 'deployee') continue;
    for (const p of Object.values(POSTURES)) if (p.id !== e.posture && p.categories.includes(u.categorie)) L.push({ type: 'POSTURE', unite: u.id, posture: p.id });
    for (const l of lieuxAccessibles(s, u.id)) L.push({ type: 'POSITIONNER', unite: u.id, lieu: l });
    for (const o of missionsPossibles(s, u.id)) {
      if (e.mission && e.mission.type === o.type && e.mission.lieu === o.lieu && e.mission.vers === o.vers) continue;
      L.push(o.vers ? { type: 'MISSION', unite: u.id, mission: o.type, lieu: o.lieu, vers: o.vers } : { type: 'MISSION', unite: u.id, mission: o.type, lieu: o.lieu });
    }
    if (e.mission) L.push({ type: 'ANNULER_MISSION', unite: u.id });
  }
  return L;
}
export function nomLieuCarte(theatre: string, id: string): string { return carteDuTheatre(theatre).lieux.find(l => l.id === id)!.nom; }
export function libelleMission(theatre: string, o: OrdreMission): string {
  return MISSIONS[o.type].nom + ' — ' + nomLieuCarte(theatre, o.lieu) + (o.vers ? ' ↔ ' + nomLieuCarte(theatre, o.vers) : '');
}
export function actTactique(s: Etat, a: Extract<Action, { type: 'POSITIONNER' | 'POSTURE' | 'MISSION' | 'ANNULER_MISSION' }>): void {
  const e = s.unites[a.unite], u = UN[a.unite], t = e.theatre!;
  let txt: string;
  switch (a.type) {
    case 'POSITIONNER':
      e.lieu = a.lieu;
      if (e.mission && !missionValide(s, a.unite, e.mission)) e.mission = null;
      txt = u.nom + ' s’implante à ' + nomLieuCarte(t, a.lieu) + '.';
      break;
    case 'POSTURE':
      e.posture = a.posture;
      txt = u.nom + ' : posture ' + POSTURES[a.posture].nom.toLowerCase() + '.';
      break;
    case 'MISSION':
      e.mission = a.vers ? { type: a.mission, lieu: a.lieu, vers: a.vers } : { type: a.mission, lieu: a.lieu };
      txt = u.nom + ' : ' + libelleMission(t, e.mission) + '.';
      break;
    case 'ANNULER_MISSION':
      txt = u.nom + ' : fin de mission (' + libelleMission(t, e.mission!) + ').';
      e.mission = null;
      break;
  }
  decider(s, txt);
  journaliser(s, txt, 'decision');
}

// Projection d'urgence (crise) : l'unité arrive directement au point d'entrée du théâtre
export function deployerUrgence(s: Etat, uniteId: string, theatre: string): void {
  const e = s.unites[uniteId];
  e.etat = 'deployee'; e.theatre = theatre; e.compteur = 0;
  e.lieu = estAuSol(UN[uniteId]) ? carteDuTheatre(theatre).depart : null;
  e.posture = 'defensive'; e.mission = null;
}

// ---------- Résolution mensuelle ----------
export function resoudreTactique(s: Etat): void {
  const R = s.ressources;
  for (const T of THEATRES) {
    const th = s.theatres[T.id], C = carteDuTheatre(T.id), L = th.lieux, rapport: string[] = [];
    const unites = unitesDeployeesSur(s, T.id);
    const sout = soutienTheatre(s, T.id), fs = 0.5 + 0.5 * sout.ratio;
    const menaceMax = menacesDans(s, T.id).reduce((a, m) => Math.max(a, m.force), 0);

    // 1. Connaissance des lieux : elle s'érode, le renseignement du théâtre fixe un plancher
    for (const l of C.lieux) {
      const x = L[l.id];
      if (x.controle !== 'ennemi') { x.connu = 100; continue; }
      x.connu = Math.max(Math.round(th.rens * 0.6), x.connu - PARAMS_TACTIQUE.declinConnu);
    }
    for (const u of unites) {
      const e = s.unites[u.id], P = POSTURES[e.posture];
      if (P.connu) {
        const cibles = e.lieu ? [e.lieu, ...voisinsCarte(C, e.lieu)] : C.lieux.map(l => l.id);
        const gain = Math.round((e.lieu ? P.connu : P.connu / 2) * fs);
        for (const c of cibles) L[c].connu = Math.min(100, L[c].connu + gain);
      }
      if (e.mission?.type === 'patrouille') L[e.mission.lieu].connu = Math.min(100, L[e.mission.lieu].connu + 15);
    }

    // 2. Missions : frappes d'abord (les raids exploitent une position frappée), puis le reste
    if (!unites.length) { th.rapportTactique = []; continue; }
    const frappes = new Set<string>();
    const alerte = unites.some(u => s.unites[u.id].mission?.type === 'evacuation');
    const escorte = unites.some(u => s.unites[u.id].mission?.type === 'escorte');
    let reduction = 0;
    const perte = (u: UniteDef, motif: string) => {
      s.stats.pertes++;
      R.opinion = borner(R.opinion - (alerte ? 1 : 2), 0, 100);
      s.unites[u.id].fatigue = borner(s.unites[u.id].fatigue + 10, 0, 100);
      rapport.push(u.nom + ' : pertes (' + motif + ')' + (alerte ? ', blessés évacués à temps.' : '.'));
    };
    const victimesCiviles = (lieu: string) => {
      s.stats.collat++;
      R.credibilite = borner(R.credibilite - 3, 0, 100); R.opinion = borner(R.opinion - 2, 0, 100);
      rapport.push('Victimes civiles signalées à ' + nomLieuCarte(T.id, lieu) + '.');
      if ((s.compteurEvenements.BAVURE || 0) < EV.BAVURE.max! && !s.chaines.some(c => c.id === 'BAVURE')) s.chaines.push({ id: 'BAVURE', tour: s.tour + 1 });
    };
    const ordre = (types: TypeMission[]) => unites.filter(u => { const m = s.unites[u.id].mission; return m && types.includes(m.type); });

    for (const u of ordre(['frappe'])) {
      const e = s.unites[u.id], o = e.mission!;
      if (!missionValide(s, u.id, o)) { e.mission = null; rapport.push(u.nom + ' : frappe suspendue, objectif perdu de vue.'); continue; }
      const ev = evaluerMission(s, u.id, o), x = L[o.lieu];
      const d = Math.min(x.activite, Math.round((8 + u.cap.frappe * 1.5) * fs * (1 - e.fatigue / 200) * multPression(T.id, s.tour, u.categorie)));
      x.activite -= d; reduction += d; frappes.add(o.lieu);
      rapport.push(u.nom + ' frappe ' + nomLieuCarte(T.id, o.lieu) + ' (activité −' + d + ').');
      if (alea(s) < ev.risqueCollat) victimesCiviles(o.lieu);
    }
    for (const u of ordre(['raid', 'appui', 'patrouille', 'axe', 'escorte', 'evacuation'])) {
      const e = s.unites[u.id], o = e.mission!;
      if (!missionValide(s, u.id, o)) { e.mission = null; rapport.push(u.nom + ' : mission caduque (' + MISSIONS[o.type].nom.toLowerCase() + ').'); continue; }
      const x = L[o.lieu], ev = evaluerMission(s, u.id, o);
      if (o.type === 'raid') {
        const pS = frappes.has(o.lieu) ? Math.min(0.95, ev.pSucces) : ev.pSucces;
        if (alea(s) < pS) {
          const d = Math.min(x.activite, Math.round(15 + alea(s) * 15));
          x.activite -= d; reduction += d; x.connu = Math.max(x.connu, 70);
          rapport.push('Raid de ' + u.nom + ' sur ' + nomLieuCarte(T.id, o.lieu) + ' : réussi (activité −' + d + ').');
        } else rapport.push('Raid de ' + u.nom + ' sur ' + nomLieuCarte(T.id, o.lieu) + ' : repoussé.');
        if (alea(s) < ev.risquePertes) perte(u, 'raid');
        if (alea(s) < ev.risqueCollat) victimesCiviles(o.lieu);
        e.fatigue = borner(e.fatigue + 8, 0, 100);
        e.mission = null;
      } else if (o.type === 'appui') {
        if (alea(s) < ev.pSucces) { x.controle = 'allie'; x.activite = 0; x.connu = 100; rapport.push('Les partenaires prennent ' + nomLieuCarte(T.id, o.lieu) + ', appuyés par ' + u.nom + '.'); }
        else { th.partenaire = borner(th.partenaire - 2, 0, 60); rapport.push('L’offensive partenaire sur ' + nomLieuCarte(T.id, o.lieu) + ' échoue.'); }
        if (alea(s) < ev.risquePertes) perte(u, 'appui au combat');
        e.mission = null;
      } else if (o.type === 'patrouille') {
        const d = u.cap.endurance * 0.6 * fs * (1 - e.fatigue / 200);
        for (const c of [o.lieu, ...voisinsCarte(C, o.lieu)]) { const y = L[c]; if (y.controle === 'ennemi' || y.activite > 0) { const k = Math.min(y.activite, Math.round(c === o.lieu ? d : d / 2)); y.activite -= k; reduction += k; } }
        th.pressionOps += 2 * fs;
        if (alea(s) < ev.risquePertes) perte(u, 'patrouille');
      } else if (o.type === 'axe') {
        th.pressionOps += 3 * fs;
      }
    }

    // 3. Postures : formation des partenaires, risques de l'offensive
    for (const u of unites) {
      const e = s.unites[u.id], P = POSTURES[e.posture];
      if (P.partenaire) th.partenaire = borner(th.partenaire + P.partenaire * fs, 0, 60);
      if (P.risquePertes && alea(s) < P.risquePertes * (1.4 - u.cap.discretion / 10) * (escorte ? 0.7 : 1)) perte(u, 'posture offensive');
    }

    // 4. L'action sur les lieux réduit la menace principale du théâtre
    if (reduction > 0) {
      const m = menacesDans(s, T.id).sort((a, b) => b.force - a.force)[0];
      if (m) m.force = Math.max(0, Math.round((m.force - reduction / 4) * 10) / 10);
    }

    // 5. Évolution des lieux : l'activité adverse suit la menace ; position démantelée, infiltration
    for (const l of C.lieux) {
      const x = L[l.id];
      if (x.controle !== 'ennemi') continue;
      const base = l.force ? (l.force[0] + l.force[1]) / 2 : 20;
      const cible = borner(base * menaceMax / 50, 0, 100);
      x.activite = Math.round(borner(x.activite + (cible - x.activite) * 0.15, 0, 100));
      if (x.activite <= 0) { x.controle = 'neutre'; x.connu = 100; rapport.push('Position adverse démantelée à ' + l.nom + '.'); }
    }
    if (menaceMax >= PARAMS_TACTIQUE.menaceInfiltration) {
      const bloques = unites.map(u => s.unites[u.id].mission).filter(m => m?.type === 'axe').map(m => [m!.lieu, m!.vers!]);
      const defendu = (id: string) => unites.some(u => s.unites[u.id].lieu === id && ['defensive', 'offensive'].includes(s.unites[u.id].posture));
      const proie = C.lieux.find(l => L[l.id].controle === 'neutre' && !defendu(l.id) &&
        voisinsCarte(C, l.id).some(v => L[v].controle === 'ennemi' && L[v].activite >= PARAMS_TACTIQUE.infiltration && !bloques.some(([a, b]) => (a === v && b === l.id) || (a === l.id && b === v))));
      if (proie) { const x = L[proie.id]; x.controle = 'ennemi'; x.activite = 15; x.connu = Math.min(x.connu, 30); rapport.push('L’adversaire s’infiltre à ' + proie.nom + '.'); }
    }
    for (const t of rapport) journaliser(s, TH[T.id].court + ' — ' + t, t.includes('pertes') || t.includes('civiles') || t.includes('infiltre') ? 'alerte' : 'info');
    th.rapportTactique = rapport;
  }
}
