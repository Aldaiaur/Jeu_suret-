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
export const SOUTIEN_UNITE: Record<string, number> = { A400M: 4, MRTT: 2, BPC: 2 };

// Unités qui donnent de la mobilité (raids à deux liaisons de distance)
export const MOBILITE_HELICO: string[] = ['GAM', 'RHFS4', 'BPC'];

export const PARAMS_TACTIQUE = {
  seuilIdentifie: 50,      // connaissance à partir de laquelle un lieu est identifié
  declinConnu: 12,         // perte mensuelle de connaissance
  infiltration: 40,        // activité adverse qui permet de s’infiltrer dans un lieu voisin
  menaceInfiltration: 55,  // niveau de menace du théâtre à partir duquel l’adversaire s’étend
  surcoutPenurie: 1.25     // multiplicateur de coût quand le soutien est insuffisant (affrètement)
};
