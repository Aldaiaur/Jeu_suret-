// Robot qui joue des actions au hasard, avec son propre générateur à graine.
// Partagé entre l'outil qui fige les parties de référence (tools/golden-prototype.ts)
// et le test de non-régression : il ne doit utiliser que la syntaxe TypeScript effaçable.

export interface MoteurMinimal {
  nouvellePartie(graine: string | number, difficulte: string): any;
  actionsPossibles(s: any): any[];
  appliquerAction(s: any, a: any): any;
  finDeTour(s: any): any;
  alea(s: { rngState: number }): number;
  verifierInvariants(s: any, complet: boolean): string[];
}

export interface ResumePartie {
  graine: number;
  difficulte: string;
  tour: number;
  fin: string;
  score: number;
  empreinte: string;
}

// Sérialisation à clés triées, pour comparer des états indépendamment de l'ordre des champs
export function canonique(v: unknown): string {
  if (Array.isArray(v)) return '[' + v.map(canonique).join(',') + ']';
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    return '{' + Object.keys(o).sort().filter(k => o[k] !== undefined).map(k => JSON.stringify(k) + ':' + canonique(o[k])).join(',') + '}';
  }
  return JSON.stringify(v);
}

function hacher(t: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16).padStart(8, '0') + ':' + t.length;
}

export function jouerParties(M: MoteurMinimal, nb: number, difficultes: string[]): ResumePartie[] {
  const choix = { rngState: 987654321 };
  const pick = <T>(l: T[]): T => l[Math.floor(M.alea(choix) * l.length)];
  const res: ResumePartie[] = [];
  for (let i = 0; i < nb; i++) {
    const graine = 1000 + i, difficulte = difficultes[i % difficultes.length];
    let s = M.nouvellePartie(graine, difficulte);
    let garde = 0;
    while (!s.fin && garde++ < 6000) {
      if (s.phase === 'jeu') {
        const n = Math.floor(M.alea(choix) * 5);
        for (let k = 0; k < n && s.phase === 'jeu' && !s.fin; k++) {
          const L = M.actionsPossibles(s);
          const groupes: Record<string, any[]> = {};
          for (const a of L) (groupes[a.type] = groupes[a.type] || []).push(a);
          const types = Object.keys(groupes);
          if (!types.length) break;
          s = M.appliquerAction(s, pick(groupes[pick(types)]));
        }
        if (s.phase === 'jeu' && !s.fin) s = M.finDeTour(s);
      } else {
        let a = pick(M.actionsPossibles(s));
        if (s.phase === 'zoom' && a.type === 'Z_RETRAIT' && M.alea(choix) < 0.9) a = { type: 'Z_SEMAINE' };
        s = M.appliquerAction(s, a);
      }
      const inv = M.verifierInvariants(s, s.phase === 'jeu' || !!s.fin);
      if (inv.length) throw new Error('Partie ' + graine + ' : ' + inv.join(' ; '));
    }
    res.push({ graine, difficulte, tour: s.tour, fin: s.fin ? s.fin.type : 'non terminée', score: s.fin ? s.fin.score.total : -1, empreinte: hacher(canonique(s)) });
  }
  return res;
}
