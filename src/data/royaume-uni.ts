import type { DoctrineDef, NationDef, ServiceDef, UniteDef } from '../sim/types';
import { EXT, MARITIMES } from './monde';

// ---------------------------------------------------------------------
// ROYAUME-UNI. Source principale : docs/recherche/resultats/nation-GBR.md (codes S1 à S12).
// Cette fiche a été rédigée de mémoire, sans vérification en ligne : tous ses chiffres sont à recontrôler.
// Les montants sont en millions de livres, sur la même échelle de jeu que les euros de la France
// (surcoût mensuel en opération, pas coût complet). Repère : Shader, ≈ 1,75 Md£ de coût net additionnel
// d’août 2014 à mars 2018 (S9, S1, faible), soit ≈ 40 M£/mois pour ≈ 1 400 personnels.
// Signature : effet de levier. Masse militaire limitée, aucun porte-avions opérationnel sur la période,
// accès privilégié aux États-Unis (Five Eyes, relation spéciale).
// ---------------------------------------------------------------------
const TERRE_EXT = ['EST', 'LIBYE', 'LEVANT', 'SAHEL', 'GUINEE', 'CORNE'];

export const UNITES_GBR: UniteDef[] = [
  // Forces spéciales (UKSF) : effectifs non publics, politique de non-commentaire (S8, élevé pour la structure)
  { id:'SAS22',  nom:'22 SAS',                     categorie:'FS', type:'Régiment de forces spéciales',            effectif:400, cap:{assaut:10,renseignement:7,frappe:2,discretion:9,endurance:7}, delai:1, coutDeploiement:3, coutMensuel:3, theatres:EXT, depart:null }, // À VÉRIFIER (effectif non public ; coûts)
  { id:'SBS',    nom:'Special Boat Service',       categorie:'FS', type:'Forces spéciales navales',                effectif:250, cap:{assaut:9,renseignement:6,frappe:2,discretion:9,endurance:6}, delai:1, coutDeploiement:3, coutMensuel:3, theatres:EXT, depart:null }, // À VÉRIFIER (effectif non public)
  { id:'SRR',    nom:'Special Reconnaissance Regiment', categorie:'FS', type:'Reconnaissance spéciale et surveillance', effectif:300, cap:{assaut:4,renseignement:9,frappe:1,discretion:9,endurance:8}, delai:1, coutDeploiement:2, coutMensuel:2, theatres:EXT, depart:null }, // À VÉRIFIER (effectif non public)
  { id:'SFSG',   nom:'Special Forces Support Group', categorie:'FS', type:'Appui des forces spéciales (parachutistes)', effectif:600, cap:{assaut:7,renseignement:4,frappe:3,discretion:5,endurance:8}, delai:1, coutDeploiement:3, coutMensuel:3, theatres:EXT, depart:null }, // À VÉRIFIER (effectif)
  { id:'JSFAW',  nom:'Escadre aérienne des forces spéciales', categorie:'FS', type:'Hélicoptères des forces spéciales', effectif:300, cap:{assaut:6,renseignement:4,frappe:5,discretion:6,endurance:5}, delai:2, coutDeploiement:5, coutMensuel:4, theatres:EXT, depart:null }, // Escadre dédiée (S8) ; À VÉRIFIER (effectif, coûts)
  // Sécurité intérieure : police majoritairement non armée, renfort militaire prévu par Temperer (S1, S4)
  { id:'CTSFO',  nom:'Tireurs antiterroristes de la police', categorie:'INT', type:'Unités spécialisées antiterroristes (CTSFO)', effectif:300, cap:{assaut:9,renseignement:4,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['GB'], depart:null, protection:2 }, // À VÉRIFIER (effectif national des CTSFO)
  { id:'ARV',    nom:'Polices armées',             categorie:'INT', type:'Véhicules d’intervention armés',         effectif:6500, cap:{assaut:6,renseignement:3,frappe:0,discretion:4,endurance:6}, delai:0, coutDeploiement:0.5, coutMensuel:1.5, theatres:['GB'], depart:null, protection:2 }, // ≈ 6 500 policiers armés en Angleterre et au pays de Galles en 2018 (S1, moyen). À VÉRIFIER (coûts)
  { id:'TEMPERER', nom:'Opération Temperer',       categorie:'INT', type:'Renfort militaire de la police',          effectif:5100, cap:{assaut:3,renseignement:2,frappe:0,discretion:1,endurance:4}, delai:0, coutDeploiement:3, coutMensuel:7, theatres:['GB'], depart:null, protection:6 }, // Plafond prévu de 5 100, ≈ 980 déployés en mai 2017 (S1, moyen). À VÉRIFIER (coûts)
  // British Army : groupement de 1 000 à 1 800 en ≈ 5 jours, brigade en semaines (S8, moyen)
  { id:'PARA16', nom:'16e brigade d’assaut aérien', categorie:'TERRE', type:'Groupement aéroporté', effectif:1000, cap:{assaut:8,renseignement:4,frappe:3,discretion:3,endurance:7}, delai:1, coutDeploiement:15, coutMensuel:10, theatres:TERRE_EXT, depart:null }, // Délai ≈ 5 jours (S8, moyen). À VÉRIFIER (coûts)
  { id:'CDO3',   nom:'3e brigade de commandos',    categorie:'TERRE', type:'Groupement de Royal Marines',          effectif:1000, cap:{assaut:8,renseignement:4,frappe:3,discretion:4,endurance:7}, delai:1, coutDeploiement:14, coutMensuel:10, theatres:['EST','LIBYE','LEVANT','GUINEE','CORNE','INDOPAC'], depart:null }, // Groupe commando en ≈ 5 jours (S8, élevé). À VÉRIFIER (coûts)
  { id:'BLINDE', nom:'Groupement blindé (3e division)', categorie:'TERRE', type:'Groupement interarmes blindé',      effectif:1200, cap:{assaut:8,renseignement:3,frappe:4,discretion:1,endurance:8}, delai:3, coutDeploiement:25, coutMensuel:13, theatres:['EST','LEVANT','LIBYE'], depart:null }, // Brigade en semaines (S8) ; présence avancée en Estonie ≈ 800 depuis 2017 (S8, élevé). À VÉRIFIER (coûts)
  { id:'GURKHA', nom:'Bataillon gurkha de Brunei', categorie:'TERRE', type:'Infanterie légère prépositionnée',     effectif:900, cap:{assaut:7,renseignement:5,frappe:2,discretion:5,endurance:8}, delai:1, coutDeploiement:4, coutMensuel:3, theatres:['INDOPAC','CORNE'], depart:'INDOPAC' }, // ≈ 900 à Brunei, école de jungle (S8, moyen). À VÉRIFIER (coûts)
  { id:'AAC',    nom:'Groupement aéromobile (Apache)', categorie:'TERRE', type:'Hélicoptères d’attaque de l’Army Air Corps', effectif:300, cap:{assaut:5,renseignement:4,frappe:7,discretion:4,endurance:5}, delai:2, coutDeploiement:8, coutMensuel:7, theatres:['SAHEL','LIBYE','LEVANT','EST','CORNE'], depart:null }, // À VÉRIFIER (effectif, coûts)
  { id:'GMLRS',  nom:'Batterie GMLRS',             categorie:'TERRE', type:'Lance-roquettes guidées (≈ 70 km)',     effectif:150, cap:{assaut:1,renseignement:2,frappe:8,discretion:2,endurance:7}, delai:2, coutDeploiement:6, coutMensuel:4, theatres:['LEVANT','EST','LIBYE'], depart:null }, // Portée ≈ 70 km (S8, moyen) ; stocks non publics. À VÉRIFIER (coûts)
  { id:'FORMATEURS', nom:'Équipes de formation',   categorie:'TERRE', type:'Formation des armées partenaires',      effectif:300, cap:{assaut:3,renseignement:4,frappe:0,discretion:4,endurance:7}, delai:1, coutDeploiement:1, coutMensuel:1.5, theatres:TERRE_EXT, depart:null }, // Orbital (Ukraine, ≈ 100, ≈ 9 500 formés fin 2018) et Turus (Nigeria, 100 à 300) (S1, moyen). À VÉRIFIER (coûts)
  // Royal Air Force
  { id:'TORNADO', nom:'Détachement Tornado GR4',   categorie:'AIR', type:'Attaque au sol, missiles de croisière',   effectif:250, cap:{assaut:0,renseignement:4,frappe:9,discretion:3,endurance:5}, delai:1, coutDeploiement:6, coutMensuel:11, theatres:EXT, depart:'LEVANT' }, // 6 à 8 appareils à Akrotiri ; seul vecteur du Storm Shadow jusqu’en 2018 ; retrait en mars 2019 (S8, moyen). À VÉRIFIER (coûts)
  { id:'TYPHOON', nom:'Détachement Typhoon',       categorie:'AIR', type:'Chasse polyvalente',                       effectif:250, cap:{assaut:0,renseignement:4,frappe:8,discretion:3,endurance:6}, delai:1, coutDeploiement:6, coutMensuel:12, theatres:EXT, depart:null }, // Flotte ≈ 140 (S8, moyen) ; heure de vol ≈ 70 000 £ en coût complet (S3, faible), non retenue : le jeu compte un surcoût. À VÉRIFIER
  { id:'REAPER_RAF', nom:'Drones Reaper (RAF)',    categorie:'AIR', type:'Drone MALE armé',                          effectif:80,  cap:{assaut:0,renseignement:8,frappe:5,discretion:6,endurance:9}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:['LEVANT','LIBYE','SAHEL'], depart:'LEVANT' }, // 10 MQ-9 armés, pilotés depuis Waddington et Creech ; flotte saturée par Shader (S8, élevé). À VÉRIFIER (coûts)
  { id:'SENTINEL', nom:'Sentinel R1 et Shadow R1', categorie:'AIR', type:'Surveillance du sol et renseignement',     effectif:120, cap:{assaut:0,renseignement:8,frappe:0,discretion:4,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:EXT, depart:null }, // 5 Sentinel, ≈ 5 Shadow (S8, moyen). À VÉRIFIER (coûts)
  { id:'RIVET',  nom:'RC-135W Rivet Joint',        categorie:'AIR', type:'Renseignement électromagnétique',          effectif:100, cap:{assaut:0,renseignement:9,frappe:0,discretion:4,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:EXT, depart:null }, // 3 appareils livrés en 2013, 2015, 2017 (S8, élevé). À VÉRIFIER (coûts)
  { id:'E3D',    nom:'E-3D Sentry',                categorie:'AIR', type:'Détection et contrôle aéroportés',         effectif:100, cap:{assaut:0,renseignement:7,frappe:1,discretion:2,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:['EST','LEVANT','LIBYE'], depart:null }, // 6 E-3D (S8, moyen). À VÉRIFIER (coûts)
  { id:'VOYAGER', nom:'Ravitailleurs Voyager',     categorie:'AIR', type:'Ravitaillement en vol et transport',       effectif:120, cap:{assaut:0,renseignement:1,frappe:2,discretion:1,endurance:8}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:EXT, depart:null }, // 14 Voyager, 9 en flotte permanente, contrat privé AirTanker (S8, élevé). À VÉRIFIER (coûts)
  { id:'C17',    nom:'Transport stratégique C-17', categorie:'AIR', type:'Transport stratégique',                    effectif:120, cap:{assaut:0,renseignement:0,frappe:0,discretion:2,endurance:8}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:EXT, depart:null }, // 8 C-17, portée mondiale en 24-48 h (S8, moyen). À VÉRIFIER (coûts)
  { id:'CHINOOK', nom:'Hélicoptères lourds Chinook', categorie:'AIR', type:'Transport lourd (Joint Helicopter Command)', effectif:150, cap:{assaut:2,renseignement:2,frappe:0,discretion:3,endurance:6}, delai:2, coutDeploiement:4, coutMensuel:4, theatres:TERRE_EXT, depart:null }, // 3 Chinook et ≈ 90 personnels au profit de Barkhane depuis l’été 2018 (S1, moyen). À VÉRIFIER (coûts)
  // Royal Navy : aucun porte-avions opérationnel sur la période (HMS Queen Elizabeth admis le 7/12/2017, S8, élevé)
  { id:'T45',    nom:'Destroyer Type 45',          categorie:'MER', type:'Défense aérienne de zone',                 effectif:190, cap:{assaut:0,renseignement:6,frappe:3,discretion:4,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:MARITIMES, depart:null }, // 6 Type 45, propulsion fragile (S8, élevé). À VÉRIFIER (équipage, coûts)
  { id:'T23',    nom:'Frégate Type 23',            categorie:'MER', type:'Lutte anti-sous-marine',                   effectif:185, cap:{assaut:1,renseignement:6,frappe:4,discretion:5,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:MARITIMES, depart:null }, // 13 Type 23 (S8, élevé). À VÉRIFIER (équipage, coûts)
  { id:'ASTUTE', nom:'Sous-marin nucléaire d’attaque', categorie:'MER', type:'Classes Astute et Trafalgar, missiles Tomahawk', effectif:100, cap:{assaut:0,renseignement:8,frappe:6,discretion:10,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:MARITIMES, depart:null }, // 2015 : 4 Trafalgar et 2 Astute ; 2018 : 3 et 3 ; disponibilité dégradée début 2017 [DÉBATTU] (S8, moyen). À VÉRIFIER (coûts)
  { id:'ALBION', nom:'Groupe amphibie',            categorie:'MER', type:'HMS Albion ou Bulwark (un seul actif)',   effectif:330, cap:{assaut:5,renseignement:3,frappe:2,discretion:2,endurance:6}, delai:2, coutDeploiement:4, coutMensuel:5, theatres:MARITIMES, depart:null } // Un seul bâtiment de commandement amphibie disponible à la fois ; HMS Ocean retiré le 27/03/2018 (S8, élevé). À VÉRIFIER (équipage, coûts)
];

// ---------------------------------------------------------------------
// RENSEIGNEMENT : ≈ 12 000 agents pour les trois agences civiles, partage Five Eyes,
// pas de satellite d’imagerie national (S10, moyen)
// ---------------------------------------------------------------------
export const SERVICES_GBR: ServiceDef[] = [
  { id:'SIS', nom:'MI6', libelle:'Secret Intelligence Service', domaine:'Extérieur',
    capteurs:{HUMINT:5,SIGINT:1,IMINT:0}, efficacite:{HUMINT:1.2,SIGINT:0.9,IMINT:0.7}, theatres:EXT,
    affectationInitiale:{ LEVANT:{HUMINT:2}, LIBYE:{HUMINT:1} } }, // ≈ 2 500 agents (S10, moyen)
  { id:'MI5', nom:'MI5', libelle:'Security Service', domaine:'Intérieur',
    capteurs:{HUMINT:5,SIGINT:2,IMINT:0}, efficacite:{HUMINT:1.2,SIGINT:1.0,IMINT:0.6}, theatres:['GB'],
    affectationInitiale:{ GB:{HUMINT:3,SIGINT:1} } }, // ≈ 4 000 agents (S10, moyen)
  { id:'GCHQ', nom:'GCHQ', libelle:'Government Communications Headquarters', domaine:'Technique et cyber',
    capteurs:{HUMINT:0,SIGINT:7,IMINT:0}, efficacite:{HUMINT:0,SIGINT:1.25,IMINT:0}, theatres:['GB', ...EXT],
    affectationInitiale:{ GB:{SIGINT:2}, LEVANT:{SIGINT:2} } }, // ≈ 5 800 agents, accord UKUSA (S10, moyen). Efficacité : partage Five Eyes, choix de jeu
  { id:'DI', nom:'DI', libelle:'Defence Intelligence', domaine:'Militaire',
    capteurs:{HUMINT:1,SIGINT:1,IMINT:3}, efficacite:{HUMINT:0.8,SIGINT:1.0,IMINT:0.9}, theatres:EXT,
    affectationInitiale:{ LEVANT:{IMINT:2} } } // 3 500 à 4 000 (S10, faible) ; imagerie dépendante des États-Unis
];

// ---------------------------------------------------------------------
// DOCTRINES : la revue stratégique du 23/11/2015 fixe le cadre (S8, élevé) ; les trois choix
// sont des lectures possibles de la période.
// ---------------------------------------------------------------------
export const DOCTRINES_GBR: DoctrineDef[] = [
  { id:'GBR_RELATION', nom:'La relation spéciale',
    texte:'Peser sur Washington plutôt que de tout faire soi-même. Renseignement partagé et crédibilité auprès des alliés, au prix d’une image de suivisme.',
    bonus:'Renseignement +6 partout, crédibilité initiale +6', malus:'Opinion initiale −4, votes des Communes plus difficiles',
    mods:{ rensBonus:6, capteursBonus:{}, opBonus:0, enveloppe:0, delaiMod:0, coutMult:1, protectionMult:1, croissanceExtMult:1, capitalMensuel:0, voteBonus:-0.05, opinion:-4, credibilite:6 } },
  { id:'GBR_EXPEDITION', nom:'Force expéditionnaire',
    texte:'La revue de 2015 promet une force projetable de 50 000 hommes. Agir vite et loin, en assumant le coût.',
    bonus:'Succès des opérations +8 %, projection plus rapide d’un mois, enveloppe +5 M£/mois', malus:'Coûts mensuels +12 %, opinion initiale −3',
    mods:{ rensBonus:0, capteursBonus:{}, opBonus:0.08, enveloppe:5, delaiMod:-1, coutMult:1.12, protectionMult:1, croissanceExtMult:1, capitalMensuel:0, voteBonus:-0.03, opinion:-3, credibilite:3 } },
  { id:'GBR_CONTEST', nom:'CONTEST : protéger le territoire',
    texte:'Prévenir, poursuivre, protéger, préparer. La sécurité intérieure d’abord, l’engagement extérieur au plus juste.',
    bonus:'+1 capteur MI5 (sources humaines) et GCHQ, protection intérieure +35 %, capital +1/mois', malus:'Menaces extérieures +15 % de croissance, crédibilité initiale −8',
    mods:{ rensBonus:0, capteursBonus:{MI5:{HUMINT:1}, GCHQ:{SIGINT:1}}, opBonus:0, enveloppe:0, delaiMod:0, coutMult:1, protectionMult:1.35, croissanceExtMult:1.15, capitalMensuel:1, voteBonus:0.05, opinion:2, credibilite:-8 } }
];

// ---------------------------------------------------------------------
// NATION
// Convention parlementaire : depuis 2003 (renforcée après le vote perdu du 29/08/2013, 272-285), le
// gouvernement soumet aux Communes l’engagement au combat, avec une exception pour l’urgence et le
// secret ; les forces spéciales échappent à tout contrôle parlementaire (S1, S3, élevé).
// Le vote est préalable dans la réalité ; dans le jeu, il intervient après le premier mois d’engagement
// (le temps de l’urgence). Coefficients : choix de jouabilité, l’opinion pèse plus qu’en France
// (« syndrome irakien », section 1 de la fiche).
// ---------------------------------------------------------------------
export const NATION_GBR: NationDef = {
  id: 'GBR', nom: 'Royaume-Uni', role: 'Comité de crise du gouvernement (COBR) et Conseil de sécurité nationale', signature: 'L’effet de levier',
  devise: '£', cellule: 'comité de crise du gouvernement (COBR)',
  territoire: 'GB',
  theatres: ['GB', 'EST', 'LIBYE', 'LEVANT', 'SAHEL', 'GUINEE', 'CORNE', 'INDOPAC'],
  basesPermanentes: ['GB', 'INDOPAC'],   // Brunei (bataillon gurkha) ; Chypre sert de base à Shader, qui reste soumise aux Communes
  unites: UNITES_GBR, services: SERVICES_GBR, doctrines: DOCTRINES_GBR,
  operations: ['FRAPPE', 'RAID', 'FORMATION', 'PROTECTION', 'CYBER_GCHQ', 'REASSURANCE'],
  allies: { USA: 70, FRA: 65, DEU: 60, ITA: 55, JPN: 55, AUS: 65, NGA: 50 },   // À VÉRIFIER (relations initiales : choix de jeu)
  categories: { FS: 'Forces spéciales (UKSF)', INT: 'Sécurité intérieure', TERRE: 'British Army', AIR: 'Royal Air Force', MER: 'Royal Navy' },
  procedure: {
    nom: 'Convention parlementaire', institution: 'des Communes',
    description: 'Le gouvernement soumet aux Communes tout engagement au combat. Le vote intervient dès le premier mois ; les forces spéciales n’y sont pas soumises. Un refus impose le retrait.',
    dureeAvantVote: 1,
    poids: { base: 0.2, opinion: 0.5, capital: 0.35, credibilite: 1 / 250, crise: 0.08 },
    debat: { nom: 'Motion devant les Communes', description: 'Publier la base juridique de l’intervention et ouvrir un débat de motion.', bonus: 0.12, capital: 2 },
    succes: { capital: 3 },
    refus: { capital: -12, credibilite: -6 },
    texteAutorise: 'Les Communes approuvent l’engagement ({theatre}).',
    texteRefus: 'Les Communes rejettent l’engagement ({theatre}). Retrait des forces.',
    motifRetrait: 'vote négatif des Communes',
    categoriesExemptees: ['FS']
  },
  levier: {
    allie: 'USA', base: 0.12, capital: 1, relation: 1,
    description: 'Relation spéciale et Five Eyes : les demandes aux États-Unis aboutissent plus souvent (+12 points) et coûtent un point de capital et un point de relation de moins.'
  },
  briefing: {
    date: 'Londres, le 15 janvier 2015',
    diffusion: 'Diffusion restreinte',
    expediteur: 'GBR_NSA',
    destinataire: 'Président du comité de crise du gouvernement (COBR)',
    introduction: 'Vous présidez le comité de crise du gouvernement, adossé au Conseil de sécurité nationale. Vous disposez des agences de renseignement, des forces spéciales, des armées et de notre relation privilégiée avec Washington. Voici l’état de la menace à votre prise de fonctions.',
    paragraphes: [
      { theatre: 'GB', titre: 'Territoire', texte: 'Le niveau de menace terroriste est « grave » depuis août 2014. Les attentats de Paris, la semaine dernière, montrent ce que des réseaux revenus de Syrie peuvent accomplir. Plusieurs centaines de résidents britanniques ont rejoint les groupes armés en Syrie et en Irak.' },
      { theatre: 'GB', titre: 'Cyberespace', texte: 'Le GCHQ observe une hausse des intrusions contre les administrations et les opérateurs d’infrastructures, attribuées à des groupes criminels et à des services étatiques.' },
      { theatre: 'LEVANT', titre: 'Levant', texte: 'Depuis septembre 2014, la Royal Air Force frappe Daech en Irak, avec l’accord des Communes et depuis la base d’Akrotiri, à Chypre. Les frappes en Syrie restent exclues : les Communes ont rejeté une intervention en août 2013.' },
      { theatre: 'EST', titre: 'Flanc est', texte: 'La Russie a annexé la Crimée en mars 2014. Les combats continuent dans le Donbass. Nos alliés baltes attendent des gages concrets de l’OTAN.' },
      { theatre: 'LIBYE', titre: 'Libye', texte: 'Deux gouvernements rivaux se disputent le pays ; des groupes ralliés à Daech s’y implantent. Nos ressortissants ont été évacués l’été dernier.' },
      { theatre: 'SAHEL', titre: 'Sahel', texte: 'Nos avions de transport soutiennent l’opération française au Mali depuis 2013. Nous n’y avons pas de troupes au combat.' },
      { theatre: 'INDOPAC', titre: 'Indo-Pacifique', texte: 'Un bataillon gurkha stationne à Brunei. Les accords de défense des cinq puissances nous lient à la Malaisie et à Singapour, au moment où la construction d’îles artificielles s’accélère en mer de Chine méridionale.' }
    ],
    conclusion: 'Le Premier ministre vous demande d’arrêter, dès cette semaine, la ligne qui guidera notre politique de sécurité pendant les trois années à venir.'
  }
};
