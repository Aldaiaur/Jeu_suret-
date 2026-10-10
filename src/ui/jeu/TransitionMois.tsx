// Compte rendu du mois écoulé : évolution des indicateurs, budget, faits marquants et comptes rendus des théâtres.
// Il reste affiché jusqu'à ce que le joueur le ferme (Entrée, Échap ou bouton), puis les dossiers en attente s'ouvrent.
import { useEffect, useRef } from 'react';
import { TH } from '../../data';
import { devise } from '../../sim';
import { usePartie } from '../contexte';

const LIGNES: [keyof import('../../sim').Ressources, string, boolean][] = [
  ['opinion', 'Opinion', true], ['capital', 'Capital', true], ['menaceInt', 'Menace intérieure', false], ['credibilite', 'Crédibilité', true]
];
const TON: Record<string, string> = { alerte: 'c-rouge', succes: 'c-vert', crise: 'c-rouge', evenement: 'c-ambre', decision: '', info: 'discret' };

export function TransitionMois() {
  const { etat: s, ui, majUi } = usePartie();
  const t = ui.transition;
  const bouton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (t) bouton.current?.focus(); }, [t]);
  if (!t) return null;
  const fermer = () => majUi({ transition: null });
  const budget = Math.round(t.apres.budget - t.avant.budget);
  const surcout = Math.round(t.apres.surcout - t.avant.surcout);
  const faits = t.faits.filter(f => f.genre !== 'info' || f.texte.includes('opérationnel') || f.texte.includes('disponible'));
  return (
    <div className="transition" role="dialog" aria-modal="true" aria-label={'Compte rendu de ' + t.moisEcoule}>
      <div className="transition-carte compte-rendu">
        <div className="discret petit compte-rendu-titre">Compte rendu de {t.moisEcoule}</div>
        <div className="transition-date">{t.date}</div>
        <div className="transition-deltas">
          {LIGNES.map(([k, lib, haut]) => {
            const d = Math.round(t.apres[k] - t.avant[k]);
            return (
              <div key={k}>
                <span className="discret">{lib}</span>
                <b className={'chiffres ' + (d === 0 ? '' : (d > 0) === haut ? 'c-vert' : 'c-rouge')}>{d > 0 ? '+' : ''}{d}</b>
                <span className="discret petit chiffres">{Math.round(t.apres[k])}</span>
              </div>
            );
          })}
          <div><span className="discret">Solde</span><b className={'chiffres ' + (budget >= 0 ? 'c-vert' : 'c-rouge')}>{budget > 0 ? '+' : ''}{budget} {devise(s)}</b><span className="discret petit chiffres">{Math.round(t.apres.budget)} {devise(s)}</span></div>
          {surcout > 0 && <div><span className="discret">Surcoût</span><b className="chiffres c-rouge">+{surcout} {devise(s)}</b></div>}
        </div>
        {faits.length > 0 && (
          <section className="compte-rendu-section">
            <h3 className="titre-section">Faits marquants</h3>
            <ul>{faits.slice(0, 8).map((f, i) => <li key={i} className={TON[f.genre] || ''}>{f.texte}</li>)}</ul>
          </section>
        )}
        {t.theatres.length > 0 && (
          <section className="compte-rendu-section">
            <h3 className="titre-section">Théâtres</h3>
            {t.theatres.map(x => <div key={x.theatre} className="compte-rendu-theatre"><b>{TH[x.theatre].nom}</b><span>{x.lignes.slice(0, 3).join(' ')}</span></div>)}
          </section>
        )}
        {t.evenements > 0 && <div className="transition-alerte">{t.evenements} dossier{t.evenements > 1 ? 's' : ''} en attente de décision</div>}
        <button ref={bouton} className="btn principal compte-rendu-bouton" onClick={fermer}>{t.evenements > 0 ? 'Ouvrir les dossiers' : 'Continuer'} <span className="touche">↵</span></button>
      </div>
    </div>
  );
}
