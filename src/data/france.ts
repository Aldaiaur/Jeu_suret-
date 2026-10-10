import type { DoctrineDef, ServiceDef, UniteDef } from '../sim/types';
import { EXT, MARITIMES } from './monde';

// ---------------------------------------------------------------------
// UNITÉS — coûts en M€ : mise en place sur le théâtre, puis surcoût mensuel en opération.
// cap : assaut, renseignement, frappe, discretion, endurance (0-10)
// Sources : docs/recherche/resultats/nation-FRA.md (codes S..) et couts-deploiements.md.
// Repère commun des coûts mensuels : surcoût OPEX moyen de 125 928 € par militaire projeté et par an
// (Cour des comptes, « Les opérations extérieures de la France 2012-2015 », 2016), soit ≈ 10,5 M€/mois
// pour 1 000 militaires. C'est un surcoût marginal, pas un coût complet.
// ---------------------------------------------------------------------
export const UNITES_FRA: UniteDef[] = [
  // Forces spéciales (COS)
  { id:'RPIMA1', nom:'1er RPIMa',          categorie:'FS', type:'Régiment de forces spéciales Terre', effectif:900,  cap:{assaut:9,renseignement:7,frappe:2,discretion:8,endurance:7}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:'SAHEL' }, // À VÉRIFIER (effectif du régiment ; le COS compte ≈ 3 000 à 4 000 militaires, S43 moyen ; TF Sabre au Sahel : « quelques centaines »)
  { id:'RDP13',  nom:'13e RDP',            categorie:'FS', type:'Recherche humaine en profondeur',     effectif:900,  cap:{assaut:5,renseignement:9,frappe:1,discretion:9,endurance:8}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; non détaillé dans la fiche FRA)
  { id:'CPA10',  nom:'CPA 10',             categorie:'FS', type:'Commando parachutiste de l’air',      effectif:120,  cap:{assaut:7,renseignement:6,frappe:4,discretion:8,endurance:6}, delai:1, coutDeploiement:2,  coutMensuel:2,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; non trouvé dans la fiche FRA)
  { id:'CDOMAR', nom:'Commandos marine',   categorie:'FS', type:'Forces spéciales Marine',             effectif:650,  cap:{assaut:9,renseignement:6,frappe:2,discretion:9,endurance:6}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; sept commandos : Jaubert, Trépel, de Montfort, de Penfentenyo, Hubert, Kieffer, Ponchardier, S0)
  { id:'RHFS4',  nom:'4e RHFS',            categorie:'FS', type:'Hélicoptères des forces spéciales',   effectif:400,  cap:{assaut:6,renseignement:4,frappe:5,discretion:6,endurance:5}, delai:2, coutDeploiement:5,  coutMensuel:4,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif, coûts ; EHS 1/67 et ET 3/61 non chiffrés)
  // Sécurité intérieure
  { id:'GIGN',   nom:'GIGN',               categorie:'INT', type:'Intervention Gendarmerie',          effectif:380,  cap:{assaut:9,renseignement:4,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['METRO'], depart:null, protection:2 }, // Effectif : 378 militaires après la réforme de 2007 (Sénat, rapport l09-101-328), 400 à la maison mère en 2020 (gendarmerie) ; antennes régionales créées en 04/2016
  { id:'RAID',   nom:'RAID',               categorie:'INT', type:'Intervention Police nationale',      effectif:450,  cap:{assaut:9,renseignement:4,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['METRO'], depart:null, protection:2 }, // Effectif : ≈ 80 agents avant 2015, ≈ 450-500 après l’intégration des GIPN en antennes (2015-2016) (Wikipédia « RAID (French police unit) », moyen)
  { id:'SENTI',  nom:'Protection du territoire', categorie:'INT', type:'Dispositif militaire (contrat 10 000 h)', effectif:10000, cap:{assaut:3,renseignement:2,frappe:0,discretion:1,endurance:4}, delai:0, coutDeploiement:5, coutMensuel:13, theatres:['METRO'], depart:null, protection:8 }, // Effectif : 10 000 dont 3 000 en réserve (S34-S36, élevé). Mensuel : MISSINT 156 M€ en 2018 (S22-S23, élevé), ≈ 145 M€ en 2016 (iFRAP, moyen). À VÉRIFIER (coût de mise en place)
  // Terre
  { id:'GTIA1',  nom:'GTIA 1',             categorie:'TERRE', type:'Groupement tactique interarmes',  effectif:1000, cap:{assaut:7,renseignement:4,frappe:3,discretion:2,endurance:8}, delai:2, coutDeploiement:20, coutMensuel:10.5, theatres:['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE'], depart:'SAHEL' }, // Effectif : GTIA ≈ 1 000-1 300 (S36). Mensuel : 1 000 × 125 928 €/12 (Cour des comptes 2016, dérivé). À VÉRIFIER (mise en place)
  { id:'GTIA2',  nom:'GTIA 2',             categorie:'TERRE', type:'Groupement tactique interarmes',  effectif:1000, cap:{assaut:7,renseignement:4,frappe:3,discretion:2,endurance:8}, delai:2, coutDeploiement:20, coutMensuel:10.5, theatres:['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE'], depart:null }, // Comme GTIA 1
  { id:'GTIA3',  nom:'GTIA 3',             categorie:'TERRE', type:'Groupement tactique interarmes',  effectif:1000, cap:{assaut:7,renseignement:4,frappe:3,discretion:2,endurance:8}, delai:2, coutDeploiement:20, coutMensuel:10.5, theatres:['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE'], depart:null }, // Comme GTIA 1
  // Air
  { id:'RAFALE', nom:'Escadron Rafale',    categorie:'AIR', type:'Chasse polyvalente (détachement)',  effectif:250,  cap:{assaut:0,renseignement:4,frappe:9,discretion:3,endurance:6}, delai:1, coutDeploiement:6,  coutMensuel:12, theatres:EXT, depart:'LEVANT' }, // Détachement de 6 à 14 avions (S44, S18). Mensuel dérivé : 8 avions × ≈ 100 h/mois (S32) × 14 596 €/h (EPM seul, Cour des comptes 2014) ≈ 11,7 M€. À VÉRIFIER (effectif du détachement, mise en place)
  { id:'M2000D', nom:'Escadron Mirage 2000D', categorie:'AIR', type:'Attaque au sol (détachement)',   effectif:200,  cap:{assaut:0,renseignement:2,frappe:7,discretion:3,endurance:6}, delai:1, coutDeploiement:5,  coutMensuel:7,  theatres:EXT, depart:'SAHEL' }, // Mensuel dérivé : 8 avions × ≈ 100 h/mois (S32) × 8 802 €/h (EPM, Cour des comptes 2014 ; 8 082 € selon une autre reprise). À VÉRIFIER (effectif, mise en place)
  { id:'REAPER', nom:'Drones Reaper',      categorie:'AIR', type:'Drone MALE, non armé',              effectif:80,   cap:{assaut:0,renseignement:9,frappe:0,discretion:6,endurance:9}, delai:1, coutDeploiement:2,  coutMensuel:2,  theatres:['SAHEL','LEVANT','LIBYE'], depart:'SAHEL' }, // Vecteurs : 2 en 2014, 5 en ligne au Sahel après les livraisons de fin 2016, flotte de 6 ; 3 en permanence à Niamey ; non armés sur 2015-2018 (armement décidé le 5/09/2017, effectif en 12/2019) (S30, S61, élevé). À VÉRIFIER (effectif, coûts)
  { id:'ATL2',   nom:'Atlantique 2',       categorie:'AIR', type:'Patrouille maritime et ISR',        effectif:120,  cap:{assaut:0,renseignement:8,frappe:3,discretion:4,endurance:7}, delai:1, coutDeploiement:2,  coutMensuel:3,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif, coûts)
  { id:'MRTT',   nom:'Ravitailleurs C-135FR', categorie:'AIR', type:'Ravitaillement en vol',          effectif:150,  cap:{assaut:0,renseignement:1,frappe:2,discretion:1,endurance:8}, delai:1, coutDeploiement:2,  coutMensuel:4,  theatres:EXT, depart:null }, // Flotte ≈ 14 C-135FR/KC-135R, plus de 50 ans d’âge ; 6 engagés pour une frappe en Syrie en 04/2018 (S32, moyen). À VÉRIFIER (effectif, coûts : « non trouvé » dans couts-deploiements)
  { id:'A400M',  nom:'Transport A400M',    categorie:'AIR', type:'Transport tactique et stratégique', effectif:120,  cap:{assaut:0,renseignement:0,frappe:0,discretion:2,endurance:7}, delai:1, coutDeploiement:2,  coutMensuel:4,  theatres:EXT, depart:null }, // Livraisons : 8 appareils fin 2015 (capacités logistiques seulement), 11 au 2/03/2017, 12 en service fin 2016 et fin 2017 (Assemblée nationale, QE 99447 et 4414, élevé). À VÉRIFIER (effectif du détachement, coûts)
  // Mer
  { id:'CDG',    nom:'Groupe aéronaval (Charles de Gaulle)', categorie:'MER', type:'Porte-avions et escorte', effectif:2600, cap:{assaut:1,renseignement:6,frappe:10,discretion:2,endurance:5}, delai:1, coutDeploiement:15, coutMensuel:25, theatres:['LIBYE','LEVANT','CORNE','INDOPAC'], depart:null, indisponibilites:[{debut:5,fin:9},{debut:25,fin:44}] }, // Calendrier : missions 01-05/2015, 11/2015-03/2016, 09-12/2016 ; arrêt technique majeur de 02/2017 à 09/2018 (S40, S41, S59, élevé). Effectif : ≈ 1 900 pour le porte-avions en opération (1 200 bâtiment, 600 groupe aérien, 100 état-major ; ministère de la Défense, 2009), ≈ 2 600 avec l’escorte (FREMM 108, Horizon 174, SNA 70, pétrolier). Coûts : ≈ 1 M€/jour selon une estimation de presse (faible). À VÉRIFIER (arrêt de mi-2015 entre deux missions)
  { id:'FREMM',  nom:'FREMM',              categorie:'MER', type:'Frégate multimissions',             effectif:108,  cap:{assaut:1,renseignement:6,frappe:5,discretion:5,endurance:7}, delai:1, coutDeploiement:2,  coutMensuel:4,  theatres:MARITIMES, depart:null }, // Équipage ≈ 108, détachement hélicoptère compris (Marine nationale, fiche FREMM) ; cinq FREMM (Aquitaine, Provence, Languedoc, Auvergne, Bretagne en 2018) ; MdCN, premier tir le 14/04/2018 (S32, S33). À VÉRIFIER (coûts : « non trouvé »)
  { id:'SNA',    nom:'Sous-marin nucléaire d’attaque', categorie:'MER', type:'SNA classe Rubis',       effectif:70,   cap:{assaut:0,renseignement:8,frappe:3,discretion:10,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:MARITIMES, depart:null }, // Six SNA classe Rubis (élevé). À VÉRIFIER (coûts ; disponibilité ≈ 50 % supposée)
  { id:'BPC',    nom:'Bâtiment de projection (BPC)', categorie:'MER', type:'Porte-hélicoptères amphibie', effectif:180, cap:{assaut:5,renseignement:3,frappe:2,discretion:2,endurance:6}, delai:2, coutDeploiement:4, coutMensuel:5, theatres:MARITIMES, depart:null }, // Trois BPC (Mistral, Tonnerre, Dixmude) ; GTIA embarqué de 450 à 900 (S0). À VÉRIFIER (équipage hors troupes embarquées, coûts)
  // Appui, renseignement et sécurité intérieure
  { id:'GAM',    nom:'Groupement aéromobile (ALAT)', categorie:'TERRE', type:'Hélicoptères Tigre, Gazelle, Caïman', effectif:300, cap:{assaut:6,renseignement:4,frappe:6,discretion:4,endurance:5}, delai:2, coutDeploiement:8, coutMensuel:7, theatres:['SAHEL','LIBYE','GUINEE','CORNE','EST'], depart:null }, // À VÉRIFIER (effectif, coûts : heures de vol Tigre et NH90 « non trouvé »)
  { id:'CAESAR', nom:'Batterie CAESAR',          categorie:'TERRE', type:'Artillerie de 155 mm sur camion', effectif:150, cap:{assaut:2,renseignement:2,frappe:7,discretion:2,endurance:7}, delai:2, coutDeploiement:6, coutMensuel:4, theatres:['LEVANT','SAHEL','EST','LIBYE'], depart:null }, // Effectif : task force Wagram, 150 militaires, 4 CAESAR puis 3, portée ≈ 40 km (S42, S43, élevé). À VÉRIFIER (coûts)
  { id:'RH2',    nom:'2e régiment de hussards',  categorie:'TERRE', type:'Recherche humaine (renseignement)', effectif:900, cap:{assaut:3,renseignement:8,frappe:0,discretion:7,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:2, theatres:['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE'], depart:null }, // À VÉRIFIER (effectif, coûts ; non traité par la recherche)
  { id:'BRI',    nom:'BRI de la préfecture de police', categorie:'INT', type:'Brigade de recherche et d’intervention', effectif:100, cap:{assaut:7,renseignement:5,frappe:0,discretion:6,endurance:6}, delai:0, coutDeploiement:0.5, coutMensuel:0.5, theatres:['METRO'], depart:null, protection:1 }, // Effectif ≈ 100 (fiche FRA, S0 faible). À VÉRIFIER
  { id:'AWACS',  nom:'E-3F AWACS',               categorie:'AIR', type:'Détection et contrôle aéroportés', effectif:100, cap:{assaut:0,renseignement:7,frappe:1,discretion:2,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:['EST','LEVANT','LIBYE'], depart:null }, // Quatre E-3F (S0) ; deux engagés en 04/2018 (S32). À VÉRIFIER (effectif, coûts)
  { id:'GABRIEL',nom:'C-160 Gabriel',            categorie:'AIR', type:'Renseignement d’origine électromagnétique', effectif:60, cap:{assaut:0,renseignement:8,frappe:0,discretion:4,endurance:6}, delai:1, coutDeploiement:1.5, coutMensuel:2, theatres:EXT, depart:null }, // À VÉRIFIER (effectif, coûts ; non traité par la recherche)
  { id:'HORIZON',nom:'Frégate Horizon',          categorie:'MER', type:'Frégate de défense aérienne', effectif:174, cap:{assaut:0,renseignement:6,frappe:3,discretion:4,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:MARITIMES, depart:null } // Deux frégates Horizon (S32). Équipage : 174 (26 officiers, 110 officiers mariniers, 38 quartiers-maîtres et matelots ; techno-science, faible). À VÉRIFIER (coûts)
];

// ---------------------------------------------------------------------
// SERVICES DE RENSEIGNEMENT
// ---------------------------------------------------------------------
export const SERVICES_FRA: ServiceDef[] = [
  { id:'DGSE',  nom:'DGSE',  libelle:'Direction générale de la sécurité extérieure', domaine:'Extérieur',
    capteurs:{HUMINT:5,SIGINT:4,IMINT:1}, efficacite:{HUMINT:1.2,SIGINT:1.0,IMINT:0.8}, theatres:EXT,
    affectationInitiale:{ SAHEL:{HUMINT:2,SIGINT:1}, LEVANT:{HUMINT:2,SIGINT:2} } },
  { id:'DGSI',  nom:'DGSI',  libelle:'Direction générale de la sécurité intérieure', domaine:'Intérieur',
    capteurs:{HUMINT:5,SIGINT:3,IMINT:0}, efficacite:{HUMINT:1.2,SIGINT:1.0,IMINT:0.6}, theatres:['METRO'],
    affectationInitiale:{ METRO:{HUMINT:3,SIGINT:1} } },
  { id:'DRM',   nom:'DRM',   libelle:'Direction du renseignement militaire', domaine:'Militaire',
    capteurs:{HUMINT:1,SIGINT:2,IMINT:4}, efficacite:{HUMINT:0.8,SIGINT:1.0,IMINT:1.2}, theatres:EXT,
    affectationInitiale:{ SAHEL:{IMINT:2}, LEVANT:{IMINT:1} } },
  { id:'ANSSI', nom:'ANSSI', libelle:'Agence nationale de la sécurité des systèmes d’information', domaine:'Cyberdéfense',
    capteurs:{HUMINT:0,SIGINT:4,IMINT:0}, efficacite:{HUMINT:0,SIGINT:0.5,IMINT:0}, theatres:['METRO','EST'],
    affectationInitiale:{ METRO:{SIGINT:2} } }
];

// ---------------------------------------------------------------------
// DOCTRINES (choix initial)
// ---------------------------------------------------------------------
export const DOCTRINES_FRA: DoctrineDef[] = [
  { id:'RENS', nom:'Primauté du renseignement',
    texte:'Priorité aux services. Capteurs supplémentaires et meilleure lecture des menaces, mais des moyens d’action plus comptés.',
    bonus:'+1 capteur HUMINT DGSE et DGSI, renseignement +8 partout', malus:'Enveloppe OPEX -10 M€/mois, succès des opérations -5 %',
    mods:{ rensBonus:8, capteursBonus:{DGSE:{HUMINT:1}, DGSI:{HUMINT:1}}, opBonus:-0.05, enveloppe:-10, delaiMod:0, coutMult:1, protectionMult:1, croissanceExtMult:1, capitalMensuel:0, voteBonus:0, opinion:0, credibilite:0 } },
  { id:'PROJ', nom:'Intervention avancée',
    texte:'Agir loin pour protéger ici. Projection rapide et opérations plus efficaces, au prix de la tolérance politique.',
    bonus:'Succès des opérations +10 %, projection plus rapide d’un tour (minimum 0)', malus:'Coûts mensuels +15 %, votes de l’article 35 plus difficiles, opinion initiale -5',
    mods:{ rensBonus:0, capteursBonus:{}, opBonus:0.10, enveloppe:0, delaiMod:-1, coutMult:1.15, protectionMult:1, croissanceExtMult:1, capitalMensuel:0, voteBonus:-0.1, opinion:-5, credibilite:5 } },
  { id:'SANCT', nom:'Sanctuarisation du territoire',
    texte:'La sécurité des Français d’abord. Protection intérieure renforcée, engagement extérieur au minimum.',
    bonus:'Effet de la protection intérieure +40 %, capital politique +1/mois', malus:'Menaces extérieures +15 % de croissance, crédibilité initiale -10',
    mods:{ rensBonus:0, capteursBonus:{}, opBonus:0, enveloppe:0, delaiMod:0, coutMult:1, protectionMult:1.4, croissanceExtMult:1.15, capitalMensuel:1, voteBonus:0.05, opinion:3, credibilite:-10 } }
];
