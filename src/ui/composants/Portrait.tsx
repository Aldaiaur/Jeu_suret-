// Portrait générique d'un personnage fictif, dessiné par code : buste stylisé, sans traits individuels.
import { useId } from 'react';
import { PERS } from '../../data';

const TENUES = {
  costume: { veste: '#1f2833', col: '#e8e6e0', cravate: '#5a1f24' },
  tailleur: { veste: '#2a2f3a', col: '#d9d4cc', cravate: null },
  terre: { veste: '#3b4532', col: '#5a6448', cravate: '#2a3020' },
  air: { veste: '#26344a', col: '#9fb1c6', cravate: '#18202c' },
  mer: { veste: '#151c2a', col: '#e8e6e0', cravate: '#151c2a' },
  gendarmerie: { veste: '#1d2840', col: '#c9ccd2', cravate: '#111827' }
} as const;

export function Portrait({ id, taille = 64 }: { id: string; taille?: number }) {
  const p = PERS[id]?.portrait, uid = useId().replace(/:/g, '');
  if (!p) return null;
  const t = TENUES[p.tenue];
  const cheveux: Record<typeof p.coupe, string> = {
    court: 'M31,30 Q32,14 50,13 Q68,14 69,30 Q66,22 50,21 Q34,22 31,30 Z',
    raie: 'M30,32 Q30,13 50,12 Q70,13 70,32 Q68,22 56,20 Q44,24 33,24 Q31,27 30,32 Z',
    chignon: 'M30,34 Q29,13 50,12 Q71,13 70,34 Q67,21 50,20 Q33,21 30,34 Z M58,10 a7,6 0 1,1 0.1,0 Z',
    degarni: 'M31,34 Q30,24 35,21 Q34,28 33,34 Z M69,34 Q70,24 65,21 Q66,28 67,34 Z',
    long: 'M29,52 Q26,14 50,12 Q74,14 71,52 Q70,40 68,30 Q62,20 50,20 Q38,20 32,30 Q30,40 29,52 Z',
    ras: 'M32,28 Q34,15 50,14 Q66,15 68,28 Q62,20 50,19 Q38,20 32,28 Z',
    carre: 'M29,44 Q27,13 50,12 Q73,13 71,44 L68,44 Q68,24 50,21 Q32,24 32,44 Z'
  };
  return (
    <svg width={taille} height={taille} viewBox="0 0 100 100" className="portrait" role="img" aria-label={'Portrait de ' + PERS[id].nom}>
      <defs>
        <radialGradient id={'f' + uid} cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#24313e" /><stop offset="100%" stopColor="#0c1218" /></radialGradient>
        <linearGradient id={'l' + uid} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#000" stopOpacity={0.35} /><stop offset="45%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#ffd9a0" stopOpacity={0.12} /></linearGradient>
      </defs>
      <rect width={100} height={100} rx={8} fill={`url(#f${uid})`} />
      {/* Buste et tenue */}
      <path d="M14,100 Q16,72 36,66 L50,72 L64,66 Q84,72 86,100 Z" fill={t.veste} />
      <path d="M40,64 L50,76 L60,64 L56,62 L50,68 L44,62 Z" fill={t.col} />
      {t.cravate && <path d="M48,70 L52,70 L54,90 L50,94 L46,90 Z" fill={t.cravate} />}
      {p.etoiles ? Array.from({ length: Math.min(5, p.etoiles) }, (_, i) => <circle key={i} cx={22 + i * 3.4} cy={78 - i * 1.2} r={1.3} fill="#d9b85a" />) : null}
      {(p.tenue === 'terre' || p.tenue === 'air' || p.tenue === 'mer') && <path d="M18,80 L30,74" stroke="#d9b85a" strokeWidth={1.2} opacity={0.7} />}
      {/* Cou et visage */}
      <path d="M43,52 L43,64 Q50,70 57,64 L57,52 Z" fill={p.teint} />
      <ellipse cx={50} cy={38} rx={18} ry={22} fill={p.teint} />
      <ellipse cx={32.5} cy={40} rx={2.5} ry={4} fill={p.teint} /><ellipse cx={67.5} cy={40} rx={2.5} ry={4} fill={p.teint} />
      {p.barbe && <path d="M33,42 Q34,60 50,61 Q66,60 67,42 Q64,54 50,55 Q36,54 33,42 Z" fill={p.cheveux} opacity={0.85} />}
      <path d={cheveux[p.coupe]} fill={p.cheveux} />
      {/* Traits stylisés */}
      <path d="M41,37 h5 M54,37 h5" stroke="#2a1d16" strokeWidth={1.6} strokeLinecap="round" opacity={0.75} />
      <path d="M50,40 L48.5,46 L51,46.5" stroke="#000" strokeOpacity={0.2} strokeWidth={1} fill="none" />
      <path d="M45,51 Q50,53 55,51" stroke="#5a2e26" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.6} />
      {p.lunettes && <g fill="none" stroke="#1a1f24" strokeWidth={1.2}><rect x={38.5} y={33.5} width={9} height={7} rx={2} /><rect x={52.5} y={33.5} width={9} height={7} rx={2} /><path d="M47.5,36.5 h5" /></g>}
      <rect width={100} height={100} rx={8} fill={`url(#l${uid})`} />
    </svg>
  );
}
