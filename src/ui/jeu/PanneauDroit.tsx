import type { ReactNode } from 'react';
import { AL, MOIS, NB_TOURS, TH, THEATRES, UNITES } from '../../data';
import { appuiDef, coutsMensuels, dateDuTour, instantane, probaVote, type Action } from '../../sim';
import { procedure } from '../../sim';
import { usePartie, type OngletDroit } from '../contexte';
import { pct } from '../format';
import { Graphique } from '../composants/Graphique';

export function PanneauDroit() {
  const { etat: s, ui, majUi } = usePartie();
  const onglet = (id: OngletDroit, lib: string, compte?: number) => (
    <button className={'onglet' + (ui.ongletDroit === id ? ' actif' : '')} onClick={() => majUi({ ongletDroit: id })} data-tuto={'onglet-' + id}>
      {lib}{compte ? <span className="compte">{compte}</span> : null}
    </button>
  );
  return (
    <aside className="panneau panneau-droit">
      <div className="onglets">
        {onglet('situation', 'Situation')}
        {onglet('rapports', 'Rapports', s.rapports.length)}
        {onglet('journal', 'Journal')}
      </div>
      <div className="panneau-defile">
        {ui.ongletDroit === 'situation' && <Situation />}
        {ui.ongletDroit === 'rapports' && <Rapports />}
        {ui.ongletDroit === 'journal' && <Journal />}
      </div>
    </aside>
  );
}

function Situation() {
  const { etat: s } = usePartie();
  const ech: [number, ReactNode, string][] = [];
  for (const T of THEATRES) {
    const th = s.theatres[T.id];
    if (T.exterieur && !T.basePermanente && !th.voteFait && th.toursIntervention > 0) {
      const dans = Math.max(1, procedure(s).dureeAvantVote + 1 - th.toursIntervention);
      ech.push([dans, <>Vote {procedure(s).nom.toLowerCase()} ({T.court}) dans {dans} mois · adoption {pct(probaVote(s, T.id))}</>, dans === 1 ? 'ambre' : '']);
    }
    if (th.crise && th.crise.statut === 'libre') ech.push([0, <>Crise non traitée : {th.crise.titre} ({th.crise.toursLibres} m)</>, 'rouge']);
    if (th.allie) ech.push([th.allie, <>Appui allié {T.court} : encore {th.allie} mois</>, 'violet']);
    for (const a of th.appuis) ech.push([a.tours, <>{AL[a.allie].nom} — {appuiDef(a.allie, a.appui).nom} ({T.court}) : {a.tours} m</>, 'violet']);
  }
  for (const u of UNITES) {
    const e = s.unites[u.id];
    if (e.etat === 'projection') ech.push([e.compteur, <>{u.nom} arrive sur {TH[e.theatre!].court} dans {e.compteur} mois</>, '']);
    if (e.etat === 'deployee' && e.fatigue >= 75) ech.push([0, <>{u.nom} : fatigue {Math.round(e.fatigue)}, relève à prévoir</>, 'rouge']);
    for (const p of u.indisponibilites || []) if (p.debut > s.tour && p.debut - s.tour <= 3) ech.push([p.debut - s.tour, <>{u.nom} : arrêt technique dans {p.debut - s.tour} mois</>, 'ambre']);
  }
  const prevu = s.ressources.budget + s.ressources.enveloppe - coutsMensuels(s);
  if (prevu < 0) ech.push([0, <>Dépassement budgétaire prévu : {prevu.toFixed(1)} M€</>, 'rouge']);
  return (
    <>
      <section className="groupe">
        <h3 className="titre-section">Tendances</h3>
        <Graphique historique={s.historique.concat([instantane(s)])} largeur={340} hauteur={150} revelerMenaceExt={!!s.fin} />
      </section>
      <section className="groupe" data-tuto="echeances">
        <h3 className="titre-section">Échéances et alertes</h3>
        {!ech.length && <p className="discret">Rien à signaler.</p>}
        {ech.sort((a, b) => a[0] - b[0]).map((x, i) => <div key={i} className={'echeance ' + x[2]}>{x[1]}</div>)}
      </section>
      <Gouvernement />
    </>
  );
}

function Gouvernement() {
  const { etat: s, estPossible, jouer } = usePartie();
  const hausse: Action = { type: 'BUDGET', sens: 'hausse' }, baisse: Action = { type: 'BUDGET', sens: 'baisse' };
  return (
    <section className="groupe" data-tuto="gouvernement">
      <h3 className="titre-section">Arbitrages budgétaires</h3>
      <div className="ligne-action" data-tip="Le gouvernement accepte de relever l’enveloppe des opérations, au prix de capital politique. Consomme une action.">
        <div className="ligne-action-texte"><div>Demander une rallonge</div><div className="ligne-action-meta">Enveloppe +10 M€/mois · capital −8</div></div>
        <button className="btn petit" disabled={!estPossible(hausse)} onClick={() => jouer(hausse)}>Demander</button>
      </div>
      <div className="ligne-action" data-tip="Rendre des crédits regagne la confiance du gouvernement. Consomme une action.">
        <div className="ligne-action-texte"><div>Consentir des économies</div><div className="ligne-action-meta">Enveloppe −10 M€/mois · capital +4</div></div>
        <button className="btn petit" disabled={!estPossible(baisse)} onClick={() => jouer(baisse)}>Proposer</button>
      </div>
      <p className="discret petit">Enveloppe actuelle : {s.ressources.enveloppe} M€/mois.</p>
    </section>
  );
}

function Rapports() {
  const { etat: s, majUi } = usePartie();
  const tri = s.rapports.slice().sort((a, b) => a.fiabilite.localeCompare(b.fiabilite));
  return (
    <section className="groupe">
      <h3 className="titre-section">Synthèse — {dateDuTour(Math.min(s.tour, NB_TOURS - 1))}</h3>
      {!tri.length && <p className="discret">Aucun rapport.</p>}
      {tri.map((r, i) => (
        <button key={i} className={'rapport fiab-' + r.fiabilite} onClick={() => majUi({ selection: { kind: 'theatre', id: r.theatre } })}
          data-tip="Fiabilité A (très sûre) à E (douteuse). Plus le renseignement est faible, plus l’estimation est large et plus le rapport peut être faux.">
          <div className="rapport-entete"><span>{r.service}</span><span>{TH[r.theatre].court}</span><span className="rapport-fiab">{r.fiabilite}</span></div>
          <div>{r.texte}</div>
        </button>
      ))}
    </section>
  );
}

function Journal() {
  const { etat: s } = usePartie();
  return (
    <section className="journal">
      {s.journal.slice(0, 150).map((j, i) => j.genre === 'tour'
        ? <div key={i} className="journal-tour">{j.texte.replace(/—/g, '').trim()}</div>
        : <div key={i} className={'journal-ligne ' + j.genre}><span className="journal-mois">{MOIS[j.tour % 12].slice(0, 4)}.</span>{j.texte}</div>)}
    </section>
  );
}
