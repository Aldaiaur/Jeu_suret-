// Fenêtres de décision et de bilan. Une seule à la fois, par ordre de priorité.
import { CARTES_REGIONALES, EV, MT, NB_TOURS, OP, PARAMS, TH, UN } from '../../data';
import {
  choixPermis, dateDuTour, evaluerCriseAbstraite, evaluerOperation, menaceDeCrise, menaceParId, moyensCrise,
  type BilanZoom
} from '../../sim';
import { usePartie } from '../contexte';
import { pct, pucesEffets } from '../format';
import { Fenetre } from '../composants/Fenetre';
import { Graphique } from '../composants/Graphique';
import { exporter } from '../sauvegarde';

export function Fenetres() {
  const { etat: s, ui } = usePartie();
  if (ui.aide) return <FenetreAide />;
  if (ui.bilan) return <FenetreBilanZoom b={ui.bilan} />;
  if (ui.apercu) return <FenetreApercu />;
  if (s.phase === 'evenement') return <FenetreEvenement />;
  if (s.phase === 'crise') return <FenetreCrise />;
  if (s.phase === 'fin') return <FenetreFin />;
  return null;
}

function Puces({ effets }: { effets: Parameters<typeof pucesEffets>[0] }) {
  const p = pucesEffets(effets);
  if (!p.length) return <span className="puce neutre">Pas d’effet immédiat</span>;
  return <>{p.map((x, i) => <span key={i} className={'puce ' + x.ton}>{x.texte}</span>)}</>;
}

function FenetreEvenement() {
  const { etat: s, jouer } = usePartie();
  const E = EV[s.evenementCourant!];
  return (
    <Fenetre tampon="Événement" ton="ambre" titre={E.titre} sousTitre={dateDuTour(s.tour)}>
      <p className="texte-dossier">{E.texte}</p>
      <div className="choix-liste">
        {E.choix.map((c, i) => {
          const ok = choixPermis(s, c);
          return (
            <button key={i} className="choix" disabled={!ok} onClick={() => jouer({ type: 'CHOIX', index: i })}>
              <span className="choix-num">{i + 1}</span>
              <span className="choix-corps">
                <span className="choix-texte">{c.texte}{!ok && <span className="c-rouge"> — moyens indisponibles</span>}</span>
                <span className="choix-effets"><Puces effets={c.effets} />{c.suite && <span className="puce neutre">Des suites sont possibles</span>}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Fenetre>
  );
}

function FenetreCrise() {
  const { etat: s, jouer } = usePartie();
  const t = s.criseCourante!, th = s.theatres[t], crise = th.crise!, m = menaceDeCrise(s, t), moy = moyensCrise(s, t);
  return (
    <Fenetre tampon="Crise" ton="rouge" titre={crise.titre} sousTitre={TH[t].nom + ' · ' + dateDuTour(s.tour)} largeur={760}
      pied={<>
        <button className="btn danger" onClick={() => jouer({ type: 'CRISE', intervenir: false })} data-tip="Opinion −3, crédibilité −4. La crise évolue librement pendant deux mois.">Ne pas intervenir</button>
        <button className="btn principal grand" disabled={!moy.possible} onClick={() => jouer({ type: 'CRISE', intervenir: true })}>Intervenir</button>
      </>}>
      <p className="texte-dossier">{crise.texte}</p>
      <div className="grille-infos">
        <div><span className="titre-section">Adversaire</span><div>{m && m.detectee ? MT[m.type].nom + ' · niveau estimé ' + m.estimation + ' ± ' + m.marge : 'Mal identifié'}</div></div>
        <div><span className="titre-section">Renseignement</span><div>{th.rens}</div></div>
      </div>
      {moy.zoom ? (
        <>
          <div className="grille-infos">
            <div><span className="titre-section">Forces spéciales</span><div>{moy.fs.length ? moy.fs.map(i => UN[i].nom).join(', ') : moy.fsDispo.length ? 'Projection d’urgence : ' + UN[moy.fsDispo[0]].nom : 'Aucune'}</div></div>
            <div><span className="titre-section">Appui feu</span><div>{moy.frappe.length ? moy.frappe.map(i => UN[i].nom).join(', ') : 'Aucun'}</div></div>
          </div>
          <div className="encart">Intervenir ouvre la carte régionale <b>{CARTES_REGIONALES[TH[t].carteRegionale].nom}</b> : six semaines au plus pour atteindre les objectifs.</div>
        </>
      ) : (
        <>
          <div className="grille-infos"><div><span className="titre-section">Moyens</span><div>{moy.sur.length ? moy.sur.map(i => UN[i].nom).join(', ') : moy.dispo.length ? 'Projection d’urgence : ' + UN[moy.dispo[0]].nom : 'Aucun'}</div></div></div>
          {moy.possible && (() => {
            const ev = evaluerCriseAbstraite(s, t, false);
            return (
              <table className="tableau">
                <tbody>
                  <tr><th>Probabilité de succès</th><td className="chiffres">{pct(ev.pSucces)}</td></tr>
                  <tr><th>Risque de pertes</th><td className="chiffres">{pct(ev.risquePertes)}</td></tr>
                  <tr><th>En cas de succès</th><td><span className="puce vert">Opinion +4</span><span className="puce vert">Crédibilité +4</span><span className="puce vert">Capital +2</span></td></tr>
                  <tr><th>En cas d’échec</th><td><span className="puce rouge">Opinion −4</span><span className="puce rouge">Crédibilité −3</span></td></tr>
                </tbody>
              </table>
            );
          })()}
        </>
      )}
      {!moy.possible && <div className="encart rouge">Aucun moyen adapté n’est disponible pour intervenir.</div>}
    </Fenetre>
  );
}

function FenetreApercu() {
  const { etat: s, ui, majUi, jouer } = usePartie();
  const a = ui.apercu!, op = OP[a.op], ev = evaluerOperation(s, a.op, a.theatre, a.cible, false);
  const m = a.cible ? menaceParId(s, a.cible) : null;
  const fermer = () => majUi({ apercu: null });
  return (
    <Fenetre tampon="Ordre d’opération" ton="turquoise" titre={op.nom} sousTitre={TH[a.theatre].nom} largeur={600} onFermer={fermer}
      pied={<><button className="btn fantome" onClick={fermer}>Annuler</button><button className="btn principal grand" onClick={() => jouer(a)}>Ordonner</button></>}>
      <p className="second">{op.description}</p>
      {m && <div className="encart">Cible : <b>{MT[m.type].nom}</b> — niveau estimé {m.estimation} ± {m.marge}</div>}
      <div className="proba">
        <div className="proba-lib"><span>Probabilité de succès</span><b className="chiffres">{pct(ev.pSucces)}</b></div>
        <div className="barre grande"><i style={{ width: ev.pSucces * 100 + '%', background: 'var(--vert)' }} /></div>
      </div>
      <table className="tableau">
        <tbody>
          <tr><th>Risque de pertes</th><td className="chiffres">{pct(ev.risquePertes)}</td></tr>
          <tr><th>Risque de dommages collatéraux</th><td className="chiffres">{pct(ev.risqueCollat)}</td></tr>
          <tr><th>Coût</th><td>{ev.cout} M€{ev.capital ? ' et ' + ev.capital + ' de capital politique' : ''} · 1 action</td></tr>
          <tr><th>Moyens engagés</th><td>{ev.participants.map(i => UN[i].nom).join(', ') || 'Capteurs ' + op.serviceRequis}</td></tr>
        </tbody>
      </table>
      <p className="discret petit">Évaluation fondée sur l’estimation du renseignement : la situation réelle peut différer.</p>
    </Fenetre>
  );
}

function FenetreBilanZoom({ b }: { b: BilanZoom }) {
  const { majUi } = usePartie();
  const fermer = () => majUi({ bilan: null });
  return (
    <Fenetre tampon="Retour d’expérience" ton={b.taux >= 0.5 ? 'turquoise' : 'rouge'} titre={b.titre} sousTitre={b.semaines + ' semaine(s) d’engagement' + (b.anticipe ? ' · retrait décidé' : '')}
      pied={<button className="btn principal grand" onClick={fermer}>Retour à la carte stratégique</button>}>
      <div className="objectifs">
        {b.objectifs.map((o, i) => <div key={i} className={'objectif ' + (o.atteint ? 'ok' : 'ko')}><span>{o.atteint ? '✓' : '✕'}</span>{o.texte}</div>)}
      </div>
      <div className="stats-ligne">
        <div><b className="chiffres">{b.stats.neutralises}</b><span>potentiel neutralisé</span></div>
        <div><b className="chiffres">{b.stats.evacues}</b><span>groupe(s) évacué(s)</span></div>
        <div><b className="chiffres">{b.stats.pertes}</b><span>perte(s)</span></div>
        <div><b className="chiffres">{b.stats.collat}</b><span>incident(s) collatéral(aux)</span></div>
      </div>
      <p className="second">Effets stratégiques : menace réduite de {b.baisseMenace}{b.effets.length ? ' · ' + b.effets.join(', ') : ''}.</p>
    </Fenetre>
  );
}

function FenetreFin() {
  const { etat: s, quitter } = usePartie();
  const f = s.fin!, sc = f.score!, st = s.stats;
  return (
    <Fenetre tampon={f.type === 'defaite' ? 'Défaite' : 'Fin de mandat'} ton={f.type === 'defaite' ? 'rouge' : 'turquoise'} largeur={820}
      titre={f.type === 'defaite' ? 'Vous quittez vos fonctions' : 'Bilan de fin de mandat'} sousTitre={dateDuTour(Math.min(f.tour, NB_TOURS - 1))}
      pied={<><button className="btn" onClick={() => exporter(s)}>Exporter la partie</button><button className="btn principal grand" onClick={quitter}>Nouvelle partie</button></>}>
      <p className="texte-dossier">{f.raison}</p>
      <div className="score">
        <div className="score-total"><b className="chiffres">{sc.total}</b><span>{sc.mention}</span></div>
        <div className="score-domaines">
          {sc.domaines.map(d => (
            <div key={d.nom} className="score-domaine">
              <span>{d.nom}</span><span className="barre"><i style={{ width: d.valeur + '%', background: 'var(--turquoise)' }} /></span><span className="chiffres">{d.valeur}</span><span className="discret chiffres">{Math.round(d.poids * 100)} %</span>
            </div>
          ))}
        </div>
      </div>
      <h3 className="titre-section">Évolution sur la période</h3>
      <Graphique historique={s.historique} largeur={760} hauteur={170} revelerMenaceExt />
      <p className="discret petit">Opérations : {st.operations} ({st.succes} succès) · Crises : {st.crisesInterv} interventions, {st.crisesReussies} réussies, {st.crisesIgnorees} ignorées · Attaques subies : {st.attaques} · Déjouées : {st.dejoues} · Pertes : {st.pertes} · Collatéraux : {st.collat} · Votes article 35 : {st.votes} ({st.votesPerdus} perdus)</p>
      <h3 className="titre-section">Chronologie des décisions</h3>
      <div className="chronologie">{s.decisions.map((d, i) => <div key={i}><span className="c-ambre">{dateDuTour(d.tour)}</span> — {d.texte}</div>)}</div>
    </Fenetre>
  );
}

function FenetreAide() {
  const { majUi } = usePartie();
  const fermer = () => majUi({ aide: false });
  return (
    <Fenetre tampon="Aide" titre="Règles essentielles" largeur={760} onFermer={fermer} pied={<button className="btn principal" onClick={fermer}>Fermer</button>}>
      <div className="aide">
        <p><b>Tour.</b> Un tour = un mois, de janvier 2015 à décembre 2017. Agissez, puis cliquez sur « Fin du mois » (ou Entrée).</p>
        <p><b>Actions.</b> Leur nombre dépend du capital politique ({PARAMS.actionsBase} + 1 par tranche de {PARAMS.actionsParCapital}, maximum {PARAMS.actionsMax}). Déployer, rapatrier, opérer, arbitrer le budget et solliciter un allié consomment une action. Réaffecter des capteurs est gratuit.</p>
        <p><b>Renseignement.</b> Chaque menace a une force réelle cachée. Vous n’en voyez qu’une estimation avec une marge. Plus le renseignement est élevé, plus l’estimation est précise. Sous {PARAMS.rensFauxRapport}, les rapports peuvent être faux.</p>
        <p><b>Menaces.</b> Une menace négligée grandit, peut s’étendre vers un théâtre voisin et passer à l’action. La pression (forces, capteurs, partenaires, alliés) freine sa croissance.</p>
        <p><b>Unités.</b> Disponible, en projection, déployée (la fatigue monte), puis en régénération après rapatriement. À 100 de fatigue, l’unité est relevée d’office.</p>
        <p><b>Article 35.</b> Au-delà de {PARAMS.dureeAvantVote} mois, une intervention extérieure est soumise au Parlement. Un vote négatif impose le retrait.</p>
        <p><b>Budget.</b> Chaque mois : solde + enveloppe − coûts. Un dépassement devient du surcoût et coûte du capital politique.</p>
        <p><b>Théâtres.</b> Cliquez sur un théâtre pour ouvrir sa carte régionale : lieux, liaisons, biome et saison du mois. Les saisons modifient la pression exercée par chaque type de force, la fatigue, les coûts et la croissance de certaines menaces.</p>
        <p><b>Tactique.</b> Sur la carte régionale, cliquez une unité déployée puis un lieu marqué : l’ordre proposé s’exécute (deux clics). Le panneau de l’unité règle sa posture (offensive, défensive, reconnaissance, formation, réserve) et liste toutes ses missions avec leurs risques. Ces ordres sont gratuits et se résolvent à la fin du mois. Frappes et raids exigent une position identifiée ; les drones et la reconnaissance identifient, l’aviation frappe, les forces au sol exploitent. Le soutien logistique limite ce qu’un théâtre peut porter.</p>
        <p><b>Crises.</b> Au Levant, au Sahel, en Libye, dans le golfe de Guinée et à Djibouti, intervenir ouvre une intervention de six semaines sur la carte régionale : raids, frappes, reconnaissance, appui aux forces locales, évacuation. Sur le territoire national, à l’est et en Indo-Pacifique, l’intervention est résolue globalement.</p>
        <p><b>Défaite.</b> Opinion sous 10, capital à 0, ou menace intérieure à 100 pendant 3 mois.</p>
        <p><b>Raccourcis.</b> Entrée : fin du mois · Échap : fermer · H : aide · 1, 2, 3 : choix d’un événement.</p>
      </div>
    </Fenetre>
  );
}
