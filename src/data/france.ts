import type { AllieDef, DoctrineDef, OperationDef, ServiceDef, UniteDef } from '../sim/types';
import { EXT, MARITIMES } from './monde';

// ---------------------------------------------------------------------
// UNITÉS — coûts en M€ : mise en place sur le théâtre, puis surcoût mensuel en opération.
// cap : assaut, renseignement, frappe, discretion, endurance (0-10)
// Sources : docs/recherche/resultats/nation-FRA.md (codes S..) et couts-deploiements.md.
// Repère commun des coûts mensuels : surcoût OPEX moyen de 125 928 € par militaire projeté et par an
// (Cour des comptes, « Les opérations extérieures de la France 2012-2015 », 2016), soit ≈ 10,5 M€/mois
// pour 1 000 militaires. C'est un surcoût marginal, pas un coût complet.
// ---------------------------------------------------------------------
export const UNITES: UniteDef[] = [
  // Forces spéciales (COS)
  { id:'RPIMA1', nom:'1er RPIMa',          categorie:'FS', type:'Régiment de forces spéciales Terre', effectif:900,  cap:{assaut:9,renseignement:7,frappe:2,discretion:8,endurance:7}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:'SAHEL' }, // À VÉRIFIER (effectif du régiment ; le COS compte ≈ 3 000 à 4 000 militaires, S43 moyen ; TF Sabre au Sahel : « quelques centaines »)
  { id:'RDP13',  nom:'13e RDP',            categorie:'FS', type:'Recherche humaine en profondeur',     effectif:900,  cap:{assaut:5,renseignement:9,frappe:1,discretion:9,endurance:8}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; non détaillé dans la fiche FRA)
  { id:'CPA10',  nom:'CPA 10',             categorie:'FS', type:'Commando parachutiste de l’air',      effectif:120,  cap:{assaut:7,renseignement:6,frappe:4,discretion:8,endurance:6}, delai:1, coutDeploiement:2,  coutMensuel:2,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; non trouvé dans la fiche FRA)
  { id:'CDOMAR', nom:'Commandos marine',   categorie:'FS', type:'Forces spéciales Marine',             effectif:650,  cap:{assaut:9,renseignement:6,frappe:2,discretion:9,endurance:6}, delai:1, coutDeploiement:3,  coutMensuel:3,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif ; sept commandos : Jaubert, Trépel, de Montfort, de Penfentenyo, Hubert, Kieffer, Ponchardier, S0)
  { id:'RHFS4',  nom:'4e RHFS',            categorie:'FS', type:'Hélicoptères des forces spéciales',   effectif:400,  cap:{assaut:6,renseignement:4,frappe:5,discretion:6,endurance:5}, delai:2, coutDeploiement:5,  coutMensuel:4,  theatres:EXT, depart:null }, // À VÉRIFIER (effectif, coûts ; EHS 1/67 et ET 3/61 non chiffrés)
  // Sécurité intérieure
  { id:'GIGN',   nom:'GIGN',               categorie:'INT', type:'Intervention Gendarmerie',          effectif:380,  cap:{assaut:9,renseignement:4,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['METRO'], depart:null, protection:2 }, // À VÉRIFIER (effectif : ≈ 400 selon la fiche FRA, mais connaissance générale non sourcée S0)
  { id:'RAID',   nom:'RAID',               categorie:'INT', type:'Intervention Police nationale',      effectif:170,  cap:{assaut:9,renseignement:4,frappe:0,discretion:7,endurance:7}, delai:0, coutDeploiement:0.5, coutMensuel:1, theatres:['METRO'], depart:null, protection:2 }, // À VÉRIFIER (effectif : ≈ 320 avec les antennes régionales selon la fiche FRA, S0 non sourcé)
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
  { id:'A400M',  nom:'Transport A400M',    categorie:'AIR', type:'Transport tactique et stratégique', effectif:120,  cap:{assaut:0,renseignement:0,frappe:0,discretion:2,endurance:7}, delai:1, coutDeploiement:2,  coutMensuel:4,  theatres:EXT, depart:null }, // Flotte ≈ 11-14 appareils fin 2018, livraisons retardées (S19, moyen). À VÉRIFIER (livraisons annuelles, effectif, coûts)
  // Mer
  { id:'CDG',    nom:'Groupe aéronaval (Charles de Gaulle)', categorie:'MER', type:'Porte-avions et escorte', effectif:2600, cap:{assaut:1,renseignement:6,frappe:10,discretion:2,endurance:5}, delai:1, coutDeploiement:15, coutMensuel:25, theatres:['LIBYE','LEVANT','CORNE','INDOPAC'], depart:null, indisponibilites:[{debut:5,fin:9},{debut:25,fin:35}] }, // À VÉRIFIER (effectif, calendrier d'entretien)
  { id:'FREMM',  nom:'FREMM',              categorie:'MER', type:'Frégate multimissions',             effectif:110,  cap:{assaut:1,renseignement:6,frappe:5,discretion:5,endurance:7}, delai:1, coutDeploiement:2,  coutMensuel:4,  theatres:MARITIMES, depart:null }, // Cinq FREMM sur la période (Aquitaine, Provence, Languedoc, Auvergne, Bretagne en 2018) ; MdCN, premier tir le 14/04/2018 (S32, S33). À VÉRIFIER (équipage, coûts : « non trouvé »)
  { id:'SNA',    nom:'Sous-marin nucléaire d’attaque', categorie:'MER', type:'SNA classe Rubis',       effectif:70,   cap:{assaut:0,renseignement:8,frappe:3,discretion:10,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:3, theatres:MARITIMES, depart:null }, // Six SNA classe Rubis (élevé). À VÉRIFIER (coûts ; disponibilité ≈ 50 % supposée)
  { id:'BPC',    nom:'Bâtiment de projection (BPC)', categorie:'MER', type:'Porte-hélicoptères amphibie', effectif:180, cap:{assaut:5,renseignement:3,frappe:2,discretion:2,endurance:6}, delai:2, coutDeploiement:4, coutMensuel:5, theatres:MARITIMES, depart:null }, // Trois BPC (Mistral, Tonnerre, Dixmude) ; GTIA embarqué de 450 à 900 (S0). À VÉRIFIER (équipage hors troupes embarquées, coûts)
  // Appui, renseignement et sécurité intérieure
  { id:'GAM',    nom:'Groupement aéromobile (ALAT)', categorie:'TERRE', type:'Hélicoptères Tigre, Gazelle, Caïman', effectif:300, cap:{assaut:6,renseignement:4,frappe:6,discretion:4,endurance:5}, delai:2, coutDeploiement:8, coutMensuel:7, theatres:['SAHEL','LIBYE','GUINEE','CORNE','EST'], depart:null }, // À VÉRIFIER (effectif, coûts : heures de vol Tigre et NH90 « non trouvé »)
  { id:'CAESAR', nom:'Batterie CAESAR',          categorie:'TERRE', type:'Artillerie de 155 mm sur camion', effectif:150, cap:{assaut:2,renseignement:2,frappe:7,discretion:2,endurance:7}, delai:2, coutDeploiement:6, coutMensuel:4, theatres:['LEVANT','SAHEL','EST','LIBYE'], depart:null }, // Effectif : task force Wagram, 150 militaires, 4 CAESAR puis 3, portée ≈ 40 km (S42, S43, élevé). À VÉRIFIER (coûts)
  { id:'RH2',    nom:'2e régiment de hussards',  categorie:'TERRE', type:'Recherche humaine (renseignement)', effectif:900, cap:{assaut:3,renseignement:8,frappe:0,discretion:7,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:2, theatres:['EST','LIBYE','LEVANT','SAHEL','GUINEE','CORNE'], depart:null }, // À VÉRIFIER (effectif, coûts ; non traité par la recherche)
  { id:'BRI',    nom:'BRI de la préfecture de police', categorie:'INT', type:'Brigade de recherche et d’intervention', effectif:100, cap:{assaut:7,renseignement:5,frappe:0,discretion:6,endurance:6}, delai:0, coutDeploiement:0.5, coutMensuel:0.5, theatres:['METRO'], depart:null, protection:1 }, // Effectif ≈ 100 (fiche FRA, S0 faible). À VÉRIFIER
  { id:'AWACS',  nom:'E-3F AWACS',               categorie:'AIR', type:'Détection et contrôle aéroportés', effectif:100, cap:{assaut:0,renseignement:7,frappe:1,discretion:2,endurance:6}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:['EST','LEVANT','LIBYE'], depart:null }, // Quatre E-3F (S0) ; deux engagés en 04/2018 (S32). À VÉRIFIER (effectif, coûts)
  { id:'GABRIEL',nom:'C-160 Gabriel',            categorie:'AIR', type:'Renseignement d’origine électromagnétique', effectif:60, cap:{assaut:0,renseignement:8,frappe:0,discretion:4,endurance:6}, delai:1, coutDeploiement:1.5, coutMensuel:2, theatres:EXT, depart:null }, // À VÉRIFIER (effectif, coûts ; non traité par la recherche)
  { id:'HORIZON',nom:'Frégate Horizon',          categorie:'MER', type:'Frégate de défense aérienne', effectif:190, cap:{assaut:0,renseignement:6,frappe:3,discretion:4,endurance:7}, delai:1, coutDeploiement:2, coutMensuel:4, theatres:MARITIMES, depart:null } // Deux frégates Horizon (S32). À VÉRIFIER (équipage, coûts)
];

// ---------------------------------------------------------------------
// SERVICES DE RENSEIGNEMENT
// ---------------------------------------------------------------------
export const SERVICES: ServiceDef[] = [
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
// ALLIÉS : acteurs avec une relation (0-100) et des appuis par théâtre.
// appui.effets : rens, pression, frappesZoom, recosZoom, opBonus, delai (pendant duree mois),
//                partenaire (immédiat). base : probabilité d'accord avant relation et crédibilité.
// interets : théâtres où un engagement français améliore la relation.
// ---------------------------------------------------------------------
export const ALLIES: AllieDef[] = [
  { id:'USA', nom:'États-Unis', relation:60, interets:['LEVANT','EST','SAHEL'],
    description:'Premier partenaire militaire. Moyens de surveillance, de transport stratégique et de frappe sans équivalent, mais une attention fluctuante.',
    appuis:[
      { id:'ISR',       nom:'Drones et avions de surveillance',       theatres:['SAHEL','LEVANT','LIBYE','CORNE','GUINEE'], duree:4, capital:2, relation:3, base:0.8,  effets:{ rens:15, recosZoom:1 } }, // Appui américain au Sahel et au Levant : ravitaillement, ISR, C-17 (fiche FRA, S0 moyen). À VÉRIFIER (moyens par théâtre)
      { id:'FRAPPES',   nom:'Frappes de la coalition',                theatres:['LEVANT','LIBYE'],                          duree:4, capital:3, relation:4, base:0.65, effets:{ pression:10, frappesZoom:2, opBonus:0.05 } },
      { id:'TRANSPORT', nom:'Transport stratégique (C-17)',           theatres:['SAHEL','LEVANT','LIBYE','CORNE','GUINEE','EST'], duree:4, capital:1, relation:2, base:0.85, effets:{ delai:-1 } },
      { id:'RAVITO',    nom:'Ravitaillement en vol (KC-135)',         theatres:['SAHEL','LEVANT','LIBYE'],                  duree:4, capital:1, relation:2, base:0.8,  effets:{ pression:4, opBonus:0.05 } },
      { id:'REASSUR',   nom:'Présence renforcée de l’US Army',        theatres:['EST'],                                     duree:5, capital:2, relation:3, base:0.6,  effets:{ pression:12 } },
      { id:'NAVAL',     nom:'Patrouilles de l’US Navy',               theatres:['INDOPAC','CORNE'],                         duree:4, capital:1, relation:2, base:0.7,  effets:{ pression:8, rens:5 } }
    ] },
  { id:'UK', nom:'Royaume-Uni', relation:65, interets:['LEVANT','EST'],
    description:'Partenaire militaire le plus proche en Europe (traités de Lancaster House).',
    appuis:[
      { id:'FRAPPES',   nom:'Frappes de la RAF',                      theatres:['LEVANT'],          duree:4, capital:2, relation:3, base:0.7,  effets:{ pression:6, frappesZoom:1 } },
      { id:'ISR',       nom:'Renseignement partagé',                  theatres:['LEVANT','LIBYE'],  duree:4, capital:1, relation:2, base:0.75, effets:{ rens:8 } },
      { id:'HELICOS',   nom:'Hélicoptères lourds Chinook',            theatres:['SAHEL'],           duree:5, capital:2, relation:3, base:0.5,  effets:{ pression:4, delai:-1 } } // Réel : 3 Chinook à Barkhane en 2018, hors calendrier du jeu (fiche FRA, S0 moyen). Ici un possible plus précoce. À VÉRIFIER
    ] },
  { id:'DEU', nom:'Allemagne', relation:65, interets:['SAHEL','EST'],
    description:'Partenaire européen central, engagé dans la formation au Mali et sur le flanc est.',
    appuis:[
      { id:'FORMATION', nom:'Formateurs (mission européenne au Mali)', theatres:['SAHEL'], duree:1, capital:1, relation:2, base:0.75, effets:{ partenaire:6 } },
      { id:'REASSUR',   nom:'Contribution à la présence avancée',      theatres:['EST'],   duree:5, capital:1, relation:2, base:0.7,  effets:{ pression:6 } }
    ] },
  { id:'ITA', nom:'Italie', relation:60, interets:['LIBYE'],
    description:'Partenaire de premier plan en Méditerranée centrale et en Libye.',
    appuis:[ { id:'NAVAL', nom:'Opération navale en Méditerranée', theatres:['LIBYE'], duree:4, capital:1, relation:2, base:0.75, effets:{ pression:6, rens:6 } } ] },
  { id:'JPN', nom:'Japon', relation:55, interets:['CORNE','INDOPAC'],
    description:'Présent à Djibouti pour la lutte contre la piraterie.',
    appuis:[ { id:'ISR', nom:'Patrouille maritime P-3C', theatres:['CORNE'], duree:4, capital:1, relation:2, base:0.7, effets:{ rens:8, pression:4 } } ] },
  { id:'AUS', nom:'Australie', relation:55, interets:['INDOPAC'],
    description:'Partenaire stratégique dans le Pacifique Sud.',
    appuis:[ { id:'NAVAL', nom:'Patrouilles conjointes', theatres:['INDOPAC'], duree:4, capital:1, relation:2, base:0.7, effets:{ pression:6, rens:6 } } ] },
  { id:'NGA', nom:'Nigeria', relation:50, interets:['GUINEE','SAHEL'],
    description:'Puissance riveraine du golfe de Guinée.',
    appuis:[ { id:'NAVAL', nom:'Patrouilles de la marine nigériane', theatres:['GUINEE'], duree:4, capital:1, relation:2, base:0.6, effets:{ pression:6 } } ] }
];

// ---------------------------------------------------------------------
// OPÉRATIONS STRATÉGIQUES
// ---------------------------------------------------------------------
export const OPERATIONS: OperationDef[] = [
  { id:'FRAPPE', nom:'Frappe', capacite:'frappe', categories:['AIR','MER','TERRE'], minCapacite:5, serviceRequis:null,
    cibles:['DJIHAD','DAECH','PIRATERIE','BOKO_HARAM'], theatresInterdits:['METRO','EST','INDOPAC'], degats:14, cout:6, capital:0,
    risquePertes:0.03, risqueCollat:0.28, pression:8, effetSucces:{}, description:'Frappe planifiée (aviation, aéronavale, hélicoptères d’attaque ou artillerie) sur des objectifs identifiés.' },
  { id:'RAID', nom:'Raid de forces spéciales', capacite:'assaut', categories:['FS','INT'], minCapacite:5, serviceRequis:null,
    cibles:['TERRO','DJIHAD','DAECH','PIRATERIE','BOKO_HARAM','SHABAAB'], theatresInterdits:[], degats:18, cout:3, capital:1,
    risquePertes:0.18, risqueCollat:0.12, pression:8, effetSucces:{}, description:'Action ciblée contre un dispositif adverse (interpellation en métropole).' },
  { id:'FORMATION', nom:'Formation d’une armée partenaire', capacite:'endurance', categories:['TERRE','FS'], minCapacite:5, serviceRequis:null,
    cibles:null, theatresInterdits:['METRO'], degats:0, cout:4, capital:0,
    risquePertes:0.03, risqueCollat:0, pression:3, effetSucces:{partenaire:8}, description:'Accompagnement et formation de forces locales (effet durable).' },
  { id:'PROTECTION', nom:'Protection du territoire', capacite:'assaut', categories:['INT'], minCapacite:1, serviceRequis:null,
    cibles:null, theatresInterdits:EXT, degats:0, cout:5, capital:0,
    risquePertes:0.02, risqueCollat:0.04, pression:6, effetSucces:{menaceInt:-8, opinion:1}, description:'Renforcement de la protection des sites sensibles et des rassemblements.' },
  { id:'CYBERDEF', nom:'Contre-mesure cyber', capacite:'renseignement', categories:[], minCapacite:0, serviceRequis:'ANSSI',
    cibles:['CYBER','ETAT_EST'], theatresInterdits:[], degats:14, cout:2, capital:0,
    risquePertes:0, risqueCollat:0.06, pression:4, effetSucces:{}, description:'Neutralisation d’infrastructures d’attaque et durcissement des systèmes.' },
  { id:'REASSURANCE', nom:'Posture de réassurance', capacite:'endurance', categories:['AIR','MER','TERRE'], minCapacite:4, serviceRequis:null,
    cibles:['ETAT_EST','INDOPAC_P','PIRATERIE','COREE_NORD'], theatresInterdits:['METRO'], degats:9, cout:5, capital:0,
    risquePertes:0.01, risqueCollat:0.08, pression:6, effetSucces:{credibilite:1}, description:'Présence visible, exercices et patrouilles avec les partenaires.' }
];

// ---------------------------------------------------------------------
// DOCTRINES (choix initial)
// ---------------------------------------------------------------------
export const DOCTRINES: DoctrineDef[] = [
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
