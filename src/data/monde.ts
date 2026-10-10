import type { Categorie, DifficulteDef, EtatUniteId, SaisonDef, TheatreDef, TypeCapteur } from '../sim/types';

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
// SAISONS par théâtre (mois : 0 = janvier). Chaque mois appartient à une seule saison.
// Ordres de grandeur climatiques de notoriété publique ; les coefficients de jeu sont des choix
// de conception. // À VÉRIFIER (calage des coefficients par un retour d’expérience opérationnel)
// ---------------------------------------------------------------------
const SAISONS: Record<string, SaisonDef[]> = {
  METRO: [
    { id:'HIVER', nom:'Hiver', mois:[11,0,1], visuel:'brouillard', description:'Jours courts et intempéries : les dispositifs de protection s’usent plus vite.', effets:{ fatigue:1.1 } },
    { id:'PRINTEMPS', nom:'Printemps', mois:[2,3,4], visuel:'aucun', description:'Conditions habituelles.', effets:{} },
    { id:'ETE', nom:'Saison des grands rassemblements', mois:[5,6,7], visuel:'aucun', description:'Festivals, compétitions et vacances : davantage de sites à protéger.', effets:{ pression:{ INT:0.9 }, croissance:{ TERRO:1.1 } } },
    { id:'AUTOMNE', nom:'Automne', mois:[8,9,10], visuel:'aucun', description:'Conditions habituelles.', effets:{} }
  ],
  EST: [
    { id:'HIVER', nom:'Neige et grand froid', mois:[11,0,1], visuel:'neige', description:'Froid intense : fatigue accrue, coûts de soutien en hausse, manœuvre ralentie.', effets:{ fatigue:1.3, cout:1.1, pression:{ TERRE:0.9 } } },
    { id:'RASPOUTITSA_P', nom:'Raspoutitsa de printemps', mois:[2,3], visuel:'boue', description:'Le dégel transforme plaines et pistes en boue : les blindés restent sur les routes.', effets:{ pression:{ TERRE:0.7 }, fatigue:1.1 } },
    { id:'ETE', nom:'Saison des grandes manœuvres', mois:[4,5,6,7,8], visuel:'aucun', description:'Sols praticables : saison des exercices de grande ampleur de part et d’autre de la frontière.', effets:{ croissance:{ ETAT_EST:1.15 } } },
    { id:'RASPOUTITSA_A', nom:'Raspoutitsa d’automne', mois:[9,10], visuel:'boue', description:'Pluies d’automne et boue : mobilité hors route très réduite.', effets:{ pression:{ TERRE:0.75 }, fatigue:1.05 } }
  ],
  LIBYE: [
    { id:'HIVER', nom:'Tempêtes d’hiver', mois:[11,0,1,2], visuel:'houle', description:'Mer formée en Méditerranée centrale : patrouilles navales plus difficiles.', effets:{ pression:{ MER:0.85 } } },
    { id:'GHIBLI', nom:'Ghibli', mois:[3,4], visuel:'poussiere', description:'Vent de sable chaud du désert : visibilité réduite pour l’aviation.', effets:{ pression:{ AIR:0.9 }, recosZoom:-1 } },
    { id:'ETE', nom:'Été', mois:[5,6,7,8], visuel:'chaleur', description:'Fortes chaleurs à l’intérieur des terres.', effets:{ fatigue:1.2 } },
    { id:'AUTOMNE', nom:'Automne', mois:[9,10], visuel:'aucun', description:'Conditions habituelles.', effets:{} }
  ],
  LEVANT: [
    { id:'HIVER', nom:'Pluies et brouillard', mois:[11,0,1], visuel:'brouillard', description:'Plafond bas et brouillard : moins de sorties aériennes utiles.', effets:{ pression:{ AIR:0.85 }, frappesZoom:-1 } },
    { id:'PRINTEMPS', nom:'Tempêtes de sable', mois:[2,3,4], visuel:'poussiere', description:'Vents de sable printaniers : capteurs et aviation gênés.', effets:{ pression:{ AIR:0.9 } } },
    { id:'ETE', nom:'Chaleur extrême', mois:[5,6,7,8], visuel:'chaleur', description:'Plus de 45 °C dans la plaine : la fatigue des troupes s’accélère.', effets:{ fatigue:1.35, pression:{ TERRE:0.9, FS:0.95 } } },
    { id:'AUTOMNE', nom:'Automne', mois:[9,10], visuel:'aucun', description:'Conditions habituelles.', effets:{} }
  ],
  SAHEL: [
    { id:'SECHE', nom:'Saison sèche et harmattan', mois:[10,11,0,1], visuel:'poussiere', description:'Vent chargé de poussière : visibilité réduite pour l’aviation, pistes praticables.', effets:{ pression:{ AIR:0.9 } } },
    { id:'CHAUDE', nom:'Saison chaude', mois:[2,3,4,9], visuel:'chaleur', description:'Températures extrêmes : fatigue accrue des hommes et des matériels.', effets:{ fatigue:1.25 } },
    { id:'PLUIES', nom:'Saison des pluies', mois:[5,6,7,8], visuel:'pluie', description:'Oueds en crue et pistes coupées : mobilité terrestre réduite, l’adversaire aussi se déplace moins.', effets:{ pression:{ TERRE:0.7, FS:0.85 }, fatigue:1.1, croissance:{ DJIHAD:0.9 } } }
  ],
  GUINEE: [
    { id:'SECHE', nom:'Saison sèche', mois:[11,0,1,2], visuel:'poussiere', description:'Harmattan sur la côte ; mer calme, favorable aux abordages.', effets:{ pression:{ AIR:0.9 }, croissance:{ PIRATERIE:1.1 } } },
    { id:'GRANDES_PLUIES', nom:'Mousson : grande saison des pluies', mois:[3,4,5,6], visuel:'mousson', description:'Pluies diluviennes et mer agitée : fenêtres aériennes et navales réduites.', effets:{ pression:{ AIR:0.8, MER:0.85, TERRE:0.85 }, frappesZoom:-1 } },
    { id:'PETITE_SECHE', nom:'Petite saison sèche', mois:[7], visuel:'aucun', description:'Courte accalmie.', effets:{} },
    { id:'PETITES_PLUIES', nom:'Petite saison des pluies', mois:[8,9,10], visuel:'pluie', description:'Averses fréquentes : opérations aériennes perturbées.', effets:{ pression:{ AIR:0.9, MER:0.9 } } }
  ],
  CORNE: [
    { id:'MOUSSON_NE', nom:'Mousson du nord-est', mois:[11,0,1,2], visuel:'aucun', description:'Vents modérés ; navigation praticable.', effets:{ pression:{ MER:0.9 } } },
    { id:'INTERMOUSSON', nom:'Intermousson', mois:[3,4,9,10], visuel:'aucun', description:'Mer calme : fenêtre favorable aux pirates.', effets:{ croissance:{ PIRATERIE:1.2 } } },
    { id:'MOUSSON_SO', nom:'Mousson du sud-ouest', mois:[5,6,7,8], visuel:'houle', description:'Mer très forte dans l’océan Indien : la piraterie marque le pas ; chaleur écrasante à Djibouti.', effets:{ pression:{ MER:0.75 }, croissance:{ PIRATERIE:0.5 }, fatigue:1.3 } }
  ],
  INDOPAC: [
    { id:'INTERMOUSSON', nom:'Intermousson', mois:[2,3,4], visuel:'aucun', description:'Mer calme : activité accrue des flottilles et des chantiers sur les récifs.', effets:{ croissance:{ INDOPAC_P:1.1 } } },
    { id:'MOUSSON_SO', nom:'Mousson du sud-ouest', mois:[5,6,7], visuel:'mousson', description:'Pluies et houle : fenêtres aériennes et navales réduites.', effets:{ pression:{ MER:0.85, AIR:0.85 } } },
    { id:'TYPHONS', nom:'Saison des typhons', mois:[8,9], visuel:'houle', description:'Typhons en mer de Chine méridionale : bâtiments déroutés, vols annulés.', effets:{ pression:{ MER:0.7, AIR:0.8 } } },
    { id:'MOUSSON_NE', nom:'Mousson du nord-est', mois:[10,11,0,1], visuel:'aucun', description:'Vents établis, mer formée par endroits.', effets:{ pression:{ MER:0.9 } } }
  ]
};

// ---------------------------------------------------------------------
// THÉÂTRES : nœuds du graphe stratégique (coordonnées schématiques)
// ---------------------------------------------------------------------
export const THEATRES: TheatreDef[] = [
  { id:'METRO',   lon:2.35, lat:48.86, nom:'Métropole',                court:'MÉTROPOLE', x:470, y:150, voisins:['EST','LIBYE','LEVANT'], exterieur:false, maritime:true,  rensBase:20, basePermanente:true,  carteRegionale:'METRO', saisons:SAISONS.METRO },
  { id:'EST',     lon:24.5, lat:55, nom:'Europe de l’Est',           court:'EST',       x:650, y:110, voisins:['METRO'],                exterieur:true,  maritime:true,  rensBase:15, basePermanente:false, carteRegionale:'BALTIQUE', saisons:SAISONS.EST },
  { id:'LIBYE',   lon:15.5, lat:32, nom:'Libye-Méditerranée',        court:'LIBYE',     x:520, y:285, voisins:['METRO','SAHEL','LEVANT'], exterieur:true, maritime:true,  rensBase:5,  basePermanente:false, carteRegionale:'LIBYE', saisons:SAISONS.LIBYE },
  { id:'LEVANT',  lon:40.5, lat:35.3, nom:'Levant (Irak-Syrie)',       court:'LEVANT',    x:700, y:250, voisins:['METRO','LIBYE','CORNE'], exterieur:true,  maritime:true,  rensBase:10, basePermanente:false, carteRegionale:'IRAK_NORD', saisons:SAISONS.LEVANT },
  { id:'SAHEL',   lon:-0.5, lat:16.3, nom:'Sahel',                     court:'SAHEL',     x:400, y:390, voisins:['LIBYE','GUINEE'],        exterieur:true,  maritime:false, rensBase:12, basePermanente:false, carteRegionale:'SAHEL', saisons:SAISONS.SAHEL },
  { id:'GUINEE',  lon:3.5, lat:3, nom:'Golfe de Guinée',           court:'GUINÉE',    x:330, y:500, voisins:['SAHEL'],                 exterieur:true,  maritime:true,  rensBase:10, basePermanente:true,  carteRegionale:'GUINEE', saisons:SAISONS.GUINEE },
  { id:'CORNE',   lon:43.1, lat:11.6, nom:'Corne de l’Afrique (Djibouti)', court:'DJIBOUTI', x:740, y:420, voisins:['LEVANT','INDOPAC'],     exterieur:true,  maritime:true,  rensBase:18, basePermanente:true,  carteRegionale:'DJIBOUTI', saisons:SAISONS.CORNE },
  { id:'INDOPAC', lon:110, lat:10, nom:'Indo-Pacifique',            court:'INDO-PAC',  x:920, y:470, voisins:['CORNE'],                 exterieur:true,  maritime:true,  rensBase:10, basePermanente:true,  carteRegionale:'MER_CHINE', saisons:SAISONS.INDOPAC }
];

// Groupes de théâtres réutilisés par les unités et les opérations
export const EXT: string[] = ['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE','INDOPAC'];

export const MARITIMES: string[] = ['EST','LIBYE','LEVANT','GUINEE','CORNE','INDOPAC'];

// Enveloppe mensuelle (M€) : abstraction de jeu. Repères réels (fiche FRA, élevé) : provision OPEX de 450 M€/an
// en loi de finances (≈ 37,5 M€/mois) pour des surcoûts OPEX + MISSINT de 1,1 à 1,54 Md€/an ; l’écart est le « surcoût ».
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
  dureeAvantVote:4,  // article 35, al. 3 : autorisation du Parlement au-delà de 4 mois (Constitution, S1)
   probaEvenement:0.65, toursCriseLibre:2,
  margeMin:4, rensFauxRapport:30,
  plafondProtection:0.5   // part maximale de la menace intérieure que la protection peut absorber
};
