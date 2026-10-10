import type { MaterielDef } from '../sim/types';

// ---------------------------------------------------------------------
// CATALOGUE DES MATÉRIELS : caractéristiques publiques et illustration (dessinée par code dans l’interface).
// Les codes S.. renvoient à docs/recherche/resultats/nation-FRA.md. Les valeurs de constructeur
// non revérifiées pendant la recherche portent « À VÉRIFIER » dans leur source.
// ---------------------------------------------------------------------
export const MATERIELS: MaterielDef[] = [
  // Aviation
  { id:'RAFALE', nom:'Rafale', type:'Avion de combat omnirôle', milieu:'air', role:'Supériorité aérienne, frappe, reconnaissance, dissuasion',
    caracteristiques:[
      { lib:'Parc Rafale Air', val:'102 (fin 2017), 105 (fin 2018)', source:'S44, Assemblée nationale (élevé)' },
      { lib:'Disponibilité', val:'55,4 % (2017), 53,7 % (2018)', source:'S44 (élevé)' },
      { lib:'Coût de l’heure de vol (entretien seul)', val:'14 596 €', source:'Cour des comptes 2014, via couts-deploiements.md (élevé)' },
      { lib:'Longueur', val:'15,3 m', source:'À VÉRIFIER (fiche constructeur)' }
    ] },
  { id:'M2000D', nom:'Mirage 2000D', type:'Avion d’attaque biplace', milieu:'air', role:'Appui aérien rapproché et frappe de précision',
    caracteristiques:[
      { lib:'Équipage', val:'2 (pilote et navigateur officier systèmes d’armes)', source:'À VÉRIFIER (fiche armée de l’Air)' },
      { lib:'Coût de l’heure de vol (entretien seul)', val:'8 802 € (8 082 € selon une autre reprise)', source:'Cour des comptes 2014 (conflit non résolu)' },
      { lib:'Bases en opération', val:'Niamey, N’Djamena', source:'nation-FRA.md, section 4 (élevé)' }
    ] },
  { id:'REAPER', nom:'MQ-9 Reaper', type:'Drone MALE', milieu:'air', role:'Surveillance et désignation de cibles',
    caracteristiques:[
      { lib:'Flotte', val:'2 en 2014, 5 en ligne au Sahel fin 2016, 6 au total', source:'S30, S31 (élevé)' },
      { lib:'Armement', val:'Non armé sur 2015-2018 ; décidé le 5/09/2017, effectif en 12/2019', source:'S30, S61 (élevé)' },
      { lib:'Présence permanente', val:'3 vecteurs à Niamey', source:'S54 (élevé)' }
    ] },
  { id:'A400M', nom:'A400M Atlas', type:'Avion de transport', milieu:'air', role:'Transport tactique et stratégique',
    caracteristiques:[
      { lib:'Flotte', val:'≈ 11 à 14 appareils fin 2018 (livraisons retardées)', source:'S19 (moyen)' },
      { lib:'Motorisation', val:'4 turbopropulseurs', source:'À VÉRIFIER (fiche constructeur)' }
    ] },
  { id:'C135FR', nom:'C-135FR', type:'Avion ravitailleur', milieu:'air', role:'Ravitaillement en vol, allonge des raids',
    caracteristiques:[
      { lib:'Flotte', val:'≈ 14 C-135FR et KC-135R', source:'S32 (moyen)' },
      { lib:'Âge', val:'Plus de 50 ans', source:'S32 (moyen)' },
      { lib:'Successeur', val:'Premier A330 MRTT Phénix livré à l’automne 2018', source:'S0 (à vérifier)' }
    ] },
  { id:'ATL2', nom:'Atlantique 2', type:'Avion de patrouille maritime', milieu:'air', role:'Lutte anti-sous-marine, renseignement, appui feu',
    caracteristiques:[
      { lib:'Motorisation', val:'2 turbopropulseurs', source:'À VÉRIFIER (fiche Marine nationale)' },
      { lib:'Emploi en opération', val:'ISR au-dessus du Sahel et du Levant', source:'nation-FRA.md, section 3.2 (moyen)' }
    ] },
  { id:'E3F', nom:'E-3F SDCA', type:'Avion de détection et de commandement', milieu:'air', role:'Surveillance aérienne et coordination des raids',
    caracteristiques:[
      { lib:'Flotte', val:'4 appareils', source:'S0 (à vérifier)' },
      { lib:'Engagement', val:'2 appareils lors des frappes du 14/04/2018', source:'S32 (moyen)' }
    ] },
  { id:'C160G', nom:'C-160 Gabriel', type:'Avion de renseignement électromagnétique', milieu:'air', role:'Interception et localisation des émissions',
    caracteristiques:[
      { lib:'Statut', val:'Flotte C-160 en retrait sur la période', source:'nation-FRA.md, section 4 (moyen)' },
      { lib:'Nombre d’appareils', val:'2', source:'À VÉRIFIER' }
    ] },
  // Hélicoptères
  { id:'TIGRE', nom:'Tigre', type:'Hélicoptère d’attaque', milieu:'air', role:'Appui feu, escorte, reconnaissance armée',
    caracteristiques:[{ lib:'Équipage', val:'2, en tandem', source:'À VÉRIFIER (fiche armée de Terre)' }, { lib:'Coût de l’heure de vol', val:'Non trouvé', source:'couts-deploiements.md' }] },
  { id:'CAIMAN', nom:'Caïman (NH90)', type:'Hélicoptère de transport tactique', milieu:'air', role:'Transport de troupes, évacuation sanitaire',
    caracteristiques:[{ lib:'Coût de l’heure de vol', val:'Non trouvé', source:'couts-deploiements.md' }, { lib:'Capacité', val:'Environ 20 passagers équipés', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'GAZELLE', nom:'Gazelle', type:'Hélicoptère léger', milieu:'air', role:'Reconnaissance et appui léger',
    caracteristiques:[{ lib:'Particularité', val:'Rotor de queue caréné (fenestron)', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'CARACAL', nom:'Caracal (H225M)', type:'Hélicoptère de transport lourd', milieu:'air', role:'Infiltration et extraction des forces spéciales, sauvetage',
    caracteristiques:[{ lib:'Particularité', val:'Ravitaillable en vol', source:'À VÉRIFIER (fiche constructeur)' }] },
  // Terre
  { id:'CAESAR', nom:'CAESAR', type:'Canon automoteur de 155 mm', milieu:'terre', role:'Appui feu indirect à longue portée',
    caracteristiques:[
      { lib:'Portée', val:'≈ 40 km', source:'S42, S43 (élevé)' },
      { lib:'Parc', val:'77 pièces', source:'S0 (à vérifier)' },
      { lib:'Task force Wagram (Irak)', val:'150 militaires, 4 pièces puis 3, plus de 1 200 missions', source:'S42, S43 (élevé)' }
    ] },
  { id:'VBCI', nom:'VBCI', type:'Véhicule blindé de combat d’infanterie', milieu:'terre', role:'Transport et appui de l’infanterie au contact',
    caracteristiques:[{ lib:'Configuration', val:'8 roues motrices, tourelle de 25 mm', source:'À VÉRIFIER (fiche armée de Terre)' }, { lib:'Engagement', val:'Présence avancée en Estonie (2017)', source:'nation-FRA.md, section 5.2 (moyen)' }] },
  { id:'VAB', nom:'VAB', type:'Véhicule de l’avant blindé', milieu:'terre', role:'Transport de troupes protégé',
    caracteristiques:[{ lib:'Configuration', val:'4 × 4 ou 6 × 6', source:'À VÉRIFIER (fiche armée de Terre)' }] },
  { id:'VBL', nom:'VBL', type:'Véhicule blindé léger', milieu:'terre', role:'Reconnaissance et liaison',
    caracteristiques:[{ lib:'Configuration', val:'4 × 4, 2 à 3 hommes', source:'À VÉRIFIER (fiche armée de Terre)' }] },
  // Mer
  { id:'CDG', nom:'Charles de Gaulle', type:'Porte-avions à propulsion nucléaire', milieu:'mer', role:'Groupe aéronaval : frappe et supériorité aérienne depuis la mer',
    caracteristiques:[
      { lib:'Groupe aérien en mission', val:'18 à 24 Rafale Marine, 2 E-2C', source:'S40, S41 (élevé)' },
      { lib:'Missions 2015-2016', val:'01-05/2015, 11/2015-03/2016, 09-12/2016', source:'S40, S41, S59 (élevé)' },
      { lib:'Arrêt technique majeur', val:'02/2017 à 09/2018 (≈ 1,3 Md€, estimation)', source:'S59 (élevé) ; iFRAP (moyen)' }
    ] },
  { id:'FREMM', nom:'FREMM', type:'Frégate multimissions', milieu:'mer', role:'Lutte anti-sous-marine, frappe vers la terre',
    caracteristiques:[
      { lib:'Bâtiments', val:'Aquitaine, Provence, Languedoc, Auvergne, Bretagne (2018)', source:'S32 (moyen)' },
      { lib:'Missile de croisière naval', val:'Premier tir opérationnel le 14/04/2018', source:'S32, S33 (moyen)' }
    ] },
  { id:'HORIZON', nom:'Frégate Horizon', type:'Frégate de défense aérienne', milieu:'mer', role:'Protection antiaérienne du groupe aéronaval',
    caracteristiques:[{ lib:'Bâtiments', val:'2', source:'S32 (moyen)' }, { lib:'Système d’armes', val:'Missiles Aster (PAAMS)', source:'S0 (à vérifier)' }] },
  { id:'RUBIS', nom:'SNA classe Rubis', type:'Sous-marin nucléaire d’attaque', milieu:'mer', role:'Renseignement, escorte, lutte sous la mer',
    caracteristiques:[{ lib:'Bâtiments', val:'6', source:'nation-FRA.md (élevé)' }, { lib:'Successeur', val:'Classe Suffren, non livrée sur la période', source:'nation-FRA.md (élevé)' }] },
  { id:'MISTRAL', nom:'BPC classe Mistral', type:'Porte-hélicoptères amphibie', milieu:'mer', role:'Projection d’un groupement et de ses hélicoptères',
    caracteristiques:[{ lib:'Bâtiments', val:'3 (Mistral, Tonnerre, Dixmude)', source:'nation-FRA.md (élevé)' }, { lib:'Troupes embarquées', val:'GTIA de 450 à 900', source:'S0 (à vérifier)' }] },
  { id:'EMBARCATION', nom:'Embarcation rapide de commando', type:'Embarcation d’assaut', milieu:'mer', role:'Infiltration et action depuis la mer',
    caracteristiques:[{ lib:'Type', val:'Embarcation pneumatique ou semi-rigide (générique)', source:'Illustration générique' }] }
];
