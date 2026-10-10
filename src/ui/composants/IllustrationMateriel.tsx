// Illustrations des matériels, dessinées par code en style « jeu vidéo » : silhouettes vectorielles,
// éclairage rasant, fond sombre. Aviation en vue de dessus (silhouette la plus reconnaissable),
// hélicoptères, véhicules et navires de profil. Aucune image externe.
import { useId, type ReactElement } from 'react';
import { MAT } from '../../data';

type Milieu = 'air' | 'terre' | 'mer';

// Symétrise un tracé de vue de dessus autour de l'axe y = 100 (la moitié supérieure est décrite)
function symetrique(moitie: [number, number][]): string {
  const bas = moitie.map(([x, y]) => [x, 200 - y] as [number, number]).reverse();
  return 'M' + [...moitie, ...bas].map(p => p.join(',')).join(' L') + ' Z';
}
const roue = (x: number, y: number, r: number, k: string) => (
  <g key={k}><circle cx={x} cy={y} r={r} fill="#101418" stroke="#4a545e" strokeWidth={1.2} /><circle cx={x} cy={y} r={r * 0.45} fill="#2a3138" stroke="#6b7782" strokeWidth={0.8} /></g>
);
const helice = (x: number, y: number, r: number, k: string) => (
  <g key={k}><ellipse cx={x} cy={y} rx={2.5} ry={r} fill="#9fb2c0" opacity={0.18} /><path d={`M${x},${y - r} L${x},${y + r}`} stroke="#c7d3dc" strokeWidth={0.8} opacity={0.5} /></g>
);
const rotor = (x: number, y: number, l: number) => (
  <g><ellipse cx={x} cy={y} rx={l} ry={5} fill="#9fb2c0" opacity={0.12} /><path d={`M${x - l},${y} L${x + l},${y}`} stroke="#cbd6de" strokeWidth={1.4} opacity={0.55} /><rect x={x - 3} y={y} width={6} height={10} fill="#3a434c" /></g>
);

interface Dessin { milieu: Milieu; profil?: boolean; formes: (m: string) => ReactElement }

const DESSINS: Record<string, Dessin> = {
  // ---------- Aviation, vue de dessus (nez à droite) ----------
  RAFALE: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[358, 100], [336, 96], [300, 92], [258, 90], [252, 88], [150, 12], [128, 12], [128, 90], [90, 92], [64, 93], [60, 100]])} fill={m} />
      <path d={symetrique([[272, 90], [252, 60], [242, 61], [252, 90]])} fill={m} />
      <path d="M300,96 Q318,100 300,104 L268,103 L268,97 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M70,100 L126,100" stroke="#0b0f13" strokeWidth={3} />
      <path d="M150,12 L128,12 M150,188 L128,188" stroke="#e8eef2" strokeWidth={1.2} opacity={0.6} />
    </g>) },
  M2000D: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[372, 100], [350, 97], [300, 92], [270, 90], [128, 20], [114, 20], [114, 92], [72, 94], [66, 100]])} fill={m} />
      <path d="M372,100 L392,99" stroke="#9aa6b0" strokeWidth={1.4} />
      <path d="M318,96 Q338,100 318,104 L282,103 L282,97 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M78,100 L118,100" stroke="#0b0f13" strokeWidth={3} />
      <path d="M200,62 L196,58 M200,138 L196,142" stroke="#c9d1d8" strokeWidth={2.2} />
    </g>) },
  REAPER: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[330, 100], [322, 92], [300, 92], [222, 94], [222, 8], [208, 8], [204, 94], [140, 96], [128, 70], [118, 70], [124, 97], [114, 98]])} fill={m} />
      <circle cx={322} cy={108} r={7} fill="#1b232a" stroke="#6fb6d6" strokeWidth={0.8} />
      {helice(110, 100, 16, 'h')}
    </g>) },
  A400M: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[352, 100], [340, 86], [300, 80], [236, 80], [214, 6], [194, 6], [190, 80], [100, 82], [86, 44], [70, 44], [74, 86], [60, 94], [56, 100]])} fill={m} />
      {[46, 74, 126, 154].map((y, i) => <g key={i}><rect x={212} y={y - 5} width={44} height={10} rx={4} fill={m} />{helice(258, y, 14, 'p' + i)}</g>)}
      <path d="M340,94 Q348,100 340,106" stroke="#6fb6d6" strokeWidth={1.2} fill="none" />
    </g>) },
  C135FR: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[356, 100], [344, 92], [300, 90], [236, 90], [158, 10], [140, 10], [176, 90], [98, 92], [74, 52], [60, 52], [70, 93], [56, 98]])} fill={m} />
      {[60, 34, 140, 166].map((y, i) => <rect key={i} x={i % 2 ? 176 : 200} y={y - 4} width={28} height={8} rx={3.5} fill="#2c343c" stroke="#8d99a3" strokeWidth={0.6} />)}
      <path d="M56,100 L22,100" stroke="#9aa6b0" strokeWidth={2.4} />
    </g>) },
  ATL2: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[350, 100], [338, 90], [300, 88], [226, 88], [222, 8], [204, 8], [200, 88], [104, 92], [94, 56], [80, 56], [82, 94], [60, 96]])} fill={m} />
      <path d="M60,100 L30,100" stroke="#9aa6b0" strokeWidth={3} />
      {[54, 146].map((y, i) => <g key={i}><rect x={206} y={y - 6} width={40} height={12} rx={5} fill={m} />{helice(248, y, 16, 'p' + i)}</g>)}
    </g>) },
  E3F: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[356, 100], [344, 92], [300, 90], [236, 90], [158, 10], [140, 10], [176, 90], [98, 92], [74, 52], [60, 52], [70, 93], [56, 98]])} fill={m} />
      {[60, 34, 140, 166].map((y, i) => <rect key={i} x={i % 2 ? 176 : 200} y={y - 4} width={28} height={8} rx={3.5} fill="#2c343c" stroke="#8d99a3" strokeWidth={0.6} />)}
      <circle cx={140} cy={100} r={36} fill="#232b33" stroke="#c9d3db" strokeWidth={1.4} />
      <path d="M104,100 L176,100" stroke="#e5484d" strokeWidth={6} opacity={0.75} />
      <circle cx={140} cy={100} r={36} fill="url(#reflet-disque)" />
    </g>) },
  C160G: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[342, 100], [330, 90], [292, 87], [220, 87], [216, 10], [200, 10], [196, 87], [102, 90], [94, 54], [78, 54], [80, 92], [62, 96]])} fill={m} />
      {[56, 144].map((y, i) => <g key={i}><rect x={204} y={y - 6} width={38} height={12} rx={5} fill={m} />{helice(244, y, 15, 'p' + i)}</g>)}
      {[14, 186].map((y, i) => <rect key={'w' + i} x={196} y={y - 4} width={24} height={8} rx={4} fill="#2c343c" stroke="#8d99a3" strokeWidth={0.6} />)}
      <path d="M260,90 L262,82 M240,90 L242,84 M150,90 L152,84" stroke="#c9d3db" strokeWidth={1.2} />
    </g>) },
  // ---------- Hélicoptères, de profil ----------
  TIGRE: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M318,112 Q330,118 316,126 L250,132 L210,128 L150,118 L70,112 L60,96 L72,96 L82,108 L150,106 L196,98 L236,92 L262,90 Q292,92 318,112 Z" fill={m} />
      <path d="M262,92 Q284,94 304,110 L270,108 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M232,94 Q248,90 258,98 L238,104 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M196,116 L240,116 L246,122 L196,122 Z" fill="#2c343c" />
      {[200, 226].map((x, i) => <rect key={i} x={x} y={122} width={16} height={8} rx={3} fill="#1b2228" stroke="#7a8590" strokeWidth={0.6} />)}
      <path d="M318,122 L334,126" stroke="#9aa6b0" strokeWidth={3} />
      <circle cx={66} cy={96} r={14} fill="none" stroke="#c9d3db" strokeWidth={0.8} opacity={0.4} />
      {rotor(220, 80, 140)}
    </g>) },
  CAIMAN: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M322,118 Q326,138 300,142 L196,144 L170,138 L90,118 L66,86 L82,86 L100,110 L170,108 L190,96 L262,92 Q314,94 322,118 Z" fill={m} />
      <path d="M276,96 Q308,98 318,116 L282,114 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <rect x={210} y={108} width={46} height={26} rx={3} fill="#1f262d" stroke="#7a8590" strokeWidth={0.8} />
      {[196, 288].map((x, i) => roue(x, 150, 7, 'r' + i))}
      <circle cx={74} cy={88} r={16} fill="none" stroke="#c9d3db" strokeWidth={0.8} opacity={0.4} />
      {rotor(226, 82, 150)}
    </g>) },
  GAZELLE: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M296,112 Q306,138 270,140 L220,138 L200,124 L110,118 L96,96 L84,96 L86,128 L104,128 L200,132 L206,104 L236,92 Q286,92 296,112 Z" fill={m} />
      <path d="M240,96 Q286,94 294,114 Q290,132 262,134 L246,130 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} opacity={0.95} />
      <circle cx={95} cy={114} r={10} fill="#1b2228" stroke="#8d99a3" strokeWidth={1} />
      <path d="M210,146 L290,146" stroke="#7a8590" strokeWidth={2.5} />
      {rotor(224, 82, 120)}
    </g>) },
  CARACAL: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M330,118 Q332,140 304,144 L192,146 L164,140 L88,120 L62,84 L80,84 L98,112 L166,110 L186,98 L266,92 Q322,94 330,118 Z" fill={m} />
      <path d="M282,96 Q316,98 326,116 L288,114 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M296,102 L350,96" stroke="#9aa6b0" strokeWidth={2.4} />
      <path d="M200,132 L262,132 L268,146 L196,146 Z" fill="#2a3138" />
      {[190, 300].map((x, i) => roue(x, 152, 7, 'r' + i))}
      <circle cx={70} cy={86} r={18} fill="none" stroke="#c9d3db" strokeWidth={0.8} opacity={0.4} />
      {rotor(226, 82, 156)}
    </g>) },
  // ---------- Terre, de profil ----------
  CAESAR: { milieu: 'terre', formes: m => (
    <g>
      <path d="M300,140 L300,104 L326,104 L344,120 L346,140 Z" fill={m} />
      <path d="M306,108 L322,108 L336,120 L306,120 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M70,140 L70,124 L296,124 L296,140 Z" fill={m} />
      <path d="M120,124 L136,108 L196,108 L208,124 Z" fill={m} />
      <path d="M128,124 L140,104 L176,104 L184,124 Z" fill={m} />
      <path d="M150,108 L350,102" stroke="#aab4bc" strokeWidth={5} strokeLinecap="round" />
      <path d="M346,102 L364,101.5" stroke="#cbd4da" strokeWidth={8} strokeLinecap="round" />
      <path d="M62,128 L48,152 L58,152 L72,132 Z" fill="#2c343c" />
      {[110, 148, 316].map((x, i) => roue(x, 148, 13, 'r' + i))}
    </g>) },
  VBCI: { milieu: 'terre', formes: m => (
    <g>
      <path d="M70,142 L66,110 L90,96 L300,96 L336,116 L338,142 Z" fill={m} />
      <path d="M170,96 L178,80 L232,80 L240,96 Z" fill={m} />
      <path d="M232,86 L320,84" stroke="#aab4bc" strokeWidth={4} strokeLinecap="round" />
      <path d="M300,100 L330,116" stroke="#cbd4da" strokeWidth={1} opacity={0.5} />
      {[100, 150, 236, 286].map((x, i) => roue(x, 146, 15, 'r' + i))}
    </g>) },
  VAB: { milieu: 'terre', formes: m => (
    <g>
      <path d="M90,140 L88,100 L104,90 L268,90 L312,112 L316,140 Z" fill={m} />
      <path d="M270,94 L304,112 L270,112 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M150,90 L156,82 L180,82 L184,90" fill={m} />
      <path d="M170,84 L214,82" stroke="#aab4bc" strokeWidth={2} />
      {[130, 268].map((x, i) => roue(x, 144, 17, 'r' + i))}
    </g>) },
  VBL: { milieu: 'terre', formes: m => (
    <g>
      <path d="M120,140 L118,112 L150,102 L240,100 L290,118 L298,140 Z" fill={m} />
      <path d="M246,104 L282,118 L244,118 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M190,100 L194,90 L214,90 L216,100 Z" fill={m} />
      <path d="M210,92 L246,88" stroke="#aab4bc" strokeWidth={2} />
      {[156, 260].map((x, i) => roue(x, 144, 15, 'r' + i))}
    </g>) },
  // ---------- Mer, de profil (ligne de flottaison y = 136) ----------
  CDG: { milieu: 'mer', formes: m => (
    <g>
      <path d="M30,96 L372,96 L360,112 L346,136 L60,136 L44,116 Z" fill={m} />
      <path d="M30,96 L372,96" stroke="#d6dee4" strokeWidth={1.4} />
      <path d="M232,96 L234,64 L262,62 L270,74 L272,96 Z" fill={m} />
      <path d="M248,62 L248,40 M240,48 L258,48 M252,54 L266,52" stroke="#aab4bc" strokeWidth={1.6} />
      <rect x={238} y={70} width={26} height={5} fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.6} />
      {[90, 130, 170, 300, 330].map((x, i) => <path key={i} d={`M${x},94 l12,-3 l6,0 l-6,3 l12,0 l2,-3 l3,0 l-1,3 Z`} fill="#8d99a3" />)}
    </g>) },
  FREMM: { milieu: 'mer', formes: m => (
    <g>
      <path d="M50,112 L340,112 L362,104 L352,124 L332,136 L70,136 L56,124 Z" fill={m} />
      <path d="M90,112 L96,92 L150,92 L156,112 Z" fill={m} />
      <path d="M170,112 L178,88 L250,88 L262,112 Z" fill={m} />
      <path d="M196,88 L206,48 L222,48 L232,88 Z" fill={m} stroke="#aab4bc" strokeWidth={0.8} />
      <path d="M210,48 L214,30 L218,48" stroke="#aab4bc" strokeWidth={1.4} fill="none" />
      <path d="M300,112 L304,104 L318,104 L322,112 Z M318,107 L338,104" fill={m} stroke="#aab4bc" strokeWidth={1.2} />
    </g>) },
  HORIZON: { milieu: 'mer', formes: m => (
    <g>
      <path d="M50,112 L340,112 L364,104 L352,124 L332,136 L70,136 L56,124 Z" fill={m} />
      <path d="M100,112 L104,90 L160,90 L166,112 Z" fill={m} />
      <path d="M180,112 L186,84 L262,84 L270,112 Z" fill={m} />
      <path d="M226,84 L230,56 L240,56 L244,84 Z" fill={m} />
      <circle cx={235} cy={48} r={11} fill="#cfd8df" stroke="#8d99a3" strokeWidth={1} />
      <path d="M128,90 L130,62 L136,62 L138,90 Z M126,60 L140,60" fill={m} stroke="#aab4bc" strokeWidth={1.2} />
      <path d="M298,112 L302,104 L316,104 L320,112 Z M316,107 L336,104" fill={m} stroke="#aab4bc" strokeWidth={1.2} />
    </g>) },
  RUBIS: { milieu: 'mer', formes: m => (
    <g>
      <path d="M60,124 Q60,112 90,110 L320,110 Q352,112 356,124 Q352,136 320,138 L90,138 Q60,136 60,124 Z" fill={m} />
      <path d="M232,110 L238,82 L270,82 L272,110 Z" fill={m} />
      <path d="M242,82 L242,66 M252,82 L252,60 M262,82 L262,70" stroke="#aab4bc" strokeWidth={1.6} />
      <path d="M62,124 L44,112 L48,124 L44,136 Z" fill={m} />
    </g>) },
  MISTRAL: { milieu: 'mer', formes: m => (
    <g>
      <path d="M34,84 L366,84 L360,104 L346,136 L60,136 L40,110 Z" fill={m} />
      <path d="M34,84 L366,84" stroke="#d6dee4" strokeWidth={1.4} />
      <path d="M248,84 L250,54 L290,54 L296,84 Z" fill={m} />
      <path d="M268,54 L268,32 M260,40 L278,40" stroke="#aab4bc" strokeWidth={1.6} />
      <rect x={254} y={60} width={34} height={5} fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.6} />
      {[90, 150, 200].map((x, i) => <g key={i}><path d={`M${x - 14},80 L${x + 14},80`} stroke="#8d99a3" strokeWidth={1.2} /><rect x={x - 8} y={76} width={16} height={6} rx={2} fill="#8d99a3" /></g>)}
      <path d="M60,118 L340,118" stroke="#0d1a24" strokeWidth={2} opacity={0.6} />
    </g>) },
  EMBARCATION: { milieu: 'mer', formes: m => (
    <g>
      <path d="M110,128 L290,124 Q320,122 330,112 L300,112 L120,116 Z" fill={m} />
      <path d="M118,116 Q110,130 126,134 L290,130 Q318,128 326,116" fill="none" stroke="#2c343c" strokeWidth={8} strokeLinecap="round" />
      <path d="M200,112 L206,98 L232,98 L236,112 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M112,112 L104,132 L114,132 Z" fill="#2c343c" />
      <path d="M100,134 Q60,140 20,136 M104,138 Q70,146 30,146" stroke="#cfe6f2" strokeWidth={1.4} opacity={0.5} fill="none" />
    </g>) },
  // ---------- Royaume-Uni ----------
  TYPHOON: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[362, 100], [340, 97], [296, 93], [262, 92], [256, 90], [140, 14], [122, 14], [118, 90], [86, 92], [62, 94], [58, 100]])} fill={m} />
      <path d={symetrique([[318, 95], [300, 70], [292, 70], [298, 95]])} fill={m} />
      <path d="M318,96 Q334,100 318,104 L286,103 L286,97 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M66,96 L118,96 M66,104 L118,104" stroke="#0b0f13" strokeWidth={2.6} />
      <path d="M140,14 L122,14 M140,186 L122,186" stroke="#e8eef2" strokeWidth={1.2} opacity={0.6} />
    </g>) },
  TORNADO: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[366, 100], [344, 96], [300, 92], [236, 90], [214, 88], [150, 30], [136, 32], [176, 88], [104, 90], [96, 50], [80, 50], [82, 92], [56, 96], [52, 100]])} fill={m} />
      <path d="M326,96 Q342,100 326,104 L292,103 L292,97 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M60,96 L100,96 M60,104 L100,104" stroke="#0b0f13" strokeWidth={3} />
      {[64, 136].map((y, i) => <rect key={i} x={180} y={y - 3} width={34} height={6} rx={3} fill="#2c343c" stroke="#8d99a3" strokeWidth={0.6} />)}
    </g>) },
  C17: { milieu: 'air', formes: m => (
    <g>
      <path d={symetrique([[356, 100], [344, 84], [300, 78], [240, 78], [198, 6], [180, 6], [190, 78], [96, 80], [74, 38], [56, 38], [64, 84], [52, 96]])} fill={m} />
      {[40, 64, 136, 160].map((y, i) => <rect key={i} x={i === 0 || i === 3 ? 206 : 220} y={y - 5} width={30} height={10} rx={4.5} fill="#2c343c" stroke="#8d99a3" strokeWidth={0.6} />)}
      <path d="M342,92 Q350,100 342,108" stroke="#6fb6d6" strokeWidth={1.2} fill="none" />
    </g>) },
  CHINOOK: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M330,122 Q334,142 308,144 L96,144 Q70,142 66,120 L70,96 L96,90 L300,90 Q326,96 330,122 Z" fill={m} />
      <path d="M300,94 Q320,100 326,118 L298,116 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M70,96 L76,66 L104,66 L110,90 Z" fill={m} />
      {[120, 160, 200, 240].map((x, i) => <rect key={i} x={x} y={104} width={14} height={10} rx={2} fill="#1b2228" stroke="#7a8590" strokeWidth={0.6} />)}
      {[110, 290].map((x, i) => roue(x, 150, 7, 'r' + i))}
      {rotor(90, 60, 110)}
      {rotor(300, 82, 110)}
    </g>) },
  APACHE: { milieu: 'air', profil: true, formes: m => (
    <g>
      <path d="M314,116 Q326,124 312,130 L250,134 L210,130 L150,120 L72,114 L62,96 L74,96 L84,110 L150,108 L194,100 L236,92 L264,92 Q290,96 314,116 Z" fill={m} />
      <path d="M262,96 Q282,98 296,112 L268,110 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M236,96 Q248,92 256,100 L240,104 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <circle cx={228} cy={80} r={9} fill="#2a3138" stroke="#8d99a3" strokeWidth={0.8} />
      <path d="M190,118 L246,118 L250,126 L190,126 Z" fill="#2c343c" />
      {[194, 222].map((x, i) => <rect key={i} x={x} y={126} width={18} height={7} rx={3} fill="#1b2228" stroke="#7a8590" strokeWidth={0.6} />)}
      <path d="M300,130 L300,140 M318,130 L322,138" stroke="#9aa6b0" strokeWidth={2.4} />
      {roue(140, 144, 6, 'rq')}{roue(280, 146, 7, 'rv')}
      {rotor(222, 72, 136)}
    </g>) },
  JACKAL: { milieu: 'terre', formes: m => (
    <g>
      <path d="M96,138 L94,116 L130,108 L250,106 L300,116 L308,138 Z" fill={m} />
      <path d="M150,108 L162,88 L240,88 L246,106" fill="none" stroke="#8d99a3" strokeWidth={2.4} />
      <path d="M232,90 L276,86" stroke="#aab4bc" strokeWidth={3} strokeLinecap="round" />
      <rect x={224} y={84} width={14} height={10} fill="#2c343c" />
      {[132, 270].map((x, i) => roue(x, 142, 17, 'r' + i))}
    </g>) },
  WARRIOR: { milieu: 'terre', formes: m => (
    <g>
      <path d="M66,134 L70,104 L94,92 L300,92 L332,112 L336,134 Z" fill={m} />
      <path d="M176,92 L184,74 L238,74 L246,92 Z" fill={m} />
      <path d="M238,82 L314,80" stroke="#aab4bc" strokeWidth={4} strokeLinecap="round" />
      <rect x={66} y={132} width={272} height={20} rx={10} fill="#14191e" stroke="#4a545e" strokeWidth={1.2} />
      {[92, 136, 180, 224, 268, 312].map((x, i) => <circle key={i} cx={x} cy={142} r={7} fill="#2a3138" stroke="#6b7782" strokeWidth={0.8} />)}
    </g>) },
  M270: { milieu: 'terre', formes: m => (
    <g>
      <path d="M260,132 L262,100 L300,100 L326,118 L328,132 Z" fill={m} />
      <path d="M268,104 L296,104 L314,118 L268,118 Z" fill="#0d1a24" stroke="#6fb6d6" strokeWidth={0.8} />
      <path d="M74,132 L74,112 L258,112 L258,132 Z" fill={m} />
      <path d="M86,112 L96,76 L232,62 L240,98 Z" fill={m} stroke="#aab4bc" strokeWidth={0.8} />
      {[0, 1, 2].map(i => <path key={i} d={`M104,${86 - i * 6} L228,${72 - i * 4}`} stroke="#0b0f13" strokeWidth={1} opacity={0.6} />)}
      <rect x={70} y={130} width={262} height={20} rx={10} fill="#14191e" stroke="#4a545e" strokeWidth={1.2} />
      {[94, 138, 182, 226, 270, 310].map((x, i) => <circle key={i} cx={x} cy={140} r={7} fill="#2a3138" stroke="#6b7782" strokeWidth={0.8} />)}
    </g>) }
};

// Substituts en attendant l’art : un matériel proche, de même silhouette générale (voir docs/illustrations.md)
const ALIAS: Record<string, string> = {
  VOYAGER: 'C135FR', SENTINEL: 'C135FR', RC135W: 'C135FR', E3D: 'E3F', FOXHOUND: 'VAB',
  TYPE45: 'HORIZON', TYPE23: 'FREMM', ASTUTE: 'RUBIS', CLASSE_ALBION: 'MISTRAL'
};
for (const k in ALIAS) DESSINS[k] = DESSINS[ALIAS[k]];

function Fond({ milieu, profil, id }: { milieu: Milieu; profil: boolean; id: string }) {
  if (milieu === 'air' && !profil) return (
    <g>
      <rect width={400} height={200} fill="#0b1219" />
      <rect width={400} height={200} fill={`url(#sol${id})`} />
      {[[60, 40, 70, 18], [300, 150, 90, 22], [150, 170, 60, 12], [340, 40, 50, 14], [30, 150, 40, 10]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#cfdde8" opacity={0.06} filter={`url(#flou${id})`} />)}
    </g>
  );
  if (milieu === 'air') return (
    <g>
      <rect width={400} height={200} fill={`url(#ciel${id})`} />
      <ellipse cx={200} cy={210} rx={260} ry={60} fill="#e8833a" opacity={0.14} />
      {[[30, 40, 140], [240, 160, 120], [90, 176, 90], [280, 30, 100]].map(([x, y, l], i) => <path key={i} d={`M${x},${y} h${l}`} stroke="#9fb7c8" strokeWidth={1} opacity={0.12} />)}
    </g>
  );
  if (milieu === 'terre') return (
    <g>
      <rect width={400} height={200} fill={`url(#ciel${id})`} />
      <rect y={150} width={400} height={50} fill="#17140f" />
      <path d="M0,150 Q100,144 200,150 T400,148" fill="none" stroke="#5a4a32" strokeWidth={1} opacity={0.6} />
      <ellipse cx={200} cy={156} rx={180} ry={8} fill="#000" opacity={0.45} />
      <rect y={128} width={400} height={30} fill="#c79a4a" opacity={0.05} />
    </g>
  );
  return (
    <g>
      <rect width={400} height={200} fill={`url(#ciel${id})`} />
      <rect y={136} width={400} height={64} fill="#07121c" />
      {[142, 152, 166, 182].map((y, i) => <path key={i} d={`M${20 + i * 30},${y} h${300 - i * 40}`} stroke="#6fb6d6" strokeWidth={1} opacity={0.12 - i * 0.02} />)}
      <path d="M30,136 L370,136" stroke="#8fc6dc" strokeWidth={0.8} opacity={0.35} />
    </g>
  );
}

export function IllustrationMateriel({ id, largeur = 240 }: { id: string; largeur?: number }) {
  const uid = useId().replace(/:/g, '');
  const D = DESSINS[id];
  if (!D) return null;
  const dessus = D.milieu === 'air' && !D.profil;
  const ombre = dessus ? 'translate(14 18)' : 'translate(0 3)';
  const halo = D.milieu === 'terre' ? '#c06a2a' : D.milieu === 'mer' ? '#2d7896' : dessus ? '#3d7aa8' : '#c9783a';
  return (
    <svg width={largeur} height={largeur / 2} viewBox="0 0 400 200" className="illustration" role="img" aria-label={MAT[id]?.nom}>
      <defs>
        <linearGradient id={'ciel' + uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080d13" /><stop offset="70%" stopColor={D.milieu === 'mer' ? '#0f2030' : D.milieu === 'terre' ? '#1d1c1b' : '#132231'} /><stop offset="100%" stopColor="#1c2a36" />
        </linearGradient>
        <linearGradient id={'metal' + uid} gradientUnits="userSpaceOnUse" x1="120" y1="20" x2="190" y2="185">
          <stop offset="0%" stopColor="#b9c3cb" /><stop offset="35%" stopColor="#66717a" /><stop offset="70%" stopColor="#353d44" /><stop offset="100%" stopColor="#171c21" />
        </linearGradient>
        <linearGradient id={'rim' + uid} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="150">
          <stop offset="0%" stopColor="#ffe7c2" stopOpacity={0.95} /><stop offset="55%" stopColor="#ffd9a0" stopOpacity={0.25} /><stop offset="100%" stopColor="#ffd9a0" stopOpacity={0} />
        </linearGradient>
        <radialGradient id={'halo' + uid} cx="50%" cy="55%" r="55%"><stop offset="0%" stopColor={halo} stopOpacity={0.42} /><stop offset="100%" stopColor={halo} stopOpacity={0} /></radialGradient>
        <radialGradient id={'sol' + uid} cx="55%" cy="45%" r="70%"><stop offset="0%" stopColor="#1d2d3c" /><stop offset="100%" stopColor="#070b10" /></radialGradient>
        <radialGradient id="reflet-disque" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="#fff" stopOpacity={0.25} /><stop offset="100%" stopColor="#fff" stopOpacity={0} /></radialGradient>
        <filter id={'flou' + uid}><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <Fond milieu={D.milieu} profil={!!D.profil} id={uid} />
      <rect width={400} height={200} fill={`url(#halo${uid})`} />
      <g transform={ombre} opacity={dessus ? 0.55 : 0.35} filter={`url(#flou${uid})`}>{D.formes('#000')}</g>
      <g>{D.formes(`url(#metal${uid})`)}</g>
      <g stroke={`url(#rim${uid})`} strokeWidth={1.3} strokeLinejoin="round">{D.formes('none')}</g>
    </svg>
  );
}

export const MATERIELS_ILLUSTRES = Object.keys(DESSINS);
