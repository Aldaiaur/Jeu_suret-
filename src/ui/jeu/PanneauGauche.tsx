import { ALLIES, CATEGORIES, ETATS_UNITE, SERVICES, TH, THEATRES, TYPES_CAPTEURS, UNITES } from '../../data';
import { capteursLibres, fiabilite, type Categorie } from '../../sim';
import { usePartie, type OngletGauche } from '../contexte';
import { COULEURS_CATEGORIE, couleurNiveau } from '../format';
import { SymboleHtml } from '../composants/SymboleOtan';

export function PanneauGauche() {
  const { etat: s, ui, majUi } = usePartie();
  const engagees = UNITES.filter(u => ['deployee', 'projection'].includes(s.unites[u.id].etat)).length;
  const onglet = (id: OngletGauche, lib: string, compte?: number) => (
    <button className={'onglet' + (ui.ongletGauche === id ? ' actif' : '')} onClick={() => majUi({ ongletGauche: id })} data-tuto={'onglet-' + id}>
      {lib}{compte !== undefined && <span className="compte">{compte}</span>}
    </button>
  );
  return (
    <aside className="panneau panneau-gauche">
      <div className="onglets">
        {onglet('forces', 'Forces', engagees)}
        {onglet('renseignement', 'Renseignement')}
        {onglet('allies', 'Alliés')}
      </div>
      <div className="panneau-defile">
        {ui.ongletGauche === 'forces' && <ListeForces />}
        {ui.ongletGauche === 'renseignement' && <ListeRenseignement />}
        {ui.ongletGauche === 'allies' && <ListeAllies />}
      </div>
    </aside>
  );
}

function ListeForces() {
  const { etat: s, ui, majUi } = usePartie();
  return (
    <>
      {(Object.keys(CATEGORIES) as Categorie[]).map(cat => (
        <section key={cat} className="groupe">
          <h3 className="titre-section"><i className="point" style={{ background: COULEURS_CATEGORIE[cat] }} />{CATEGORIES[cat]}</h3>
          {UNITES.filter(u => u.categorie === cat).map(u => {
            const e = s.unites[u.id];
            const sel = ui.selection?.kind === 'unite' && ui.selection.id === u.id;
            const det = e.etat === 'projection' || e.etat === 'regeneration' ? ' · ' + e.compteur + ' m' : e.etat === 'indisponible' && e.indispo ? ' · ' + e.indispo + ' m' : '';
            return (
              <button key={u.id} className={'ligne-unite' + (sel ? ' sel' : '')} onClick={() => majUi({ selection: { kind: 'unite', id: u.id } })}
                data-tip={u.nom + '\n' + u.type + ' · effectif ' + u.effectif + '\nAssaut ' + u.cap.assaut + ' · Rens. ' + u.cap.renseignement + ' · Frappe ' + u.cap.frappe + ' · Discrétion ' + u.cap.discretion + ' · Endurance ' + u.cap.endurance + '\nFatigue ' + Math.round(e.fatigue)}>
                <span className="ligne-unite-nom"><SymboleHtml unite={u.id} taille={11} />{u.nom}</span>
                {e.theatre && <span className="ligne-unite-lieu">{TH[e.theatre].court}</span>}
                <span className={'etat etat-' + e.etat}>{ETATS_UNITE[e.etat].replace(' (entretien)', '')}{det}</span>
                <span className="barre ligne-unite-fatigue"><i style={{ width: e.fatigue + '%', background: couleurNiveau(e.fatigue) }} /></span>
              </button>
            );
          })}
        </section>
      ))}
    </>
  );
}

function ListeRenseignement() {
  const { etat: s, ui, majUi } = usePartie();
  return (
    <>
      <section className="groupe">
        <h3 className="titre-section">Services</h3>
        {SERVICES.map(sv => {
          const st = s.services[sv.id];
          const sel = ui.selection?.kind === 'service' && ui.selection.id === sv.id;
          return (
            <button key={sv.id} className={'carte-service' + (sel ? ' sel' : '')} onClick={() => majUi({ selection: { kind: 'service', id: sv.id } })}
              data-tip={sv.libelle + '\n' + sv.domaine + ' · théâtres : ' + sv.theatres.map(t => TH[t].court).join(', ')} data-tuto={'service-' + sv.id}>
              <div className="carte-service-haut"><b>{sv.nom}</b><span className="discret">{sv.domaine}</span></div>
              <div className="capteurs-resume">
                {TYPES_CAPTEURS.filter(t => st.capteurs[t] > 0).map(t => {
                  const pris = st.capteurs[t] - capteursLibres(s, sv.id, t);
                  return (
                    <span key={t} className="capteur-type">
                      <span className="capteur-lib">{t}</span>
                      <span className="segments">{Array.from({ length: st.capteurs[t] }, (_, i) => <i key={i} className={i < pris ? 'pris' : ''} />)}</span>
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </section>
      <section className="groupe">
        <h3 className="titre-section">Niveau par théâtre</h3>
        {THEATRES.map(T => {
          const r = s.theatres[T.id].rens;
          return (
            <button key={T.id} className="ligne-rens" onClick={() => majUi({ selection: { kind: 'theatre', id: T.id } })} data-tip={'Renseignement ' + T.nom + ' : ' + r + '\nFiabilité ' + fiabilite(r) + ' (A très sûre, E douteuse)'}>
              <span>{T.nom}</span>
              <span className="chiffres c-turquoise">{r}</span>
              <span className="pastille contour">{fiabilite(r)}</span>
              <span className="barre"><i style={{ width: r + '%', background: 'var(--turquoise)' }} /></span>
            </button>
          );
        })}
      </section>
    </>
  );
}

function ListeAllies() {
  const { etat: s, ui, majUi } = usePartie();
  return (
    <section className="groupe">
      {ALLIES.map(A => {
        const st = s.allies[A.id];
        const actifs = THEATRES.reduce((n, T) => n + s.theatres[T.id].appuis.filter(x => x.allie === A.id).length, 0);
        const sel = ui.selection?.kind === 'allie' && ui.selection.id === A.id;
        return (
          <button key={A.id} className={'carte-allie' + (sel ? ' sel' : '')} onClick={() => majUi({ selection: { kind: 'allie', id: A.id } })}
            data-tip={A.nom + '\n' + A.description + '\nRelation ' + Math.round(st.relation) + '/100 (référence ' + A.relation + ')'}>
            <div className="carte-allie-haut">
              <b>{A.nom}</b>
              <span className="chiffres">{Math.round(st.relation)}</span>
            </div>
            <span className="barre"><i style={{ width: st.relation + '%', background: couleurNiveau(st.relation, true) }} /></span>
            <div className="carte-allie-bas">
              {actifs > 0 && <span className="pastille violet">{actifs} appui{actifs > 1 ? 's' : ''} en cours</span>}
              {st.cooldown > 0 && <span className="pastille">nouvelle demande dans {st.cooldown} m</span>}
            </div>
          </button>
        );
      })}
    </section>
  );
}
