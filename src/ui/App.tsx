import { lazy, Suspense, useEffect } from 'react';
import { FournisseurJeu, useJeu } from './contexte';
import { Accueil } from './ecrans/Accueil';
import { Briefing } from './ecrans/Briefing';
import { Infobulle } from './composants/Infobulle';
import { Toasts } from './composants/Toasts';
import { Retour } from './composants/Retour';

// L'écran de jeu (carte du monde, symboles militaires, cartes régionales) forme un morceau à part :
// l'accueil s'affiche sans l'attendre, et il est préchargé pendant que le joueur lit l'accueil et le briefing.
const chargerJeu = () => import('./jeu/Jeu');
const Jeu = lazy(() => chargerJeu().then(m => ({ default: m.Jeu })));

export function App() {
  return (
    <FournisseurJeu>
      <Ecrans />
      <Infobulle />
      <Toasts />
      <Retour />
    </FournisseurJeu>
  );
}

function Ecrans() {
  const { etat, ui } = useJeu();
  useEffect(() => {
    const prechargement = () => { void chargerJeu(); };
    if ('requestIdleCallback' in window) { const id = requestIdleCallback(prechargement, { timeout: 1500 }); return () => cancelIdleCallback(id); }
    const id = setTimeout(prechargement, 300);
    return () => clearTimeout(id);
  }, []);
  if (!etat || ui.ecran === 'accueil') return <Accueil />;
  if (ui.ecran === 'briefing') return <Briefing />;
  return <Suspense fallback={<div className="chargement" role="status">Chargement de la carte…</div>}><Jeu /></Suspense>;
}
