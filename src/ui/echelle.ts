// Taille de l'interface (accessibilité) : facteur d'agrandissement de toute la page, mémorisé localement.
const CLE = 'redlines.echelle.v1';
function lire(): number {
  try { const v = Number(localStorage.getItem(CLE)); if (v >= 1 && v <= 1.5) return v; } catch { /* réglage par défaut */ }
  return 1;
}
let echelle = lire();
export function echelleInterface(): number { return echelle; }
export function appliquerEchelle(): void {
  if (typeof document !== 'undefined') (document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = echelle === 1 ? '' : String(echelle);
}
export function reglerEchelle(v: number): void {
  echelle = v;
  try { localStorage.setItem(CLE, String(v)); } catch { /* stockage indisponible */ }
  appliquerEchelle();
}
