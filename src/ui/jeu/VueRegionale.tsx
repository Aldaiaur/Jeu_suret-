// Vue régionale d'un théâtre, consultable à tout moment : biome, saison, lieux réels, liaisons, forces engagées
// et commandement tactique (implantation, posture, missions). Un ordre courant se donne en deux clics :
// l'unité, puis le lieu (ordre par défaut), ou l'unité, puis un ordre du panneau.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BIOMES, CARTES_REGIONALES, CATEGORIES, IDENTITES, MISSIONS, MT, POSTURES, TH, THEATRES, UN, UNITES } from '../../data';
import { SymboleSvg } from '../composants/SymboleOtan';
import { Insigne } from '../composants/Insigne';
import {
  dateDuTour, estAuSol, identifie, libelleMission, saisonDu, soutienTheatre, type Posture, type UniteDef
} from '../../sim';
import { usePartie } from '../contexte';
import { FondRegional, projectionRegionale, type Cadre } from '../composants/FondRegional';
import { COULEUR_SAISON, EffetSaison, IconeSaison, decrireSaison } from '../composants/Saison';
import { COULEURS_CATEGORIE, couleurNiveau, pct } from '../format';
import { placerEtiquettes } from '../composants/etiquettes';
import { ordreParDefaut, ordresUnite, type Ordre } from './ordres';
import { activable } from '../composants/activable';

const LIBELLE_CONTROLE = { allie: 'tenu par nos partenaires', ennemi: 'présence adverse', neutre: 'contesté ou neutre' } as const;
const CIVILS = ['nulle', 'faible', 'moyenne', 'dense'];
const COULEUR_MISSION: Record<string, string> = { frappe: 'var(--rouge-vif)', raid: 'var(--ambre)', patrouille: 'var(--turquoise)', axe: 'var(--turquoise)', escorte: 'var(--vert)', appui: 'var(--violet)', evacuation: 'var(--vert)' };
const ICONE_ORDRE: Record<string, string> = { frappe: '✦', raid: '➜', patrouille: '◎', positionner: '▣', appui: '⚑', evacuation: '✚', axe: '═', escorte: '⇄' };

function decrireEval(o: Ordre): string {
  if (!o.ev) return '';
  const r: string[] = [];
  if (o.ev.pSucces < 1) r.push('succès ' + pct(o.ev.pSucces));
  if (o.ev.risquePertes >= 0.01) r.push('pertes ' + pct(o.ev.risquePertes));
  if (o.ev.risqueCollat >= 0.01) r.push('collatéral ' + pct(o.ev.risqueCollat));
  return r.join(' · ');
}

export function VueRegionale({ theatre }: { theatre: string }) {
  const { etat: s, ui, majUi, jouer } = usePartie();
  const T = TH[theatre], C = CARTES_REGIONALES[T.carteRegionale], B = BIOMES[C.biome], th = s.theatres[theatre];
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
  const cadre: Cadre = useMemo(() => ({ L: taille.L, H: taille.H, marges: { haut: 100, droite: 500, bas: 170, gauche: 80 } }), [taille]);
  const projection = useMemo(() => projectionRegionale(C, cadre), [C, cadre]);
  const pos = useMemo(() => Object.fromEntries(C.lieux.map(l => [l.id, projection([l.lon, l.lat]) as [number, number]])), [C, projection]);
  const etiquettes = useMemo(() => placerEtiquettes(C.lieux, pos, 13), [C, pos]);

  const saison = saisonDu(theatre, s.tour), effets = decrireSaison(saison.effets);
  const menaces = s.menaces.filter(m => m.theatre === theatre && m.detectee);
  const presentes = UNITES.filter(u => s.unites[u.id].theatre === theatre);
  const sol = presentes.filter(u => estAuSol(u) && s.unites[u.id].lieu), horsCarte = presentes.filter(u => !sol.includes(u));
  const sout = soutienTheatre(s, theatre);
  const sel = ui.uniteRegion && s.unites[ui.uniteRegion]?.theatre === theatre ? ui.uniteRegion : null;
  const selDeployee = sel && s.unites[sel].etat === 'deployee' && s.phase === 'jeu';
  const defauts = useMemo(() => {
    const r: Record<string, Ordre | null> = {};
    if (selDeployee) for (const l of C.lieux) r[l.id] = ordreParDefaut(s, sel!, l.id);
    return r;
  }, [s, sel, selDeployee, C]);
  const { L, H } = taille;

  // Position d'un jeton : sous le lieu pour les forces au sol, bandeau latéral pour les forces hors carte
  const posJeton = (u: UniteDef): [number, number] => {
    const e = s.unites[u.id];
    if (e.lieu && estAuSol(u)) {
      const ici = sol.filter(x => s.unites[x.id].lieu === e.lieu), i = ici.indexOf(u);
      const [x, y] = pos[e.lieu];
      return [x - (ici.length - 1) * 16 + i * 32, y + 30];
    }
    return [34, 140 + horsCarte.indexOf(u) * 44];
  };

  return (
    <div className="vue-regionale" ref={boite}>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque" aria-hidden="true"><FondRegional C={C} cadre={cadre} projection={projection} /></svg>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque" aria-hidden="true"><EffetSaison visuel={saison.visuel} L={L} H={H} prefixe={'vr-' + C.id} /></svg>
      <svg width={L} height={H} viewBox={`0 0 ${L} ${H}`} className="calque vue-regionale-svg" onClick={() => majUi({ uniteRegion: null })}>
        {C.liens.map(([a, b]) => <line key={a + b} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} className="route" style={{ stroke: B.palette.route }} />)}
        {/* Missions en cours */}
        {presentes.map(u => {
          const m = s.unites[u.id].mission;
          if (!m) return null;
          const [x0, y0] = posJeton(u), [x1, y1] = pos[m.lieu], c = COULEUR_MISSION[m.type];
          if (m.vers) { const [x2, y2] = pos[m.vers]; return <line key={'m' + u.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} className="trait-mission axe" />; }
          return <line key={'m' + u.id} x1={x0} y1={y0} x2={x1} y2={y1} stroke={c} className="trait-mission" />;
        })}
        {C.lieux.map(l => {
          const [x, y] = pos[l.id], x0 = th.lieux[l.id], connu = identifie(s, theatre, l.id), d = defauts[l.id];
          const forme = l.type === 'base' ? <rect x={-11} y={-11} width={22} height={22} rx={4} /> : l.type === 'zone' ? <polygon points="0,-14 14,0 0,14 -14,0" /> : <circle r={11} />;
          const tip = l.nom + ' (' + l.type + (l.littoral ? ', littoral' : '') + ')\n' + LIBELLE_CONTROLE[x0.controle] + '\nPopulation civile : ' + CIVILS[l.civils] +
            (x0.controle === 'ennemi' ? '\nActivité adverse : ' + (connu ? x0.activite : 'position non identifiée') + '\nConnaissance : ' + x0.connu + ' / 100' : '') +
            (l.id === C.depart ? '\nPoint d’entrée de nos forces' : '') +
            (d ? '\n\nClic : ' + d.libelle + (d.ev ? '\n' + decrireEval(d) : '') : '');
          return (
            <g key={l.id} transform={`translate(${x},${y})`} className={'lieu petit ctrl-' + x0.controle + (d ? ' ordonnable' : '')} data-tip={tip}
              onClick={ev => { ev.stopPropagation(); if (d) jouer(d.action); }} {...(d ? activable(() => jouer(d.action), l.nom + ' : ' + d.libelle) : {})}>
              {d && <circle r={20} className="lieu-cible" />}
              {x0.controle === 'ennemi' && connu && <circle r={16} className="lieu-identifie" />}
              <g className="lieu-forme">{forme}</g>
              {x0.controle === 'ennemi' && <text y={4} textAnchor="middle" className="lieu-force">{connu ? x0.activite : '?'}</text>}
              <text x={etiquettes[l.id].x} y={etiquettes[l.id].y} textAnchor={etiquettes[l.id].ancre} className="lieu-nom">{l.nom}</text>
              {d && <g transform="translate(15,-15)"><circle r={8} className="badge-ordre" /><text y={3.5} textAnchor="middle" className="badge-ordre-texte">{ICONE_ORDRE[d.type]}</text></g>}
            </g>
          );
        })}
        {horsCarte.length > 0 && <text x={16} y={116} className="vr-horscarte-titre">HORS CARTE</text>}
        {presentes.map(u => {
          const [x, y] = posJeton(u), e = s.unites[u.id];
          return (
            <g key={u.id + (ui.retour?.unite === u.id ? ui.retour.cle : '')} transform={`translate(${x},${y})`} className={'jeton' + (sel === u.id ? ' sel' : '') + (e.etat !== 'deployee' ? ' en-route' : '') + (ui.retour?.unite === u.id ? ' vient-de-recevoir' : '')}
              data-tip={u.nom + '\n' + POSTURES[e.posture].nom + (e.mission ? '\n' + libelleMission(theatre, e.mission) : '') + (e.etat !== 'deployee' ? '\nEn projection : arrivée sous ' + e.compteur + ' mois' : '') + '\nFatigue ' + Math.round(e.fatigue)}
              onClick={ev => { ev.stopPropagation(); majUi({ uniteRegion: sel === u.id ? null : u.id }); }} data-tuto={'jeton-' + u.id}
              {...activable(() => majUi({ uniteRegion: sel === u.id ? null : u.id }), u.nom + ', ' + POSTURES[e.posture].nom.toLowerCase())}>
              <rect x={-14} y={-12} width={28} height={27} rx={3} className="jeton-fond" />
              <SymboleSvg unite={u.id} taille={15} />
              <rect x={-11} y={12} width={22 * (1 - e.fatigue / 100)} height={2.5} style={{ fill: couleurNiveau(e.fatigue) }} />
              <text y={23} textAnchor="middle" className="jeton-texte">{IDENTITES[u.id].sigle}</text>
            </g>
          );
        })}
      </svg>

      <div className="vr-entete">
        <button className="btn petit" onClick={() => majUi({ selection: null, uniteRegion: null })} data-tip="Revenir à la carte du monde (Échap)">← Monde</button>
        <nav className="vr-onglets" aria-label="Théâtres">
          {THEATRES.map(X => (
            <button key={X.id} className={'vr-onglet' + (X.id === theatre ? ' actif' : '') + (s.theatres[X.id].crise ? ' crise' : '')} data-tuto={'theatre-' + X.id}
              onClick={() => majUi({ selection: { kind: 'theatre', id: X.id }, uniteRegion: null })} aria-current={X.id === theatre ? 'page' : undefined}>{X.court}</button>
          ))}
        </nav>
      </div>

      {(
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
          {presentes.length > 0 && (
            <div className={'vr-soutien' + (sout.ratio < 1 ? ' penurie' : '')} data-tuto="soutien"
              data-tip={'Soutien logistique (transport, carburant, munitions) : capacité ' + sout.capacite + ', besoins ' + sout.demande + '.\nEn pénurie, l’efficacité des unités baisse (jusqu’à −50 %) et les coûts augmentent de 25 % (affrètement).\nA400M, ravitailleurs, BPC, escortes de convoi et transport allié augmentent la capacité.'}>
              <span>Soutien logistique</span><b className="chiffres">{sout.demande} / {sout.capacite}</b>
              <span className="barre"><i style={{ width: Math.min(100, sout.demande / Math.max(1, sout.capacite) * 100) + '%', background: sout.ratio < 1 ? 'var(--rouge)' : 'var(--vert)' }} /></span>
            </div>
          )}
          {th.rapportTactique.length > 0 && <div className="vr-rapport">{th.rapportTactique.slice(0, 3).map((t, i) => <div key={i}>{t}</div>)}</div>}
          <div className="vr-legende">
            <span><i className="lg allie" /> Partenaires</span>
            <span><i className="lg neutre" /> Contesté</span>
            <span><i className="lg ennemi" /> Adversaire</span>
            <span className="discret">{presentes.length ? 'Cliquez une unité pour lui donner un ordre' : '● ville · ■ base · ◆ zone'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Ordres d'une unité : affiché dans le tiroir de droite à la place de la fiche du théâtre
export function PanneauOrdres({ uniteId, theatre }: { uniteId: string; theatre: string }) {
  const { etat: s, majUi, jouer, estPossible } = usePartie();
  const u = UN[uniteId], e = s.unites[uniteId];
  const ordres = e.etat === 'deployee' && s.phase === 'jeu' ? ordresUnite(s, uniteId) : [];
  const groupes: Record<string, Ordre[]> = {};
  for (const o of ordres) (groupes[o.type] = groupes[o.type] || []).push(o);
  const NOMS: Record<string, string> = { positionner: 'Implantation', ...Object.fromEntries(Object.values(MISSIONS).map(m => [m.id, m.nom])) };
  return (
    <div className="vr-ordres">
      <div className="vr-ordres-entete">
        <button className="btn petit" onClick={() => majUi({ uniteRegion: null })} data-tip="Revenir à la fiche du théâtre (Échap)">← Théâtre</button>
        <div className="fiche-identite">
          <Insigne unite={uniteId} taille={44} />
          <div>
          <div className="fiche-type"><i className="point" style={{ background: COULEURS_CATEGORIE[u.categorie] }} />{CATEGORIES[u.categorie]}</div>
          <b className="vr-ordres-nom">{u.nom}</b>
          <span className="discret petit"> · {e.lieu ? 'implanté à ' + CARTES_REGIONALES[TH[theatre].carteRegionale].lieux.find(l => l.id === e.lieu)!.nom : 'hors carte'} · fatigue {Math.round(e.fatigue)}</span>
          </div>
        </div>
      </div>
      {e.etat !== 'deployee' ? <p className="discret petit">En projection : arrivée sous {e.compteur} mois.</p> : (
        <>
          <div className="vr-postures" role="radiogroup" aria-label="Posture" data-tuto="postures">
            {(Object.keys(POSTURES) as Posture[]).filter(p => POSTURES[p].categories.includes(u.categorie)).map(p => {
              const P = POSTURES[p], a = { type: 'POSTURE', unite: uniteId, posture: p } as const;
              return (
                <button key={p} role="radio" aria-checked={e.posture === p} className={'vr-posture' + (e.posture === p ? ' actif' : '')} disabled={e.posture !== p && !estPossible(a)}
                  onClick={() => e.posture !== p && jouer(a)}
                  data-tip={P.description + '\nPression ×' + P.pression + ' · fatigue ×' + P.fatigue + (P.rens !== 1 ? ' · renseignement ×' + P.rens : '') + (P.risquePertes ? ' · risque de pertes ' + pct(P.risquePertes) + '/mois' : '')}>{P.nom}</button>
              );
            })}
          </div>
          <div className="vr-mission">
            {e.mission ? <><span>Mission : <b>{libelleMission(theatre, e.mission)}</b></span><button className="btn petit" onClick={() => jouer({ type: 'ANNULER_MISSION', unite: uniteId })}>Annuler</button></>
              : <span className="discret petit">Aucune mission. Cliquez un lieu marqué sur la carte pour l’ordre proposé, ou choisissez ci-dessous.</span>}
          </div>
          <div className="vr-ordres-liste">
            {Object.entries(groupes).map(([t, l]) => (
              <div key={t} className="vr-ordres-groupe">
                <div className="titre-section">{NOMS[t]}</div>
                {l.map((o, i) => (
                  <button key={i} className={'btn petit' + (t === 'frappe' || t === 'raid' ? ' principal' : '')} onClick={() => jouer(o.action)}
                    data-tip={(t === 'positionner' ? 'Déplacer l’unité sur ce lieu.' : MISSIONS[t as keyof typeof MISSIONS].description) + (o.ev ? '\n' + o.ev.effet + '\nCoût : ' + o.ev.cout + ' M€/mois' : '')}>
                    {o.cible}{decrireEval(o) && <span className="btn-suffixe">{decrireEval(o)}</span>}
                  </button>
                ))}
              </div>
            ))}
            {!ordres.length && <p className="discret petit">Aucun ordre possible pour l’instant.</p>}
          </div>
        </>
      )}
    </div>
  );
}
