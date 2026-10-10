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
      { lib:'Livraisons', val:'8 fin 2015 (logistique seulement), 11 au 2/03/2017, 12 en service fin 2017', source:'Assemblée nationale, QE 99447 et 4414 (élevé)' },
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
      { lib:'Effectif en opération', val:'≈ 1 900 (1 200 bâtiment, 600 groupe aérien, 100 état-major)', source:'Ministère de la Défense, 2009 (élevé)' },
      { lib:'Missions 2015-2016', val:'01-05/2015, 11/2015-03/2016, 09-12/2016', source:'S40, S41, S59 (élevé)' },
      { lib:'Arrêt technique majeur', val:'02/2017 à 09/2018 (≈ 1,3 Md€, estimation)', source:'S59 (élevé) ; iFRAP (moyen)' }
    ] },
  { id:'FREMM', nom:'FREMM', type:'Frégate multimissions', milieu:'mer', role:'Lutte anti-sous-marine, frappe vers la terre',
    caracteristiques:[
      { lib:'Bâtiments', val:'Aquitaine, Provence, Languedoc, Auvergne, Bretagne (2018)', source:'S32 (moyen)' },
      { lib:'Équipage', val:'≈ 108, détachement hélicoptère compris', source:'Marine nationale, fiche FREMM (élevé)' },
      { lib:'Missile de croisière naval', val:'Premier tir opérationnel le 14/04/2018', source:'S32, S33 (moyen)' }
    ] },
  { id:'HORIZON', nom:'Frégate Horizon', type:'Frégate de défense aérienne', milieu:'mer', role:'Protection antiaérienne du groupe aéronaval',
    caracteristiques:[{ lib:'Bâtiments', val:'2', source:'S32 (moyen)' }, { lib:'Équipage', val:'174', source:'techno-science, fiche classe Horizon (faible)' }, { lib:'Système d’armes', val:'Missiles Aster (PAAMS)', source:'S0 (à vérifier)' }] },
  { id:'RUBIS', nom:'SNA classe Rubis', type:'Sous-marin nucléaire d’attaque', milieu:'mer', role:'Renseignement, escorte, lutte sous la mer',
    caracteristiques:[{ lib:'Bâtiments', val:'6', source:'nation-FRA.md (élevé)' }, { lib:'Successeur', val:'Classe Suffren, non livrée sur la période', source:'nation-FRA.md (élevé)' }] },
  { id:'MISTRAL', nom:'BPC classe Mistral', type:'Porte-hélicoptères amphibie', milieu:'mer', role:'Projection d’un groupement et de ses hélicoptères',
    caracteristiques:[{ lib:'Bâtiments', val:'3 (Mistral, Tonnerre, Dixmude)', source:'nation-FRA.md (élevé)' }, { lib:'Troupes embarquées', val:'GTIA de 450 à 900', source:'S0 (à vérifier)' }] },
  { id:'EMBARCATION', nom:'Embarcation rapide de commando', type:'Embarcation d’assaut', milieu:'mer', role:'Infiltration et action depuis la mer',
    caracteristiques:[{ lib:'Type', val:'Embarcation pneumatique ou semi-rigide (générique)', source:'Illustration générique' }] },
  // ---------- Royaume-Uni (codes S.. : docs/recherche/resultats/nation-GBR.md, fiche rédigée de mémoire) ----------
  { id:'TYPHOON', nom:'Typhoon', type:'Avion de combat omnirôle', milieu:'air', role:'Supériorité aérienne, police du ciel, frappe',
    caracteristiques:[
      { lib:'Flotte', val:'≈ 140', source:'S8, IISS (moyen)' },
      { lib:'Heure de vol', val:'≈ 70 000 £ en coût complet (réponse parlementaire vers 2011)', source:'S3 (faible)' },
      { lib:'Police du ciel OTAN', val:'4 appareils (Baltique 2015-2016, Roumanie 2017-2018)', source:'S1 (moyen)' }
    ] },
  { id:'TORNADO', nom:'Tornado GR4', type:'Avion d’attaque à géométrie variable', milieu:'air', role:'Frappe à longue distance, missiles de croisière',
    caracteristiques:[
      { lib:'Statut', val:'En déclin, retrait en mars 2019', source:'S8 (moyen)' },
      { lib:'Armement', val:'Seul vecteur du Storm Shadow jusqu’en 2018', source:'S8 (moyen)' },
      { lib:'Frappe du 14/04/2018', val:'4 Tornado, 8 Storm Shadow', source:'S3 (moyen)' }
    ] },
  { id:'C17', nom:'C-17 Globemaster III', type:'Avion de transport stratégique', milieu:'air', role:'Transport lourd à portée mondiale',
    caracteristiques:[{ lib:'Flotte', val:'8', source:'S8 (moyen)' }, { lib:'Portée', val:'Mondiale en 24 à 48 h', source:'S8 (moyen)' }, { lib:'Motorisation', val:'4 turboréacteurs', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'VOYAGER', nom:'Voyager', type:'Avion ravitailleur et de transport', milieu:'air', role:'Ravitaillement en vol, transport de personnel',
    caracteristiques:[{ lib:'Flotte', val:'14, dont 9 en flotte permanente', source:'S8 (élevé)' }, { lib:'Exploitation', val:'Contrat privé (AirTanker)', source:'S8 (élevé)' }] },
  { id:'SENTINEL', nom:'Sentinel R1', type:'Avion de surveillance du sol', milieu:'air', role:'Radar de surveillance et de désignation de cibles au sol',
    caracteristiques:[{ lib:'Flotte', val:'5 Sentinel R1, ≈ 5 Shadow R1', source:'S8 (moyen)' }, { lib:'Base', val:'Avion d’affaires modifié', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'RC135W', nom:'RC-135W Rivet Joint', type:'Avion de renseignement électromagnétique', milieu:'air', role:'Interception et localisation des émissions',
    caracteristiques:[{ lib:'Flotte', val:'3 (livrés en 2013, 2015 et 2017)', source:'S8 (élevé)' }, { lib:'Origine', val:'Acquis auprès des États-Unis', source:'À VÉRIFIER' }] },
  { id:'E3D', nom:'E-3D Sentry', type:'Avion de détection et de commandement', milieu:'air', role:'Surveillance aérienne et coordination',
    caracteristiques:[{ lib:'Flotte', val:'6', source:'S8 (moyen)' }] },
  { id:'CHINOOK', nom:'Chinook', type:'Hélicoptère de transport lourd à rotors en tandem', milieu:'air', role:'Transport de troupes et de charges lourdes',
    caracteristiques:[{ lib:'Engagement', val:'3 appareils et ≈ 90 personnels à Gao au profit de Barkhane, depuis l’été 2018', source:'S1 (moyen)' }, { lib:'Capacité', val:'Plusieurs dizaines de soldats équipés', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'APACHE', nom:'Apache', type:'Hélicoptère d’attaque', milieu:'air', role:'Appui feu, escorte, lutte antichar',
    caracteristiques:[{ lib:'Équipage', val:'2, en tandem', source:'À VÉRIFIER (fiche constructeur)' }, { lib:'Mise en œuvre', val:'Army Air Corps', source:'À VÉRIFIER' }] },
  { id:'JACKAL', nom:'Jackal', type:'Véhicule de patrouille et d’appui', milieu:'terre', role:'Reconnaissance et raids motorisés',
    caracteristiques:[{ lib:'Configuration', val:'4 × 4 ouvert, mitrailleuse lourde ou lance-grenades', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'FOXHOUND', nom:'Foxhound', type:'Véhicule de patrouille protégé', milieu:'terre', role:'Transport protégé contre les engins explosifs',
    caracteristiques:[{ lib:'Configuration', val:'4 × 4, coque protégée', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'WARRIOR', nom:'Warrior', type:'Véhicule de combat d’infanterie à chenilles', milieu:'terre', role:'Transport et appui de l’infanterie blindée',
    caracteristiques:[{ lib:'Engagement', val:'Présence avancée en Estonie (Tapa), depuis 2017', source:'S8 (élevé)' }, { lib:'Armement', val:'Canon de 30 mm', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'M270', nom:'GMLRS', type:'Lance-roquettes multiple guidé', milieu:'terre', role:'Frappe de précision à longue portée',
    caracteristiques:[{ lib:'Portée', val:'≈ 70 km', source:'S8 (moyen)' }, { lib:'Stocks de munitions', val:'Non publics', source:'S8' }] },
  { id:'TYPE45', nom:'Destroyer Type 45', type:'Destroyer de défense aérienne', milieu:'mer', role:'Défense antiaérienne de zone (Sea Viper)',
    caracteristiques:[{ lib:'Bâtiments', val:'6', source:'S8 (élevé)' }, { lib:'Contrainte', val:'Propulsion peu fiable, équipages insuffisants', source:'S8 (élevé)' }] },
  { id:'TYPE23', nom:'Frégate Type 23', type:'Frégate anti-sous-marine', milieu:'mer', role:'Lutte sous la mer, escorte',
    caracteristiques:[{ lib:'Bâtiments', val:'13', source:'S8 (élevé)' }, { lib:'Défense antiaérienne', val:'Sea Ceptor à partir de 2018', source:'S8 (élevé)' }] },
  { id:'ASTUTE', nom:'SNA classes Astute et Trafalgar', type:'Sous-marin nucléaire d’attaque', milieu:'mer', role:'Renseignement, escorte, frappe Tomahawk',
    caracteristiques:[{ lib:'Flotte', val:'2015 : 4 Trafalgar et 2 Astute ; 2018 : 3 et 3', source:'S8 (moyen)' }, { lib:'Disponibilité', val:'Très dégradée début 2017 selon la presse [DÉBATTU]', source:'S8 (moyen)' }] },
  { id:'CLASSE_ALBION', nom:'Classe Albion', type:'Transport de chalands de débarquement', milieu:'mer', role:'Commandement amphibie, projection d’un groupe commando',
    caracteristiques:[{ lib:'Bâtiments', val:'HMS Albion et Bulwark, un seul actif à la fois', source:'S8 (élevé)' }, { lib:'Soutien', val:'3 bâtiments de la classe Bay', source:'S8 (élevé)' }] },
  // ---------- Israël (sections 4.1 et 3.2 de nation-ISR.md ; IISS Military Balance 2019 via CSIS) ----------
  { id:'F16I', nom:'F-16I Sufa', type:'Avion de combat biplace', milieu:'air', role:'Frappe à longue distance, supériorité aérienne',
    caracteristiques:[{ lib:'Parc', val:'98 F-16I, plus 127 F-16C et D', source:'IISS MB2019 via CSIS (élevé)' }, { lib:'Perte au combat', val:'1 abattu le 10/02/2018 (S-200 probable)', source:'nation-ISR.md 5.2 (élevé)' }] },
  { id:'F15I', nom:'F-15I Ra’am', type:'Avion d’attaque à long rayon d’action', milieu:'air', role:'Frappe en profondeur',
    caracteristiques:[{ lib:'Parc', val:'25', source:'IISS MB2019 via CSIS (élevé)' }] },
  { id:'F35I', nom:'F-35I Adir', type:'Avion de combat furtif', milieu:'air', role:'Pénétration des défenses aériennes, renseignement',
    caracteristiques:[{ lib:'Jalons', val:'2 premiers à Nevatim le 12/12/2016 ; capacité initiale (9 appareils) le 06/12/2017 ; 50 commandés', source:'nation-ISR.md 4.1 (élevé)' }, { lib:'Premier emploi au combat', val:'Annoncé le 22/05/2018', source:'nation-ISR.md 4.1 (élevé)' }] },
  { id:'HERON', nom:'Heron et Hermes', type:'Drones de surveillance', milieu:'air', role:'Patrouille permanente au-dessus des fronts',
    caracteristiques:[{ lib:'Nombre', val:'Non public de façon fiable', source:'nation-ISR.md 4.1' }, { lib:'Armement', val:'Non reconnu officiellement', source:'nation-ISR.md 4.1 (faible)' }] },
  { id:'G550', nom:'G550 Shavit et Eitam', type:'Avions de renseignement et d’alerte avancée', milieu:'air', role:'Écoutes électroniques, surveillance aérienne',
    caracteristiques:[{ lib:'Parc', val:'3 Shavit, 2 Eitam, 1 EC-707, 2 Phalcon', source:'IISS MB2019 via CSIS (élevé)' }] },
  { id:'B707', nom:'Boeing 707 Re’em', type:'Avion ravitailleur', milieu:'air', role:'Ravitaillement en vol des raids lointains',
    caracteristiques:[{ lib:'Parc', val:'≈ 7, plus 4 KC-130H', source:'GlobalSecurity (faible-moyen)' }, { lib:'Contrainte', val:'Flotte vieillissante, limite un raid sur l’Iran', source:'nation-ISR.md 4.1 [CONSENSUS]' }] },
  { id:'UH60', nom:'UH-60 Yanshuf', type:'Hélicoptère de transport', milieu:'air', role:'Transport des forces spéciales, sauvetage',
    caracteristiques:[{ lib:'Emploi', val:'Insertion et extraction des forces spéciales', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'MERKAVA', nom:'Merkava', type:'Char de combat', milieu:'terre', role:'Combat blindé, protection de l’équipage',
    caracteristiques:[{ lib:'Particularité', val:'Moteur à l’avant, pour protéger l’équipage', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'NAMER', nom:'Namer', type:'Véhicule blindé lourd d’infanterie', milieu:'terre', role:'Transport protégé de l’infanterie',
    caracteristiques:[{ lib:'Base', val:'Châssis de char', source:'À VÉRIFIER (fiche constructeur)' }] },
  { id:'IRON_DOME', nom:'Iron Dome', type:'Système antiroquette', milieu:'terre', role:'Interception des roquettes et des obus',
    caracteristiques:[{ lib:'Batteries', val:'10', source:'MDAA (moyen)' }, { lib:'Coût d’un intercepteur Tamir', val:'≈ 40 000 $ (presse)', source:'nation-ISR.md 2.3 (faible)' }, { lib:'Financement américain cumulé', val:'1,397 Md$ (avril 2018)', source:'CRS RL33222 (élevé)' }] },
  { id:'MISSILE_ARROW', nom:'Arrow et David’s Sling', type:'Défense antimissile', milieu:'terre', role:'Interception des missiles balistiques et de croisière',
    caracteristiques:[{ lib:'Mises en service', val:'Arrow-3 le 18/01/2017 ; David’s Sling le 02/04/2017', source:'nation-ISR.md 4.1 (élevé)' }, { lib:'Financement américain FY2018', val:'Arrow-3 310 M$, David’s Sling 221,5 M$', source:'CRS RL33222 (élevé)' }] },
  { id:'SAAR5', nom:'Corvette Sa’ar 5', type:'Corvette lance-missiles', milieu:'mer', role:'Protection des eaux et des plateformes gazières',
    caracteristiques:[{ lib:'Bâtiments', val:'3', source:'nation-ISR.md 4.1 (moyen)' }, { lib:'Successeur', val:'Sa’ar 6 commandées en Allemagne, livrées après 2018', source:'nation-ISR.md 4.1 (moyen)' }] },
  { id:'DOLPHIN', nom:'Sous-marin classe Dolphin', type:'Sous-marin d’attaque', milieu:'mer', role:'Renseignement, frappe, dissuasion (attribuée)',
    caracteristiques:[{ lib:'Flotte', val:'5 après la livraison du Rahav le 12/01/2016', source:'nation-ISR.md 4.1 (élevé)' }, { lib:'Capacité de seconde frappe', val:'Attribuée par des sources externes, non reconnue', source:'nation-ISR.md 4.1' }] }
];
