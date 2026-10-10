// Zoom régional : intervention semaine par semaine sur une carte géographique réelle.
import { useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import monde from 'world-atlas/countries-50m.json';
import { CARTES_REGIONALES, UN } from '../../data';
import { evaluerActionZoom, nomLieu, objectifsZoom, type ActionZoom } from '../../sim';
import { usePartie } from '../contexte';
import { pct } from '../format';

const L = 900, H = 640;
const topo = monde as unknown as Topology<{ countries: GeometryCollection }>;
const pays = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;

function libelle(a: ActionZoom, z: Parameters<typeof nomLieu>[0]): string {
  switch (a.type) {
    case 'Z_DEPLACER': return 'Se porter sur ' + nomLieu(z, a.vers);
    case 'Z_RAID': return 'Raid sur ' + nomLieu(z, a.lieu);
    case 'Z_EVACUER': return 'Évacuer depuis ' + nomLieu(z, a.lieu);
    case 'Z_RECO': return 'Reconnaissance par drone';
    case 'Z_FRAPPE': return 'Frappe aérienne';
    case 'Z_APPUI': return 'Appuyer l’offensive locale';
    default: return a.type;
  }
}
const AIDE_ACTION: Partial<Record<ActionZoom['type'], string>> = {
  Z_RAID: 'Réussite plus probable si la position est reconnue. Échec : risque de blessés.',
  Z_FRAPPE: 'Efficacité réduite si la position n’est pas reconnue ou si l’adversaire est dispersé. Risque collatéral selon la densité civile.',
  Z_APPUI: 'Les forces locales attaquent, appuyées par les détachements au contact. Seul moyen de reprendre durablement un lieu.',
  Z_RECO: 'Révèle la position et resserre l’estimation (marge 5). Réduit la dispersion.',
  Z_EVACUER: 'Met à l’abri les personnes présentes sur ce lieu.',
  Z_DEPLACER: 'Déplacement vers un lieu adjacent non tenu par l’adversaire.'
};

export function VueZoom() {
  const { etat: s, ui, majUi, possibles, jouer } = usePartie();
  const z = s.zoom!, C = CARTES_REGIONALES[z.carte];
  const sc = C.scenarios.find(x => x.id === z.scenario)!;
  const lieuxObj = sc.objectifs.filter(o => o.lieu).map(o => o.lieu!);
  const objectifs = objectifsZoom(s);

  const { proj, fonds } = useMemo(() => {
    const pts: Feature<Geometry> = { type: 'Feature', properties: {}, geometry: { type: 'MultiPoint', coordinates: C.lieux.map(l => [l.lon, l.lat]) } };
    const p = geoMercator().fitExtent([[90, 70], [L - 90, H - 60]], pts);
    const ch = geoPath(p);
    return { proj: p, fonds: pays.features.map((f, i) => ({ id: i + ':' + String(f.id), d: ch(f) || '', nom: f.properties.name })) };
  }, [C]);
  const pos = useMemo(() => {
    const r: Record<string, [number, number]> = {};
    for (const l of C.lieux) r[l.id] = proj([l.lon, l.lat]) as [number, number];
    return r;
  }, [C, proj]);
  // Étiquettes : au-dessus du lieu, ou sur le côté libre quand un autre lieu est trop proche
  const etiquettes = useMemo(() => {
    const r: Record<string, { x: number; y: number; ancre: 'start' | 'middle' | 'end' }> = {};
    for (const l of C.lieux) {
      const [x, y] = pos[l.id];
      let proche: [number, number] | null = null, dmin = 70;
      for (const m of C.lieux) { if (m === l) continue; const d = Math.hypot(pos[m.id][0] - x, pos[m.id][1] - y); if (d < dmin) { dmin = d; proche = pos[m.id]; } }
      const dx = proche ? proche[0] - x : 0, dy = proche ? proche[1] - y : 0;
      if (!proche || (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= 75)) r[l.id] = { x: 0, y: dy < 0 && Math.abs(dy) > 20 ? 30 : -22, ancre: 'middle' };
      else if (proche[0] >= x) r[l.id] = { x: -22, y: 4, ancre: 'end' };
      else r[l.id] = { x: 22, y: 4, ancre: 'start' };
    }
    return r;
  }, [C, pos]);

  const selL = ui.zoomLieu, selU = ui.zoomUnite;
  const liste = possibles.filter((a): a is ActionZoom => a.type.startsWith('Z_') && a.type !== 'Z_SEMAINE' && a.type !== 'Z_RETRAIT')
    .filter(a => (selU && 'unite' in a && a.unite === selU) || (selL && (('lieu' in a && a.lieu === selL) || ('vers' in a && a.vers === selL))));
  const cibles = new Set(selU ? possibles.filter(a => 'unite' in a && a.unite === selU).map(a => ('vers' in a ? a.vers : 'lieu' in a ? a.lieu : '')) : []);

  return (
    <div className="zoom">
      <header className="zoom-entete">
        <div>
          <div className="fiche-type">Intervention · {C.nom}</div>
          <h2 className="zoom-titre">{z.titre}</h2>
        </div>
        <div className="zoom-compteurs">
          <div data-tip="Une semaine par tour local, six au maximum."><span className="jauge-lib">Semaine</span><b className="chiffres">{z.semaine}/{z.maxSemaines}</b></div>
          <div data-tip="Frappes disponibles cette semaine : aviation, aéronavale, hélicoptères d’attaque, artillerie et appuis alliés."><span className="jauge-lib">Frappes</span><b className="chiffres">{z.frappes}/{z.frappesMax}</b></div>
          <div data-tip="Reconnaissances disponibles cette semaine (drones, patrouille maritime, recherche humaine)."><span className="jauge-lib">Reconnaissances</span><b className="chiffres">{z.recos}/{z.recosMax}</b></div>
          <div data-tip="Offensive possible des forces locales cette semaine."><span className="jauge-lib">Appui local</span><b className="chiffres">{z.appui}</b></div>
          <div data-tip={C.forceLocale.nom}><span className="jauge-lib">Forces locales</span><b className="chiffres">{z.forceLocale}</b></div>
          <div data-tip="Renseignement du théâtre : visibilité initiale des positions adverses et marge d’erreur."><span className="jauge-lib">Renseignement</span><b className="chiffres c-turquoise">{z.rens}</b></div>
        </div>
        <div className="zoom-boutons">
          <button className="btn danger" onClick={() => jouer({ type: 'Z_RETRAIT' })}>Mettre fin à l’intervention</button>
          <button className="btn principal grand" onClick={() => jouer({ type: 'Z_SEMAINE' })} data-tip="L’adversaire réagit, puis la semaine suivante commence. (Entrée)">Semaine suivante <span className="touche">↵</span></button>
        </div>
      </header>

      <aside className="panneau zoom-gauche">
        <h3 className="titre-section">Détachements</h3>
        {z.unites.map(u => (
          <button key={u.id} className={'ligne-unite' + (selU === u.id ? ' sel' : '')} onClick={() => majUi({ zoomUnite: u.id, zoomLieu: null })}>
            <span className="ligne-unite-nom">{UN[u.id].nom}</span>
            <span className="ligne-unite-lieu">{nomLieu(z, u.lieu)}</span>
            <span className={'etat ' + (u.blesse ? 'etat-indisponible' : u.aAgi ? 'etat-regeneration' : 'etat-disponible')}>{u.blesse ? 'diminué' : u.aAgi ? 'a agi' : 'prêt'}</span>
          </button>
        ))}
        <h3 className="titre-section" style={{ marginTop: 18 }}>Objectifs</h3>
        {objectifs.map((o, i) => <div key={i} className={'objectif ' + (o.atteint ? 'ok' : 'attente')}><span>{o.atteint ? '✓' : '○'}</span>{o.texte}</div>)}
        <div className="stats-mini">
          <span>Pertes <b className="chiffres">{z.stats.pertes}</b></span>
          <span>Collatéraux <b className="chiffres">{z.stats.collat}</b></span>
          <span>Neutralisés <b className="chiffres">{z.stats.neutralises}</b></span>
          <span>Évacués <b className="chiffres">{z.stats.evacues}</b></span>
        </div>
      </aside>

      <div className="zoom-carte" onClick={() => majUi({ zoomLieu: null, zoomUnite: null })}>
        <svg viewBox={`0 0 ${L} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="sol" cx="50%" cy="45%" r="70%"><stop offset="0%" stopColor="#1a2026" /><stop offset="100%" stopColor="#0c1014" /></radialGradient>
          </defs>
          <rect width={L} height={H} fill="url(#sol)" />
          {fonds.map(p => <path key={p.id} d={p.d} className="zoom-pays" />)}
          {C.liens.map(([a, b]) => <line key={a + b} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} className="zoom-lien" />)}
          {C.lieux.map(Ld => {
            const l = z.lieux[Ld.id], [x, y] = pos[Ld.id];
            const sel = selL === Ld.id, obj = lieuxObj.includes(Ld.id), cible = cibles.has(Ld.id);
            const civils = ['nulle', 'faible', 'moyenne', 'dense'][l.civils];
            const tip = Ld.nom + ' (' + Ld.type + ')\nContrôle : ' + l.controle + '\nPopulation civile : ' + civils +
              (l.controle === 'ennemi' ? '\nAdversaire : ' + (l.revele ? 'environ ' + l.estimee + ' ± ' + l.marge : 'position non confirmée') + (l.dispersion ? '\nDispersé parmi les civils' : '') : '') +
              (l.ressortissants ? '\nPersonnes à évacuer : ' + l.ressortissants : '');
            const forme = Ld.type === 'base' ? <rect x={-13} y={-13} width={26} height={26} rx={4} /> : Ld.type === 'zone' ? <polygon points="0,-17 17,0 0,17 -17,0" /> : <circle r={14} />;
            return (
              <g key={Ld.id} transform={`translate(${x},${y})`} className={'lieu ctrl-' + l.controle + (sel ? ' sel' : '')} data-tip={tip}
                onClick={ev => { ev.stopPropagation(); majUi({ zoomLieu: Ld.id, zoomUnite: null }); }}>
                {cible && <circle r={26} className="lieu-cible" />}
                {obj && <circle r={22} className="lieu-objectif" />}
                <g className="lieu-forme">{forme}</g>
                {l.controle === 'ennemi' && <text y={4} textAnchor="middle" className="lieu-force">{l.revele ? l.estimee : '?'}</text>}
                <text x={etiquettes[Ld.id].x} y={etiquettes[Ld.id].y} textAnchor={etiquettes[Ld.id].ancre} className="lieu-nom">{Ld.nom}</text>
                {l.dispersion > 0 && <text y={32} textAnchor="middle" className="lieu-alerte">DISPERSÉ</text>}
                {l.ressortissants > 0 && <g transform="translate(17,-12)"><circle r={8} className="lieu-evac" /><text y={3.5} textAnchor="middle" className="lieu-evac-texte">{l.ressortissants}</text></g>}
              </g>
            );
          })}
          {z.unites.map((u, i) => {
            const [x, y] = pos[u.lieu], n = z.unites.filter(v => v.lieu === u.lieu).indexOf(u);
            return (
              <g key={u.id} transform={`translate(${x - 16 + n * 20},${y + 20})`} className={'detachement' + (selU === u.id ? ' sel' : '') + (u.blesse ? ' blesse' : '')}
                onClick={ev => { ev.stopPropagation(); majUi({ zoomUnite: u.id, zoomLieu: null }); }} data-tip={UN[u.id].nom + (u.blesse ? ' (diminué)' : '')} data-i={i}>
                <rect width={18} height={12} rx={2} />
                <path d="M0,0 L18,12 M18,0 L0,12" />
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="panneau zoom-droite">
        <h3 className="titre-section">Journal d’opération</h3>
        <div className="journal">{z.journal.map((t, i) => <div key={i} className="journal-ligne">{t}</div>)}</div>
      </aside>

      <footer className="panneau zoom-actions">
        <div className="zoom-actions-titre">
          {selU ? UN[selU].nom : selL ? nomLieu(z, selL) : 'Sélectionnez un détachement ou un lieu'}
        </div>
        <div className="zoom-actions-liste">
          {!selL && !selU && <span className="discret">Les raids partent du lieu occupé vers un lieu adjacent. Frappes et reconnaissances visent tout lieu adverse. L’appui local vise un lieu voisin d’une position alliée.</span>}
          {(selL || selU) && !liste.length && <span className="discret">Aucune action possible pour cette sélection cette semaine.</span>}
          {liste.map((a, i) => {
            const ev = evaluerActionZoom(s, a, false);
            const suff = ev ? (a.type === 'Z_FRAPPE' ? 'dégâts ' + ev.degatsMin + '–' + ev.degatsMax + ' · collatéral ' + pct(ev.risqueCollat) : pct(ev.pSucces)) : '';
            return (
              <button key={i} className={'btn ' + (a.type === 'Z_RAID' || a.type === 'Z_FRAPPE' ? 'principal' : '')} onClick={() => jouer(a)}
                data-tip={(AIDE_ACTION[a.type] || '') + (ev && a.type !== 'Z_FRAPPE' ? '\nSuccès estimé ' + pct(ev.pSucces) + (ev.risquePertes ? ' · blessés ' + pct(ev.risquePertes) : '') + (ev.risqueCollat ? ' · collatéral ' + pct(ev.risqueCollat) : '') : '')}>
                {selL && 'unite' in a ? UN[a.unite].nom + ' : ' : ''}{libelle(a, z)}{suff && <span className="btn-suffixe">{suff}</span>}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
