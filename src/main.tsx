import { StrictMode } from 'react';
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

const erreurs = verifierDonnees();
if (erreurs.length) console.warn('Incohérences dans les données :\n' + erreurs.join('\n'));

createRoot(document.getElementById('racine')!).render(<StrictMode><App /></StrictMode>);
