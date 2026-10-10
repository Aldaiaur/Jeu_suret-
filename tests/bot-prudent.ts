// Robot « prudent » : joue des parties complètes avec des règles simples de bon sens, sans aléatoire propre.
// Il sert à mesurer l'équilibre plus finement que le robot aléatoire des parties de référence.
// Il n'utilise que l'API publique de la simulation et tolère l'absence des fonctions tactiques
// (pour pouvoir être rejoué sur une version antérieure du jeu).
import * as M from '../src/sim';
import { EV, TH, UN } from '../src/data';
import type { Action, Effets, Etat } from '../src/sim';

type Moteur = typeof M & Partial<{ missionsPossibles: (s: Etat, u: string) => { type: string; lieu: string; vers?: string }[]; evaluerMission: (s: Etat, u: string, o: unknown) => { pSucces: number; risqueCollat: number; risquePertes: number } }>;
const Mo = M as Moteur;
// Listes de la partie lues dans l'état : fonctionne aussi sur les versions antérieures au modèle nation
const unites = (s: Etat) => Object.keys(s.unites).map(id => UN[id]);
const territoire = (s: Etat) => Object.keys(s.theatres).find(t => !TH[t].exterieur)!;

export interface ResumeRobot { graine: number; difficulte: string; tour: number; fin: string; score: number; raison: string }

const essayer = (s: Etat, a: Action): Etat => {
  const k = M.cleAction(a);
  return M.actionsPossibles(s).some(p => M.cleAction(p) === k) ? M.appliquerAction(s, a) : s;
};

function noteEffets(e: Effets): number {
  let n = (e.opinion || 0) * 1.2 + (e.capital || 0) * 1.0 + (e.credibilite || 0) * 0.8 - (e.menaceInt || 0) * 1.2 + (e.budget || 0) * 0.08;
  for (const x of e.menace || []) n -= x.delta * 0.5;
  for (const x of e.rens || []) n += x.delta * 0.15;
  for (const x of e.partenaire || []) n += x.delta * 0.2;
  for (const x of e.relation || []) n += x.delta * 0.1;
  if (e.crise) n -= 3;
  if (e.alea) n += e.alea.p * noteEffets(e.alea.succes) + (1 - e.alea.p) * noteEffets(e.alea.echec);
  return n;
}

function moisPrudent(s0: Etat): Etat {
  let s = s0;
  // 1. Capteurs : vers le théâtre le plus menacé de chaque service
  for (let garde = 0; garde < 30; garde++) {
    const L = M.actionsPossibles(s).filter((a): a is Extract<Action, { type: 'CAPTEUR' }> => a.type === 'CAPTEUR' && a.delta === 1);
    if (!L.length) break;
    const note = (t: string) => s.menaces.filter(m => m.theatre === t && m.detectee).reduce((x, m) => Math.max(x, m.estimation || 0), 0) + (t === territoire(s) ? 15 : 0);
    L.sort((a, b) => note(b.theatre) - note(a.theatre));
    s = M.appliquerAction(s, L[0]);
  }
  // 2. Unités épuisées : réserve, puis rapatriement
  for (const u of unites(s)) {
    const e = s.unites[u.id];
    if (e.etat !== 'deployee') continue;
    if (e.fatigue > 85) s = essayer(s, { type: 'RAPATRIER', unite: u.id });
    else if (e.fatigue > 65) s = essayer(s, { type: 'POSTURE', unite: u.id, posture: 'reserve' } as Action);
  }
  // 3. Budget : rapatrier si le mois suivant creuse le surcoût
  if (s.ressources.budget + s.ressources.enveloppe - M.coutsMensuels(s) < -10) {
    const ext = unites(s).filter(u => s.unites[u.id].etat === 'deployee' && s.unites[u.id].theatre !== territoire(s)).sort((a, b) => b.coutMensuel - a.coutMensuel);
    if (ext[0]) s = essayer(s, { type: 'RAPATRIER', unite: ext[0].id });
  }
  // 4. Territoire : protection si la menace intérieure monte
  const garde = unites(s).filter(u => u.protection).sort((a, b) => b.protection! - a.protection!)[0];
  if (s.ressources.menaceInt > 45 && garde) s = essayer(s, { type: 'DEPLOYER', unite: garde.id, theatre: territoire(s) });
  // 4 bis. Article 35 : débat avant un vote incertain
  for (const a of M.actionsPossibles(s)) if (a.type === 'DEBAT' && s.theatres[a.theatre].toursIntervention >= 3 && M.probaVote(s, a.theatre) < 0.85) s = essayer(s, a);
  // 5. Opérations à bonne probabilité et faible risque collatéral
  for (const a of M.actionsPossibles(s)) {
    if (a.type !== 'OPERATION' || s.actionsRestantes <= 0) continue;
    const ev = M.evaluerOperation(s, a.op, a.theatre, a.cible, false);
    if (ev.pSucces >= 0.6 && ev.risqueCollat < 0.12 && s.ressources.budget > ev.cout + 10) { s = essayer(s, a); break; }
  }
  // 6. Renfort du théâtre extérieur le plus menacé, si le budget le permet
  const cibles = Object.keys(s.theatres).map(t => TH[t]).filter(T => T.exterieur).map(T => ({ t: T.id, n: s.menaces.filter(m => m.theatre === T.id && m.detectee).reduce((x, m) => Math.max(x, m.estimation || 0), 0) }))
    .filter(x => x.n >= 55).sort((a, b) => b.n - a.n);
  for (const c of cibles.slice(0, 1)) {
    const dep = M.actionsPossibles(s).filter((a): a is Extract<Action, { type: 'DEPLOYER' }> => a.type === 'DEPLOYER' && a.theatre === c.t);
    dep.sort((a, b) => (UN[b.unite].cap.assaut + UN[b.unite].cap.frappe) - (UN[a.unite].cap.assaut + UN[a.unite].cap.frappe));
    const u = dep[0] && UN[dep[0].unite];
    if (u && s.ressources.budget + s.ressources.enveloppe - M.coutsMensuels(s) - u.coutDeploiement - u.coutMensuel > 5) s = essayer(s, dep[0]);
  }
  // 7. Tactique : frappes sur positions identifiées à faible risque collatéral, reconnaissance des capteurs, patrouilles
  if (Mo.missionsPossibles && Mo.evaluerMission) {
    for (const u of unites(s)) {
      const e = s.unites[u.id];
      if (e.etat !== 'deployee' || e.mission || e.posture === 'reserve') continue;
      if (u.cap.renseignement >= 8 && u.cap.frappe < 5) { s = essayer(s, { type: 'POSTURE', unite: u.id, posture: 'reconnaissance' } as Action); continue; }
      const L = Mo.missionsPossibles(s, u.id);
      const frappe = L.filter(o => o.type === 'frappe').map(o => ({ o, ev: Mo.evaluerMission!(s, u.id, o) })).filter(x => x.ev.risqueCollat <= 0.1).sort((a, b) => a.ev.risqueCollat - b.ev.risqueCollat)[0];
      if (frappe) { s = essayer(s, { type: 'MISSION', unite: u.id, mission: frappe.o.type, lieu: frappe.o.lieu } as Action); continue; }
      const patrouille = L.find(o => o.type === 'patrouille' && o.lieu === e.lieu);
      if (patrouille) s = essayer(s, { type: 'MISSION', unite: u.id, mission: 'patrouille', lieu: patrouille.lieu } as Action);
    }
  }
  return s;
}

function semaineZoom(s0: Etat): Etat {
  let s = s0;
  for (let garde = 0; garde < 12 && s.phase === 'zoom'; garde++) {
    const L = M.actionsPossibles(s);
    const z = s.zoom!;
    const reco = L.find(a => a.type === 'Z_RECO' && !z.lieux[a.lieu].revele);
    const evac = L.find(a => a.type === 'Z_EVACUER');
    const appui = L.filter(a => a.type === 'Z_APPUI').map(a => ({ a, p: M.evaluerActionZoom(s, a as never, false)!.pSucces })).filter(x => x.p >= 0.6).sort((x, y) => y.p - x.p)[0];
    const frappe = L.filter(a => a.type === 'Z_FRAPPE' && z.lieux[a.lieu].revele).map(a => ({ a, ev: M.evaluerActionZoom(s, a as never, false)! })).filter(x => x.ev.risqueCollat < 0.2).sort((x, y) => (z.lieux[(y.a as { lieu: string }).lieu].force) - (z.lieux[(x.a as { lieu: string }).lieu].force))[0];
    const raid = L.filter(a => a.type === 'Z_RAID').map(a => ({ a, p: M.evaluerActionZoom(s, a as never, false)!.pSucces })).filter(x => x.p >= 0.55).sort((x, y) => y.p - x.p)[0];
    const choix = evac || reco || frappe?.a || raid?.a || appui?.a;
    if (!choix) return M.appliquerAction(s, { type: 'Z_SEMAINE' });
    s = M.appliquerAction(s, choix);
  }
  return s.phase === 'zoom' ? M.appliquerAction(s, { type: 'Z_SEMAINE' }) : s;
}

export function jouerPrudent(nb: number, difficultes: string[], nation = 'FRA'): ResumeRobot[] {
  const r: ResumeRobot[] = [];
  for (let i = 0; i < nb; i++) {
    const graine = 5000 + i, difficulte = difficultes[i % difficultes.length];
    let s = (M.nouvellePartie as (g: number, d: string, n?: string) => Etat)(graine, difficulte, nation);
    const doctrines = M.actionsPossibles(s);
    s = M.appliquerAction(s, doctrines[Math.floor(i / difficultes.length) % doctrines.length]);
    for (let garde = 0; garde < 3000 && !s.fin; garde++) {
      if (s.phase === 'jeu') s = M.finDeTour(moisPrudent(s));
      else if (s.phase === 'evenement') {
        const E = EV[s.evenementCourant!];
        const idx = E.choix.map((c, k) => ({ k, n: M.choixPermis(s, c) ? noteEffets(c.effets) : -Infinity })).sort((a, b) => b.n - a.n)[0].k;
        s = M.appliquerAction(s, { type: 'CHOIX', index: idx });
      } else if (s.phase === 'crise') {
        const L = M.actionsPossibles(s);
        const rep = L.find(a => (a.type as string) === 'CRISE_REPONSE');
        const ok = L.some(a => a.type === 'CRISE' && a.intervenir);
        s = M.appliquerAction(s, rep || { type: 'CRISE', intervenir: ok });
      } else if (s.phase === 'zoom') s = semaineZoom(s);
      else break;
    }
    r.push({ graine, difficulte, tour: s.tour, fin: s.fin ? s.fin.type : 'non terminée', score: s.fin?.score?.total ?? -1, raison: s.fin?.raison.slice(0, 50) || '' });
  }
  return r;
}
