// Types partagés : définitions de données (immuables) et état de partie (sérialisable en JSON).

// ---------------------------------------------------------------------
// Définitions de données
// ---------------------------------------------------------------------

export type TypeCapteur = 'HUMINT' | 'SIGINT' | 'IMINT';
export type Categorie = 'FS' | 'INT' | 'TERRE' | 'AIR' | 'MER';
export type EtatUniteId = 'disponible' | 'projection' | 'deployee' | 'regeneration' | 'indisponible';

export interface Capacites { assaut: number; renseignement: number; frappe: number; discretion: number; endurance: number }
export type Capacite = keyof Capacites;

export interface TheatreDef {
  id: string; nom: string; court: string;
  lon: number; lat: number;
  x: number; y: number;
  voisins: string[];
  exterieur: boolean; maritime: boolean;
  rensBase: number;
  basePermanente: boolean;
  carteRegionale: string;
  saisons: SaisonDef[];
}

// Saisons : déclarées par théâtre, elles couvrent chacune une liste de mois (0 = janvier).
// Les effets sont des multiplicateurs (1 = neutre) ou des écarts appliqués par la simulation.
export type VisuelSaison = 'aucun' | 'pluie' | 'chaleur' | 'boue' | 'neige' | 'mousson' | 'houle' | 'poussiere' | 'brouillard';
export interface EffetsSaison {
  pression?: Partial<Record<Categorie, number>>;   // pression exercée par les unités de cette catégorie
  fatigue?: number;                                  // gain mensuel de fatigue des unités déployées
  croissance?: Record<string, number>;               // croissance d’un type de menace sur ce théâtre
  cout?: number;                                     // coût mensuel des unités déployées
  frappesZoom?: number; recosZoom?: number;          // moyens disponibles chaque semaine en crise
}
export interface SaisonDef { id: string; nom: string; mois: number[]; visuel: VisuelSaison; description: string; effets: EffetsSaison }

export type BiomeId = 'urbain_bocage' | 'foret_plaine' | 'littoral_desert' | 'steppe_fluviale' | 'desert_reg' | 'mangrove_littoral' | 'littoral_aride' | 'archipel_ocean';
export type ElementRelief = 'dune' | 'rocher' | 'arbre' | 'haie' | 'batiment' | 'palmier' | 'mangrove' | 'vague' | 'marais' | 'champ' | 'montagne' | 'ile' | 'acacia';
export interface BiomeDef {
  id: BiomeId; nom: string;
  palette: { mer: string; merProfonde: string; terre: string; terre2: string; relief: string; trait: string; route: string };
  textures: ('dunes' | 'reg' | 'bocage' | 'urbain' | 'foret' | 'mangrove' | 'steppe' | 'houle' | 'champs')[];
  relief: ElementRelief[];
  densite: number;   // nombre d’éléments de relief par carte (indicatif)
}

export interface UniteDef {
  id: string; nom: string; categorie: Categorie; type: string; effectif: number;
  cap: Capacites;
  delai: number; coutDeploiement: number; coutMensuel: number;
  theatres: string[];
  depart: string | null;
  protection?: number;
  indisponibilites?: { debut: number; fin: number }[];
}

export interface ServiceDef {
  id: string; nom: string; libelle: string; domaine: string;
  capteurs: Record<TypeCapteur, number>;
  efficacite: Record<TypeCapteur, number>;
  theatres: string[];
  affectationInitiale: Record<string, Partial<Record<TypeCapteur, number>>>;
}

export interface EffetsAppui { rens?: number; pression?: number; frappesZoom?: number; recosZoom?: number; opBonus?: number; delai?: number; partenaire?: number; soutien?: number }

export interface AppuiDef {
  id: string; nom: string; theatres: string[];
  duree: number; capital: number; relation: number; base: number;
  effets: EffetsAppui;
}

export interface AllieDef { id: string; nom: string; relation: number; interets: string[]; description: string; appuis: AppuiDef[] }

export interface MenaceDef {
  id: string; nom: string; criseTitre: string;
  plancher?: number;
  theatresDepart: string[]; forceDepart: [number, number];
  croissance: number;
  sensibilite: Partial<Capacites>;
  pressionServices: Record<string, number>;
  servicesCles: Record<string, number>;
  alimentePar: Record<string, number>;
  seuilExpansion: number; expansion: string[]; probExpansion: number;
  seuilAttaque: number;
  attaque: Partial<Record<'opinion' | 'capital' | 'credibilite' | 'menaceInt' | 'budget', number>>;
  apresAttaque: number;
  poidsInterieur: number; impactInterieur: number;
  crise: boolean;
  secondaires: { theatre: string; p: number; force: [number, number] }[];
}

export interface OperationDef {
  id: string; nom: string;
  capacite: Capacite; categories: Categorie[]; minCapacite: number;
  serviceRequis: string | null;
  cibles: string[] | null;
  theatresInterdits: string[];
  degats: number; cout: number; capital: number;
  risquePertes: number; risqueCollat: number; pression: number;
  effetSucces: { partenaire?: number; menaceInt?: number; opinion?: number; credibilite?: number };
  description: string;
}

export interface Mods {
  rensBonus: number;
  capteursBonus: Record<string, Partial<Record<TypeCapteur, number>>>;
  opBonus: number; enveloppe: number; delaiMod: number; coutMult: number;
  protectionMult: number; croissanceExtMult: number; capitalMensuel: number;
  voteBonus: number; opinion: number; credibilite: number;
}

export interface DoctrineDef { id: string; nom: string; texte: string; bonus: string; malus: string; mods: Mods }

export interface DifficulteDef {
  nom: string; croissanceMult: number; enveloppe: number; budgetInitial: number;
  capital: number; opinion: number; menaceInt: number; credibilite: number; forceMult: number;
}

export interface Effets {
  opinion?: number; capital?: number; credibilite?: number; menaceInt?: number;
  budget?: number; enveloppe?: number;
  menace?: { type: string; delta: number; theatre?: string }[];
  rens?: { theatre: string; delta: number }[];
  partenaire?: { theatre: string; delta: number }[];
  pression?: { theatre: string; delta: number }[];
  fatigue?: { unite?: string; categorie?: Categorie; delta: number }[];
  indispo?: { unite: string; tours: number };
  crise?: string;
  allie?: { theatre: string; tours: number };
  relation?: { allie: string; delta: number }[];
  appui?: { allie: string; appui: string; theatre: string; tours: number };
  alea?: { p: number; succes: Effets; echec: Effets };
}

export interface Conditions {
  tourMin?: number; tourMax?: number;
  menace?: { type: string; forceMin: number; theatre?: string };
  opinionMax?: number; opinionMin?: number; menaceIntMin?: number; surcoutMin?: number;
  deploiementExterieur?: boolean;
  theatreDeploye?: string;
  rensMin?: { theatre: string; val: number };
  chaine?: boolean;
  relationMin?: { allie: string; val: number };
  relationMax?: { allie: string; val: number };
}

export interface ChoixDef {
  texte: string;
  requiert?: { categorie: Categorie };
  effets: Effets;
  suite?: string; suiteDelai?: number; suiteP?: number;
}

export interface EvenementDef { id: string; titre: string; poids: number; max?: number; cond?: Conditions; texte: string; choix: ChoixDef[] }

export type Controle = 'allie' | 'ennemi' | 'neutre';

export interface LieuDef {
  id: string; nom: string; x?: number; y?: number;
  lon: number; lat: number;
  littoral?: boolean;               // accessible à la Marine (côte ou zone maritime)
  type: 'ville' | 'base' | 'zone';
  controle: Controle; defense: number; force: [number, number] | null; civils: number;
}

export interface ObjectifDef { type: 'tenir' | 'controler' | 'evacuer' | 'attrition'; lieu?: string; nombre?: number; valeur?: number }

export interface ScenarioDef {
  id: string; titre: string; texte: string;
  objectifs: ObjectifDef[];
  modifs: Record<string, { force?: number; ressortissants?: number }>;
}

export interface CarteRegionaleDef {
  id: string; nom: string; theatre: string; largeur: number; hauteur: number; depart: string;
  biome: BiomeId;
  // Crise résolue sur la carte (6 semaines) ou de façon globale. Hors carte : théâtres où l’adversaire
  // est un État (Russie, Chine) ou territoire national, où raids et frappes n’ont pas de sens.
  zoomCrise: boolean;
  forcesCrise: Categorie[];       // catégories engageables en crise sur la carte
  frappes: boolean;               // règles d’engagement : frappes aériennes autorisées
  soutien: number;                // capacité logistique du théâtre (bases, ports, routes) ; voir POSTURES et MISSIONS
  fleuves?: { nom: string; points: [number, number][] }[];   // tracés schématiques (décor)
  forceLocale: { nom: string; force: number };
  reserveEnnemie: [number, number];
  lieux: LieuDef[];
  liens: [string, string][];
  scenarios: ScenarioDef[];
}

// ---------------------------------------------------------------------
// État de partie
// ---------------------------------------------------------------------

export type Phase = 'doctrine' | 'jeu' | 'evenement' | 'crise' | 'zoom' | 'fin';
export type GenreJournal = 'info' | 'alerte' | 'succes' | 'crise' | 'evenement' | 'decision' | 'tour';

export interface Ressources { budget: number; enveloppe: number; surcout: number; capital: number; opinion: number; menaceInt: number; credibilite: number }

export interface EtatUnite {
  etat: EtatUniteId; theatre: string | null; fatigue: number; compteur: number; indispo: number;
  lieu: string | null;              // implantation sur la carte régionale (forces au sol), sinon hors carte
  posture: Posture;
  mission: OrdreMission | null;
}

// ---------- Tactique ----------
export type Posture = 'offensive' | 'defensive' | 'reconnaissance' | 'formation' | 'reserve';
export type TypeMission = 'patrouille' | 'escorte' | 'axe' | 'raid' | 'frappe' | 'appui' | 'evacuation';
export interface OrdreMission { type: TypeMission; lieu: string; vers?: string }
export interface PostureDef {
  id: Posture; nom: string; description: string;
  pression: number; fatigue: number; rens: number;
  risquePertes: number;          // probabilité mensuelle de pertes (avant discrétion)
  partenaire?: number;           // gain mensuel de capacité partenaire
  connu?: number;                // gain de connaissance des lieux voisins
  categories: Categorie[];
}
export interface MissionDef {
  id: TypeMission; nom: string; verbe: string; description: string;
  cible: 'lieu' | 'liaison';
  categories: Categorie[];
  capaciteMin?: Partial<Capacites>;
  identifie?: boolean;           // la cible doit être identifiée (renseignement)
  frappe?: boolean;              // soumise aux règles d’engagement sur les frappes
  ponctuelle?: boolean;          // exécutée une fois, puis la mission s’arrête
  soutien: number;               // consommation logistique (négatif : apport)
  cout: number;                  // M€ par mois
}
export interface EtatLieu { controle: Controle; activite: number; connu: number }

export interface EtatService { capteurs: Record<TypeCapteur, number>; affectations: Record<string, Record<TypeCapteur, number>> }

export interface AppuiActif { allie: string; appui: string; tours: number }

export interface Crise { titre: string; texte: string; menaceId: string; scenario: string | null; statut: 'ouverte' | 'libre'; toursLibres: number }

export interface EtatTheatre {
  rens: number; rensBonus: number; rensPermanent: number; partenaire: number;
  pressionBonus: number; pressionOps: number;
  toursIntervention: number; voteFait: boolean;
  allie: number; appuis: AppuiActif[]; crise: Crise | null;
  lieux: Record<string, EtatLieu>;
  rapportTactique: string[];        // comptes rendus de la dernière résolution mensuelle
}

export interface Menace { id: string; type: string; theatre: string; force: number; detectee: boolean; estimation: number | null; marge: number; rapportFaux: boolean }

export interface Rapport { theatre: string; service: string; fiabilite: string; texte: string }
export interface EntreeJournal { tour: number; texte: string; genre: GenreJournal }
export interface Decision { tour: number; texte: string }

export interface Instantane { tour: number; opinion: number; capital: number; menaceInt: number; credibilite: number; surcout: number; menaceExt: number; rens: number }

export type ElementFile = { kind: 'evenement'; id: string } | { kind: 'crise'; theatre: string };

export interface ZoomLieu {
  controle: Controle; force: number; civils: number; defense: number; ressortissants: number;
  revele: boolean; estimee: number | null; marge: number; dispersion: number; frappe: boolean;
}
export interface ZoomUnite { id: string; lieu: string; blesse: boolean; aAgi: boolean }
export interface StatsZoom { pertes: number; collat: number; neutralises: number; evacues: number }

export interface Zoom {
  carte: string; theatre: string; scenario: string; titre: string;
  semaine: number; maxSemaines: number;
  lieux: Record<string, ZoomLieu>;
  unites: ZoomUnite[];
  frappesMax: number; frappes: number; recosMax: number; recos: number; appui: number;
  forceLocale: number; reserve: number; forceInitiale: number; rens: number;
  evacuesParLieu: Record<string, number>;
  stats: StatsZoom;
  journal: string[];
}

export interface ObjectifEtat { texte: string; atteint: boolean }

export interface BilanZoom {
  titre: string; theatre: string; semaines: number; anticipe: boolean;
  objectifs: ObjectifEtat[]; taux: number; stats: StatsZoom; baisseMenace: number; effets: string[];
}

export interface Score { domaines: { nom: string; valeur: number; poids: number }[]; total: number; mention: string }
export interface Fin { type: 'defaite' | 'bilan'; raison: string; tour: number; score?: Score }

export interface Stats {
  operations: number; succes: number; pertes: number; collat: number;
  crisesInterv: number; crisesReussies: number; crisesIgnorees: number;
  attaques: number; dejoues: number; votes: number; votesPerdus: number;
}

export interface Etat {
  version: number; graine: string; rngState: number; difficulte: string; doctrine: string | null;
  tour: number; phase: Phase;
  ressources: Ressources;
  actionsRestantes: number;
  unites: Record<string, EtatUnite>;
  services: Record<string, EtatService>;
  theatres: Record<string, EtatTheatre>;
  allies: Record<string, { relation: number; cooldown: number }>;
  menaces: Menace[]; prochainIdMenace: number;
  file: ElementFile[];
  evenementCourant: string | null; criseCourante: string | null;
  zoom: Zoom | null;
  dernierBilan: BilanZoom | null;
  dernierResultat: { titre: string; texte: string } | null;
  chaines: { id: string; tour: number }[];
  compteurEvenements: Record<string, number>;
  journal: EntreeJournal[]; rapports: Rapport[]; decisions: Decision[]; historique: Instantane[];
  menaceInt100: number;
  fin: Fin | null;
  stats: Stats;
}

// ---------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------

export type Action =
  | { type: 'DOCTRINE'; id: string }
  | { type: 'CAPTEUR'; service: string; theatre: string; capteur: TypeCapteur; delta: 1 | -1 }
  | { type: 'DEPLOYER'; unite: string; theatre: string }
  | { type: 'RAPATRIER'; unite: string }
  | { type: 'OPERATION'; op: string; theatre: string; cible: string | null }
  | { type: 'BUDGET'; sens: 'hausse' | 'baisse' }
  | { type: 'ALLIE'; allie: string; appui: string; theatre: string }
  | { type: 'CHOIX'; index: number }
  | { type: 'POSITIONNER'; unite: string; lieu: string }
  | { type: 'POSTURE'; unite: string; posture: Posture }
  | { type: 'MISSION'; unite: string; mission: TypeMission; lieu: string; vers?: string }
  | { type: 'ANNULER_MISSION'; unite: string }
  | { type: 'CRISE'; intervenir: boolean }
  | ActionZoom;

export type ActionZoom =
  | { type: 'Z_DEPLACER'; unite: string; vers: string }
  | { type: 'Z_RAID'; unite: string; lieu: string }
  | { type: 'Z_EVACUER'; unite: string; lieu: string }
  | { type: 'Z_RECO'; lieu: string }
  | { type: 'Z_FRAPPE'; lieu: string }
  | { type: 'Z_APPUI'; lieu: string }
  | { type: 'Z_SEMAINE' }
  | { type: 'Z_RETRAIT' };
