// Contenu du tutoriel de première partie.
// Une étape est validée par son bouton « Suivant » ou, si elle a une condition, dès que le joueur fait l'action demandée.
import { coutsMensuels, type Etat } from '../../sim';
import type { UiEtat } from '../contexte';

export interface Etape {
  id: string;
  titre: string;
  texte: string;
  cible?: string;               // valeur de data-tuto de l'élément mis en lumière
  condition?: (s: Etat, ui: UiEtat) => boolean;
  consigne?: string;            // ce que le joueur doit faire (affiché en évidence)
  preparer?: Partial<UiEtat>;   // état d'interface à appliquer en arrivant sur l'étape
}

const decisionContient = (s: Etat, t: string) => s.decisions.some(d => d.texte.includes(t));

export const ETAPES: Etape[] = [
  { id: 'bienvenue', titre: 'La cellule de crise',
    texte: 'Vous dirigez la sécurité de la France pendant trois ans. Chaque tour représente un mois. Vous agissez, puis vous clôturez le mois : les menaces évoluent, des événements surviennent, vos décisions produisent leurs effets.' },
  { id: 'jauges', cible: 'jauges', titre: 'Vos quatre indicateurs',
    texte: 'Opinion, capital politique, menace intérieure, crédibilité. Vous perdez si l’opinion tombe sous 10, si le capital tombe à 0, ou si la menace intérieure reste au maximum trois mois. Survolez n’importe quel élément pour une explication.' },
  { id: 'actions', cible: 'actions', titre: 'Actions et budget',
    texte: 'Chaque mois, vous disposez de quelques actions : engager ou rapatrier une unité, mener une opération, demander un appui allié. Leur nombre dépend de votre capital politique. Chaque unité engagée coûte aussi chaque mois.' },
  { id: 'carte', cible: 'carte', titre: 'La carte stratégique',
    texte: 'Chaque cercle est un théâtre. Le chiffre central est la menace estimée par vos services ; l’anneau se colore du vert au rouge. Les pays concernés se teintent selon la menace. Molette pour zoomer, glisser pour déplacer.' },
  { id: 'metro', cible: 'theatre-METRO', titre: 'Le territoire d’abord',
    texte: 'Une semaine après les attentats, la menace sur le territoire est votre priorité.', consigne: 'Cliquez sur la Métropole.',
    condition: (_, ui) => ui.selection?.kind === 'theatre' && ui.selection.id === 'METRO' },
  { id: 'menaces', cible: 'fiche-menaces', titre: 'Une estimation, pas une certitude',
    texte: 'Vous ne voyez jamais la force réelle d’une menace, seulement l’estimation de vos services et sa marge d’erreur (la bande colorée). Plus le renseignement est bon, plus la marge se resserre. La pression indique si vos moyens freinent la menace.' },
  { id: 'capteurs', cible: 'fiche-capteurs', titre: 'Orienter le renseignement',
    texte: 'Les capteurs des services (sources humaines, interceptions, imagerie) améliorent la connaissance d’un théâtre. Les réaffecter est gratuit et ne consomme pas d’action.', consigne: 'Ajoutez un capteur à la DGSI avec le bouton +.',
    condition: s => decisionContient(s, 'capteur') },
  { id: 'engager', cible: 'fiche-engager', titre: 'Protéger le territoire',
    texte: 'La protection du territoire mobilise 10 000 militaires. Elle freine la menace intérieure, mais coûte cher chaque mois. C’est votre première vraie décision.', consigne: 'Engagez « Protection du territoire », ou passez si vous préférez attendre.',
    condition: s => ['deployee', 'projection'].includes(s.unites.SENTI?.etat) },
  { id: 'sahel', cible: 'theatre-SAHEL', titre: 'Le Sahel',
    texte: 'Barkhane y est déjà engagée. Les opérations extérieures de plus de quatre mois doivent être autorisées par le Parlement (article 35) ; celle-ci l’est déjà.', consigne: 'Cliquez sur le Sahel.',
    condition: (_, ui) => ui.selection?.kind === 'theatre' && ui.selection.id === 'SAHEL' },
  { id: 'operations', cible: 'fiche-operations', titre: 'Opérations',
    texte: 'Avec des moyens sur place, vous pouvez mener des opérations. « Évaluer » affiche la probabilité de succès, les risques de pertes et de dommages collatéraux avant de décider. Les pertes civiles coûtent toujours cher.' },
  { id: 'rapports', cible: 'onglet-rapports', titre: 'Rapports de renseignement',
    texte: 'Chaque mois, vos services rendent compte. La fiabilité va de A (très sûre) à E (douteuse) : un rapport E peut être faux.', consigne: 'Ouvrez l’onglet Rapports.',
    condition: (_, ui) => ui.ongletDroit === 'rapports', preparer: { selection: null } },
  { id: 'fin', cible: 'fin-tour', titre: 'Clôturer le mois',
    texte: 'Quand vous avez terminé, clôturez le mois. Les actions non utilisées sont perdues.', consigne: 'Cliquez sur « Fin du mois » (ou Entrée).',
    condition: s => s.tour >= 1 },
  { id: 'bilan', cible: 'jauges', titre: 'Le mois écoulé',
    texte: 'Les flèches sous chaque indicateur montrent son évolution depuis le mois précédent. Les événements apparaissent dans des fenêtres : chaque choix affiche ses effets en vert (favorable) ou en rouge.' },
  { id: 'echeances', cible: 'echeances', titre: 'Anticiper',
    texte: 'L’onglet Situation rassemble les tendances et les échéances : votes au Parlement, unités épuisées, appuis qui expirent, dépassements budgétaires.', preparer: { ongletDroit: 'situation' } },
  { id: 'fini', titre: 'À vous',
    texte: 'Vous avez les bases. D’autres conseils apparaîtront au fil de la partie, la première fois que surviendra une crise, un vote ou une intervention. L’aide reste accessible à tout moment (touche H).' }
];

// Astuces ponctuelles, affichées une seule fois quand la situation se présente.
export interface Astuce { id: string; titre: string; texte: string; cible?: string; condition: (s: Etat, ui: UiEtat) => boolean }

export const ASTUCES: Astuce[] = [
  { id: 'evenement', titre: 'Un événement', texte: 'Lisez les effets sous chaque choix. Certains choix ont une issue incertaine, d’autres entraînent des suites les mois suivants. Touches 1, 2, 3 pour choisir.',
    condition: s => s.phase === 'evenement' },
  { id: 'crise', titre: 'Une crise', texte: 'Intervenir engage vos moyens et votre crédibilité ; ne rien faire coûte de l’opinion et laisse la menace grandir pendant deux mois. Au Levant et au Sahel, intervenir ouvre une carte régionale.',
    condition: s => s.phase === 'crise' },
  { id: 'zoom', titre: 'Intervention régionale', texte: 'Sélectionnez un détachement puis un lieu. Reconnaissez avant de frapper : une frappe mal renseignée touche plus de civils. Seules les forces locales reprennent durablement un lieu. « Semaine suivante » laisse l’adversaire réagir.',
    condition: s => s.phase === 'zoom' },
  { id: 'vote', titre: 'Article 35', texte: 'Une intervention dure depuis plus de quatre mois : le Parlement va voter. Plus l’opinion et le capital politique sont élevés, plus l’autorisation est probable. Un refus impose le retrait.', cible: 'article35',
    condition: s => Object.values(s.theatres).some(t => t.toursIntervention >= 3 && !t.voteFait) },
  { id: 'budget', titre: 'Budget sous tension', texte: 'Vos dépenses dépassent l’enveloppe. Le dépassement deviendra du surcoût et coûtera du capital politique. Rapatriez une unité, ou demandez une rallonge dans l’onglet Situation (arbitrages budgétaires).', cible: 'budget',
    condition: s => s.phase === 'jeu' && s.ressources.budget + s.ressources.enveloppe - coutsMensuels(s) < 0 },
  { id: 'actions-epuisees', titre: 'Plus d’action ce mois-ci', texte: 'Vous avez utilisé toutes vos actions. Vous pouvez encore réaffecter les capteurs, puis clôturer le mois.', cible: 'fin-tour',
    condition: s => s.phase === 'jeu' && s.actionsRestantes === 0 && s.tour <= 3 }
];
