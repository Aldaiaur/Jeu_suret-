import type { OperationDef } from '../sim/types';
import { EXT } from './monde';

// ---------------------------------------------------------------------
// OPÉRATIONS STRATÉGIQUES
// ---------------------------------------------------------------------
export const OPERATIONS: OperationDef[] = [
  { id:'FRAPPE', nom:'Frappe', capacite:'frappe', categories:['AIR','MER','TERRE'], minCapacite:5, serviceRequis:null,
    cibles:['DJIHAD','DAECH','PIRATERIE','BOKO_HARAM','HEZBOLLAH','HAMAS','IRAN_SYRIE','SINAI_EI'], theatresInterdits:['METRO','GB','EST','INDOPAC','ISRAEL','IRAN'], degats:14, cout:6, capital:0,
    risquePertes:0.03, risqueCollat:0.28, pression:8, effetSucces:{}, description:'Frappe planifiée (aviation, aéronavale, hélicoptères d’attaque ou artillerie) sur des objectifs identifiés.' },
  { id:'RAID', nom:'Raid de forces spéciales', capacite:'assaut', categories:['FS','INT'], minCapacite:5, serviceRequis:null,
    cibles:['TERRO','DJIHAD','DAECH','PIRATERIE','BOKO_HARAM','SHABAAB','HEZBOLLAH','HAMAS','IRAN_SYRIE','SINAI_EI'], theatresInterdits:[], degats:18, cout:3, capital:1,
    risquePertes:0.18, risqueCollat:0.12, pression:8, effetSucces:{}, description:'Action ciblée contre un dispositif adverse (interpellation en métropole).' },
  { id:'FORMATION', nom:'Formation d’une armée partenaire', capacite:'endurance', categories:['TERRE','FS'], minCapacite:5, serviceRequis:null,
    cibles:null, theatresInterdits:['METRO','GB'], degats:0, cout:4, capital:0,
    risquePertes:0.03, risqueCollat:0, pression:3, effetSucces:{partenaire:8}, description:'Accompagnement et formation de forces locales (effet durable).' },
  { id:'PROTECTION', nom:'Protection du territoire', capacite:'assaut', categories:['INT'], minCapacite:1, serviceRequis:null,
    cibles:null, theatresInterdits:EXT, degats:0, cout:5, capital:0,
    risquePertes:0.02, risqueCollat:0.04, pression:6, effetSucces:{menaceInt:-8, opinion:1}, description:'Renforcement de la protection des sites sensibles et des rassemblements.' },
  { id:'CYBERDEF', nom:'Contre-mesure cyber', capacite:'renseignement', categories:[], minCapacite:0, serviceRequis:'ANSSI',
    cibles:['CYBER','ETAT_EST'], theatresInterdits:[], degats:14, cout:2, capital:0,
    risquePertes:0, risqueCollat:0.06, pression:4, effetSucces:{}, description:'Neutralisation d’infrastructures d’attaque et durcissement des systèmes.' },
  // Cyber offensif britannique : programme commun GCHQ-ministère de la Défense (2015), emploi contre Daech
  // confirmé publiquement (oct. 2016, puis 12/04/2018) (nation-GBR.md, section 4, élevé pour l’existence)
  { id:'CYBER_GCHQ', nom:'Opération cyber offensive', capacite:'renseignement', categories:[], minCapacite:0, serviceRequis:'GCHQ',
    cibles:['CYBER','ETAT_EST','DAECH'], theatresInterdits:[], degats:15, cout:2, capital:1,
    risquePertes:0, risqueCollat:0.05, pression:5, effetSucces:{}, description:'Défense des réseaux et action offensive contre les infrastructures de l’adversaire (propagande, commandement).' }, // À VÉRIFIER (efficacité relative : choix de jeu)
  { id:'REASSURANCE', nom:'Posture de réassurance', capacite:'endurance', categories:['AIR','MER','TERRE'], minCapacite:4, serviceRequis:null,
    cibles:['ETAT_EST','INDOPAC_P','PIRATERIE','COREE_NORD'], theatresInterdits:['METRO','GB'], degats:9, cout:5, capital:0,
    risquePertes:0.01, risqueCollat:0.08, pression:6, effetSucces:{credibilite:1}, description:'Présence visible, exercices et patrouilles avec les partenaires.' },
  // Israël (nation-ISR.md, sections 3 et 7) : action clandestine du Mossad, cyber de l’unité 8200 (attributions non reconnues),
  // doctrine Begin (interdiction préventive). Coefficients : choix de jeu. // À VÉRIFIER
  { id:'SABOTAGE', nom:'Sabotage et action clandestine', capacite:'renseignement', categories:[], minCapacite:0, serviceRequis:'MOSSAD',
    cibles:['NUCLEAIRE_IRAN','IRAN_SYRIE','HEZBOLLAH'], theatresInterdits:[], degats:14, cout:4, capital:2,
    risquePertes:0.05, risqueCollat:0.05, pression:6, effetSucces:{}, description:'Sabotage de la chaîne d’approvisionnement, exfiltration de documents, neutralisation de filières d’armement.' },
  { id:'CYBER_8200', nom:'Opération cyber', capacite:'renseignement', categories:[], minCapacite:0, serviceRequis:'AMAN',
    cibles:['CYBER','NUCLEAIRE_IRAN','HEZBOLLAH','HAMAS'], theatresInterdits:[], degats:12, cout:2, capital:1,
    risquePertes:0, risqueCollat:0.04, pression:5, effetSucces:{}, description:'Défense des réseaux et action contre les infrastructures numériques de l’adversaire.' },
  { id:'FRAPPE_PREVENTIVE', nom:'Frappe préventive', capacite:'frappe', categories:['AIR'], minCapacite:8, serviceRequis:null,
    cibles:['NUCLEAIRE_IRAN'], theatresInterdits:[], degats:30, cout:15, capital:12,
    risquePertes:0.15, risqueCollat:0.1, pression:15, effetSucces:{ credibilite:3 }, description:'Raid à longue distance sur les sites du programme nucléaire. Décision d’une extrême gravité : coût politique immense, riposte probable.' }
];
