import type { Categorie, DifficulteDef, EtatUniteId, TheatreDef, TypeCapteur } from '../sim/types';

export const MOIS: string[] = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

export const ANNEE_DEPART: number = 2015;

export const NB_TOURS: number = 36;

export const TYPES_CAPTEURS: TypeCapteur[] = ['HUMINT','SIGINT','IMINT'];

export const POIDS_CAPTEUR: Record<TypeCapteur, number> = { HUMINT: 9, SIGINT: 7, IMINT: 6 };

export const CATEGORIES: Record<Categorie, string> = {
  FS:    'Forces spéciales',
  INT:   'Sécurité intérieure',
  TERRE: 'Armée de Terre',
  AIR:   'Armée de l’Air',
  MER:   'Marine nationale'
};

export const ETATS_UNITE: Record<EtatUniteId, string> = {
  disponible:   'Disponible',
  projection:   'En projection',
  deployee:     'Déployée',
  regeneration: 'En régénération',
  indisponible: 'Indisponible (entretien)'
};

// ---------------------------------------------------------------------
// THÉÂTRES : nœuds du graphe stratégique (coordonnées schématiques)
// ---------------------------------------------------------------------
export const THEATRES: TheatreDef[] = [
  { id:'METRO',   lon:2.35, lat:48.86, nom:'Métropole',                court:'MÉTROPOLE', x:470, y:150, voisins:['EST','LIBYE','LEVANT'], exterieur:false, maritime:true,  rensBase:20, basePermanente:true,  carteRegionale:null },
  { id:'EST',     lon:24.5, lat:55, nom:'Europe de l’Est',           court:'EST',       x:650, y:110, voisins:['METRO'],                exterieur:true,  maritime:true,  rensBase:15, basePermanente:false, carteRegionale:null },
  { id:'LIBYE',   lon:15.5, lat:32, nom:'Libye-Méditerranée',        court:'LIBYE',     x:520, y:285, voisins:['METRO','SAHEL','LEVANT'], exterieur:true, maritime:true,  rensBase:5,  basePermanente:false, carteRegionale:null },
  { id:'LEVANT',  lon:40.5, lat:35.3, nom:'Levant (Irak-Syrie)',       court:'LEVANT',    x:700, y:250, voisins:['METRO','LIBYE','CORNE'], exterieur:true,  maritime:true,  rensBase:10, basePermanente:false, carteRegionale:'IRAK_NORD' },
  { id:'SAHEL',   lon:-0.5, lat:16.3, nom:'Sahel',                     court:'SAHEL',     x:400, y:390, voisins:['LIBYE','GUINEE'],        exterieur:true,  maritime:false, rensBase:12, basePermanente:false, carteRegionale:'SAHEL' },
  { id:'GUINEE',  lon:3.5, lat:3, nom:'Golfe de Guinée',           court:'GUINÉE',    x:330, y:500, voisins:['SAHEL'],                 exterieur:true,  maritime:true,  rensBase:10, basePermanente:true,  carteRegionale:null },
  { id:'CORNE',   lon:43.1, lat:11.6, nom:'Corne de l’Afrique (Djibouti)', court:'DJIBOUTI', x:740, y:420, voisins:['LEVANT','INDOPAC'],     exterieur:true,  maritime:true,  rensBase:18, basePermanente:true,  carteRegionale:null },
  { id:'INDOPAC', lon:110, lat:10, nom:'Indo-Pacifique',            court:'INDO-PAC',  x:920, y:470, voisins:['CORNE'],                 exterieur:true,  maritime:true,  rensBase:10, basePermanente:true,  carteRegionale:null }
];

// Groupes de théâtres réutilisés par les unités et les opérations
export const EXT: string[] = ['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE','INDOPAC'];

export const MARITIMES: string[] = ['EST','LIBYE','LEVANT','GUINEE','CORNE','INDOPAC'];

export const DIFFICULTES: Record<string, DifficulteDef> = {
  facile:    { nom:'Facile',    croissanceMult:0.8,  enveloppe:75, budgetInitial:120, capital:70, opinion:60, menaceInt:30, credibilite:65, forceMult:0.9 },
  normal:    { nom:'Normal',    croissanceMult:1.0,  enveloppe:62, budgetInitial:80, capital:60, opinion:55, menaceInt:35, credibilite:60, forceMult:1.0 },
  difficile: { nom:'Difficile', croissanceMult:1.25, enveloppe:52,  budgetInitial:50,  capital:50, opinion:50, menaceInt:42, credibilite:55, forceMult:1.12 }
};

// Paramètres de règles exprimés en données (seuils, coefficients)
export const PARAMS = {
  actionsBase:2, actionsParCapital:25, actionsMax:6,
  capitalMensuel:2, opinionRappel:0.05,
  regenerationTours:2, fatigueRepos:15, fatigueDeploiement:6,
  dureeAvantVote:4, probaEvenement:0.65, toursCriseLibre:2,
  margeMin:4, rensFauxRapport:30,
  plafondProtection:0.5   // part maximale de la menace intérieure que la protection peut absorber
};
