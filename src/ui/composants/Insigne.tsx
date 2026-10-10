// Insigne d'unité : création originale générée par code (écu, couleurs, symbole de spécialité, devise).
// Inspiré des conventions héraldiques militaires françaises, sans reproduire d'insigne officiel.
import { useId, type ReactElement } from 'react';
import { IDENTITES } from '../../data';
import type { InsigneDef, SymboleInsigne } from '../../sim';

const FORMES: Record<InsigneDef['forme'], string> = {
  ecu: 'M10,8 H90 V52 Q90,86 50,100 Q10,86 10,52 Z',
  ecu_pointe: 'M12,8 H88 V48 L50,102 L12,48 Z',
  rond: 'M50,6 A46,46 0 1,1 49.9,6 Z',
  losange: 'M50,4 L94,54 L50,104 L6,54 Z',
  insigne_aile: 'M50,10 C68,10 80,22 80,40 C80,66 62,86 50,98 C38,86 20,66 20,40 C20,22 32,10 50,10 Z'
};

function symbole(s: SymboleInsigne, c: string): ReactElement {
  const t = { fill: 'none', stroke: c, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (s) {
    case 'parachute': return <g {...t}><path d="M28,48 Q50,18 72,48 Q61,42 50,48 Q39,42 28,48 Z" fill={c} fillOpacity={0.25} /><path d="M28,48 L50,72 L72,48 M39,46 L50,72 L61,46" strokeWidth={1.6} /><circle cx={50} cy={74} r={3} fill={c} /></g>;
    case 'ancre': return <g {...t}><circle cx={50} cy={30} r={5} /><path d="M50,35 V76 M38,44 H62 M30,62 Q34,78 50,78 Q66,78 70,62 M30,62 L26,68 M70,62 L74,68" /></g>;
    case 'aile': return <g {...t}><path d="M50,64 C40,50 26,46 16,48 C28,54 34,58 38,64 C30,62 24,64 20,68 C32,68 42,68 50,70 C58,68 68,68 80,68 C76,64 70,62 62,64 C66,58 72,54 84,48 C74,46 60,50 50,64 Z" fill={c} fillOpacity={0.3} /></g>;
    case 'helice': return <g {...t}><circle cx={50} cy={52} r={5} fill={c} /><path d="M50,47 Q44,30 50,22 Q56,30 50,47 M54,55 Q70,60 74,70 Q62,70 54,55 M46,55 Q30,60 26,70 Q38,70 46,55" fill={c} fillOpacity={0.35} /></g>;
    case 'rotor': return <g {...t}><path d="M18,40 H82" strokeWidth={3.5} /><path d="M50,40 V48" /><path d="M36,56 Q50,46 66,54 L76,58 L66,62 Q50,70 38,64 Z" fill={c} fillOpacity={0.3} /><path d="M38,70 H62" strokeWidth={2} /></g>;
    case 'dague': return <g {...t}><path d="M50,18 L56,58 H44 Z" fill={c} fillOpacity={0.35} /><path d="M36,60 H64 M50,60 V78" /><circle cx={50} cy={82} r={3.5} fill={c} /></g>;
    case 'oeil': return <g {...t}><path d="M20,52 Q50,24 80,52 Q50,80 20,52 Z" /><circle cx={50} cy={52} r={10} fill={c} fillOpacity={0.35} /><circle cx={50} cy={52} r={4} fill={c} /></g>;
    case 'canon': return <g {...t}><path d="M22,70 L74,34" strokeWidth={6} /><circle cx={36} cy={70} r={9} /><circle cx={60} cy={70} r={9} /><path d="M74,34 L80,30" strokeWidth={8} /></g>;
    case 'roue': return <g {...t}><circle cx={50} cy={52} r={22} /><circle cx={50} cy={52} r={5} fill={c} /><path d="M50,30 V74 M28,52 H72 M34,36 L66,68 M66,36 L34,68" strokeWidth={1.8} /></g>;
    case 'bouclier': return <g {...t}><path d="M34,32 H66 V54 Q66,70 50,78 Q34,70 34,54 Z" fill={c} fillOpacity={0.25} /><path d="M50,36 V72 M38,50 H62" strokeWidth={2} /></g>;
    case 'etoile': return <g {...t}><path d="M50,24 L57,44 L78,44 L61,57 L67,78 L50,65 L33,78 L39,57 L22,44 L43,44 Z" fill={c} fillOpacity={0.35} /></g>;
    case 'eclair': return <g {...t}><path d="M56,20 L34,56 H50 L42,84 L68,44 H52 Z" fill={c} fillOpacity={0.5} /></g>;
    case 'trident': return <g {...t}><path d="M50,24 V80 M32,30 V44 Q32,54 50,54 Q68,54 68,44 V30 M28,34 L32,26 L36,34 M46,28 L50,20 L54,28 M64,34 L68,26 L72,34" /></g>;
    case 'onde': return <g {...t}><circle cx={50} cy={56} r={4} fill={c} /><path d="M38,46 Q34,56 38,66 M62,46 Q66,56 62,66 M28,38 Q20,56 28,74 M72,38 Q80,56 72,74" /></g>;
    case 'goutte': return <g {...t}><path d="M50,24 C40,42 34,52 34,60 A16,16 0 0,0 66,60 C66,52 60,42 50,24 Z" fill={c} fillOpacity={0.3} /><path d="M44,62 Q46,70 54,70" strokeWidth={2} /></g>;
    case 'tour': return <g {...t}><path d="M34,78 V40 H40 V34 H46 V40 H54 V34 H60 V40 H66 V78 Z" fill={c} fillOpacity={0.25} /><path d="M46,78 V62 Q50,56 54,62 V78" /></g>;
    case 'cible': return <g {...t}><circle cx={50} cy={52} r={22} /><circle cx={50} cy={52} r={12} /><circle cx={50} cy={52} r={3} fill={c} /><path d="M50,24 V36 M50,68 V80 M22,52 H34 M66,52 H78" strokeWidth={2} /></g>;
  }
}

export function Insigne({ unite, taille = 56, avecDevise = false }: { unite: string; taille?: number; avecDevise?: boolean }) {
  const I = IDENTITES[unite].insigne, id = useId().replace(/:/g, '');
  const d = FORMES[I.forme];
  return (
    <svg width={taille} height={taille * (avecDevise ? 1.28 : 1.08)} viewBox={`0 0 100 ${avecDevise ? 138 : 108}`} className="insigne" role="img" aria-label={'Insigne : ' + I.devise}>
      <defs>
        <clipPath id={'f' + id}><path d={d} /></clipPath>
        <linearGradient id={'r' + id} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity={0.22} /><stop offset="55%" stopColor="#fff" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.35} /></linearGradient>
      </defs>
      <g clipPath={`url(#f${id})`}>
        <rect width={100} height={108} fill={I.fond} />
        {I.bande && <path d="M-10,96 L96,-10 L112,6 L6,112 Z" fill={I.bande} opacity={0.85} />}
        {symbole(I.symbole, I.couleurSymbole)}
        <rect width={100} height={108} fill={`url(#r${id})`} />
      </g>
      <path d={d} fill="none" stroke={I.bordure} strokeWidth={4} />
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={1} transform="translate(50 54) scale(0.9) translate(-50 -54)" />
      {avecDevise && (
        <g>
          <path d="M4,112 Q50,124 96,112 L92,132 Q50,140 8,132 Z" fill="#e8dcc0" stroke="#7a6a48" strokeWidth={1} />
          <text x={50} y={128} textAnchor="middle" className="insigne-devise" {...(I.devise.length > 20 ? { textLength: 84, lengthAdjust: 'spacingAndGlyphs' } : {})}>{I.devise}</text>
        </g>
      )}
    </svg>
  );
}
