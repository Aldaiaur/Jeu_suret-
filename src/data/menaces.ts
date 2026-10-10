import type { MenaceDef } from '../sim/types';

// ---------------------------------------------------------------------
// MENACES : types et règles d'évolution paramétrées
// sensibilite : poids des capacités des unités déployées dans la pression
// plancher : niveau minimal (menace qu'on peut contenir mais pas éradiquer)
// pressionServices, servicesCles : services de toutes les nations ; seuls ceux de la nation jouée comptent
// ---------------------------------------------------------------------
export const MENACES: MenaceDef[] = [
  { id:'TERRO', nom:'Réseau terroriste', criseTitre:'Attaque imminente sur le territoire', plancher:15, theatresDepart:['METRO','GB','ISRAEL'], forceDepart:[30,45], croissance:2.0,
    sensibilite:{assaut:0.25, renseignement:0.6}, pressionServices:{DGSI:0.8, MI5:0.8, SHIN_BET:0.8}, servicesCles:{DGSI:3, MI5:3, SHIN_BET:3},
    alimentePar:{DAECH:0.025, DJIHAD:0.008, HAMAS:0.01}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:55, attaque:{menaceInt:14, opinion:-6, capital:-4}, apresAttaque:-12,
    poidsInterieur:0.6, impactInterieur:0, crise:true, secondaires:[] },
  { id:'DJIHAD', nom:'Groupe armé djihadiste', criseTitre:'Offensive d’un groupe armé', theatresDepart:['SAHEL'], forceDepart:[40,60], croissance:2.2,
    sensibilite:{assaut:0.35, frappe:0.3, renseignement:0.25, endurance:0.15}, pressionServices:{}, servicesCles:{DGSE:2, SIS:2},
    alimentePar:{}, seuilExpansion:60, expansion:['GUINEE','LIBYE'], probExpansion:0.12,
    seuilAttaque:50, attaque:{credibilite:-3, opinion:-2}, apresAttaque:-5,
    poidsInterieur:0, impactInterieur:0.08, crise:true, secondaires:[{theatre:'LIBYE', p:0.5, force:[15,30]}] },
  { id:'DAECH', nom:'Daech', criseTitre:'Offensive de Daech', theatresDepart:['LEVANT'], forceDepart:[55,75], croissance:2.6,
    sensibilite:{frappe:0.4, assaut:0.3, renseignement:0.2}, pressionServices:{}, servicesCles:{DGSE:2, DRM:1, SIS:2, DI:1},
    alimentePar:{}, seuilExpansion:55, expansion:['LIBYE'], probExpansion:0.1,
    seuilAttaque:50, attaque:{credibilite:-3, opinion:-2, menaceInt:3}, apresAttaque:-4,
    poidsInterieur:0, impactInterieur:0.16, crise:true, secondaires:[{theatre:'LIBYE', p:0.35, force:[10,25]}] },
  { id:'PIRATERIE', nom:'Piraterie maritime', criseTitre:'Navire détourné et équipage retenu', theatresDepart:['GUINEE','CORNE'], forceDepart:[20,45], croissance:1.4,
    sensibilite:{renseignement:0.3, frappe:0.25, assaut:0.35, endurance:0.1}, pressionServices:{}, servicesCles:{DRM:1, DI:1},
    alimentePar:{}, seuilExpansion:50, expansion:['GUINEE','CORNE','INDOPAC'], probExpansion:0.08,
    seuilAttaque:40, attaque:{credibilite:-2, budget:-5}, apresAttaque:-3,
    poidsInterieur:0, impactInterieur:0, crise:true, secondaires:[] },
  { id:'ETAT_EST', nom:'Pression militaire russe', criseTitre:'Crise militaire russe à la frontière d’un allié', theatresDepart:['EST'], forceDepart:[30,50], croissance:1.3,
    sensibilite:{endurance:0.25, frappe:0.15, renseignement:0.2}, pressionServices:{ANSSI:0.4, GCHQ:0.4}, servicesCles:{DRM:1, ANSSI:1, DI:1, GCHQ:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:60, attaque:{credibilite:-5, opinion:-1}, apresAttaque:-6,
    poidsInterieur:0, impactInterieur:0.03, crise:true, secondaires:[] },
  { id:'CYBER', nom:'Campagne de cyberattaques', criseTitre:'Cyberattaque contre des infrastructures vitales', plancher:10, theatresDepart:['METRO','GB','ISRAEL'], forceDepart:[20,40], croissance:1.8,
    sensibilite:{}, pressionServices:{ANSSI:1.2, GCHQ:1.2, INCD:1.2}, servicesCles:{ANSSI:12, GCHQ:12, INCD:12},
    alimentePar:{ETAT_EST:0.02, NUCLEAIRE_IRAN:0.01}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:45, attaque:{menaceInt:4, opinion:-3, budget:-8}, apresAttaque:-8,
    poidsInterieur:0.2, impactInterieur:0, crise:false, secondaires:[] },
  { id:'INDOPAC_P', nom:'Pression maritime chinoise', criseTitre:'Incident naval grave', theatresDepart:['INDOPAC'], forceDepart:[20,35], croissance:1.0,
    sensibilite:{endurance:0.25, frappe:0.15, renseignement:0.15}, pressionServices:{}, servicesCles:{DRM:1, DI:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:60, attaque:{credibilite:-4}, apresAttaque:-5,
    poidsInterieur:0, impactInterieur:0, crise:false, secondaires:[] },
  // Programme nucléaire et balistique nord-coréen : le joueur n’y intervient pas militairement,
  // mais chaque essai pèse sur sa crédibilité et sur ses partenaires de la zone.
  { id:'COREE_NORD', nom:'Programme nucléaire nord-coréen', criseTitre:'Escalade nucléaire en Corée', theatresDepart:['INDOPAC'], forceDepart:[35,50], croissance:1.6,
    sensibilite:{renseignement:0.15, endurance:0.1}, pressionServices:{}, servicesCles:{DRM:1, DGSE:1, DI:1, SIS:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:55, attaque:{credibilite:-3, opinion:-1}, apresAttaque:-6,
    poidsInterieur:0, impactInterieur:0, crise:false, secondaires:[] },
  // Boko Haram et sa branche ralliée à Daech autour du lac Tchad : apogée en 2015, puis déclin et scission
  // (4 000 à 6 000 combattants en 2015, CTC ; acteurs-non-etatiques.md). La France y agit surtout en appui des armées riveraines.
  { id:'BOKO_HARAM', nom:'Insurrection du lac Tchad', criseTitre:'Offensive autour du lac Tchad', theatresDepart:['GUINEE'], forceDepart:[40,55], croissance:1.1,
    sensibilite:{assaut:0.3, frappe:0.25, renseignement:0.25, endurance:0.15}, pressionServices:{}, servicesCles:{DGSE:1, DRM:1, SIS:1, DI:1},
    alimentePar:{DAECH:0.01}, seuilExpansion:60, expansion:['SAHEL'], probExpansion:0.05,
    seuilAttaque:50, attaque:{credibilite:-2, opinion:-1}, apresAttaque:-5,
    poidsInterieur:0, impactInterieur:0.02, crise:true, secondaires:[] },
  // Al-Shabaab : plateau résilient de 4 000 à 6 000 combattants en Somalie (armée américaine, 2018). Menace pour
  // les emprises et les ressortissants à Djibouti ; la France n’intervient pas en Somalie.
  { id:'SHABAAB', nom:'Al-Shabaab', criseTitre:'Menace d’attentat contre les emprises de Djibouti', theatresDepart:['CORNE'], forceDepart:[25,40], croissance:1.0,
    sensibilite:{renseignement:0.35, assaut:0.25, endurance:0.2}, pressionServices:{}, servicesCles:{DGSE:2, SIS:2},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:55, attaque:{credibilite:-2, opinion:-2}, apresAttaque:-6,
    poidsInterieur:0, impactInterieur:0.02, crise:true, secondaires:[] },
  // ---------- Proche-Orient (nation-ISR.md, sections 5 et 6) ----------
  // Hezbollah : arsenal estimé à ≈ 130 000 roquettes et missiles (CSIS, 2018, moyen), projet de missiles de précision,
  // tunnels transfrontaliers. On le contient, on ne l’élimine pas (plancher).
  { id:'HEZBOLLAH', nom:'Hezbollah', criseTitre:'Escalade à la frontière libanaise', plancher:45, theatresDepart:['LIBAN'], forceDepart:[55,70], croissance:2.0,
    sensibilite:{frappe:0.3, renseignement:0.35, assaut:0.2, endurance:0.15}, pressionServices:{AMAN:0.4}, servicesCles:{AMAN:2, MOSSAD:1},
    alimentePar:{IRAN_SYRIE:0.02}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:52, attaque:{menaceInt:10, opinion:-4, credibilite:-3}, apresAttaque:-8,
    poidsInterieur:0, impactInterieur:0.12, crise:true, secondaires:[] }, // À VÉRIFIER (coefficients de jeu)
  // Hamas et Jihad islamique : roquettes, tunnels, ballons incendiaires ; escalades de mai, juillet, août et novembre 2018 (OCHA, élevé).
  { id:'HAMAS', nom:'Hamas et Jihad islamique', criseTitre:'Tirs de roquettes depuis Gaza', plancher:32, theatresDepart:['GAZA'], forceDepart:[45,60], croissance:2.3,
    sensibilite:{renseignement:0.4, frappe:0.25, assaut:0.2, endurance:0.15}, pressionServices:{SHIN_BET:0.5}, servicesCles:{SHIN_BET:3, AMAN:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:42, attaque:{menaceInt:8, opinion:-4, credibilite:-1}, apresAttaque:-10,
    poidsInterieur:0, impactInterieur:0.15, crise:true, secondaires:[] }, // À VÉRIFIER (coefficients de jeu)
  // Implantation iranienne en Syrie : ≈ 3 000 Gardiens de la révolution, 8 000 combattants du Hezbollah, 11 000 miliciens chiites
  // selon le chef d’état-major israélien en 2016 (nation-ISR.md, 5.2, moyen).
  { id:'IRAN_SYRIE', nom:'Implantation iranienne en Syrie', criseTitre:'Riposte iranienne depuis la Syrie', theatresDepart:['SYRIE'], forceDepart:[35,50], croissance:2.0,
    sensibilite:{frappe:0.4, renseignement:0.3, endurance:0.1}, pressionServices:{}, servicesCles:{AMAN:2, MOSSAD:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:52, attaque:{credibilite:-4, menaceInt:5, opinion:-2}, apresAttaque:-6,
    poidsInterieur:0, impactInterieur:0.05, crise:true, secondaires:[] },
  // Programme nucléaire iranien : toile de fond de la période ; une « attaque » figure une percée du programme.
  { id:'NUCLEAIRE_IRAN', nom:'Programme nucléaire iranien', criseTitre:'Percée du programme nucléaire iranien', theatresDepart:['IRAN'], forceDepart:[40,55], croissance:1.6,
    sensibilite:{renseignement:0.2, frappe:0.1}, pressionServices:{MOSSAD:0.5}, servicesCles:{MOSSAD:2, AMAN:1},
    alimentePar:{}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:65, attaque:{credibilite:-6, opinion:-4}, apresAttaque:-10,
    poidsInterieur:0, impactInterieur:0.03, crise:false, secondaires:[] },
  // Province du Sinaï (État islamique) : plus de 100 frappes israéliennes rapportées en deux ans, avec l’accord du Caire (NYT, 03/02/2018, moyen).
  { id:'SINAI_EI', nom:'Province du Sinaï (État islamique)', criseTitre:'Offensive djihadiste au Sinaï', theatresDepart:['SINAI'], forceDepart:[35,50], croissance:1.9,
    sensibilite:{frappe:0.3, renseignement:0.3, assaut:0.25, endurance:0.15}, pressionServices:{}, servicesCles:{AMAN:1, MOSSAD:1},
    alimentePar:{DAECH:0.01}, seuilExpansion:999, expansion:[], probExpansion:0,
    seuilAttaque:45, attaque:{menaceInt:3, credibilite:-2}, apresAttaque:-5,
    poidsInterieur:0, impactInterieur:0.03, crise:true, secondaires:[] }
];
