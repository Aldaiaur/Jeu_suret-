// Carte stratégique : géographie réelle (Natural Earth), théâtres positionnés par coordonnées.
import { memo, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath, type GeoPath, type GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import monde from 'world-atlas/countries-50m.json';
import { CATEGORIES, MT, TH, THEATRES, UNITES } from '../../data';
import { appuiDef, fiabilite, saisonDu, type Etat } from '../../sim';
import { COULEUR_SAISON } from '../composants/Saison';
import { AL } from '../../data';
import { usePartie } from '../contexte';
import { couleurNiveau } from '../format';

// Pays rattachés à chaque théâtre (codes ISO 3166 numériques de Natural Earth)
const PAYS_THEATRE: Record<string, string[]> = {
  METRO: ['250'],
  EST: ['233', '428', '440', '616', '642', '804'],
  LIBYE: ['434'],
  LEVANT: ['368', '760'],
  SAHEL: ['466', '562', '854', '148', '478'],
  GUINEE: ['566', '384', '288', '204', '768', '120', '266'],
  CORNE: ['262'],
  INDOPAC: ['408']
};
const THEATRE_DU_PAYS: Record<string, string> = {};
for (const t in PAYS_THEATRE) for (const p of PAYS_THEATRE[t]) THEATRE_DU_PAYS[p] = t;

const topo = monde as unknown as Topology<{ countries: GeometryCollection }>;
const pays = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;

// Cadre géographique de la campagne : Atlantique à l’ouest, mer de Chine à l’est
const CADRE: Feature<Geometry> = { type: 'Feature', properties: {}, geometry: { type: 'MultiPoint', coordinates: [[-20, -12], [118, -12], [-20, 62], [118, 62]] } };

interface Geo { L: number; H: number; projection: GeoProjection; chemin: GeoPath }
function creerGeo(L: number, H: number): Geo {
  const projection = geoNaturalEarth1().fitExtent([[24, 24], [L - 24, H - 24]], CADRE);
  return { L, H, projection, chemin: geoPath(projection) };
}

// Fond de carte : recalculé seulement quand la taille de la zone change
const Fond = memo(function Fond({ geo }: { geo: Geo }) {
  const { L, H, chemin } = geo;
  const graticule = useMemo(() => chemin(geoGraticule10()) || '', [chemin]);
  const traces = useMemo(() => pays.features.map((f, i) => ({ id: i + ':' + String(f.id), d: chemin(f) || '' })), [chemin]);
  return (
    <g>
      <rect x={-L} y={-H} width={L * 3} height={H * 3} fill="url(#ocean)" />
      <path d={graticule} fill="none" stroke="rgba(120,150,175,0.06)" strokeWidth={0.6} />
      {traces.map(p => <path key={p.id} d={p.d} className="pays" />)}
    </g>
  );
});

function niveauAffiche(s: Etat, t: string) {
  const ms = s.menaces.filter(m => m.theatre === t && m.detectee);
  if (!ms.length) return null;
  return ms.reduce((a, m) => (m.estimation! > a.estimation! ? m : a));
}

export function CarteMonde() {
  const { etat: s, ui, majUi } = usePartie();
  const [vue, setVue] = useState({ k: 1, x: 0, y: 0 });
  const glisse = useRef<{ x: number; y: number; vx: number; vy: number; bouge: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boite = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState(() => creerGeo(1000, 640));
  useLayoutEffect(() => {
    const el = boite.current!;
    const mesurer = () => { const l = Math.max(400, Math.round(el.clientWidth)), h = Math.max(300, Math.round(el.clientHeight)); setGeo(g => (g.L === l && g.H === h ? g : creerGeo(l, h))); };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { L, H, projection, chemin } = geo;

  const positions = useMemo(() => {
    const p: Record<string, [number, number]> = {};
    for (const T of THEATRES) p[T.id] = projection([T.lon, T.lat]) as [number, number];
    return p;
  }, [projection]);
  const liaisons = useMemo(() => {
    const vus = new Set<string>(), r: { cle: string; d: string }[] = [];
    for (const T of THEATRES) for (const v of T.voisins) {
      const cle = [T.id, v].sort().join('-');
      if (vus.has(cle)) continue;
      vus.add(cle);
      r.push({ cle, d: chemin({ type: 'LineString', coordinates: [[T.lon, T.lat], [TH[v].lon, TH[v].lat]] }) || '' });
    }
    return r;
  }, [chemin]);

  // Teinte des pays de chaque théâtre selon la menace estimée
  const teintes = useMemo(() => {
    const r: { id: string; d: string; couleur: string; theatre: string }[] = [];
    for (const f of pays.features) {
      const t = THEATRE_DU_PAYS[String(f.id)];
      if (!t) continue;
      const m = niveauAffiche(s, t);
      r.push({ id: String(f.id), d: chemin(f) || '', couleur: t === 'METRO' ? 'var(--turquoise)' : couleurNiveau(m ? m.estimation : null), theatre: t });
    }
    return r;
  }, [s, chemin]);

  const versSvg = (cx: number, cy: number) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top };
  };
  const borne = (v: { k: number; x: number; y: number }) => {
    const mx = (L * (v.k - 1)) / 1, my = (H * (v.k - 1)) / 1;
    return { k: v.k, x: Math.min(L * 0.2, Math.max(-mx - L * 0.2, v.x)), y: Math.min(H * 0.2, Math.max(-my - H * 0.2, v.y)) };
  };
  const molette = (ev: WheelEvent) => {
    const p = versSvg(ev.clientX, ev.clientY);
    setVue(v => {
      const k = Math.min(6, Math.max(1, v.k * (ev.deltaY < 0 ? 1.2 : 1 / 1.2)));
      const f = k / v.k;
      return borne({ k, x: p.x - (p.x - v.x) * f, y: p.y - (p.y - v.y) * f });
    });
  };
  const appui = (ev: PointerEvent) => {
    glisse.current = { x: ev.clientX, y: ev.clientY, vx: vue.x, vy: vue.y, bouge: false };
  };
  const deplacement = (ev: PointerEvent) => {
    const g = glisse.current;
    if (!g) return;
    const dx = ev.clientX - g.x, dy = ev.clientY - g.y;
    if (!g.bouge && Math.hypot(dx, dy) < 4) return;
    if (!g.bouge) { g.bouge = true; (ev.currentTarget as Element).setPointerCapture(ev.pointerId); }
    setVue(v => borne({ k: v.k, x: g.vx + dx, y: g.vy + dy }));
  };
  const relache = () => { setTimeout(() => { glisse.current = null; }, 0); };
  const clic = (sel: string | null) => {
    if (glisse.current?.bouge) return;
    majUi({ selection: sel ? { kind: 'theatre', id: sel } : null });
  };

  const k = vue.k;
  return (
    <div className="carte-monde" ref={boite} inert={ui.selection?.kind === 'theatre'}>
      <svg ref={svgRef} width={L} height={H} viewBox={`0 0 ${L} ${H}`}
        onWheel={molette} onPointerDown={appui} onPointerMove={deplacement} onPointerUp={relache} onPointerLeave={relache}
        onClick={() => clic(null)} data-tuto="carte">
        <defs>
          <radialGradient id="ocean" cx="50%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#0c141b" />
            <stop offset="100%" stopColor="#06090c" />
          </radialGradient>
          <filter id="lueur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g transform={`translate(${vue.x},${vue.y}) scale(${k})`}>
          <Fond geo={geo} />
          {teintes.map(p => (
            <path key={p.id} d={p.d} className={'pays-theatre' + (ui.selection?.id === p.theatre ? ' sel' : '')}
              style={{ fill: p.couleur, stroke: p.couleur }}
              onClick={ev => { ev.stopPropagation(); clic(p.theatre); }} />
          ))}
          {liaisons.map(l => <path key={l.cle} d={l.d} className="liaison" strokeWidth={1.2 / k} strokeDasharray={`${5 / k} ${5 / k}`} />)}
          {THEATRES.map(T => <Marqueur key={T.id} id={T.id} pos={positions[T.id]} k={k} />)}
        </g>
      </svg>
      <div className="carte-legende">
        <span><i style={{ background: 'var(--vert)' }} /> Menace contenue</span>
        <span><i style={{ background: 'var(--ambre)' }} /> Préoccupante</span>
        <span><i style={{ background: 'var(--rouge)' }} /> Critique</span>
        <span className="discret">Molette : zoom · glisser : déplacer</span>
      </div>
      {k > 1 && <button className="btn petit carte-recentrer" onClick={() => setVue({ k: 1, x: 0, y: 0 })}>Recentrer</button>}
    </div>
  );
}

function Marqueur({ id, pos, k }: { id: string; pos: [number, number]; k: number }) {
  const { etat: s, ui, majUi } = usePartie();
  const T = TH[id], th = s.theatres[id];
  const m = niveauAffiche(s, id);
  const dep = UNITES.filter(u => s.unites[u.id].theatre === id && s.unites[u.id].etat === 'deployee');
  const proj = UNITES.filter(u => s.unites[u.id].theatre === id && s.unites[u.id].etat === 'projection').length;
  const sel = ui.selection?.kind === 'theatre' && ui.selection.id === id;
  const col = id === 'METRO' && !m ? 'var(--turquoise)' : couleurNiveau(m ? m.estimation : null);
  const R = 19, circ = 2 * Math.PI * R;
  const frac = m ? m.estimation! / 100 : 0;
  const compo = Object.keys(CATEGORIES).map(c => [c, dep.filter(u => u.categorie === c).length] as const).filter(x => x[1]);
  const nbM = s.menaces.filter(x => x.theatre === id && x.detectee).length;
  const tip = T.nom + '\nMenace estimée : ' + (m ? m.estimation + ' ± ' + m.marge + ' (' + MT[m.type].nom + ')' : 'aucune détectée') +
    '\nMenaces identifiées : ' + nbM + '\nRenseignement : ' + th.rens + ' (fiabilité ' + fiabilite(th.rens) + ')' +
    '\nForces déployées : ' + dep.length + (proj ? ' (+' + proj + ' en route)' : '') + '\nCapacité partenaire : ' + th.partenaire +
    th.appuis.map(a => '\n' + AL[a.allie].nom + ' : ' + appuiDef(a.allie, a.appui).nom + ' (' + a.tours + ' mois)').join('') +
    (th.crise ? '\nCRISE : ' + th.crise.titre : '') + '\nSaison : ' + saisonDu(id, s.tour).nom + '\n(cliquer pour la carte régionale)';
  const sa = saisonDu(id, s.tour);
  return (
    <g transform={`translate(${pos[0]},${pos[1]}) scale(${1 / k})`} className={'marqueur' + (sel ? ' sel' : '')} data-tip={tip} data-tuto={ui.selection?.kind === 'theatre' ? undefined : 'theatre-' + id}
      onClick={ev => { ev.stopPropagation(); majUi({ selection: { kind: 'theatre', id } }); }}>
      {th.crise && <circle r={R + 4} className="onde" style={{ stroke: 'var(--rouge)' }} />}
      {sel && <circle r={R + 10} fill={col} opacity={0.25} filter="url(#lueur)" />}
      <circle r={R + 3} className="marqueur-fond" />
      <circle r={R} fill="none" stroke="var(--trait-2)" strokeWidth={3} />
      <circle r={R} fill="none" stroke={col} strokeWidth={3} strokeLinecap="round"
        strokeDasharray={`${(frac * circ).toFixed(1)} ${circ.toFixed(1)}`} transform="rotate(-90)" className="anneau" />
      <text y={4.5} textAnchor="middle" className="marqueur-valeur" style={{ fill: m ? col : 'var(--texte-3)' }}>{m ? m.estimation : '?'}</text>
      <g transform={`translate(0,${R + 16})`}>
        <rect x={-34} y={-10} width={68} height={17} rx={8.5} className={'etiquette' + (th.crise ? ' crise' : '')} />
        <text y={3} textAnchor="middle" className="etiquette-texte">{T.court}</text>
      </g>
      {(dep.length > 0 || proj > 0) && (
        <g transform={`translate(${R - 2},${-R + 2})`}>
          <rect x={-2} y={-9} width={8 + 7 * String(dep.length).length + (proj ? 14 : 0)} height={15} rx={4} className="badge-forces" />
          <text x={3} y={2.5} className="badge-texte">{dep.length}{proj ? <tspan className="badge-proj">+{proj}</tspan> : null}</text>
        </g>
      )}
      {compo.length > 0 && (
        <g transform={`translate(${-((compo.length - 1) * 9) / 2},${R + 32})`}>
          {compo.map(([c], i) => <rect key={c} x={i * 9 - 3} y={-3} width={6} height={6} rx={1.5} className={'puce-cat cat-' + c} />)}
        </g>
      )}
      {(th.allie > 0 || th.appuis.length > 0) && !th.crise && <circle cx={-R + 2} cy={-R + 2} r={4} fill="var(--violet)" />}
      {sa.visuel !== 'aucun' && <circle cx={-R - 1} cy={R - 3} r={3.5} fill={COULEUR_SAISON[sa.visuel]} stroke="#0a0e12" strokeWidth={1.2} />}
    </g>
  );
}
