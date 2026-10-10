import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import './ui/styles/base.css';
import './ui/styles/jeu.css';
import './ui/styles/ecrans.css';
import { App } from './ui/App';
import { verifierDonnees } from './sim';

const Galerie = lazy(() => import('./ui/ecrans/Galerie').then(m => ({ default: m.Galerie })));

// Contrôle des données en développement seulement : les tests le garantissent pour la version publiée
if (import.meta.env.DEV) {
  const erreurs = verifierDonnees();
  if (erreurs.length) console.warn('Incohérences dans les données :\n' + erreurs.join('\n'));
}

const galerie = import.meta.env.DEV && new URLSearchParams(location.search).has('galerie');
createRoot(document.getElementById('racine')!).render(<StrictMode>{galerie ? <Suspense fallback={null}><Galerie /></Suspense> : <App />}</StrictMode>);
