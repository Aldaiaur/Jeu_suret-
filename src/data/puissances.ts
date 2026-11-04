import type { PuissanceDef } from '../sim/types';

// ---------------------------------------------------------------------
// MONDE PARTAGÉ — puissances pilotées par l’IA.
// Chaque mois, une puissance répartit sa capacité d’engagement entre les théâtres qui l’intéressent,
// selon la menace qu’elle y combat (valeur réelle : elle a son propre renseignement), son style et la présence
// du joueur. Son engagement exerce une pression sur les menaces qu’elle combat (`contre`, par niveau) ou
// en attise d’autres (`attise`, croissance mensuelle par niveau, sur le même théâtre).
// Ordres de grandeur : une unité française déployée exerce 2 à 4 points de pression ; un niveau d’engagement
// d’une grande puissance en vaut 1 à 2,5. Valeurs de conception, à caler sur les parties.
// Engagements de départ (janvier 2015, contexte réel) : coalition contre Daech depuis l’été 2014, réassurance
// à l’est, Barkhane, Crimée et Donbass, mer de Chine, lutte antipiraterie, Liban et Gaza, milices iraniennes.
// Les puissances absentes de la partie (théâtres hors de la nation jouée) agissent quand même, sans effet visible.
// ---------------------------------------------------------------------
export const PUISSANCES: PuissanceDef[] = [
  { id: 'USA', nom: 'États-Unis', allie: 'USA', capacite: 7, style: 'interventionniste',
    depart: { LEVANT: 2, EST: 1, INDOPAC: 1, CORNE: 1 },
    interets: { LEVANT: 1, SYRIE: 0.8, IRAN: 0.8, INDOPAC: 0.9, EST: 0.7, CORNE: 0.5, LIBYE: 0.5, SAHEL: 0.3, GUINEE: 0.2, SINAI: 0.3 },
    contre: { DAECH: 2.5, SHABAAB: 2, ETAT_EST: 1.5, INDOPAC_P: 1.5, COREE_NORD: 1, DJIHAD: 1, PIRATERIE: 1.5, NUCLEAIRE_IRAN: 1, SINAI_EI: 1, IRAN_SYRIE: 0.5 },
    attitude: { FRA: 62, GBR: 70, ISR: 75 },
    description: 'Moyens sans équivalent (frappes, surveillance, transport), répartis entre trop de fronts. Washington soutient d’abord ceux qui partagent le fardeau.' },
  { id: 'GBR', nom: 'Royaume-Uni', nation: 'GBR', allie: 'UK', capacite: 3, style: 'prudent',
    depart: { LEVANT: 1 },
    interets: { LEVANT: 0.9, EST: 0.6, LIBYE: 0.4, CORNE: 0.3, SAHEL: 0.2, GUINEE: 0.2 },
    contre: { DAECH: 1.5, ETAT_EST: 1, PIRATERIE: 1, DJIHAD: 0.8 },
    attitude: { FRA: 65, ISR: 50 },
    description: 'Partenaire fiable mais mesuré : il s’engage aux côtés de Washington et rarement seul.' },
  { id: 'FRA', nom: 'France', nation: 'FRA', allie: 'FRA', capacite: 4, style: 'interventionniste',
    depart: { SAHEL: 2, LEVANT: 1, CORNE: 1 },
    interets: { SAHEL: 1, LEVANT: 0.7, LIBYE: 0.6, CORNE: 0.5, GUINEE: 0.5, EST: 0.4, INDOPAC: 0.3 },
    contre: { DJIHAD: 2, DAECH: 1.5, BOKO_HARAM: 1, PIRATERIE: 1, ETAT_EST: 0.8, SHABAAB: 0.5 },
    attitude: { GBR: 65, ISR: 45 },
    description: 'Seule puissance occidentale massivement engagée au Sahel ; elle attend de ses partenaires un partage de l’effort.' },
  { id: 'RUS', nom: 'Russie', allie: 'RUS', capacite: 4, style: 'opportuniste',
    depart: { EST: 2 },
    interets: { EST: 1, SYRIE: 0.9, LEVANT: 0.8, LIBYE: 0.4 },
    contre: { DAECH: 0.8 },
    attise: { ETAT_EST: 0.5, IRAN_SYRIE: 0.2 },
    attitude: { FRA: 35, GBR: 25, ISR: 50 },
    description: 'Elle avance là où l’Occident hésite : pression sur le flanc est, soutien au régime syrien, présence discrète en Libye.' },
  { id: 'CHN', nom: 'Chine', capacite: 3, style: 'prudent',
    depart: { INDOPAC: 2, CORNE: 1 },
    interets: { INDOPAC: 1, CORNE: 0.5 },
    contre: { PIRATERIE: 1 },
    attise: { INDOPAC_P: 0.5 },
    attitude: { FRA: 45, GBR: 40, ISR: 50 },
    description: 'Patiente : elle consolide ses positions en mer de Chine et protège ses routes commerciales, sans affrontement ouvert.' },
  { id: 'ISR', nom: 'Israël', nation: 'ISR', capacite: 3, style: 'interventionniste',
    depart: { LIBAN: 1, GAZA: 1, SYRIE: 1 },
    interets: { LIBAN: 0.8, GAZA: 0.8, SYRIE: 0.6, IRAN: 0.7, SINAI: 0.4, LEVANT: 0.2 },
    contre: { HEZBOLLAH: 1.5, HAMAS: 1.5, IRAN_SYRIE: 1.5, SINAI_EI: 0.5, DAECH: 0.3 },
    attitude: { FRA: 50, GBR: 55 },
    description: 'Concentrée sur ses frontières et sur l’Iran ; ses frappes en Syrie compliquent la coordination de la coalition.' },
  { id: 'IRN', nom: 'Iran', capacite: 4, style: 'opportuniste',
    depart: { SYRIE: 2, LIBAN: 1, LEVANT: 1 },
    interets: { SYRIE: 1, LIBAN: 0.8, LEVANT: 0.7, IRAN: 0.6 },
    contre: { DAECH: 1 },
    attise: { IRAN_SYRIE: 0.5, HEZBOLLAH: 0.4, NUCLEAIRE_IRAN: 0.3 },
    attitude: { FRA: 40, GBR: 35, ISR: 5 },
    description: 'Elle combat Daech par milices interposées tout en s’enracinant en Syrie et au Liban.' }
];
