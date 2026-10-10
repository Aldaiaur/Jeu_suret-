// Vue régionale d'un théâtre, consultable à tout moment : biome, saison, lieux réels, liaisons et forces engagées.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BIOMES, CARTES_REGIONALES, MT, TH, THEATRES, UNITES } from '../../data';
import { saisonDu, dateDuTour } from '../../sim';
import { usePartie } from '../contexte';
import { FondRegional, projectionRegionale, type Cadre } from '../composants/FondRegional';
import { COULEUR_SAISON, EffetSaison, IconeSaison, decrireSaison } from '../composants/Saison';
import { COULEURS_CATEGORIE, couleurNiveau } from '../format';
import { placerEtiquettes } from '../composants/etiquettes';

const LIBELLE_CONTROLE = { allie: 'tenu par nos partenaires', ennemi: 'présence adverse', neutre: 'contesté ou neutre' } as const;
const CIVILS = ['nulle', 'faible', 'moyenne', 'dense'];

export function VueRegionale({ theatre }: { theatre: string }) {
  const { etat: s, majUi } = usePartie();
  const T = TH[theatre], C = CARTES_REGIONALES[T.carteRegionale], B = BIOMES[C.biome];
  const boite = useRef<HTMLDivElement>(null);
  const [taille, setTaille] = useState({ L: 900, H: 640 });
  useLayoutEffect(() => {
    const el = boite.current!;
    const mesurer = () => { const L = Math.max(500, Math.round(el.clientWidth)), H = Math.max(360, Math.round(el.clientHeight)); setTaille(t => (t.L === L && t.H === H ? t : { L, H })); };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cadre: Cadre = useMemo(() => ({ L: taille.L, H: taille.H, marges: { haut: 92, droite: 500, bas: 150, gauche: 70 } }), [taille]);
  const projection = useMemo(() => projectionRegionale(C, cadre), [C, cadre]);
  const pos = useMemo(() => Object.fromEntries(C.lieux.map(l => [l.id, projection([l.lon, l.lat]) as [number, number]])), [C, projection]);
  const etiquettes = useMemo(() => placerEtiquettes(C.lieux, pos, 13), [C, pos]);

  const saison = saisonDu(theatre, s.tour);
  const effets = decrireSaison(saison.effets);
  const menaces = s.menaces.filter(m => m.theatre === theatre && m.detectee);
  const deployees = UNITES.filter(u => s.unites[u.id].theatre === theatre);
  const depart = C.lieux.find(l => l.id === C.depart)!;
  const { L, H } = taille;

  return (
    <div className="vue-regionale" ref={boite}>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque" aria-hidden="true"><FondRegional C={C} cadre={cadre} projection={projection} /></svg>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque" aria-hidden="true"><EffetSaison visuel={saison.visuel} L={L} H={H} prefixe={'vr-' + C.id} /></svg>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque vue-regionale-svg">
        {C.liens.map(([a, b]) => <line key={a + b} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} className="route" style={{ stroke: B.palette.route }} />)}
        {C.lieux.map(l => {
          const [x, y] = pos[l.id];
          const forme = l.type === 'base' ? <rect x={-11} y={-11} width={22} height={22} rx={4} /> : l.type === 'zone' ? <polygon points="0,-14 14,0 0,14 -14,0" /> : <circle r={11} />;
          const tip = l.nom + ' (' + l.type + ')\n' + LIBELLE_CONTROLE[l.controle] + '\nPopulation civile : ' + CIVILS[l.civils] + (l.id === C.depart ? '\nPoint d’entrée de nos forces' : '');
          return (
            <g key={l.id} transform={`translate(${x},${y})`} className={'lieu petit ctrl-' + l.controle} data-tip={tip}>
              <g className="lieu-forme">{forme}</g>
              <text x={etiquettes[l.id].x} y={etiquettes[l.id].y} textAnchor={etiquettes[l.id].ancre} className="lieu-nom">{l.nom}</text>
            </g>
          );
        })}
        {deployees.length > 0 && (() => {
          const [x, y] = pos[depart.id];
          return (
            <g transform={`translate(${x - 9 * deployees.length / 2},${y + 18})`}>
              {deployees.map((u, i) => <rect key={u.id} x={i * 9} y={0} width={7} height={7} rx={1.5} fill={COULEURS_CATEGORIE[u.categorie]} data-tip={u.nom} />)}
            </g>
          );
        })()}
      </svg>

      <div className="vr-entete">
        <button className="btn petit" onClick={() => majUi({ selection: null })} data-tip="Revenir à la carte du monde (Échap)">← Monde</button>
        <nav className="vr-onglets" aria-label="Théâtres">
          {THEATRES.map(X => (
            <button key={X.id} className={'vr-onglet' + (X.id === theatre ? ' actif' : '') + (s.theatres[X.id].crise ? ' crise' : '')} data-tuto={'theatre-' + X.id}
              onClick={() => majUi({ selection: { kind: 'theatre', id: X.id } })} aria-current={X.id === theatre ? 'page' : undefined}>{X.court}</button>
          ))}
        </nav>
      </div>

      <div className="vr-cartouche">
        <div className="fiche-type">{C.nom} · {B.nom}</div>
        <div className="vr-saison" style={{ color: COULEUR_SAISON[saison.visuel] }} data-tuto="saison"
          data-tip={saison.description + (effets.length ? '\n' + effets.join('\n') : '\nPas d’effet sur les règles.')}>
          <IconeSaison visuel={saison.visuel} taille={18} />
          <span><b>{saison.nom}</b><span className="discret"> · {dateDuTour(s.tour)}</span></span>
        </div>
        {effets.length > 0 && <div className="vr-effets">{effets.map(e => <span key={e} className="puce neutre">{e}</span>)}</div>}
        <div className="vr-menaces">
          {menaces.map(m => <span key={m.id} className="puce" style={{ color: couleurNiveau(m.estimation) }}>{MT[m.type].nom} {m.estimation}</span>)}
          {!menaces.length && <span className="discret petit">Aucune menace identifiée.</span>}
        </div>
        <div className="vr-legende">
          <span><i className="lg allie" /> Partenaires</span>
          <span><i className="lg neutre" /> Contesté</span>
          <span><i className="lg ennemi" /> Adversaire</span>
          <span className="discret">● ville · ■ base · ◆ zone</span>
        </div>
      </div>

    </div>
  );
}
