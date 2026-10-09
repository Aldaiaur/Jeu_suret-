// Outils génériques : clonage, bornes, générateur pseudo-aléatoire à graine.
import type { Action } from './types';

export function cloner<T>(s: T): T { return JSON.parse(JSON.stringify(s)); }
export function borner(v: number, a: number, b: number): number { return v < a ? a : (v > b ? b : v); }
export function arrondi(v: number): number { return Math.round(v * 10) / 10; }

// Clé canonique d'une action (comparaison indépendante de l'ordre des champs)
export function cleAction(a: Action): string {
  const o = a as unknown as Record<string, unknown>;
  const k = Object.keys(o).sort();
  return k.map(x => x + '=' + JSON.stringify(o[x])).join('&');
}

// ---------- Générateur pseudo-aléatoire mulberry32 (état dans s.rngState) ----------
export function graineVersEntier(g: string | number): number {
  const t = String(g).trim();
  if (/^\d+$/.test(t)) return Number(BigInt(t) % 4294967296n) >>> 0;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
export function alea(s: { rngState: number }): number {
  s.rngState = (s.rngState + 0x6D2B79F5) >>> 0;
  let t = s.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function aleaEntre(s: { rngState: number }, a: number, b: number): number { return a + alea(s) * (b - a); }
export function aleaInt(s: { rngState: number }, a: number, b: number): number { return Math.floor(aleaEntre(s, a, b + 1 - 1e-9)); }
export function choisir<T>(s: { rngState: number }, l: T[]): T { return l[Math.floor(alea(s) * l.length)]; }
export function choisirPondere<T>(s: { rngState: number }, items: T[], poids: (x: T) => number): T | null {
  const tot = items.reduce((a, x) => a + poids(x), 0);
  if (tot <= 0) return null;
  let r = alea(s) * tot;
  for (const x of items) { r -= poids(x); if (r <= 0) return x; }
  return items[items.length - 1];
}
