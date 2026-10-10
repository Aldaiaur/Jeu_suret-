// Bandeau de passage au mois suivant : nouvelle date et évolution des indicateurs.
import { useEffect } from 'react';
import { usePartie } from '../contexte';

const LIGNES: [keyof import('../../sim').Ressources, string, boolean][] = [
  ['opinion', 'Opinion', true], ['capital', 'Capital', true], ['menaceInt', 'Menace intérieure', false], ['credibilite', 'Crédibilité', true]
];

export function TransitionMois() {
  const { ui, majUi } = usePartie();
  const t = ui.transition;
  useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => majUi({ transition: null }), 2600);
    return () => clearTimeout(id);
  }, [t, majUi]);
  if (!t) return null;
  const budget = Math.round(t.apres.budget - t.avant.budget);
  return (
    <div className="transition" onClick={() => majUi({ transition: null })}>
      <div className="transition-carte">
        <div className="transition-date">{t.date}</div>
        <div className="transition-deltas">
          {LIGNES.map(([k, lib, haut]) => {
            const d = Math.round(t.apres[k] - t.avant[k]);
            return (
              <div key={k}>
                <span className="discret">{lib}</span>
                <b className={'chiffres ' + (d === 0 ? '' : (d > 0) === haut ? 'c-vert' : 'c-rouge')}>{d > 0 ? '+' : ''}{d}</b>
              </div>
            );
          })}
          <div><span className="discret">Solde</span><b className={'chiffres ' + (budget >= 0 ? 'c-vert' : 'c-rouge')}>{budget > 0 ? '+' : ''}{budget} M€</b></div>
        </div>
        {t.evenements > 0 && <div className="transition-alerte">{t.evenements} dossier{t.evenements > 1 ? 's' : ''} en attente de décision</div>}
      </div>
    </div>
  );
}
