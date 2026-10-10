// Drapeaux simplifiés des nations jouables, dessinés en SVG (aucune ressource externe).
export type NationJouable = 'FRA' | 'USA' | 'GBR' | 'RUS' | 'CHN' | 'ISR';

export function Drapeau({ nation, taille = 14 }: { nation: NationJouable; taille?: number }) {
  const w = taille * 1.5, h = taille;
  const corps = (() => {
    switch (nation) {
      case 'FRA': return <><rect width="10" height="20" fill="#0055a4" /><rect x="10" width="10" height="20" fill="#fff" /><rect x="20" width="10" height="20" fill="#ef4135" /></>;
      case 'RUS': return <><rect width="30" height="6.67" fill="#fff" /><rect y="6.67" width="30" height="6.67" fill="#0039a6" /><rect y="13.33" width="30" height="6.67" fill="#d52b1e" /></>;
      case 'CHN': return <><rect width="30" height="20" fill="#de2910" /><polygon points="5,2.5 5.9,5.2 8.7,5.2 6.4,6.8 7.3,9.5 5,7.9 2.7,9.5 3.6,6.8 1.3,5.2 4.1,5.2" fill="#ffde00" /></>;
      case 'ISR': return <><rect width="30" height="20" fill="#fff" /><rect y="2.5" width="30" height="2.5" fill="#0038b8" /><rect y="15" width="30" height="2.5" fill="#0038b8" /><polygon points="15,6.4 18.2,12 11.8,12" fill="none" stroke="#0038b8" strokeWidth="0.9" /><polygon points="15,13.6 18.2,8 11.8,8" fill="none" stroke="#0038b8" strokeWidth="0.9" /></>;
      case 'GBR': return <><rect width="30" height="20" fill="#012169" /><path d="M0,0 30,20 M30,0 0,20" stroke="#fff" strokeWidth="4" /><path d="M0,0 30,20 M30,0 0,20" stroke="#c8102e" strokeWidth="1.6" /><path d="M15,0 v20 M0,10 h30" stroke="#fff" strokeWidth="6" /><path d="M15,0 v20 M0,10 h30" stroke="#c8102e" strokeWidth="3.4" /></>;
      case 'USA': return <>{Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 20 / 6.5} width="30" height={20 / 13} fill="#b22234" />)}<rect width="13" height="10.8" fill="#3c3b6e" /></>;
    }
  })();
  return (
    <svg className="drapeau" width={w} height={h} viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">
      <defs><clipPath id={'cd-' + nation}><rect width="30" height="20" rx="2" /></clipPath></defs>
      <g clipPath={`url(#cd-${nation})`}>{corps}</g>
    </svg>
  );
}
