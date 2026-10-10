// Saison : icône, effets visuels animés sur les cartes régionales, et résumé lisible des effets de règle.
import type { ReactElement } from 'react';
import { CATEGORIES, MT } from '../../data';
import type { Categorie, EffetsSaison, VisuelSaison } from '../../sim';

// Petites icônes vectorielles, lisibles à 14 px
export function IconeSaison({ visuel, taille = 14 }: { visuel: VisuelSaison; taille?: number }) {
  const t: Record<VisuelSaison, ReactElement> = {
    aucun: <circle cx={8} cy={8} r={3} fill="currentColor" opacity={0.6} />,
    pluie: <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"><path d="M3,6 Q8,1 13,6 Z" fill="currentColor" stroke="none" /><path d="M5,9 L4,12 M8,9 L7,13 M11,9 L10,12" /></g>,
    mousson: <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"><path d="M2,6 Q8,0 14,6 Z" fill="currentColor" stroke="none" /><path d="M4,8 L2,13 M7,8 L5,14 M10,8 L8,14 M13,8 L11,13" /></g>,
    chaleur: <g stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"><circle cx={8} cy={8} r={3} fill="currentColor" /><path d="M8,1 V3 M8,13 V15 M1,8 H3 M13,8 H15 M3,3 L4.4,4.4 M11.6,11.6 L13,13 M3,13 L4.4,11.6 M11.6,4.4 L13,3" /></g>,
    neige: <g stroke="currentColor" strokeWidth={1.3} strokeLinecap="round"><path d="M8,1 V15 M2,4.5 L14,11.5 M2,11.5 L14,4.5" /><path d="M6,2.5 L8,4 L10,2.5 M6,13.5 L8,12 L10,13.5" fill="none" /></g>,
    boue: <g fill="currentColor"><ellipse cx={8} cy={11} rx={6} ry={2.4} opacity={0.8} /><path d="M3,8 Q5,5 8,7 Q11,9 13,6" stroke="currentColor" strokeWidth={1.3} fill="none" /></g>,
    houle: <g stroke="currentColor" strokeWidth={1.4} fill="none" strokeLinecap="round"><path d="M1,6 Q4.5,2 8,6 T15,6" /><path d="M1,11 Q4.5,7 8,11 T15,11" /></g>,
    poussiere: <g fill="currentColor"><circle cx={3} cy={5} r={1} /><circle cx={7} cy={4} r={1.3} /><circle cx={12} cy={6} r={1} /><circle cx={5} cy={9} r={1.2} /><circle cx={10} cy={10} r={1.4} /><circle cx={13} cy={12} r={0.9} /><circle cx={4} cy={13} r={0.9} /></g>,
    brouillard: <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round"><path d="M2,5 H12 M4,8 H14 M2,11 H11" /></g>
  };
  return <svg width={taille} height={taille} viewBox="0 0 16 16" aria-hidden="true" className="icone-saison">{t[visuel]}</svg>;
}

export const COULEUR_SAISON: Record<VisuelSaison, string> = {
  aucun: 'var(--texte-3)', pluie: '#6fb3e0', mousson: '#5aa0d6', chaleur: '#f2a33a', neige: '#d8e8f2',
  boue: '#b08a5a', houle: '#5ec2d6', poussiere: '#d9b36a', brouillard: '#a9b6c0'
};

// Superposition animée sur une carte régionale (désactivée par prefers-reduced-motion via la feuille de style)
export function EffetSaison({ visuel, L, H, prefixe }: { visuel: VisuelSaison; L: number; H: number; prefixe: string }) {
  const id = (x: string) => prefixe + '-saison-' + x;
  const grand = { x: -60, y: -60, width: L + 120, height: H + 120 };
  switch (visuel) {
    case 'pluie': case 'mousson': {
      const dense = visuel === 'mousson';
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><pattern id={id('p')} width={dense ? 18 : 26} height={dense ? 26 : 34} patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path d="M4,0 L4,9 M13,15 L13,22" stroke="#9cc7e6" strokeWidth={1} opacity={dense ? 0.5 : 0.38} />
          </pattern></defs>
          {dense && <rect width={L} height={H} fill="#06121c" opacity={0.28} />}
          <rect {...grand} fill={`url(#${id('p')})`} className="anim-pluie" />
        </g>
      );
    }
    case 'neige':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><pattern id={id('p')} width={40} height={40} patternUnits="userSpaceOnUse">
            <circle cx={6} cy={8} r={1.3} fill="#e6f0f6" opacity={0.6} /><circle cx={26} cy={18} r={1} fill="#e6f0f6" opacity={0.5} /><circle cx={16} cy={33} r={1.5} fill="#e6f0f6" opacity={0.55} />
          </pattern></defs>
          <rect width={L} height={H} fill="#cfe2ee" opacity={0.07} />
          <rect {...grand} fill={`url(#${id('p')})`} className="anim-neige" />
        </g>
      );
    case 'chaleur':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><radialGradient id={id('g')} cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#ff9a2e" stopOpacity={0.16} /><stop offset="100%" stopColor="#ff6a00" stopOpacity={0.04} /></radialGradient></defs>
          <rect width={L} height={H} fill={`url(#${id('g')})`} className="anim-chaleur" />
        </g>
      );
    case 'boue':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><pattern id={id('p')} width={70} height={50} patternUnits="userSpaceOnUse">
            <ellipse cx={20} cy={14} rx={9} ry={2.5} fill="#5a4024" opacity={0.35} /><ellipse cx={52} cy={36} rx={12} ry={3} fill="#5a4024" opacity={0.3} />
          </pattern></defs>
          <rect width={L} height={H} fill="#6b4a26" opacity={0.12} />
          <rect width={L} height={H} fill={`url(#${id('p')})`} />
        </g>
      );
    case 'poussiere':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><pattern id={id('p')} width={60} height={60} patternUnits="userSpaceOnUse">
            {[[5, 9], [22, 30], [41, 12], [50, 47], [14, 52], [33, 44]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.9 + (i % 3) * 0.4} fill="#e2c07a" opacity={0.35} />)}
          </pattern></defs>
          <rect width={L} height={H} fill="#c79a4a" opacity={0.08} />
          <rect {...grand} fill={`url(#${id('p')})`} className="anim-poussiere" />
        </g>
      );
    case 'houle':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><pattern id={id('p')} width={80} height={36} patternUnits="userSpaceOnUse">
            <path d="M0,18 q10,-8 20,0 t20,0 t20,0 t20,0" fill="none" stroke="#7fd3e3" strokeWidth={1} opacity={0.3} />
          </pattern></defs>
          <rect {...grand} fill={`url(#${id('p')})`} className="anim-houle" />
        </g>
      );
    case 'brouillard':
      return (
        <g className="effet-saison" pointerEvents="none">
          <defs><linearGradient id={id('g')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d4dc" stopOpacity={0} /><stop offset="45%" stopColor="#c8d4dc" stopOpacity={0.13} /><stop offset="55%" stopColor="#c8d4dc" stopOpacity={0.13} /><stop offset="100%" stopColor="#c8d4dc" stopOpacity={0} />
          </linearGradient></defs>
          <rect x={0} y={H * 0.15} width={L} height={H * 0.3} fill={`url(#${id('g')})`} className="anim-brouillard" />
          <rect x={0} y={H * 0.55} width={L} height={H * 0.32} fill={`url(#${id('g')})`} className="anim-brouillard lent" />
        </g>
      );
    default: return null;
  }
}

// Effets de règle d'une saison, en phrases courtes (ce que la saison change concrètement)
export function decrireSaison(e: EffetsSaison): string[] {
  const r: string[] = [];
  const pc = (v: number) => (v > 1 ? '+' : '−') + Math.round(Math.abs(v - 1) * 100) + ' %';
  for (const c in e.pression || {}) { const v = e.pression![c as Categorie]!; if (v !== 1) r.push('Pression ' + CATEGORIES[c as Categorie].toLowerCase() + ' ' + pc(v)); }
  if (e.fatigue && e.fatigue !== 1) r.push('Fatigue ' + pc(e.fatigue));
  if (e.cout && e.cout !== 1) r.push('Coûts mensuels ' + pc(e.cout));
  for (const t in e.croissance || {}) r.push('Croissance ' + MT[t].nom + ' ' + pc(e.croissance![t]));
  if (e.frappesZoom) r.push('Frappes en crise ' + (e.frappesZoom > 0 ? '+' : '−') + Math.abs(e.frappesZoom) + ' par semaine');
  if (e.recosZoom) r.push('Reconnaissances en crise ' + (e.recosZoom > 0 ? '+' : '−') + Math.abs(e.recosZoom) + ' par semaine');
  return r;
}
