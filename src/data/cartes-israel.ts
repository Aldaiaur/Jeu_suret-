import type { CarteRegionaleDef } from '../sim/types';

// ---------------------------------------------------------------------
// CARTES RÉGIONALES D’ISRAËL. Lieux réels, coordonnées de notoriété publique ; tracés de fleuves schématiques.
// Choix de conception : Gaza, le Liban, la Syrie et l’Iran sont résolus hors carte. Entre 2015 et 2018, Israël
// n’a mené aucune offensive terrestre (nation-ISR.md, section 7.2) ; le jeu ne propose pas de bataille
// tactique dans des quartiers densément peuplés. Les lieux tenus par des groupes armés restent habités :
// toute frappe y a un coût civil (civils 3). Seul le Sinaï, en appui de l’armée égyptienne, a une crise sur carte.
// « ennemi » désigne le contrôle d’un groupe armé, jamais la population.
// ---------------------------------------------------------------------
export const CARTES_ISRAEL: Record<string, CarteRegionaleDef> = {
  ISRAEL: {
    id:'ISRAEL', nom:'Israël', theatre:'ISRAEL', largeur:760, hauteur:540, depart:'TEL_AVIV',
    biome:'littoral_aride', zoomCrise:false, forcesCrise:['INT'], frappes:false, soutien:22,
    fleuves:[{ nom:'Jourdain', points:[[35.6,33.2],[35.59,32.9],[35.57,32.7],[35.55,32.4],[35.52,32.0],[35.55,31.76]] }],
    forceLocale:{ nom:'Police et Police des frontières', force:60 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'INTERVENTION', nom:'Engager l’unité antiterroriste', description:'L’unité nationale de la Police des frontières intervient sur renseignement du Shin Bet. Décisif si l’information est bonne.', requiert:['INT'], p:0.65,
        effets:{ fatigue:[{categorie:'INT', delta:8}] }, succes:{ opinion:4, credibilite:2, menaceInt:-6 }, echec:{ opinion:-5, menaceInt:4 }, baisseMenace:15 },
      { id:'BOUCLAGE', nom:'Renforts et contrôles renforcés', description:'Barrages, renforts de police et de réservistes autour des lieux exposés. Sûr, mais coûteux et pesant pour la vie quotidienne.', p:0.9,
        effets:{ budget:-6, capital:-1 }, succes:{ menaceInt:-4, opinion:1 }, echec:{ opinion:-2 }, baisseMenace:6 }
    ],
    lieux:[
      { id:'TEL_AVIV',      lon:34.78, lat:32.08, nom:'Tel-Aviv',      type:'ville', controle:'allie', defense:60, force:null, civils:3, littoral:true },
      { id:'JERUSALEM',     lon:35.22, lat:31.78, nom:'Jérusalem',     type:'ville', controle:'allie', defense:55, force:null, civils:3 },
      { id:'HAIFA',         lon:34.99, lat:32.79, nom:'Haïfa',         type:'ville', controle:'allie', defense:40, force:null, civils:3, littoral:true },
      { id:'BEER_SHEVA',    lon:34.79, lat:31.25, nom:'Beer-Sheva',    type:'ville', controle:'allie', defense:35, force:null, civils:3 },
      { id:'ASHKELON',      lon:34.57, lat:31.67, nom:'Ashkelon',      type:'ville', controle:'allie', defense:30, force:null, civils:3, littoral:true },
      { id:'SDEROT',        lon:34.6,  lat:31.52, nom:'Sdérot',        type:'ville', controle:'allie', defense:25, force:null, civils:2 },
      { id:'EILAT',         lon:34.95, lat:29.56, nom:'Eilat',         type:'ville', controle:'allie', defense:30, force:null, civils:2, littoral:true },
      { id:'NAHARIYA',      lon:35.09, lat:33.0,  nom:'Nahariya',      type:'ville', controle:'allie', defense:25, force:null, civils:2, littoral:true },
      { id:'KIRYAT_SHMONA', lon:35.57, lat:33.21, nom:'Kiryat Shmona', type:'ville', controle:'allie', defense:25, force:null, civils:2 },
      { id:'TIBERIADE',     lon:35.53, lat:32.79, nom:'Tibériade',     type:'ville', controle:'allie', defense:25, force:null, civils:2 },
      { id:'NEVATIM',       lon:35.01, lat:31.21, nom:'Nevatim',       type:'base',  controle:'allie', defense:50, force:null, civils:1 }
    ],
    liens:[['TEL_AVIV','JERUSALEM'],['TEL_AVIV','HAIFA'],['TEL_AVIV','ASHKELON'],['ASHKELON','SDEROT'],['ASHKELON','BEER_SHEVA'],['JERUSALEM','BEER_SHEVA'],
           ['SDEROT','BEER_SHEVA'],['BEER_SHEVA','NEVATIM'],['NEVATIM','EILAT'],['HAIFA','NAHARIYA'],['HAIFA','TIBERIADE'],['TIBERIADE','KIRYAT_SHMONA'],['NAHARIYA','KIRYAT_SHMONA']],
    scenarios:[
      { id:'VAGUE_ATTAQUES', titre:'Une vague d’attaques isolées', texte:'Plusieurs attaques au couteau ou à la voiture-bélier en quelques jours ; d’autres seraient en préparation.', objectifs:[], modifs:{} },
      { id:'CELLULE', titre:'Une cellule armée repérée', texte:'Le Shin Bet a repéré une cellule qui préparerait un attentat dans une grande ville.', objectifs:[], modifs:{} }
    ]
  },
  LIBAN_SUD: {
    id:'LIBAN_SUD', nom:'Liban-Sud et frontière nord', theatre:'LIBAN', largeur:760, hauteur:540, depart:'KIRYAT_SHMONA',
    biome:'collines_levant', zoomCrise:false, forcesCrise:[], frappes:true, soutien:12,
    fleuves:[{ nom:'Litani', points:[[36.1,33.9],[35.9,33.6],[35.65,33.4],[35.55,33.32],[35.35,33.33],[35.25,33.34]] }],
    forceLocale:{ nom:'Armée libanaise et FINUL', force:30 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'RIPOSTE', nom:'Riposte aérienne calibrée', description:'Frappes sur les postes et les lanceurs qui ont tiré, sans viser l’infrastructure civile. Rétablit la dissuasion si la riposte reste proportionnée.', requiert:['AIR'], p:0.7,
        effets:{ credibilite:-1 }, succes:{ credibilite:4, menaceInt:-4 }, echec:{ menaceInt:6, opinion:-3 }, baisseMenace:12 },
      { id:'TUNNELS', nom:'Neutraliser les tunnels', description:'Le génie détruit les tunnels transfrontaliers côté israélien, sans franchir la frontière. Lent, mais peu escalatoire.', requiert:['TERRE'], p:0.75,
        effets:{ budget:-5 }, succes:{ credibilite:2, menaceInt:-5, opinion:2 }, echec:{ opinion:-2 }, baisseMenace:10 },
      { id:'FINUL', nom:'Message par la FINUL et retenue', description:'Faire passer un avertissement par la force des Nations unies et attendre. Évite l’escalade, au risque de paraître faible.', p:0.5,
        effets:{ capital:-2 }, succes:{ credibilite:1 }, echec:{ credibilite:-4, menaceInt:4 }, baisseMenace:8 }
    ],
    lieux:[
      { id:'KIRYAT_SHMONA', lon:35.57, lat:33.21, nom:'Kiryat Shmona',        type:'base',  controle:'allie',  defense:40, force:null,    civils:2 },
      { id:'NAQOURA',       lon:35.14, lat:33.12, nom:'Naqoura (FINUL)',      type:'zone',  controle:'neutre', defense:10, force:null,    civils:1, littoral:true },
      { id:'TYR',           lon:35.2,  lat:33.27, nom:'Tyr',                  type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:3, littoral:true },
      { id:'BINT_JBEIL',    lon:35.43, lat:33.12, nom:'Bint Jbeil',           type:'ville', controle:'ennemi', defense:0,  force:[20,35], civils:2 },
      { id:'AITA',          lon:35.34, lat:33.1,  nom:'Aïta ech-Chaab',       type:'zone',  controle:'ennemi', defense:0,  force:[15,25], civils:1 },
      { id:'MARJAYOUN',     lon:35.59, lat:33.36, nom:'Marjayoun',            type:'ville', controle:'neutre', defense:10, force:null,    civils:2 },
      { id:'NABATIEH',      lon:35.48, lat:33.38, nom:'Nabatiyé',             type:'ville', controle:'ennemi', defense:0,  force:[20,30], civils:3 },
      { id:'CHEBAA',        lon:35.73, lat:33.28, nom:'Fermes de Chebaa',     type:'zone',  controle:'ennemi', defense:0,  force:[10,20], civils:0 },
      { id:'SAIDA',         lon:35.37, lat:33.56, nom:'Saïda',                type:'ville', controle:'neutre', defense:10, force:null,    civils:3, littoral:true },
      { id:'DAHIYE',        lon:35.5,  lat:33.85, nom:'Dahiyé (Beyrouth)',    type:'ville', controle:'ennemi', defense:0,  force:[30,45], civils:3, littoral:true },
      { id:'BEKAA',         lon:36.2,  lat:34.0,  nom:'Baalbek et la Bekaa',  type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:2 }
    ],
    liens:[['KIRYAT_SHMONA','MARJAYOUN'],['KIRYAT_SHMONA','CHEBAA'],['KIRYAT_SHMONA','BINT_JBEIL'],['BINT_JBEIL','AITA'],['AITA','NAQOURA'],['NAQOURA','TYR'],
           ['TYR','BINT_JBEIL'],['TYR','NABATIEH'],['NABATIEH','MARJAYOUN'],['NABATIEH','SAIDA'],['SAIDA','DAHIYE'],['MARJAYOUN','CHEBAA'],['CHEBAA','BEKAA'],['DAHIYE','BEKAA'],['TYR','SAIDA']],
    scenarios:[
      { id:'ECHANGE_TIRS', titre:'Échange de tirs à la frontière', texte:'Un missile antichar a visé une patrouille ; des roquettes sont tombées près de Kiryat Shmona.', objectifs:[], modifs:{} }
    ]
  },
  GAZA: {
    id:'GAZA', nom:'Bande de Gaza et pourtour', theatre:'GAZA', largeur:760, hauteur:540, depart:'SDEROT',
    biome:'littoral_aride', zoomCrise:false, forcesCrise:[], frappes:true, soutien:14,
    forceLocale:{ nom:'Aucune force partenaire', force:5 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'FRAPPES_CIBLEES', nom:'Frappes ciblées sur les lanceurs', description:'Frappes de précision sur les équipes de tir et les dépôts. Les lanceurs sont cachés au milieu des habitations : chaque erreur coûte des vies civiles et de la légitimité.', requiert:['AIR'], p:0.7,
        effets:{ credibilite:-2 }, succes:{ menaceInt:-5, opinion:1 }, echec:{ menaceInt:4, credibilite:-3, relation:[{allie:'USA', delta:-1}] }, baisseMenace:10 },
      { id:'TREVE', nom:'Trêve par la médiation égyptienne', description:'Le Caire négocie un cessez-le-feu contre des allègements du blocus. Fragile, et contesté par la droite de la coalition.', p:0.65,
        effets:{ capital:-3 }, succes:{ menaceInt:-4, relation:[{allie:'EGY', delta:3}] }, echec:{ menaceInt:5, opinion:-3 }, baisseMenace:8 },
      { id:'OPERATION_TERRESTRE', nom:'Opération terrestre limitée', description:'Une incursion de quelques jours contre les tunnels et les lanceurs. Pertes militaires et civiles certaines, réprobation internationale.', requiert:['TERRE'], p:0.6,
        effets:{ capital:-4, credibilite:-5, fatigue:[{categorie:'TERRE', delta:12}], relation:[{allie:'USA', delta:-2}, {allie:'EGY', delta:-2}] }, succes:{ menaceInt:-8, opinion:2 }, echec:{ opinion:-6, menaceInt:6 }, baisseMenace:18 }
    ],
    lieux:[
      { id:'SDEROT',       lon:34.6,  lat:31.52, nom:'Sdérot',                type:'ville', controle:'allie',  defense:30, force:null,    civils:2 },
      { id:'ASHKELON',     lon:34.57, lat:31.67, nom:'Ashkelon',              type:'ville', controle:'allie',  defense:30, force:null,    civils:3, littoral:true },
      { id:'REIM',         lon:34.46, lat:31.39, nom:'Re’im',                 type:'base',  controle:'allie',  defense:40, force:null,    civils:1 },
      { id:'KEREM_SHALOM', lon:34.28, lat:31.23, nom:'Kerem Shalom (passage)', type:'base', controle:'allie',  defense:30, force:null,    civils:0 },
      { id:'BEIT_HANOUN',  lon:34.54, lat:31.54, nom:'Beit Hanoun',           type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:3 },
      { id:'JABALIYA',     lon:34.48, lat:31.53, nom:'Jabaliya',              type:'ville', controle:'ennemi', defense:0,  force:[20,30], civils:3 },
      { id:'GAZA_VILLE',   lon:34.45, lat:31.5,  nom:'Gaza',                  type:'ville', controle:'ennemi', defense:0,  force:[30,45], civils:3, littoral:true },
      { id:'DEIR',         lon:34.35, lat:31.42, nom:'Deir el-Balah',         type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:3, littoral:true },
      { id:'KHAN_YOUNES',  lon:34.31, lat:31.34, nom:'Khan Younès',           type:'ville', controle:'ennemi', defense:0,  force:[20,35], civils:3 },
      { id:'RAFAH',        lon:34.25, lat:31.29, nom:'Rafah',                 type:'ville', controle:'ennemi', defense:0,  force:[20,30], civils:3 }
    ],
    liens:[['SDEROT','ASHKELON'],['SDEROT','BEIT_HANOUN'],['SDEROT','REIM'],['REIM','KEREM_SHALOM'],['BEIT_HANOUN','JABALIYA'],['JABALIYA','GAZA_VILLE'],
           ['GAZA_VILLE','DEIR'],['DEIR','KHAN_YOUNES'],['KHAN_YOUNES','RAFAH'],['RAFAH','KEREM_SHALOM'],['REIM','KHAN_YOUNES']],
    scenarios:[
      { id:'ROQUETTES', titre:'Salves de roquettes sur le sud', texte:'Des dizaines de roquettes visent Sdérot et Ashkelon ; les écoles du sud ferment.', objectifs:[], modifs:{} }
    ]
  },
  SYRIE_SUD: {
    id:'SYRIE_SUD', nom:'Golan et Syrie du Sud', theatre:'SYRIE', largeur:760, hauteur:540, depart:'GOLAN',
    biome:'collines_levant', zoomCrise:false, forcesCrise:[], frappes:true, soutien:10,
    forceLocale:{ nom:'Groupes rebelles du Sud (aide humanitaire)', force:20 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'FRAPPE_AMPLEUR', nom:'Frappe de grande ampleur, revendiquée', description:'Des dizaines de cibles iraniennes et les batteries sol-air qui les protègent. Dissuasion forte, risque d’escalade et de pertes d’avions.', requiert:['AIR'], p:0.7,
        effets:{ credibilite:1 }, succes:{ credibilite:4, opinion:2 }, echec:{ credibilite:-3, menaceInt:4 }, baisseMenace:15 },
      { id:'NON_REVENDIQUEE', nom:'Frappe limitée, non revendiquée', description:'Quelques objectifs, sans commentaire officiel : l’adversaire n’est pas obligé de riposter.', requiert:['AIR'], p:0.8,
        effets:{}, succes:{ credibilite:1 }, echec:{ menaceInt:2 }, baisseMenace:8 },
      { id:'CANAL_RUSSE', nom:'Passer par le canal russe', description:'Demander à Moscou de tenir les forces iraniennes à distance du Golan.', p:0.5,
        effets:{ capital:-1 }, succes:{ relation:[{allie:'RUS', delta:2}] }, echec:{ credibilite:-2 }, baisseMenace:6 }
    ],
    lieux:[
      { id:'GOLAN',          lon:35.75, lat:33.0,  nom:'Plateau du Golan',            type:'base',  controle:'allie',  defense:45, force:null,    civils:1 },
      { id:'QUNEITRA',       lon:35.82, lat:33.12, nom:'Quneitra (zone tampon)',      type:'zone',  controle:'neutre', defense:10, force:null,    civils:1 },
      { id:'DERAA',          lon:36.1,  lat:32.62, nom:'Deraa',                       type:'ville', controle:'neutre', defense:10, force:null,    civils:3 },
      { id:'SOUEIDA',        lon:36.57, lat:32.71, nom:'Soueïda',                     type:'ville', controle:'neutre', defense:10, force:null,    civils:2 },
      { id:'DAMAS',          lon:36.29, lat:33.51, nom:'Damas',                       type:'ville', controle:'neutre', defense:20, force:null,    civils:3 },
      { id:'AEROPORT_DAMAS', lon:36.52, lat:33.41, nom:'Aéroport de Damas (dépôts)',  type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:1 },
      { id:'KISWE',          lon:36.24, lat:33.36, nom:'Al-Kiswah (base)',            type:'base',  controle:'ennemi', defense:0,  force:[15,25], civils:1 },
      { id:'QUSAYR',         lon:36.58, lat:34.51, nom:'Al-Qousseir',                 type:'zone',  controle:'ennemi', defense:0,  force:[20,30], civils:1 },
      { id:'HOMS',           lon:36.71, lat:34.73, nom:'Homs',                        type:'ville', controle:'neutre', defense:15, force:null,    civils:3 },
      { id:'T4',             lon:37.63, lat:34.52, nom:'Base aérienne T-4',           type:'base',  controle:'ennemi', defense:0,  force:[20,35], civils:0 },
      { id:'MASYAF',         lon:36.34, lat:35.06, nom:'Masyaf (centre de recherche)', type:'zone', controle:'ennemi', defense:0,  force:[10,20], civils:1 }
    ],
    liens:[['GOLAN','QUNEITRA'],['QUNEITRA','DAMAS'],['QUNEITRA','DERAA'],['DERAA','SOUEIDA'],['DERAA','DAMAS'],['DAMAS','KISWE'],['DAMAS','AEROPORT_DAMAS'],
           ['KISWE','SOUEIDA'],['DAMAS','QUSAYR'],['QUSAYR','HOMS'],['HOMS','T4'],['HOMS','MASYAF'],['AEROPORT_DAMAS','T4']],
    scenarios:[
      { id:'ROQUETTES_GOLAN', titre:'Roquettes iraniennes sur le Golan', texte:'Une unité de la Force Qods a tiré une salve de roquettes vers nos positions du Golan.', objectifs:[], modifs:{} }
    ]
  },
  SINAI: {
    id:'SINAI', nom:'Sinaï', theatre:'SINAI', largeur:760, hauteur:540, depart:'EILAT',
    biome:'desert_reg', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:5,
    forceLocale:{ nom:'Armée égyptienne', force:40 }, reserveEnnemie:[20,35],
    lieux:[
      { id:'EILAT',            lon:34.95, lat:29.56, nom:'Eilat',               type:'base',  controle:'allie',  defense:45, force:null,    civils:2, littoral:true },
      { id:'NITZANA',          lon:34.42, lat:30.88, nom:'Nitzana (frontière)', type:'base',  controle:'allie',  defense:30, force:null,    civils:0 },
      { id:'EL_ARICH',         lon:33.8,  lat:31.13, nom:'El-Arich',            type:'ville', controle:'allie',  defense:35, force:null,    civils:3, littoral:true },
      { id:'CHARM',            lon:34.33, lat:27.92, nom:'Charm el-Cheikh',     type:'ville', controle:'allie',  defense:30, force:null,    civils:2, littoral:true },
      { id:'RAFAH_EGY',        lon:34.24, lat:31.28, nom:'Rafah (Égypte)',      type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:2 },
      { id:'CHEIKH_ZOUEID',    lon:34.11, lat:31.21, nom:'Cheikh Zoueïd',       type:'ville', controle:'ennemi', defense:0,  force:[20,30], civils:2 },
      { id:'BIR_LAHFAN',       lon:33.85, lat:30.95, nom:'Bir Lahfan',          type:'zone',  controle:'ennemi', defense:0,  force:[15,25], civils:1 },
      { id:'DJEBEL_HALAL',     lon:34.05, lat:30.65, nom:'Djebel Halal',        type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:0 },
      { id:'NAKHL',            lon:33.75, lat:29.91, nom:'Nakhl',               type:'zone',  controle:'neutre', defense:10, force:null,    civils:1 },
      { id:'TABA',             lon:34.9,  lat:29.49, nom:'Taba',                type:'ville', controle:'neutre', defense:10, force:null,    civils:1, littoral:true },
      { id:'SAINTE_CATHERINE', lon:33.95, lat:28.56, nom:'Sainte-Catherine',    type:'ville', controle:'neutre', defense:10, force:null,    civils:1 }
    ],
    liens:[['EILAT','TABA'],['EILAT','NITZANA'],['TABA','NAKHL'],['NAKHL','SAINTE_CATHERINE'],['SAINTE_CATHERINE','CHARM'],['NAKHL','DJEBEL_HALAL'],['NITZANA','DJEBEL_HALAL'],
           ['NITZANA','BIR_LAHFAN'],['EL_ARICH','BIR_LAHFAN'],['EL_ARICH','CHEIKH_ZOUEID'],['CHEIKH_ZOUEID','RAFAH_EGY'],['BIR_LAHFAN','DJEBEL_HALAL']],
    scenarios:[
      { id:'ARICH_MENACEE', titre:'El-Arich menacée', texte:'La Province du Sinaï masse des combattants autour de Cheikh Zoueïd et menace El-Arich. Le Caire accepte un appui discret.',
        objectifs:[{type:'tenir', lieu:'EL_ARICH'}, {type:'attrition', valeur:25}], modifs:{ CHEIKH_ZOUEID:{force:10} } },
      { id:'TOURISTES', titre:'Touristes bloqués à Sainte-Catherine', texte:'Un car de touristes étrangers est bloqué près du monastère ; un groupe armé rôde dans les montagnes.',
        objectifs:[{type:'evacuer', lieu:'SAINTE_CATHERINE', nombre:1}, {type:'tenir', lieu:'CHARM'}], modifs:{ SAINTE_CATHERINE:{ressortissants:1} } },
      { id:'FRONTIERE', titre:'Menace sur la frontière', texte:'Des combattants venus du Djebel Halal préparent une attaque contre nos postes frontaliers.',
        objectifs:[{type:'tenir', lieu:'NITZANA'}, {type:'attrition', valeur:30}], modifs:{ DJEBEL_HALAL:{force:10} } }
    ]
  },
  IRAN: {
    id:'IRAN', nom:'Iran', theatre:'IRAN', largeur:760, hauteur:540, depart:'GOLFE',
    // Règles d’engagement : aucune frappe sans décision politique (opération « Frappe préventive »)
    biome:'desert_reg', zoomCrise:false, forcesCrise:[], frappes:false, soutien:2,
    forceLocale:{ nom:'Aucune force partenaire', force:5 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'SABOTAGE', nom:'Sabotage clandestin', description:'Le Mossad frappe la chaîne d’approvisionnement du programme. Discret, mais une capture serait désastreuse.', p:0.55,
        effets:{ capital:-2 }, succes:{ credibilite:3 }, echec:{ credibilite:-4, opinion:-2 }, baisseMenace:12 },
      { id:'FRAPPE_PREVENTIVE', nom:'Frappe préventive', description:'Un raid à longue distance sur les sites nucléaires. Coût politique et diplomatique immense, riposte certaine.', requiert:['AIR'], p:0.45,
        effets:{ capital:-8, credibilite:-4, relation:[{allie:'USA', delta:-6}, {allie:'RUS', delta:-4}] }, succes:{ credibilite:6, opinion:4 }, echec:{ credibilite:-6, menaceInt:8 }, baisseMenace:30 },
      { id:'DIPLOMATIE', nom:'Pression diplomatique avec Washington', description:'Fournir aux États-Unis et aux Européens des preuves pour durcir les inspections et les sanctions.', p:0.6,
        effets:{ capital:-1 }, succes:{ relation:[{allie:'USA', delta:3}] }, echec:{ credibilite:-2 }, baisseMenace:6 }
    ],
    lieux:[
      { id:'GOLFE',        lon:51.5,  lat:26.8,  nom:'Golfe (eaux internationales)',   type:'zone',  controle:'neutre', defense:0,  force:null,    civils:0, littoral:true },
      { id:'TEHERAN',      lon:51.39, lat:35.69, nom:'Téhéran',                        type:'ville', controle:'neutre', defense:0,  force:null,    civils:3 },
      { id:'NATANZ',       lon:51.73, lat:33.72, nom:'Natanz (enrichissement)',        type:'zone',  controle:'ennemi', defense:0,  force:[30,45], civils:1 },
      { id:'FORDO',        lon:50.99, lat:34.88, nom:'Fordo (site enterré)',           type:'zone',  controle:'ennemi', defense:0,  force:[35,50], civils:0 },
      { id:'ISFAHAN',      lon:51.67, lat:32.65, nom:'Ispahan',                        type:'ville', controle:'neutre', defense:0,  force:null,    civils:3 },
      { id:'ARAK',         lon:49.24, lat:34.38, nom:'Arak (réacteur à eau lourde)',   type:'zone',  controle:'ennemi', defense:0,  force:[20,30], civils:1 },
      { id:'PARCHIN',      lon:51.77, lat:35.52, nom:'Parchin',                        type:'base',  controle:'ennemi', defense:0,  force:[20,35], civils:1 },
      { id:'BOUCHEHR',     lon:50.89, lat:28.83, nom:'Bouchehr (centrale civile)',     type:'zone',  controle:'neutre', defense:0,  force:null,    civils:2, littoral:true },
      { id:'BANDAR_ABBAS', lon:56.27, lat:27.18, nom:'Bandar Abbas',                   type:'base',  controle:'ennemi', defense:0,  force:[15,25], civils:2, littoral:true },
      { id:'KERMANSHAH',   lon:47.07, lat:34.31, nom:'Kermanchah (missiles)',          type:'base',  controle:'ennemi', defense:0,  force:[20,30], civils:1 }
    ],
    liens:[['TEHERAN','PARCHIN'],['TEHERAN','FORDO'],['FORDO','ARAK'],['FORDO','NATANZ'],['NATANZ','ISFAHAN'],['ISFAHAN','ARAK'],['ARAK','KERMANSHAH'],
           ['ISFAHAN','BOUCHEHR'],['BOUCHEHR','GOLFE'],['GOLFE','BANDAR_ABBAS'],['ISFAHAN','BANDAR_ABBAS']],
    scenarios:[
      { id:'PERCEE', titre:'Une percée du programme', texte:'Les services estiment que l’Iran a franchi une étape décisive de l’enrichissement.', objectifs:[], modifs:{} }
    ]
  }
};
