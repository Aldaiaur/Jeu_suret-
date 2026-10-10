// Sons de l'interface, synthétisés par code (Web Audio) : aucun fichier, aucune ressource réseau.
// Sobres et brefs (radio, téléscripteur, alarme), désactivables et réglables depuis le menu.
import type { Action, Etat } from '../sim';

export type NomSon = 'clic' | 'ordre' | 'deploiement' | 'rapatriement' | 'succes' | 'echec' | 'alerte' | 'mois' | 'crise' | 'evenement';

const CLE = 'redlines.son.v1';
interface Reglage { actif: boolean; volume: number }
function lire(): Reglage {
  try { const r = JSON.parse(localStorage.getItem(CLE) || ''); if (typeof r.actif === 'boolean' && typeof r.volume === 'number') return r; } catch { /* réglage par défaut */ }
  return { actif: true, volume: 0.35 };
}
let reglage = lire();
export function reglageSon(): Reglage { return reglage; }
export function regler(r: Partial<Reglage>): void {
  reglage = { ...reglage, ...r };
  try { localStorage.setItem(CLE, JSON.stringify(reglage)); } catch { /* stockage indisponible */ }
}

let ctx: AudioContext | null = null;
function contexte(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

// Briques : note (oscillateur avec enveloppe) et souffle (bruit filtré)
function note(c: AudioContext, sortie: AudioNode, t: number, f0: number, f1: number, duree: number, forme: OscillatorType, gain: number): void {
  const o = c.createOscillator(), g = c.createGain();
  o.type = forme; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + duree);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g).connect(sortie); o.start(t); o.stop(t + duree + 0.02);
}
function souffle(c: AudioContext, sortie: AudioNode, t: number, duree: number, freq: number, gain: number): void {
  const n = Math.round(c.sampleRate * duree), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = b; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 2; g.gain.value = gain;
  s.connect(f).connect(g).connect(sortie); s.start(t);
}

export function jouerSon(nom: NomSon): void {
  if (!reglage.actif || reglage.volume <= 0) return;
  const c = contexte();
  if (!c) return;
  const sortie = c.createGain();
  sortie.gain.value = reglage.volume;
  sortie.connect(c.destination);
  const t = c.currentTime + 0.01;
  switch (nom) {
    case 'clic': note(c, sortie, t, 1800, 1500, 0.03, 'square', 0.08); break;
    case 'ordre': souffle(c, sortie, t, 0.06, 2500, 0.15); note(c, sortie, t + 0.04, 900, 1300, 0.09, 'sine', 0.25); break;
    case 'deploiement': souffle(c, sortie, t, 0.35, 400, 0.25); note(c, sortie, t, 180, 380, 0.35, 'sawtooth', 0.08); break;
    case 'rapatriement': note(c, sortie, t, 380, 180, 0.3, 'sawtooth', 0.08); break;
    case 'succes': [523, 659, 784].forEach((f, i) => note(c, sortie, t + i * 0.09, f, f, 0.22, 'triangle', 0.22)); break;
    case 'echec': note(c, sortie, t, 330, 220, 0.35, 'triangle', 0.25); break;
    case 'alerte': [0, 0.18].forEach(d => note(c, sortie, t + d, 660, 440, 0.15, 'square', 0.1)); break;
    case 'mois': for (let i = 0; i < 6; i++) souffle(c, sortie, t + i * 0.055, 0.03, 3000, 0.3); break;
    case 'crise': [0, 0.25, 0.5].forEach(d => note(c, sortie, t + d, 880, 620, 0.2, 'square', 0.1)); break;
    case 'evenement': note(c, sortie, t, 880, 880, 0.6, 'sine', 0.2); note(c, sortie, t, 1320, 1320, 0.4, 'sine', 0.06); break;
  }
}

export function sonAction(a: Action, n: Etat): NomSon {
  switch (a.type) {
    case 'DEPLOYER': return 'deploiement';
    case 'RAPATRIER': return 'rapatriement';
    case 'OPERATION': return n.journal[0]?.genre === 'succes' ? 'succes' : 'echec';
    case 'CRISE': case 'CRISE_REPONSE': return n.journal[0]?.texte.includes('maîtrisée') ? 'succes' : a.type === 'CRISE' && !a.intervenir ? 'alerte' : 'echec';
    case 'POSITIONNER': case 'POSTURE': case 'MISSION': case 'ANNULER_MISSION': return 'ordre';
    default: return n.phase === 'evenement' ? 'evenement' : n.phase === 'crise' ? 'crise' : 'clic';
  }
}
