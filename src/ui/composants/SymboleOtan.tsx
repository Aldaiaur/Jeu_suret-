// Symbole militaire OTAN (APP-6) d'une unité, généré par la bibliothèque libre milsymbol (licence MIT).
import ms from 'milsymbol';
import { IDENTITES } from '../../data';

interface Rendu { svg: string; largeur: number; hauteur: number; ax: number; ay: number }
const cache = new Map<string, Rendu>();

export function rendreSymbole(sidc: string, taille: number): Rendu {
  const cle = sidc + '|' + taille;
  let r = cache.get(cle);
  if (!r) {
    const sym = new ms.Symbol(sidc, { size: taille, outlineWidth: 2, outlineColor: '#0a0e12' });
    const { width, height } = sym.getSize(), a = sym.getAnchor();
    r = { svg: sym.asSVG(), largeur: width, hauteur: height, ax: a.x, ay: a.y };
    cache.set(cle, r);
  }
  return r;
}

// Dans un SVG : symbole centré sur (0, 0)
export function SymboleSvg({ unite, taille = 18 }: { unite: string; taille?: number }) {
  const r = rendreSymbole(IDENTITES[unite].sidc, taille);
  return <g transform={`translate(${-r.ax},${-r.ay})`} dangerouslySetInnerHTML={{ __html: r.svg }} />;
}

// Dans du HTML (listes, fiches)
export function SymboleHtml({ unite, taille = 14 }: { unite: string; taille?: number }) {
  const r = rendreSymbole(IDENTITES[unite].sidc, taille);
  return <span className="symbole-otan" style={{ width: r.largeur, height: r.hauteur }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: r.svg }} />;
}
