import { useState } from 'react';
import { DIFFICULTES, NATIONS as NATIONS_JOUABLES } from '../../data';
import { dateDuTour } from '../../sim';
import { lireSauvegarde, useJeu } from '../contexte';
import { Drapeau, type NationJouable } from '../composants/Drapeau';
import { importerFichier } from '../sauvegarde';
import { tutorielDejaVu, activerTutoriel } from '../tutoriel/etat';

// Les nations décrites dans les données sont jouables ; les autres sont annoncées
const NATIONS: { id: NationJouable; nom: string; signature: string; dispo: boolean }[] = ([
  { id: 'FRA', nom: 'France', signature: '' },
  { id: 'GBR', nom: 'Royaume-Uni', signature: '' },
  { id: 'USA', nom: 'États-Unis', signature: 'Moyens immenses, attention dispersée' },
  { id: 'RUS', nom: 'Russie', signature: 'Le déni plausible' },
  { id: 'CHN', nom: 'Chine', signature: 'Le temps long, la zone grise' },
  { id: 'ISR', nom: 'Israël', signature: 'Fronts multiples, délais courts' }
] as { id: NationJouable; nom: string; signature: string }[]).map(n => {
  const N = NATIONS_JOUABLES[n.id];
  return { ...n, signature: N ? N.signature : n.signature, dispo: !!N };
});
// Le tutoriel suit la campagne de référence (France, janvier 2015)
const NATION_TUTORIEL = 'FRA';

export function Accueil() {
  const { lancer, charger, notifier } = useJeu();
  const [nation, setNation] = useState<NationJouable>('FRA');
  const [difficulte, setDifficulte] = useState('normal');
  const [graine, setGraine] = useState(String(Date.now() % 1000000));
  const [avance, setAvance] = useState(false);
  const [tuto, setTuto] = useState(!tutorielDejaVu());
  const sauvegarde = lireSauvegarde();

  const demarrer = () => { activerTutoriel(tuto && nation === NATION_TUTORIEL); lancer(graine.trim() || '1', difficulte, nation); };

  return (
    <div className="accueil">
      <div className="accueil-fond" aria-hidden="true" />
      <div className="accueil-contenu">
        <div className="accueil-marque">
          <h1 className="logo">RED<b>LINES</b></h1>
          <div className="logo-trait" />
          <p className="accueil-accroche">Chaque puissance a ses lignes rouges. Tenez les vôtres.</p>
        </div>

        <div className="accueil-panneau">
          {sauvegarde && (
            <button className="reprise" onClick={() => charger(sauvegarde)}>
              <span><span className="titre-section">Reprendre</span><b>{(NATIONS_JOUABLES[sauvegarde.nation] || NATIONS_JOUABLES.FRA).nom} — {dateDuTour(sauvegarde.tour)}</b></span>
              <span className="btn principal">Continuer</span>
            </button>
          )}

          <h3 className="titre-section">Nation</h3>
          <div className="nations">
            {NATIONS.map(n => (
              <button key={n.id} className={'nation' + (nation === n.id ? ' sel' : '') + (n.dispo ? '' : ' verrou')} disabled={!n.dispo} onClick={() => setNation(n.id)}
                data-tip={n.dispo ? undefined : n.nom + '\nEn préparation.'}>
                <Drapeau nation={n.id} taille={22} />
                <span className="nation-nom">{n.nom}</span>
                <span className="nation-sig">{n.dispo ? n.signature : 'Bientôt'}</span>
              </button>
            ))}
          </div>

          <h3 className="titre-section">Difficulté</h3>
          <div className="onglets">
            {Object.keys(DIFFICULTES).map(k => (
              <button key={k} className={'onglet' + (difficulte === k ? ' actif' : '')} onClick={() => setDifficulte(k)}>{DIFFICULTES[k].nom}</button>
            ))}
          </div>

          <label className={'case' + (nation === NATION_TUTORIEL ? '' : ' inactif')} data-tip={nation === NATION_TUTORIEL ? undefined : 'Le tutoriel accompagne la campagne de la France.'}>
            <input type="checkbox" checked={tuto && nation === NATION_TUTORIEL} disabled={nation !== NATION_TUTORIEL} onChange={e => setTuto(e.target.checked)} />
            <span>Tutoriel guidé pendant les premiers mois{nation === NATION_TUTORIEL ? '' : ' (campagne de la France)'}</span>
          </label>

          <button className="lien-avance" onClick={() => setAvance(a => !a)}>{avance ? '▾' : '▸'} Options avancées</button>
          {avance && (
            <div className="avance">
              <label className="champ-lib" data-tip="Même graine et mêmes décisions donnent la même partie.">Graine</label>
              <input className="champ chiffres" value={graine} onChange={e => setGraine(e.target.value)} />
            </div>
          )}

          <div className="accueil-boutons">
            <button className="btn fantome" onClick={() => importerFichier(charger, m => notifier('Import impossible', m, 'alerte'))}>Importer une partie</button>
            <button className="btn principal grand" onClick={demarrer}>Nouvelle partie</button>
          </div>
        </div>
        <p className="accueil-avertissement">Fiction. Le contexte de janvier 2015 est réel ; tout ce qui suit dépend de vos choix. Les personnages sont inventés.</p>
      </div>
    </div>
  );
}
