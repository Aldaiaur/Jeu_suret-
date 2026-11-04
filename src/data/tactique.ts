import type { Categorie, MissionDef, PostureDef, Posture, TypeMission } from '../sim/types';

// ---------------------------------------------------------------------
// TACTIQUE : postures et missions des unités déployées, résolues chaque mois.
// Les coefficients sont des choix de conception, à caler par des parties tests.
// // À VÉRIFIER (équilibrage des coefficients)
// ---------------------------------------------------------------------
const TOUTES: Categorie[] = ['FS', 'INT', 'TERRE', 'AIR', 'MER'];

export const POSTURES: Record<Posture, PostureDef> = {
  offensive: { id:'offensive', nom:'Offensive', description:'Pression maximale sur l’adversaire, au prix de la fatigue et des risques.',
    pression:1.4, fatigue:1.5, rens:1, risquePertes:0.05, categories:['FS','TERRE','AIR','MER'] },
  defensive: { id:'defensive', nom:'Défensive', description:'Protège le lieu tenu : il ne peut pas tomber par infiltration et se défend mieux en crise.',
    pression:1, fatigue:1, rens:1, risquePertes:0, categories:TOUTES },
  reconnaissance: { id:'reconnaissance', nom:'Reconnaissance', description:'Améliore le renseignement local et identifie les positions adverses voisines.',
    pression:0.6, fatigue:0.9, rens:2, risquePertes:0.01, connu:25, categories:TOUTES },
  formation: { id:'formation', nom:'Formation des partenaires', description:'Forme et accompagne les forces locales : effet durable, pression faible.',
    pression:0.4, fatigue:0.8, rens:1, risquePertes:0.01, partenaire:1.5, categories:['FS','TERRE'] },
  reserve: { id:'reserve', nom:'Réserve', description:'Repos et remise en condition sur place, disponible pour une crise.',
    pression:0.15, fatigue:0.4, rens:0.5, risquePertes:0, categories:TOUTES }
};

export const MISSIONS: Record<TypeMission, MissionDef> = {
  patrouille: { id:'patrouille', nom:'Patrouille de zone', verbe:'Patrouiller', cible:'lieu', categories:['TERRE','FS','INT','MER'],
    description:'Réduit l’activité adverse sur le lieu et ses abords, améliore la connaissance du terrain.', soutien:0, cout:0.5 },
  escorte: { id:'escorte', nom:'Escorte de convoi', verbe:'Escorter', cible:'liaison', categories:['TERRE','MER'],
    description:'Sécurise une liaison logistique : capacité de soutien accrue et moins de pertes sur le théâtre.', soutien:-2, cout:0.5 },
  axe: { id:'axe', nom:'Contrôle d’un axe', verbe:'Contrôler l’axe', cible:'liaison', categories:['TERRE','FS'],
    description:'Interdit l’axe à l’adversaire : il ne peut plus s’infiltrer par là et sa croissance ralentit.', soutien:0, cout:0.5 },
  raid: { id:'raid', nom:'Raid sur un lieu identifié', verbe:'Raid sur', cible:'lieu', categories:['FS','TERRE'], capaciteMin:{ assaut:5 },
    identifie:true, ponctuelle:true, description:'Action de vive force. Plus efficace sur une position frappée le même mois. Risque de pertes.', soutien:1, cout:1 },
  frappe: { id:'frappe', nom:'Frappe', verbe:'Frapper', cible:'lieu', categories:['AIR','MER','TERRE'], capaciteMin:{ frappe:5 },
    identifie:true, frappe:true, description:'Aviation, aéronavale ou artillerie sur une position identifiée. Risque collatéral selon la population.', soutien:1, cout:2 },
  appui: { id:'appui', nom:'Appui à une unité partenaire', verbe:'Appuyer les partenaires vers', cible:'lieu', categories:['FS','TERRE'],
    ponctuelle:true, description:'Les forces locales tentent de prendre le lieu, appuyées par nos conseillers. Seul moyen de le tenir durablement.', soutien:0, cout:0.5 },
  evacuation: { id:'evacuation', nom:'Sauvetage et évacuation', verbe:'Alerte sauvetage à', cible:'lieu', categories:['FS','TERRE','MER','AIR'],
    description:'Dispositif d’alerte (hélicoptères, transport) : limite les conséquences des pertes et permet les évacuations.', soutien:0, cout:0.5 }
};

// Consommation logistique d’une unité déployée, par catégorie
export const SOUTIEN_CATEGORIE: Record<Categorie, number> = { FS: 1, INT: 0, TERRE: 2, AIR: 1, MER: 0 };

// Apports logistiques particuliers (unités de transport et de ravitaillement)
export const SOUTIEN_UNITE: Record<string, number> = { A400M: 4, MRTT: 2, BPC: 2, C17: 4, VOYAGER: 2, ALBION: 2, CHINOOK: 2 };

// Unités qui donnent de la mobilité (raids à deux liaisons de distance)
export const MOBILITE_HELICO: string[] = ['GAM', 'RHFS4', 'BPC', 'JSFAW', 'AAC', 'CHINOOK', 'ALBION'];

export const PARAMS_TACTIQUE = {
  seuilIdentifie: 50,      // connaissance à partir de laquelle un lieu est identifié
  connuParRens: 0.65,      // plancher de connaissance = renseignement du théâtre × ce coefficient
  declinConnu: 12,         // perte mensuelle de connaissance
  infiltration: 40,        // activité adverse qui permet de s’infiltrer dans un lieu voisin
  menaceInfiltration: 55,  // niveau de menace du théâtre à partir duquel l’adversaire s’étend
  surcoutPenurie: 1.25     // multiplicateur de coût quand le soutien est insuffisant (affrètement)
};

// ---------------------------------------------------------------------
// FRICTIONS : un aléa par semaine pendant une intervention de crise (une chance sur deux à partir
// de la semaine 2). Elles obligent à adapter le plan sans allonger la partie. // À VÉRIFIER (équilibrage)
// ---------------------------------------------------------------------
export interface FrictionDef { id: string; nom: string; texte: string }
export const FRICTIONS: FrictionDef[] = [
  { id:'TEMPETE', nom:'Mauvais temps', texte:'Vents de sable ou plafond bas : une frappe et une reconnaissance de moins cette semaine.' },
  { id:'SOURCE', nom:'Une source se manifeste', texte:'Un informateur livre la position adverse la plus importante encore inconnue.' },
  { id:'ENGINS', nom:'Engins explosifs sur les axes', texte:'Chaque déplacement de détachement risque d’être touché cette semaine (une chance sur quatre).' },
  { id:'RALLIEMENT', nom:'Ralliement de combattants locaux', texte:'Des notables rallient les forces partenaires : forces locales +10 et une offensive locale de plus.' },
  { id:'EXODE', nom:'Exode de civils', texte:'Une partie des habitants fuit la position adverse la plus peuplée : moins de risques pour les civils.' }
];

// ---------------------------------------------------------------------
// TERRAINS des lieux en intervention de crise. Modificateurs lisibles d'un coup d'œil :
// raid (puissance du raid), frappe (dégâts ×), collat (risque civil ×), defense (contre une contre-attaque),
// recoMarge (marge d'estimation après reconnaissance). Valeurs de conception. // À VÉRIFIER (équilibrage)
// ---------------------------------------------------------------------
export type TerrainId = 'urbain' | 'desert' | 'montagne' | 'foret' | 'marais' | 'plaine' | 'littoral';
export interface TerrainDef { id: TerrainId; nom: string; raid: number; frappe: number; collat: number; defense: number; recoMarge: number; description: string }
export const TERRAINS: Record<TerrainId, TerrainDef> = {
  urbain:   { id: 'urbain',   nom: 'Ville',               raid: -10, frappe: 0.7,  collat: 1.5, defense: 10, recoMarge: 8,  description: 'Défense facilitée, frappes moins efficaces et risque élevé pour les civils.' },
  desert:   { id: 'desert',   nom: 'Désert découvert',    raid: 0,   frappe: 1.25, collat: 0.6, defense: 0,  recoMarge: 4,  description: 'Rien pour se cacher : frappes efficaces, positions faciles à reconnaître.' },
  montagne: { id: 'montagne', nom: 'Montagne',            raid: -12, frappe: 0.8,  collat: 0.7, defense: 12, recoMarge: 8,  description: 'Grottes et crêtes : raids difficiles, position solide.' },
  foret:    { id: 'foret',    nom: 'Forêt et broussaille', raid: -6, frappe: 0.75, collat: 0.8, defense: 6,  recoMarge: 10, description: 'Couvert dense : reconnaissance et frappes moins précises.' },
  marais:   { id: 'marais',   nom: 'Marais et mangrove',  raid: -8,  frappe: 0.85, collat: 0.9, defense: 4,  recoMarge: 9,  description: 'Mobilité réduite, positions mal connues.' },
  plaine:   { id: 'plaine',   nom: 'Plaine et steppe',    raid: 0,   frappe: 1,    collat: 1,   defense: 0,  recoMarge: 5,  description: 'Terrain sans effet particulier.' },
  littoral: { id: 'littoral', nom: 'Littoral',            raid: -2,  frappe: 1,    collat: 1,   defense: 2,  recoMarge: 5,  description: 'Accès par la mer ; terrain sans autre effet.' }
};
// Terrain par défaut d'un lieu hors ville, selon le biome de la carte
export const TERRAIN_BIOME: Record<string, TerrainId> = {
  desert_reg: 'desert', steppe_fluviale: 'plaine', collines_levant: 'montagne', littoral_desert: 'desert', mangrove_littoral: 'marais',
  littoral_aride: 'desert', foret_plaine: 'foret', urbain_bocage: 'plaine', archipel_ocean: 'littoral'
};

// ---------------------------------------------------------------------
// OBJECTIFS SECONDAIRES : une occasion facultative par intervention, révélée dès l'ouverture.
// Ne pas la saisir ne coûte rien ; la réussir rapporte un effet stratégique.
// ---------------------------------------------------------------------
export type TypeSecondaire = 'otage' | 'chef' | 'depot';
export interface SecondaireDef { id: TypeSecondaire; titre: string; texte: string; consigne: string; recompense: { opinion?: number; credibilite?: number; menace?: number; rens?: number; reserve?: number } }
export const SECONDAIRES: SecondaireDef[] = [
  { id: 'otage', titre: 'Un journaliste retenu', texte: 'Un journaliste occidental serait détenu à {lieu}.', consigne: 'Évacuer depuis {lieu} (lieu repris ou adversaire réduit à 10).',
    recompense: { opinion: 4, credibilite: 2 } },
  { id: 'chef', titre: 'Un chef adverse localisé', texte: 'Une source situe un chef de l’adversaire à {lieu}.', consigne: 'Réussir un raid sur {lieu}.',
    recompense: { menace: -8, rens: 6 } },
  { id: 'depot', titre: 'Un dépôt d’armes repéré', texte: 'Un dépôt d’armes et de munitions a été repéré à {lieu}.', consigne: 'Frapper {lieu} ou y réussir un raid : les renforts adverses diminuent aussitôt.',
    recompense: { menace: -5, reserve: -10 } }
];
