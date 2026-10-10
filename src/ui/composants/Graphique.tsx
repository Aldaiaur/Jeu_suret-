// Courbes d'évolution des indicateurs, mois par mois.
import { ANNEE_DEPART, NB_TOURS } from '../../data';
import type { Instantane } from '../../sim';

const SERIES: [keyof Instantane, string, string][] = [
  ['opinion', 'var(--vert)', 'Opinion'],
  ['menaceInt', 'var(--rouge)', 'Menace int.'],
  ['credibilite', 'var(--turquoise)', 'Crédibilité'],
  ['capital', 'var(--ambre)', 'Capital'],
  ['menaceExt', 'var(--violet)', 'Menace ext. réelle']
];

export function Graphique({ historique, largeur, hauteur, revelerMenaceExt }: { historique: Instantane[]; largeur: number; hauteur: number; revelerMenaceExt: boolean }) {
  const g = 26, d = 6, hh = hauteur - 32;
  const x = (t: number) => g + (largeur - g - d) * t / NB_TOURS;
  const y = (v: number) => 6 + (hh - 6) * (1 - v / 100);
  const pts = historique.filter((p, i) => i === historique.length - 1 || p.tour !== historique[i + 1].tour);
  // La menace extérieure réelle n'est révélée qu'en fin de partie (brouillard de guerre)
  const visibles = revelerMenaceExt ? SERIES : SERIES.slice(0, 4);
  return (
    <svg className="graphique" viewBox={`0 0 ${largeur} ${hauteur}`} width="100%">
      {[0, 50, 100].map(v => (
        <g key={v}>
          <line x1={g} x2={largeur - d} y1={y(v)} y2={y(v)} stroke="var(--trait)" />
          <text x={g - 5} y={y(v) + 3} textAnchor="end" className="graphique-axe">{v}</text>
        </g>
      ))}
      {[0, 12, 24, 36].map(t => <text key={t} x={x(t)} y={hh + 12} textAnchor={t === 0 ? 'start' : t === 36 ? 'end' : 'middle'} className="graphique-axe">{ANNEE_DEPART + t / 12}</text>)}
      {pts.length > 1 && visibles.map(([k, c]) => (
        <polyline key={k} fill="none" stroke={c} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"
          points={pts.map(p => x(p.tour).toFixed(1) + ',' + y(p[k]).toFixed(1)).join(' ')} />
      ))}
      {visibles.map(([k, c, nom], i) => <text key={k} x={g + i * 84} y={hauteur - 2} fill={c} className="graphique-legende">{nom}</text>)}
      {pts.length <= 1 && <text x={largeur / 2} y={hh / 2} textAnchor="middle" className="graphique-axe">Les courbes apparaissent après le premier mois.</text>}
    </svg>
  );
}
