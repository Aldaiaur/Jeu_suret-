// Fond des cartes régionales, généré par code à partir du biome : mer, terres texturées, relief, fleuves.
// Aucun fichier image : tout est dérivé de Natural Earth (world-atlas) et d'un tirage pseudo-aléatoire
// à graine fixe, pour que le décor reste identique d'une ouverture à l'autre.
// Le décor est peint une fois sur un canvas, puis affiché comme une image dans le SVG de la carte :
// découper des côtes détaillées en SVG à chaque image coûterait plusieurs secondes de rendu.
import { memo, useEffect, useState } from 'react';
import { geoBounds, geoContains, geoMercator, geoPath, type GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import monde from 'world-atlas/countries-50m.json';
import { BIOMES } from '../../data';
import type { BiomeDef, CarteRegionaleDef, ElementRelief } from '../../sim';

const topo = monde as unknown as Topology<{ countries: GeometryCollection }>;
const pays = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;
const bornesPays = pays.features.map(f => geoBounds(f));

// Générateur pseudo-aléatoire local au décor (l'aléatoire de la partie reste dans la simulation)
export function generateur(graine: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < graine.length; i++) { h ^= graine.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return () => {
    h = (h + 0x6D2B79F5) >>> 0;
    let t = Math.imul(h ^ (h >>> 15), h | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Cadre { L: number; H: number; marges: { haut: number; droite: number; bas: number; gauche: number } }

// Projection ajustée aux lieux de la carte, dans la zone utile (hors panneaux superposés)
export function projectionRegionale(C: CarteRegionaleDef, c: Cadre): GeoProjection {
  const pts: Feature<Geometry> = { type: 'Feature', properties: {}, geometry: { type: 'MultiPoint', coordinates: C.lieux.map(l => [l.lon, l.lat]) } };
  const { haut, droite, bas, gauche } = c.marges;
  return geoMercator().fitExtent([[gauche, haut], [Math.max(gauche + 200, c.L - droite), Math.max(haut + 150, c.H - bas)]], pts);
}

// ---------- Dessin vectoriel minimal : une forme = un tracé SVG et son style ----------
interface Forme { d: string; fond?: string; trait?: string; ep?: number; op?: number }
const cercle = (cx: number, cy: number, r: number) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0`;
const rect = (x: number, y: number, w: number, h: number) => `M${x},${y} h${w} v${h} h${-w} Z`;

function dessiner(ctx: CanvasRenderingContext2D, formes: Forme[]): void {
  for (const f of formes) {
    const p = new Path2D(f.d);
    ctx.globalAlpha = f.op ?? 1;
    if (f.fond) { ctx.fillStyle = f.fond; ctx.fill(p); }
    if (f.trait) { ctx.strokeStyle = f.trait; ctx.lineWidth = f.ep ?? 1; ctx.stroke(p); }
  }
  ctx.globalAlpha = 1;
}

// ---------- Éléments de relief ----------
const TERRESTRES: ElementRelief[] = ['dune', 'rocher', 'arbre', 'haie', 'batiment', 'palmier', 'mangrove', 'marais', 'champ', 'montagne', 'acacia'];
const MARITIMES: ElementRelief[] = ['vague', 'ile'];

function glyphe(e: ElementRelief, b: BiomeDef): Forme[] {
  const c = b.palette.relief, tr = b.palette.trait;
  switch (e) {
    case 'dune': return [{ d: 'M-9,2 Q-3,-5 3,-1 Q6,1 9,2', trait: tr, ep: 1.3, op: 0.75 }];
    case 'rocher': return [{ d: 'M-5,3 L-3,-2 L1,-4 L5,0 L4,3 Z', fond: c, trait: tr, ep: 0.8 }];
    case 'arbre': return [{ d: cercle(0, -1.5, 3.6), fond: c }, { d: cercle(2.6, 0.5, 2.4), fond: c, op: 0.85 }];
    case 'haie': return [{ d: 'M-8,0 Q-4,-1.5 0,0 T8,0', trait: c, ep: 2 }];
    case 'batiment': return [{ d: rect(-4, -3, 3, 3) + rect(0, -5, 3.5, 5) + rect(-2, 1, 4, 2.5), fond: tr, op: 0.8 }];
    case 'palmier': return [{ d: 'M0,4 L0,-2 M0,-2 Q-3,-4 -5,-2 M0,-2 Q3,-4 5,-2 M0,-2 Q-1,-5 -3,-5 M0,-2 Q1,-5 3,-5', trait: c, ep: 1.1 }];
    case 'mangrove': return [{ d: 'M-3,3 Q-2,-1 0,-2 Q2,-1 3,3 M0,-2 L0,3', trait: c, ep: 1 }, { d: cercle(0, -3.5, 2.6), fond: c }];
    case 'marais': return [{ d: 'M-6,0 H-1 M1,0 H6 M-4,2.5 H3 M-2,0 L-2,-3 M2,0 L2,-4', trait: tr, ep: 0.9, op: 0.7 }];
    case 'champ': return [{ d: rect(-6, -4, 12, 8), fond: b.palette.terre2, trait: c, ep: 0.6, op: 0.55 }, { d: 'M-6,-1.5 H6 M-6,1.5 H6', trait: c, ep: 0.5, op: 0.55 }];
    case 'montagne': return [{ d: 'M-8,4 L-2,-5 L1,-1 L3,-3 L8,4 Z', fond: c, trait: tr, ep: 0.7 }, { d: 'M-2,-5 L-0.6,-2.8 L-3.2,-2.6 Z', fond: tr }];
    case 'acacia': return [{ d: 'M0,4 L0,-1 M0,0 L-2,-2 M0,0 L2,-2', trait: c, ep: 0.9 }, { d: ellipse(0, -2.6, 5, 1.5), fond: c }];
    case 'vague': return [{ d: 'M-6,0 Q-3,-2.5 0,0 T6,0', trait: tr, ep: 0.9, op: 0.45 }];
    case 'ile': return [{ d: 'M-4,0 Q-3,-3 0,-2.5 Q4,-3 4.5,0 Q3,2.5 0,2 Q-3,2.6 -4,0 Z', fond: b.palette.terre2, trait: tr, ep: 0.7 }];
  }
}
const TOURNE: Partial<Record<ElementRelief, number>> = { haie: 180, champ: 60, ile: 360 };

// ---------- Textures : une tuile dessinée par code, répétée en motif ----------
function tuile(type: BiomeDef['textures'][number], b: BiomeDef, graine: string): { taille: number; formes: Forme[] } {
  const g = generateur(graine), c = b.palette.relief, tr = b.palette.trait;
  const n = (k: number) => Array.from({ length: k }, (_, i) => i);
  switch (type) {
    case 'dunes': return { taille: 64, formes: n(5).map(i => ({ d: `M0,${i * 13 + 6} q16,-7 32,0 t32,0`, trait: tr, ep: 0.8, op: 0.35 })) };
    case 'reg': return { taille: 48, formes: [{ d: n(22).map(() => cercle(g() * 48, g() * 48, 0.5 + g() * 0.9)).join(''), fond: tr, op: 0.35 }] };
    case 'steppe': return { taille: 48, formes: [{ d: n(9).map(() => { const x = g() * 48, y = g() * 48; return `M${x},${y} l-1.5,-3 M${x},${y} l0,-3.5 M${x},${y} l1.5,-3`; }).join(''), trait: c, ep: 0.8, op: 0.5 }] };
    case 'bocage': return { taille: 56, formes: [{ d: `M0,${10 + g() * 6} Q28,${4 + g() * 10} 56,${10 + g() * 6} M0,${36 + g() * 6} Q28,${30 + g() * 10} 56,${36 + g() * 6} M${14 + g() * 8},0 Q${10 + g() * 10},28 ${14 + g() * 8},56 M${40 + g() * 6},0 Q${36 + g() * 10},28 ${40 + g() * 6},56`, trait: c, ep: 1.2, op: 0.55 }] };
    case 'champs': return { taille: 40, formes: [{ d: n(8).map(i => `M0,${i * 5} H40`).join(''), trait: c, ep: 0.5, op: 0.3 }] };
    case 'urbain': return { taille: 30, formes: [{ d: n(6).map(() => rect(g() * 26, g() * 26, 2 + g() * 3, 2 + g() * 3)).join(''), fond: tr, op: 0.18 }] };
    case 'foret': return { taille: 48, formes: [{ d: n(14).map(() => cercle(g() * 48, g() * 48, 1.6 + g() * 1.8)).join(''), fond: c, op: 0.55 }] };
    case 'mangrove': return { taille: 48, formes: [{ d: n(16).map(() => { const x = g() * 48, y = g() * 48; return `M${x},${y} l0,-4 M${x - 2},${y} q2,-3 4,0`; }).join(''), trait: c, ep: 0.9, op: 0.55 }] };
    case 'houle': return { taille: 60, formes: n(4).map(i => ({ d: `M0,${i * 15 + 7} q7.5,-4 15,0 t15,0 t15,0 t15,0`, trait: tr, ep: 0.7, op: 0.22 })) };
  }
}
function motif(ctx: CanvasRenderingContext2D, type: BiomeDef['textures'][number], b: BiomeDef, graine: string, dpr: number): CanvasPattern | null {
  const t = tuile(type, b, graine);
  const cv = document.createElement('canvas');
  cv.width = t.taille * dpr; cv.height = t.taille * dpr;
  const c2 = cv.getContext('2d');
  if (!c2) return null;
  c2.scale(dpr, dpr);
  dessiner(c2, t.formes);
  const p = ctx.createPattern(cv, 'repeat');
  p?.setTransform(new DOMMatrix().scale(1 / dpr));
  return p;
}

// Lissage d'une polyligne (Catmull-Rom vers Bézier)
function courbe(p: [number, number][]): string {
  if (p.length < 2) return '';
  let d = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += 'C' + c1[0].toFixed(1) + ',' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ',' + c2[1].toFixed(1) + ' ' + c[0].toFixed(1) + ',' + c[1].toFixed(1);
  }
  return d;
}

// Peint le décor complet sur un canvas
function peindre(cv: HTMLCanvasElement, C: CarteRegionaleDef, cadre: Cadre, projection: GeoProjection, dpr: number): void {
  const b = BIOMES[C.biome], { L, H } = cadre;
  cv.width = Math.round(L * dpr); cv.height = Math.round(H * dpr);
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // Pays visibles : ceux dont l'emprise recoupe celle de la carte (avec une marge)
  const [o, n] = projection.invert!([-L * 0.2, -H * 0.2])!, [e, s] = projection.invert!([L * 1.2, H * 1.2])!;
  const indices = pays.features.map((_, i) => i).filter(i => {
    const [[x0, y0], [x1, y1]] = bornesPays[i];
    return !(x1 < o || x0 > e || y1 < s || y0 > n) || x0 > x1;
  });
  const surTerre = (ll: [number, number]) => indices.some(i => {
    const [[x0, y0], [x1, y1]] = bornesPays[i];
    if (x0 <= x1 && (ll[0] < x0 || ll[0] > x1)) return false;
    if (ll[1] < y0 || ll[1] > y1) return false;
    return geoContains(pays.features[i], ll);
  });

  // Mer
  const gm = ctx.createLinearGradient(0, 0, L * 0.3, H);
  gm.addColorStop(0, b.palette.mer); gm.addColorStop(1, b.palette.merProfonde);
  ctx.fillStyle = gm; ctx.fillRect(0, 0, L, H);
  if (b.textures.includes('houle')) { const p = motif(ctx, 'houle', b, C.id + 'houle', dpr); if (p) { ctx.fillStyle = p; ctx.fillRect(0, 0, L, H); } }

  // Terres : découpe par les côtes, couleur de fond puis textures
  const terres = new Path2D();
  const chemin = geoPath(projection);
  for (const i of indices) { const d = chemin(pays.features[i]); if (d) terres.addPath(new Path2D(d)); }
  ctx.save();
  ctx.clip(terres);
  ctx.fillStyle = b.palette.terre; ctx.fillRect(0, 0, L, H);
  for (const t of b.textures) if (t !== 'houle') { const p = motif(ctx, t, b, C.id + t, dpr); if (p) { ctx.fillStyle = p; ctx.fillRect(0, 0, L, H); } }
  ctx.restore();
  ctx.globalAlpha = 0.55; ctx.strokeStyle = b.palette.trait; ctx.lineWidth = 0.9; ctx.stroke(terres); ctx.globalAlpha = 1;

  // Fleuves
  for (const f of C.fleuves || []) {
    ctx.globalAlpha = 0.75; ctx.strokeStyle = '#2f6b86'; ctx.lineWidth = 2.2;
    ctx.stroke(new Path2D(courbe(f.points.map(p => projection(p) as [number, number]))));
    ctx.globalAlpha = 1;
  }

  // Relief : tirage à graine fixe, éléments terrestres sur les terres, maritimes en mer, à l'écart des lieux
  const g = generateur(C.id), lieux = C.lieux.map(l => projection([l.lon, l.lat])!);
  const terrestres = b.relief.filter(x => TERRESTRES.includes(x)), maritimes = b.relief.filter(x => MARITIMES.includes(x));
  let places = 0;
  for (let i = 0; i < b.densite * 1.6 && places < b.densite; i++) {
    const x = g() * L, y = g() * H, r = g(), t = 0.8 + g() * 0.7, choix = g();
    if (lieux.some(p => Math.hypot(p[0] - x, p[1] - y) < 26)) continue;
    const ll = projection.invert!([x, y]);
    if (!ll) continue;
    const liste = surTerre(ll as [number, number]) ? terrestres : maritimes;
    if (!liste.length) continue;
    const el = liste[Math.floor(choix * liste.length)];
    ctx.save();
    ctx.translate(x, y); ctx.scale(t, t); ctx.rotate(((TOURNE[el] || 0) * (r - 0.5)) * Math.PI / 180);
    dessiner(ctx, glyphe(el, b));
    ctx.restore();
    places++;
  }

  // Vignettage
  const gv = ctx.createRadialGradient(L * 0.45, H * 0.45, Math.min(L, H) * 0.35, L * 0.45, H * 0.45, Math.max(L, H) * 0.75);
  gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = gv; ctx.fillRect(0, 0, L, H);
}

// Affiche le décor comme une image dans un SVG ; un fond uni le remplace le temps du premier rendu
export const FondRegional = memo(function FondRegional({ C, cadre, projection }: { C: CarteRegionaleDef; cadre: Cadre; projection: GeoProjection }) {
  const b = BIOMES[C.biome];
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let annule = false, cree: string | null = null;
    const id = window.setTimeout(() => {
      const cv = document.createElement('canvas');
      peindre(cv, C, cadre, projection, Math.min(2, window.devicePixelRatio || 1));
      cv.toBlob(bl => { if (annule || !bl) return; cree = URL.createObjectURL(bl); setUrl(cree); });
    }, 0);
    return () => { annule = true; clearTimeout(id); if (cree) URL.revokeObjectURL(cree); };
  }, [C, cadre, projection]);
  return (
    <g className="fond-regional" pointerEvents="none">
      <rect width={cadre.L} height={cadre.H} fill={b.palette.merProfonde} />
      {url && <image href={url} width={cadre.L} height={cadre.H} className="fond-image" />}
    </g>
  );
});
