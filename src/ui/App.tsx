import { useEffect } from 'react';
import { EV } from '../data';
import { choixPermis } from '../sim';
import { FournisseurJeu, useJeu } from './contexte';
import { Accueil } from './ecrans/Accueil';
import { Briefing } from './ecrans/Briefing';
import { BarreHaute } from './jeu/BarreHaute';
import { PanneauGauche } from './jeu/PanneauGauche';
import { PanneauDroit } from './jeu/PanneauDroit';
import { CarteMonde } from './jeu/CarteMonde';
import { VueRegionale } from './jeu/VueRegionale';
import { Fiche } from './jeu/Fiche';
import { Fenetres } from './jeu/Fenetres';
import { VueZoom } from './jeu/VueZoom';
import { Debug } from './jeu/Debug';
import { TransitionMois } from './jeu/TransitionMois';
import { Infobulle } from './composants/Infobulle';
import { Toasts } from './composants/Toasts';
import { Tutoriel } from './tutoriel/Tutoriel';

export function App() {
  return (
    <FournisseurJeu>
      <Ecrans />
      <Infobulle />
      <Toasts />
    </FournisseurJeu>
  );
}

function Ecrans() {
  const { etat, ui } = useJeu();
  if (!etat || ui.ecran === 'accueil') return <Accueil />;
  if (ui.ecran === 'briefing') return <Briefing />;
  return <Jeu />;
}

function Jeu() {
  const { etat: s, ui } = useJeu();
  useRaccourcis();
  return (
    <div className="jeu">
      <BarreHaute />
      <div className="jeu-corps">
        <PanneauGauche />
        <main className="centre">
          <CarteMonde />
          {ui.selection?.kind === 'theatre' && <VueRegionale theatre={ui.selection.id} />}
          <Fiche />
        </main>
        <PanneauDroit />
      </div>
      {s!.zoom && !ui.bilan && <VueZoom />}
      <Fenetres />
      <TransitionMois />
      <Tutoriel />
      <Debug />
    </div>
  );
}

// Raccourcis clavier : Entrée (fin du mois / semaine suivante), Échap, H, 1-3 (choix d'un événement)
function useRaccourcis() {
  const { etat: s, ui, majUi, jouer, terminerTour } = useJeu();
  useEffect(() => {
    const touche = (ev: KeyboardEvent) => {
      if (!s || (ev.target as HTMLElement).closest('input, select, textarea')) return;
      if (ev.key === 'Escape') {
        if (ui.aide) majUi({ aide: false });
        else if (ui.apercu) majUi({ apercu: null });
        else if (ui.zoomLieu || ui.zoomUnite) majUi({ zoomLieu: null, zoomUnite: null });
        else if (ui.uniteRegion) majUi({ uniteRegion: null });
        else if (ui.selection) majUi({ selection: null });
        return;
      }
      if (ev.key === 'h' || ev.key === 'H') { majUi({ aide: !ui.aide }); return; }
      if (ui.aide || ui.apercu || ui.bilan) return;
      if (ev.key === 'Enter') {
        if (s.phase === 'jeu') { ev.preventDefault(); terminerTour(); }
        else if (s.phase === 'zoom') { ev.preventDefault(); jouer({ type: 'Z_SEMAINE' }); }
        return;
      }
      if (s.phase === 'evenement' && /^[1-3]$/.test(ev.key)) {
        const i = Number(ev.key) - 1, c = EV[s.evenementCourant!].choix[i];
        if (c && choixPermis(s, c)) jouer({ type: 'CHOIX', index: i });
      }
    };
    window.addEventListener('keydown', touche);
    return () => window.removeEventListener('keydown', touche);
  }, [s, ui, majUi, jouer, terminerTour]);
}
