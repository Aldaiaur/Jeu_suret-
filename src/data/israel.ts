import type { DoctrineDef, NationDef, ServiceDef, UniteDef } from '../sim/types';

// ---------------------------------------------------------------------
// ISRAËL. Source : docs/recherche/resultats/nation-ISR.md (sections numérotées ; confiance indiquée).
// Montants en millions de shekels sur l’échelle de jeu commune (surcoût mensuel) : les coûts par opération
// sont non publics (section 2.3). Délais : tous les théâtres sont à moins de 300 km des bases, sauf l’Iran
// (section 4, [ANALYSE]) ; d’où des projections immédiates.
// Signature : fronts simultanés et délais très courts ; contrainte principale politique (la coalition).
// ---------------------------------------------------------------------
const FRONTS = ['LIBAN', 'GAZA', 'SYRIE'];
const AIR_ISR = ['LIBAN', 'GAZA', 'SYRIE', 'SINAI', 'IRAN'];

export const UNITES_ISR: UniteDef[] = [
  // Forces spéciales : effectifs non publics (section 4.1)
  { id:'SAYERET',  nom:'Sayeret Matkal',           categorie:'FS', type:'Unité de reconnaissance de l’état-major', effectif:200, cap:{assaut:9,renseignement:8,frappe:1,discretion:9,endurance:7}, delai:0, coutDeploiement:2, coutMensuel:2.5, theatres:['LIBAN','GAZA','SYRIE','SINAI'], depart:null }, // À VÉRIFIER (effectif non public ; coûts)
  { id:'S13',      nom:'Shayetet 13',              categorie:'FS', type:'Commandos marine',                         effectif:200, cap:{assaut:9,renseignement:6,frappe:2,discretion:9,endurance:6}, delai:0, coutDeploiement:2, coutMensuel:2.5, theatres:['LIBAN','GAZA','SYRIE','SINAI'], depart:null }, // À VÉRIFIER (effectif non public)
  { id:'SHALDAG',  nom:'Shaldag',                  categorie:'FS', type:'Forces spéciales de l’armée de l’Air',     effectif:150, cap:{assaut:7,renseignement:7,frappe:5,discretion:8,endurance:6}, delai:0, coutDeploiement:2, coutMensuel:2, theatres:['LIBAN','GAZA','SYRIE','SINAI'], depart:null }, // Désignation de cibles au sol. À VÉRIFIER (effectif)
  { id:'U669',     nom:'Unité 669',                categorie:'FS', type:'Sauvetage de combat',                      effectif:150, cap:{assaut:5,renseignement:4,frappe:1,discretion:7,endurance:7}, delai:0, coutDeploiement:2, coutMensuel:2, theatres:['LIBAN','GAZA','SYRIE','SINAI'], depart:null }, // À VÉRIFIER (effectif)
  // Sécurité intérieure : ministère de la Sécurité publique, pas l’armée (section 4.1)
  { id:'YAMAM',    nom:'Yamam',                    categorie:'INT', type:'Unité nationale antiterroriste (Police des frontières)', effectif:200, cap:{assaut:9,renseignement:5,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['ISRAEL'], depart:null, protection:2 }, // À VÉRIFIER (effectif non public)
  { id:'MAGAV',    nom:'Police des frontières',    categorie:'INT', type:'Gendarmerie nationale (Magav)',           effectif:8000, cap:{assaut:5,renseignement:4,frappe:0,discretion:3,endurance:6}, delai:0, coutDeploiement:2, coutMensuel:5, theatres:['ISRAEL'], depart:null, protection:5 }, // À VÉRIFIER (effectif, coûts)
  // Défense active multicouche (section 4.1 et 7.2) : 10 batteries Iron Dome, David’s Sling (04/2017), Arrow-3 (01/2017)
  { id:'IRON_DOME', nom:'Batteries Iron Dome',     categorie:'AIR', type:'Défense contre roquettes et obus',        effectif:600, cap:{assaut:0,renseignement:3,frappe:0,discretion:2,endurance:7}, delai:0, coutDeploiement:2, coutMensuel:4, theatres:['ISRAEL'], depart:'ISRAEL', protection:6 }, // 10 batteries ; intercepteur ≈ 40 000 $ (presse, faible). À VÉRIFIER (coûts)
  { id:'ARROW',    nom:'Arrow et David’s Sling',   categorie:'AIR', type:'Défense antimissile de théâtre',          effectif:400, cap:{assaut:0,renseignement:4,frappe:0,discretion:2,endurance:7}, delai:0, coutDeploiement:2, coutMensuel:3, theatres:['ISRAEL'], depart:null, protection:3, indisponibilites:[{debut:0,fin:23}] }, // Arrow-3 opérationnel le 18/01/2017, David’s Sling le 02/04/2017 (section 4.1, élevé) : disponible à partir de janvier 2017
  // Armée de terre : brigades d’active, déployables en 24 à 72 h (section 4.1, [ANALYSE])
  { id:'GOLANI',   nom:'Brigade Golani',           categorie:'TERRE', type:'Brigade d’infanterie',                  effectif:3500, cap:{assaut:8,renseignement:4,frappe:3,discretion:3,endurance:8}, delai:0, coutDeploiement:8, coutMensuel:9, theatres:FRONTS, depart:'LIBAN' }, // Brigade de 3 000 à 4 000 (section 4.1, [ANALYSE]). À VÉRIFIER (coûts)
  { id:'GIVATI',   nom:'Brigade Givati',           categorie:'TERRE', type:'Brigade d’infanterie',                  effectif:3500, cap:{assaut:8,renseignement:4,frappe:3,discretion:3,endurance:8}, delai:0, coutDeploiement:8, coutMensuel:9, theatres:FRONTS, depart:'GAZA' }, // À VÉRIFIER (coûts)
  { id:'PARAS',    nom:'Brigade parachutiste',     categorie:'TERRE', type:'Brigade d’infanterie parachutiste',     effectif:3500, cap:{assaut:8,renseignement:4,frappe:3,discretion:4,endurance:8}, delai:0, coutDeploiement:8, coutMensuel:9, theatres:FRONTS, depart:null }, // À VÉRIFIER (coûts)
  { id:'OZ',       nom:'Brigade commando Oz',      categorie:'TERRE', type:'Brigade commando (créée fin 2015)',     effectif:2000, cap:{assaut:8,renseignement:6,frappe:2,discretion:6,endurance:7}, delai:0, coutDeploiement:5, coutMensuel:6, theatres:FRONTS, depart:null, indisponibilites:[{debut:0,fin:10}] }, // Créée en décembre 2015 [NV] (section 4.1, moyen)
  { id:'BLINDEE',  nom:'7e brigade blindée',       categorie:'TERRE', type:'Brigade de chars Merkava',              effectif:3000, cap:{assaut:9,renseignement:3,frappe:5,discretion:1,endurance:8}, delai:1, coutDeploiement:12, coutMensuel:12, theatres:FRONTS, depart:null }, // À VÉRIFIER (effectif, coûts)
  { id:'MLRS',     nom:'Artillerie à longue portée', categorie:'TERRE', type:'Lance-roquettes M270 et roquettes guidées', effectif:300, cap:{assaut:1,renseignement:2,frappe:8,discretion:2,endurance:7}, delai:0, coutDeploiement:4, coutMensuel:4, theatres:FRONTS, depart:null }, // ≈ 30 M270 (section 4.1, faible)
  // Armée de l’Air : 352 avions de combat (MB2019, élevé)
  { id:'F16I',     nom:'Escadrons F-16I Sufa',     categorie:'AIR', type:'Chasse et frappe',                         effectif:300, cap:{assaut:0,renseignement:4,frappe:9,discretion:4,endurance:7}, delai:0, coutDeploiement:4, coutMensuel:9, theatres:AIR_ISR, depart:'SYRIE' }, // 98 F-16I (MB2019, élevé) ; campagne entre les guerres en Syrie. À VÉRIFIER (coûts)
  { id:'F15I',     nom:'Escadron F-15I Ra’am',     categorie:'AIR', type:'Frappe à longue distance',                 effectif:200, cap:{assaut:0,renseignement:4,frappe:9,discretion:3,endurance:8}, delai:0, coutDeploiement:4, coutMensuel:9, theatres:AIR_ISR, depart:null }, // 25 F-15I (MB2019, élevé). À VÉRIFIER (coûts)
  { id:'F35I',     nom:'Escadron F-35I Adir',      categorie:'AIR', type:'Chasse furtive',                           effectif:150, cap:{assaut:0,renseignement:6,frappe:9,discretion:8,endurance:6}, delai:0, coutDeploiement:4, coutMensuel:10, theatres:AIR_ISR, depart:null, indisponibilites:[{debut:0,fin:34}] }, // Capacité opérationnelle initiale le 06/12/2017 (section 4.1, élevé) : disponible en décembre 2017
  { id:'DRONES',   nom:'Drones Heron et Hermes',   categorie:'AIR', type:'Drones de surveillance',                   effectif:150, cap:{assaut:0,renseignement:9,frappe:3,discretion:6,endurance:9}, delai:0, coutDeploiement:1, coutMensuel:2, theatres:['LIBAN','GAZA','SYRIE','SINAI'], depart:'GAZA' }, // Patrouille permanente au-dessus de Gaza et du Liban ; armement non reconnu officiellement (section 4.1, faible)
  { id:'SHAVIT',   nom:'Avions de renseignement G550', categorie:'AIR', type:'Écoutes et alerte avancée (Shavit, Eitam)', effectif:80, cap:{assaut:0,renseignement:9,frappe:0,discretion:4,endurance:6}, delai:0, coutDeploiement:1, coutMensuel:3, theatres:AIR_ISR, depart:null }, // 3 G550 Shavit, 2 G550 Eitam (MB2019, élevé)
  { id:'REEM',     nom:'Ravitailleurs Boeing 707', categorie:'AIR', type:'Ravitaillement en vol',                    effectif:100, cap:{assaut:0,renseignement:1,frappe:2,discretion:1,endurance:6}, delai:0, coutDeploiement:1, coutMensuel:3, theatres:AIR_ISR, depart:null }, // ≈ 7 Re’em vieillissants, facteur limitant pour un raid sur l’Iran [CONSENSUS] (section 4.1, faible-moyen)
  // Marine
  { id:'SAAR5',    nom:'Corvettes Sa’ar 5',        categorie:'MER', type:'Corvettes lance-missiles',                 effectif:250, cap:{assaut:0,renseignement:5,frappe:4,discretion:4,endurance:6}, delai:0, coutDeploiement:1, coutMensuel:3, theatres:['LIBAN','GAZA','SINAI'], depart:null }, // 3 Sa’ar 5 (section 4.1, moyen). À VÉRIFIER (coûts)
  { id:'DOLPHIN',  nom:'Sous-marins Dolphin',      categorie:'MER', type:'Sous-marins d’attaque',                    effectif:150, cap:{assaut:0,renseignement:8,frappe:5,discretion:10,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:['LIBAN','SYRIE','IRAN'], depart:null } // 5 après la livraison du Rahav le 12/01/2016 (section 4.1, élevé). À VÉRIFIER (coûts)
];

// ---------------------------------------------------------------------
// RENSEIGNEMENT (section 3). Excellent renseignement humain et technique ; Israël n’est pas membre des Five Eyes.
// ---------------------------------------------------------------------
export const SERVICES_ISR: ServiceDef[] = [
  { id:'MOSSAD', nom:'Mossad', libelle:'Institut pour le renseignement et les opérations spéciales', domaine:'Extérieur',
    capteurs:{HUMINT:5,SIGINT:1,IMINT:0}, efficacite:{HUMINT:1.25,SIGINT:0.9,IMINT:0.7}, theatres:['LIBAN','SYRIE','SINAI','IRAN'],
    affectationInitiale:{ IRAN:{HUMINT:2}, SYRIE:{HUMINT:1} } },
  { id:'SHIN_BET', nom:'Shin Bet', libelle:'Service de sécurité intérieure (Shabak)', domaine:'Intérieur et Gaza',
    capteurs:{HUMINT:5,SIGINT:2,IMINT:0}, efficacite:{HUMINT:1.2,SIGINT:1.0,IMINT:0.6}, theatres:['ISRAEL','GAZA'],
    affectationInitiale:{ ISRAEL:{HUMINT:3,SIGINT:1}, GAZA:{HUMINT:2} } },
  { id:'AMAN', nom:'Aman', libelle:'Direction du renseignement militaire (unités 8200, 9900, 504)', domaine:'Militaire',
    capteurs:{HUMINT:1,SIGINT:5,IMINT:3}, efficacite:{HUMINT:0.9,SIGINT:1.15,IMINT:1.0}, theatres:['ISRAEL','LIBAN','GAZA','SYRIE','SINAI','IRAN'],
    affectationInitiale:{ LIBAN:{SIGINT:2}, SYRIE:{SIGINT:1,IMINT:2}, GAZA:{IMINT:1} } }, // Satellite Ofek-11 lancé le 13/09/2016 (section 3.2, élevé)
  { id:'INCD', nom:'INCD', libelle:'Direction nationale du cyber', domaine:'Cyberdéfense',
    capteurs:{HUMINT:0,SIGINT:3,IMINT:0}, efficacite:{HUMINT:0,SIGINT:0.8,IMINT:0}, theatres:['ISRAEL'],
    affectationInitiale:{ ISRAEL:{SIGINT:2} } } // Résolutions 2444 (02/2015) et 3270 (12/2017) (section 3.1, élevé)
];

// ---------------------------------------------------------------------
// DOCTRINES (section 7). Le « dilemme de la revendication » oppose les deux premières.
// ---------------------------------------------------------------------
export const DOCTRINES_ISR: DoctrineDef[] = [
  { id:'ISR_MABAM', nom:'Campagne entre les guerres',
    texte:'Frapper souvent, discrètement et sans revendiquer, pour retarder la prochaine guerre sans obliger l’adversaire à riposter.',
    bonus:'Succès des opérations +10 %, croissance des menaces extérieures −5 %', malus:'Coûts mensuels +10 %, crédibilité initiale −2',
    mods:{ rensBonus:0, capteursBonus:{}, opBonus:0.10, enveloppe:0, delaiMod:0, coutMult:1.1, protectionMult:1, croissanceExtMult:0.95, capitalMensuel:0, voteBonus:0, opinion:0, credibilite:-2 } },
  { id:'ISR_DISSUASION', nom:'Dissuasion revendiquée',
    texte:'Assumer chaque frappe pour rendre la menace crédible et rassembler l’opinion, quitte à risquer l’escalade.',
    bonus:'Crédibilité initiale +8, opinion initiale +4, Cabinet plus facile à convaincre', malus:'Menaces extérieures +10 % de croissance',
    mods:{ rensBonus:0, capteursBonus:{}, opBonus:0, enveloppe:0, delaiMod:0, coutMult:1, protectionMult:1, croissanceExtMult:1.1, capitalMensuel:0, voteBonus:0.05, opinion:4, credibilite:8 } },
  { id:'ISR_DEFENSE', nom:'Défense active multicouche',
    texte:'Protéger la population d’abord : défense antimissile, renseignement intérieur, retenue au-delà des frontières.',
    bonus:'+1 capteur Shin Bet (sources humaines), renseignement +4, protection intérieure +40 %', malus:'Succès des opérations −5 %, crédibilité initiale −4',
    mods:{ rensBonus:4, capteursBonus:{SHIN_BET:{HUMINT:1}}, opBonus:-0.05, enveloppe:0, delaiMod:0, coutMult:1, protectionMult:1.4, croissanceExtMult:1, capitalMensuel:0, voteBonus:0, opinion:2, credibilite:-4 } }
];

// ---------------------------------------------------------------------
// NATION
// Procédure : la Knesset n’est informée qu’a posteriori (section 1.1) ; la vraie contrainte est la coalition
// au Cabinet de sécurité (section 1.4, [CONSENSUS]). Dans le jeu, un engagement terrestre durable doit être
// avalisé par le Cabinet ; frappes aériennes, forces spéciales et marine (campagne entre les guerres) n’y sont pas
// soumises. Un refus fait trembler la coalition (capital). Coefficients : choix de jouabilité.
// ---------------------------------------------------------------------
export const NATION_ISR: NationDef = {
  id: 'ISR', nom: 'Israël', role: 'Cabinet de sécurité', signature: 'Fronts multiples, délais courts',
  devise: 'ILS', cellule: 'cellule de crise du Cabinet de sécurité',
  territoire: 'ISRAEL',
  theatres: ['ISRAEL', 'LIBAN', 'GAZA', 'SYRIE', 'SINAI', 'IRAN'],
  basesPermanentes: ['ISRAEL'],
  unites: UNITES_ISR, services: SERVICES_ISR, doctrines: DOCTRINES_ISR,
  operations: ['FRAPPE', 'RAID', 'PROTECTION', 'SABOTAGE', 'CYBER_8200', 'FRAPPE_PREVENTIVE'],
  allies: { USA: 75, EGY: 50, JOR: 50, RUS: 40 },   // À VÉRIFIER (relations initiales : choix de jeu)
  categories: { FS: 'Forces spéciales', INT: 'Sécurité intérieure', TERRE: 'Armée de terre', AIR: 'Armée de l’Air et défense antimissile', MER: 'Marine' },
  procedure: {
    nom: 'Cabinet de sécurité', institution: 'du Cabinet de sécurité',
    description: 'Un engagement terrestre durable doit être avalisé par le Cabinet de sécurité, où siègent les partenaires de la coalition. Frappes, forces spéciales et marine n’y sont pas soumises. Un refus impose le retrait et ébranle la coalition.',
    dureeAvantVote: 1,
    poids: { base: 0.3, opinion: 0.2, capital: 0.55, credibilite: 1 / 250, crise: 0.12 },
    debat: { nom: 'Consultation des chefs de la coalition', description: 'Réunir les chefs des partis de la coalition avant la séance du Cabinet.', bonus: 0.15, capital: 3 },
    succes: { capital: 2 },
    refus: { capital: -15, credibilite: -3 },
    texteAutorise: 'Le Cabinet de sécurité avalise l’engagement ({theatre}).',
    texteRefus: 'Le Cabinet de sécurité refuse de prolonger l’engagement ({theatre}). Retrait des forces terrestres.',
    motifRetrait: 'refus du Cabinet de sécurité',
    categoriesExemptees: ['FS', 'AIR', 'MER']
  },
  // Chaque front tenu mobilise des réservistes : l’opinion se lasse au-delà de deux fronts (choix de conception)
  frontsToleres: 2,
  cadre: [24, 22, 62, 40],
  briefing: {
    date: 'Tel-Aviv, le 15 janvier 2015',
    diffusion: 'Très secret',
    expediteur: 'ISR_NSC',
    destinataire: 'Cellule de crise du Cabinet de sécurité',
    introduction: 'Vous dirigez la cellule de crise du Cabinet de sécurité. Vous disposez des services de renseignement, de l’armée et de la défense antimissile. Nos fronts sont proches et simultanés : une décision se prend en heures. Voici l’état de la menace à votre prise de fonctions.',
    paragraphes: [
      { theatre: 'ISRAEL', titre: 'Territoire', texte: 'L’automne dernier a vu une série d’attaques isolées à Jérusalem. Le Shin Bet redoute une vague d’attaques individuelles, difficiles à anticiper.' },
      { theatre: 'GAZA', titre: 'Gaza', texte: 'Le conflit de l’été 2014 s’est achevé par un cessez-le-feu fragile. Le Hamas reconstitue son arsenal et ses tunnels ; la population de Gaza vit dans des conditions très difficiles.' },
      { theatre: 'LIBAN', titre: 'Liban', texte: 'Le Hezbollah, engagé en Syrie aux côtés du régime, conserve au Liban un arsenal de plus de cent mille roquettes et missiles. Il cherche à se doter de missiles de précision.' },
      { theatre: 'SYRIE', titre: 'Syrie', texte: 'La guerre civile a amené les Gardiens de la révolution iraniens et leurs milices près du Golan. Nous frappons depuis 2013 les convois d’armes destinés au Hezbollah, sans le revendiquer.' },
      { theatre: 'SINAI', titre: 'Sinaï', texte: 'Le principal groupe djihadiste du Sinaï a prêté allégeance à l’État islamique en novembre. L’armée égyptienne peine à le contenir près de notre frontière.' },
      { theatre: 'IRAN', titre: 'Iran', texte: 'Les grandes puissances négocient avec Téhéran sur son programme nucléaire. Un accord limiterait l’enrichissement, mais lèverait les sanctions.' }
    ],
    conclusion: 'Le Premier ministre vous demande d’arrêter, dès cette semaine, la doctrine qui guidera l’emploi de nos forces pendant les trois années à venir.'
  }
};
