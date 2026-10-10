// État de l'interface et accès à la partie. La partie elle-même n'est jamais modifiée ici :
// elle est remplacée par le retour des fonctions pures de la simulation.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  appliquerAction, finDeTour, migrerEtat, nouvellePartie, actionsPossibles, cleAction, dateDuTour,
  type Action, type BilanZoom, type EntreeJournal, type Etat, type Ressources
} from '../sim';
import { NB_TOURS } from '../data';
import { jouerSon, sonAction } from './sons';

export type Selection = { kind: 'theatre' | 'unite' | 'service' | 'allie'; id: string };
export type Ecran = 'accueil' | 'briefing' | 'jeu';
export type OngletGauche = 'forces' | 'renseignement' | 'allies';
export type OngletDroit = 'situation' | 'rapports' | 'journal';

export interface Toast { id: number; titre: string; texte: string; genre: 'info' | 'succes' | 'alerte' }
export interface TransitionMois {
  date: string; moisEcoule: string; avant: Ressources; apres: Ressources; evenements: number;
  faits: EntreeJournal[];                        // entrées du journal produites par la fin du mois
  theatres: { theatre: string; lignes: string[] }[];
}

export interface UiEtat {
  ecran: Ecran;
  selection: Selection | null;
  apercu: Extract<Action, { type: 'OPERATION' }> | null;
  bilan: BilanZoom | null;
  aide: boolean;
  catalogue: boolean;
  debug: boolean;
  refMois: Ressources | null;
  zoomLieu: string | null;
  zoomUnite: string | null;
  uniteRegion: string | null;   // unité sélectionnée sur la carte régionale (ordres tactiques)
  ongletGauche: OngletGauche;
  ongletDroit: OngletDroit;
  transition: TransitionMois | null;
  retour: { cle: number; texte: string; unite: string | null } | null;
  ficheRepliee: boolean;           // fiche de droite réduite à un onglet, pour dégager la carte   // confirmation brève du dernier ordre
}

const UI_INITIAL: UiEtat = {
  ecran: 'accueil', selection: null, apercu: null, bilan: null, aide: false, catalogue: false, debug: false, refMois: null,
  zoomLieu: null, zoomUnite: null, uniteRegion: null, ongletGauche: 'forces', ongletDroit: 'situation', transition: null, retour: null, ficheRepliee: false
};

interface Contexte {
  etat: Etat | null;
  ui: UiEtat;
  possibles: Action[];
  estPossible: (a: Action) => boolean;
  majUi: (p: Partial<UiEtat> | ((u: UiEtat) => Partial<UiEtat>)) => void;
  jouer: (a: Action) => void;
  terminerTour: () => void;
  lancer: (graine: string, difficulte: string, nation?: string) => void;
  charger: (s: Etat) => void;
  quitter: () => void;
  remplacer: (s: Etat) => void;
  toasts: Toast[];
  notifier: (titre: string, texte: string, genre?: Toast['genre']) => void;
  fermerToast: (id: number) => void;
}

const Ctx = createContext<Contexte | null>(null);
export const CLE_SAUVEGARDE = 'redlines.sauvegarde.v1';

export function lireSauvegarde(): Etat | null {
  try {
    const t = localStorage.getItem(CLE_SAUVEGARDE);
    if (!t) return null;
    const s = JSON.parse(t) as Etat;
    return s && s.version === 1 && !s.fin ? migrerEtat(s) : null;
  } catch { return null; }
}

export function FournisseurJeu({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [ui, setUi] = useState<UiEtat>(UI_INITIAL);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idToast = useRef(1);

  const majUi = useCallback((p: Partial<UiEtat> | ((u: UiEtat) => Partial<UiEtat>)) => {
    setUi(u => ({ ...u, ...(typeof p === 'function' ? p(u) : p) }));
  }, []);

  const notifier = useCallback((titre: string, texte: string, genre: Toast['genre'] = 'info') => {
    const id = idToast.current++;
    setToasts(l => [...l.slice(-3), { id, titre, texte, genre }]);
    setTimeout(() => setToasts(l => l.filter(t => t.id !== id)), 7000);
  }, []);
  const fermerToast = useCallback((id: number) => setToasts(l => l.filter(t => t.id !== id)), []);

  // Sauvegarde automatique à chaque changement d'état
  useEffect(() => {
    try {
      if (etat && !etat.fin) localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(etat));
      else if (etat && etat.fin) localStorage.removeItem(CLE_SAUVEGARDE);
    } catch { /* stockage indisponible : la partie continue sans sauvegarde */ }
  }, [etat]);

  const jouer = useCallback((a: Action) => {
    if (!etat) return;
    let n: Etat;
    try { n = appliquerAction(etat, a); }
    catch (e) { notifier('Action refusée', (e as Error).message, 'alerte'); return; }
    const bilan = etat.zoom && !n.zoom && n.dernierBilan ? n.dernierBilan : null;
    if (n.dernierResultat && n.dernierResultat !== etat.dernierResultat && !bilan) {
      // La dernière entrée du journal porte la tonalité du résultat
      const g = n.journal[0]?.genre;
      notifier(n.dernierResultat.titre, n.dernierResultat.texte, g === 'alerte' ? 'alerte' : g === 'succes' ? 'succes' : 'info');
    }
    setEtat(n);
    // Retour immédiat : son et confirmation brève pour les ordres qui n'ouvrent pas de notification
    const derniere = n.decisions.length > etat.decisions.length ? n.decisions[n.decisions.length - 1].texte : null;
    const unite = 'unite' in a ? a.unite : null;
    const retour = derniere && (!n.dernierResultat || n.dernierResultat === etat.dernierResultat) ? { cle: Date.now(), texte: derniere, unite } : null;
    jouerSon(sonAction(a, n));
    setUi(u => ({ ...u, apercu: null, bilan: bilan || u.bilan, retour: retour || (unite ? { cle: Date.now(), texte: '', unite } : u.retour), ...(n.zoom ? {} : { zoomLieu: null, zoomUnite: null }) }));
  }, [etat, notifier]);

  const terminerTour = useCallback(() => {
    if (!etat || etat.phase !== 'jeu') return;
    const n = finDeTour(etat);
    jouerSon('mois');
    setEtat(n);
    const nouveaux = n.journal.filter(j => j.tour === n.tour && j.genre === 'evenement').length;
    // Entrées ajoutées au journal par la fin du mois : celles qui précèdent l'ancienne entrée la plus récente
    const ancienne = etat.journal[0];
    const fin = ancienne ? n.journal.findIndex(j => j.texte === ancienne.texte && j.tour === ancienne.tour && j.genre === ancienne.genre) : n.journal.length;
    const faits = n.journal.slice(0, fin < 0 ? 12 : fin).filter(j => j.genre !== 'tour').reverse();
    const theatres = Object.entries(n.theatres).filter(([, th]) => th.rapportTactique.length).map(([t, th]) => ({ theatre: t, lignes: th.rapportTactique }));
    setUi(u => ({
      ...u, refMois: { ...etat.ressources },
      transition: n.fin ? null : { date: dateDuTour(Math.min(n.tour, NB_TOURS - 1)), moisEcoule: dateDuTour(etat.tour), avant: { ...etat.ressources }, apres: { ...n.ressources }, evenements: nouveaux + n.file.length, faits, theatres }
    }));
  }, [etat]);

  const lancer = useCallback((graine: string, difficulte: string, nation = 'FRA') => {
    setEtat(nouvellePartie(graine, difficulte, nation));
    setUi({ ...UI_INITIAL, ecran: 'briefing' });
  }, []);
  const charger = useCallback((s: Etat) => {
    setEtat(migrerEtat(s));
    setUi({ ...UI_INITIAL, ecran: s.phase === 'doctrine' ? 'briefing' : 'jeu' });
  }, []);
  const quitter = useCallback(() => { setEtat(null); setUi(UI_INITIAL); }, []);
  const remplacer = useCallback((s: Etat) => setEtat(s), []);

  const possibles = useMemo(() => (etat ? actionsPossibles(etat) : []), [etat]);
  const clesPossibles = useMemo(() => new Set(possibles.map(cleAction)), [possibles]);
  const estPossible = useCallback((a: Action) => clesPossibles.has(cleAction(a)), [clesPossibles]);

  const valeur: Contexte = { etat, ui, possibles, estPossible, majUi, jouer, terminerTour, lancer, charger, quitter, remplacer, toasts, notifier, fermerToast };
  // Accès réservé au développement : les captures automatiques pilotent le jeu par ce biais
  if (import.meta.env.DEV) (window as unknown as { __jeu: Contexte }).__jeu = valeur;
  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function useJeu(): Contexte {
  const c = useContext(Ctx);
  if (!c) throw new Error('useJeu hors du FournisseurJeu');
  return c;
}

// Raccourci pour les composants affichés uniquement pendant une partie
export function usePartie(): Contexte & { etat: Etat } {
  const c = useJeu();
  if (!c.etat) throw new Error('aucune partie en cours');
  return c as Contexte & { etat: Etat };
}
