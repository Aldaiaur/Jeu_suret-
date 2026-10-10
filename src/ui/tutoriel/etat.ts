// Mémoire du tutoriel entre les sessions (préférence propre à ce poste de jeu).
const CLE = 'redlines.tutoriel.v1';

interface Memoire { actif: boolean; fini: boolean; etape: number; astuces: string[] }

export function lireTutoriel(): Memoire {
  try {
    const m = JSON.parse(localStorage.getItem(CLE) || 'null');
    if (m && typeof m.etape === 'number') return { actif: !!m.actif, fini: !!m.fini, etape: m.etape, astuces: Array.isArray(m.astuces) ? m.astuces : [] };
  } catch { /* stockage indisponible */ }
  return { actif: false, fini: false, etape: 0, astuces: [] };
}
export function ecrireTutoriel(m: Memoire): void {
  try { localStorage.setItem(CLE, JSON.stringify(m)); } catch { /* stockage indisponible */ }
}
export function tutorielDejaVu(): boolean { return lireTutoriel().fini; }
export function activerTutoriel(actif: boolean): void {
  ecrireTutoriel({ actif, fini: lireTutoriel().fini, etape: 0, astuces: [] });
}
