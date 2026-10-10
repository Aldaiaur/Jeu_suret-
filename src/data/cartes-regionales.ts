import type { CarteRegionaleDef } from '../sim/types';

// ---------------------------------------------------------------------
// CARTES RÉGIONALES : une par théâtre, consultables à tout moment ; certaines servent aussi au zoom de crise.
// Coordonnées des lieux réels (longitude, latitude), de notoriété publique. Les fleuves sont des tracés
// schématiques à quelques points, pour le décor seulement.
// lieux : controle allie | ennemi | neutre ; force : fourchette initiale si ennemi ; littoral : accessible à la Marine
// soutien : capacité logistique du théâtre (élongation, bases, ports). // À VÉRIFIER (valeurs de conception)
// objectifs : tenir {lieu}, controler {lieu}, evacuer {lieu, nombre}, attrition {valeur en %}
// ---------------------------------------------------------------------
export const CARTES_REGIONALES: Record<string, CarteRegionaleDef> = {
  IRAK_NORD: {
    id:'IRAK_NORD', nom:'Irak du Nord', theatre:'LEVANT', largeur:700, hauteur:560, depart:'ERBIL',
    biome:'steppe_fluviale', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:4,
    fleuves:[{ nom:'Tigre', points:[[42.4,37.2],[42.95,36.6],[43.13,36.34],[43.29,35.8],[43.45,35.2],[43.49,34.93],[43.68,34.6],[43.87,34.2],[44.2,33.7],[44.37,33.31]] }, { nom:'Euphrate', points:[[41.0,34.45],[41.9,34.4],[42.4,34.1],[42.9,33.6],[43.3,33.42],[43.78,33.35],[44.1,32.9]] }],
    forceLocale:{ nom:'Peshmergas et forces irakiennes', force:45 }, reserveEnnemie:[30,50],
    lieux:[
      { id:'DOHOUK',   lon:42.99, lat:36.87, nom:'Dohouk',    x:330, y:50,  type:'ville', controle:'allie',  defense:30, force:null,    civils:2 },
      { id:'SINJAR',   lon:41.86, lat:36.32, nom:'Sinjar',    x:80,  y:150, type:'ville', controle:'ennemi', defense:0,  force:[20,35], civils:2 },
      { id:'TALAFAR',  lon:42.45, lat:36.38, nom:'Tal Afar',  x:200, y:160, type:'ville', controle:'ennemi', defense:0,  force:[25,40], civils:2 },
      { id:'MOSSOUL',  lon:43.13, lat:36.34, nom:'Mossoul',   x:320, y:180, type:'ville', controle:'ennemi', defense:0,  force:[50,70], civils:3 },
      { id:'ERBIL',    lon:44.01, lat:36.19, nom:'Erbil',     x:490, y:160, type:'base',  controle:'allie',  defense:50, force:null,    civils:2 },
      { id:'MAKHMOUR', lon:43.58, lat:35.78, nom:'Makhmour',  x:440, y:270, type:'base',  controle:'allie',  defense:20, force:null,    civils:1 },
      { id:'QAYYARAH', lon:43.29, lat:35.8, nom:'Qayyarah',  x:310, y:290, type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:1 },
      { id:'HAWIJA',   lon:43.77, lat:35.33, nom:'Hawija',    x:470, y:360, type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:2 },
      { id:'KIRKOUK',  lon:44.39, lat:35.47, nom:'Kirkouk',   x:590, y:320, type:'ville', controle:'allie',  defense:35, force:null,    civils:2 },
      { id:'BAIJI',    lon:43.49, lat:34.93, nom:'Baiji',     x:350, y:400, type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:1 },
      { id:'TIKRIT',   lon:43.68, lat:34.6, nom:'Tikrit',    x:390, y:470, type:'ville', controle:'ennemi', defense:0,  force:[15,30], civils:2 },
      { id:'BAGDAD',   lon:44.37, lat:33.31, nom:'Bagdad',    x:500, y:530, type:'ville', controle:'allie',  defense:60, force:null,    civils:3 }
    ],
    liens:[['SINJAR','TALAFAR'],['SINJAR','DOHOUK'],['TALAFAR','MOSSOUL'],['DOHOUK','MOSSOUL'],['DOHOUK','ERBIL'],['MOSSOUL','ERBIL'],
           ['MOSSOUL','QAYYARAH'],['ERBIL','MAKHMOUR'],['ERBIL','KIRKOUK'],['MAKHMOUR','QAYYARAH'],['MAKHMOUR','HAWIJA'],['KIRKOUK','HAWIJA'],
           ['QAYYARAH','BAIJI'],['HAWIJA','BAIJI'],['BAIJI','TIKRIT'],['TIKRIT','BAGDAD'],['KIRKOUK','BAGDAD']],
    scenarios:[
      { id:'FRONT_KURDE', titre:'Offensive contre le front kurde',
        texte:'Daech concentre des forces autour de Hawija et Qayyarah et menace Makhmour et Kirkouk.',
        objectifs:[{type:'tenir', lieu:'MAKHMOUR'}, {type:'tenir', lieu:'KIRKOUK'}, {type:'attrition', valeur:30}],
        modifs:{ HAWIJA:{force:15}, QAYYARAH:{force:10} } },
      { id:'SINJAR_SIEGE', titre:'Populations encerclées à Sinjar',
        texte:'Des milliers de civils sont pris au piège dans les environs de Sinjar. Une partie peut être évacuée si l’étau se desserre.',
        objectifs:[{type:'evacuer', lieu:'SINJAR', nombre:2}, {type:'attrition', valeur:20}],
        modifs:{ SINJAR:{ressortissants:2} } },
      { id:'OTAGES_TALAFAR', titre:'Ressortissants retenus près de Tal Afar',
        texte:'Deux humanitaires européens seraient détenus dans le secteur de Tal Afar.',
        objectifs:[{type:'evacuer', lieu:'TALAFAR', nombre:1}, {type:'tenir', lieu:'DOHOUK'}],
        modifs:{ TALAFAR:{ressortissants:1} } }
    ]
  },
  SAHEL: {
    id:'SAHEL', nom:'Sahel (Mali-Niger)', theatre:'SAHEL', largeur:760, hauteur:540, depart:'GAO',
    biome:'desert_reg', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:8,
    fleuves:[{ nom:'Niger', points:[[-7.5,13.0],[-6.27,13.43],[-4.2,14.49],[-4.1,15.3],[-3.0,16.5],[-1.5,16.9],[-0.35,16.95],[-0.04,16.27],[0.5,15.66],[1.3,14.6],[2.11,13.51],[3.2,11.9]] }],
    forceLocale:{ nom:'Forces maliennes et partenaires', force:35 }, reserveEnnemie:[25,40],
    lieux:[
      { id:'TESSALIT',  lon:1.01, lat:20.2, nom:'Tessalit',             x:520, y:50,  type:'base',  controle:'allie',  defense:25, force:null,    civils:0 },
      { id:'TINZA',     lon:2.92, lat:19.95, nom:'Tin Zaouatine',        x:690, y:60,  type:'zone',  controle:'ennemi', defense:0,  force:[15,25], civils:0 },
      { id:'KIDAL',     lon:1.41, lat:18.44, nom:'Kidal',                x:560, y:170, type:'ville', controle:'neutre', defense:10, force:null,    civils:2 },
      { id:'IFOGHAS',   lon:2.1, lat:19.3, nom:'Adrar des Ifoghas',    x:680, y:180, type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:0 },
      { id:'TOMBOUCTOU',lon:-3.01, lat:16.77, nom:'Tombouctou',           x:220, y:200, type:'ville', controle:'allie',  defense:20, force:null,    civils:2 },
      { id:'GAO',       lon:-0.04, lat:16.27, nom:'Gao',                  x:450, y:280, type:'base',  controle:'allie',  defense:45, force:null,    civils:2 },
      { id:'GOURMA',    lon:-1.6, lat:15.5, nom:'Gourma',               x:300, y:320, type:'zone',  controle:'ennemi', defense:0,  force:[20,30], civils:1 },
      { id:'WAGADOU',   lon:-7.2, lat:14.9, nom:'Forêt du Wagadou',     x:80,  y:310, type:'zone',  controle:'ennemi', defense:0,  force:[20,30], civils:1 },
      { id:'ANSONGO',   lon:0.5, lat:15.66, nom:'Ansongo',              x:480, y:370, type:'ville', controle:'neutre', defense:10, force:null,    civils:2 },
      { id:'MENAKA',    lon:2.4, lat:15.92, nom:'Ménaka',               x:640, y:380, type:'ville', controle:'ennemi', defense:0,  force:[20,35], civils:2 },
      { id:'MOPTI',     lon:-4.2, lat:14.49, nom:'Mopti',                x:150, y:430, type:'ville', controle:'allie',  defense:25, force:null,    civils:3 },
      { id:'NIAMEY',    lon:2.11, lat:13.51, nom:'Niamey',               x:520, y:500, type:'base',  controle:'allie',  defense:60, force:null,    civils:3 }
    ],
    liens:[['TESSALIT','KIDAL'],['TESSALIT','TINZA'],['KIDAL','IFOGHAS'],['IFOGHAS','TINZA'],['KIDAL','GAO'],['TOMBOUCTOU','GOURMA'],
           ['TOMBOUCTOU','WAGADOU'],['TOMBOUCTOU','GAO'],['WAGADOU','MOPTI'],['MOPTI','GOURMA'],['GOURMA','GAO'],['GAO','ANSONGO'],
           ['ANSONGO','MENAKA'],['ANSONGO','NIAMEY'],['MENAKA','NIAMEY']],
    scenarios:[
      { id:'TOMBOUCTOU_MENACEE', titre:'Tombouctou menacée',
        texte:'Des katibas venues du Wagadou et du Gourma convergent vers Tombouctou.',
        objectifs:[{type:'tenir', lieu:'TOMBOUCTOU'}, {type:'controler', lieu:'GOURMA'}],
        modifs:{ WAGADOU:{force:12}, GOURMA:{force:8} } },
      { id:'IFOGHAS_SANCTUAIRE', titre:'Sanctuaire de l’Adrar des Ifoghas',
        texte:'Le renseignement signale la reconstitution d’une base logistique dans l’Adrar des Ifoghas.',
        objectifs:[{type:'controler', lieu:'IFOGHAS'}, {type:'attrition', valeur:30}],
        modifs:{ IFOGHAS:{force:10} } },
      { id:'OTAGES_MENAKA', titre:'Otages dans la région de Ménaka',
        texte:'Un ressortissant enlevé serait détenu dans les environs de Ménaka.',
        objectifs:[{type:'evacuer', lieu:'MENAKA', nombre:1}, {type:'tenir', lieu:'GAO'}],
        modifs:{ MENAKA:{ressortissants:1} } }
    ]
  },
  LIBYE: {
    id:'LIBYE', nom:'Libye et Méditerranée centrale', theatre:'LIBYE', largeur:760, hauteur:540, depart:'MISRATA',
    biome:'littoral_desert', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:3,
    forceLocale:{ nom:'Milices alliées et forces gouvernementales', force:30 }, reserveEnnemie:[20,35],
    lieux:[
      { id:'LAMPEDUSA',  lon:12.6,  lat:35.5,  nom:'Lampedusa',          type:'base',  controle:'allie',  defense:40, force:null,    civils:1, littoral:true },
      { id:'TRIPOLI',    lon:13.19, lat:32.89, nom:'Tripoli',            type:'ville', controle:'neutre', defense:20, force:null,    civils:3, littoral:true },
      { id:'SABRATHA',   lon:12.48, lat:32.79, nom:'Sabratha',           type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:2, littoral:true },
      { id:'MISRATA',    lon:15.09, lat:32.38, nom:'Misrata',            type:'base',  controle:'allie',  defense:40, force:null,    civils:3, littoral:true },
      { id:'SYRTE',      lon:16.59, lat:31.21, nom:'Syrte',              type:'ville', controle:'ennemi', defense:0,  force:[35,50], civils:2, littoral:true },
      { id:'RAS_LANOUF', lon:18.55, lat:30.5,  nom:'Croissant pétrolier', type:'zone', controle:'neutre', defense:10, force:null,    civils:0, littoral:true },
      { id:'BENGHAZI',   lon:20.07, lat:32.12, nom:'Benghazi',           type:'ville', controle:'neutre', defense:20, force:null,    civils:3, littoral:true },
      { id:'DERNA',      lon:22.64, lat:32.77, nom:'Derna',              type:'ville', controle:'ennemi', defense:0,  force:[20,30], civils:2, littoral:true },
      { id:'TOBROUK',    lon:23.96, lat:32.08, nom:'Tobrouk',            type:'ville', controle:'allie',  defense:25, force:null,    civils:2, littoral:true },
      { id:'JOUFRA',     lon:15.95, lat:29.11, nom:'Al-Joufra',          type:'zone',  controle:'neutre', defense:5,  force:null,    civils:1 },
      { id:'SABHA',      lon:14.43, lat:27.04, nom:'Sabha',              type:'ville', controle:'ennemi', defense:0,  force:[15,25], civils:2 }
    ],
    liens:[['LAMPEDUSA','TRIPOLI'],['LAMPEDUSA','MISRATA'],['SABRATHA','TRIPOLI'],['TRIPOLI','MISRATA'],['MISRATA','SYRTE'],['SYRTE','RAS_LANOUF'],
           ['RAS_LANOUF','BENGHAZI'],['BENGHAZI','DERNA'],['DERNA','TOBROUK'],['BENGHAZI','TOBROUK'],['SYRTE','JOUFRA'],['JOUFRA','SABHA'],['TRIPOLI','SABHA']],
    scenarios:[
      { id:'SIEGE_SYRTE', titre:'Bastion côtier à Syrte',
        texte:'Un groupe armé s’est retranché dans Syrte et menace Misrata. Les milices alliées préparent un assaut et demandent un appui.',
        objectifs:[{type:'controler', lieu:'SYRTE'}, {type:'tenir', lieu:'MISRATA'}, {type:'attrition', valeur:30}],
        modifs:{ SYRTE:{force:8} } },
      { id:'EVAC_TRIPOLI', titre:'Évacuation des ressortissants de Tripoli',
        texte:'Les combats entre milices gagnent la capitale. Plusieurs centaines d’Européens attendent une évacuation par la mer.',
        objectifs:[{type:'evacuer', lieu:'TRIPOLI', nombre:2}, {type:'tenir', lieu:'MISRATA'}],
        modifs:{ TRIPOLI:{ressortissants:2}, SABRATHA:{force:6} } },
      { id:'CROISSANT', titre:'Menace sur le croissant pétrolier',
        texte:'Des colonnes venues de Syrte visent les terminaux pétroliers. Leur chute priverait le pays de ses dernières recettes.',
        objectifs:[{type:'tenir', lieu:'RAS_LANOUF'}, {type:'attrition', valeur:25}],
        modifs:{ SYRTE:{force:10} } }
    ]
  },
  GUINEE: {
    id:'GUINEE', nom:'Golfe de Guinée et lac Tchad', theatre:'GUINEE', largeur:760, hauteur:540, depart:'ABIDJAN',
    biome:'mangrove_littoral', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:5,
    fleuves:[{ nom:'Niger', points:[[4.5,10.5],[5.8,9.0],[6.74,7.8],[6.78,6.15],[6.4,5.4],[6.0,4.8]] }, { nom:'Bénoué', points:[[6.74,7.8],[8.3,8.0],[9.6,8.5],[11.0,9.2],[12.4,9.3],[13.4,9.3]] }],
    forceLocale:{ nom:'Marines et armées riveraines', force:35 }, reserveEnnemie:[20,35],
    lieux:[
      { id:'ABIDJAN',     lon:-4.03, lat:5.32,  nom:'Abidjan',                type:'base',  controle:'allie',  defense:45, force:null,    civils:3, littoral:true },
      { id:'SAO_TOME',    lon:3.5,   lat:1.5,   nom:'Large du golfe',         type:'zone',  controle:'neutre', defense:0,  force:null,    civils:0, littoral:true },
      { id:'LAGOS',       lon:3.39,  lat:6.45,  nom:'Lagos',                  type:'ville', controle:'allie',  defense:30, force:null,    civils:3, littoral:true },
      { id:'DELTA',       lon:6.0,   lat:5.3,   nom:'Delta du Niger',         type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:1, littoral:true },
      { id:'PORT_HARCOURT', lon:7.03, lat:4.82, nom:'Port Harcourt',          type:'ville', controle:'neutre', defense:15, force:null,    civils:3, littoral:true },
      { id:'BAKASSI',     lon:8.55,  lat:4.65,  nom:'Péninsule de Bakassi',   type:'zone',  controle:'ennemi', defense:0,  force:[15,25], civils:1, littoral:true },
      { id:'DOUALA',      lon:9.7,   lat:4.05,  nom:'Douala',                 type:'ville', controle:'allie',  defense:20, force:null,    civils:3, littoral:true },
      { id:'LIBREVILLE',  lon:9.47,  lat:0.42,  nom:'Libreville',             type:'base',  controle:'allie',  defense:30, force:null,    civils:2, littoral:true },
      { id:'ABUJA',       lon:7.49,  lat:9.06,  nom:'Abuja',                  type:'ville', controle:'allie',  defense:30, force:null,    civils:3 },
      { id:'YAOUNDE',     lon:11.52, lat:3.87,  nom:'Yaoundé',                type:'ville', controle:'allie',  defense:25, force:null,    civils:3 },
      { id:'MAIDUGURI',   lon:13.16, lat:11.85, nom:'Maiduguri',              type:'ville', controle:'neutre', defense:20, force:null,    civils:3 },
      { id:'LAC_TCHAD',   lon:14.0,  lat:13.2,  nom:'Rives du lac Tchad',     type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:1 }
    ],
    liens:[['ABIDJAN','LAGOS'],['ABIDJAN','SAO_TOME'],['SAO_TOME','LIBREVILLE'],['SAO_TOME','BAKASSI'],['LAGOS','DELTA'],['DELTA','PORT_HARCOURT'],['PORT_HARCOURT','BAKASSI'],
           ['BAKASSI','DOUALA'],['DOUALA','LIBREVILLE'],['DOUALA','YAOUNDE'],['YAOUNDE','LIBREVILLE'],['LAGOS','ABUJA'],['ABUJA','PORT_HARCOURT'],['ABUJA','MAIDUGURI'],
           ['MAIDUGURI','LAC_TCHAD'],['YAOUNDE','MAIDUGURI']],
    scenarios:[
      { id:'MARINS_DELTA', titre:'Marins retenus dans le Delta',
        texte:'Un équipage enlevé lors d’un abordage est détenu dans les criques du Delta du Niger. La marine nigériane prépare une opération.',
        objectifs:[{type:'evacuer', lieu:'DELTA', nombre:1}, {type:'tenir', lieu:'PORT_HARCOURT'}],
        modifs:{ DELTA:{ressortissants:1} } },
      { id:'OFFENSIVE_LAC', titre:'Offensive sur les rives du lac Tchad',
        texte:'L’insurrection lance des colonnes depuis les îles du lac et menace Maiduguri. Les armées riveraines demandent un appui aérien et du renseignement.',
        objectifs:[{type:'tenir', lieu:'MAIDUGURI'}, {type:'attrition', valeur:30}],
        modifs:{ LAC_TCHAD:{force:10} } },
      { id:'BASE_PIRATE', titre:'Base pirate dans la péninsule de Bakassi',
        texte:'Le renseignement localise une base d’où partent des hors-bord à long rayon d’action.',
        objectifs:[{type:'controler', lieu:'BAKASSI'}, {type:'attrition', valeur:25}],
        modifs:{ BAKASSI:{force:6} } }
    ]
  },
  DJIBOUTI: {
    id:'DJIBOUTI', nom:'Djibouti et golfe d’Aden', theatre:'CORNE', largeur:760, hauteur:540, depart:'DJIBOUTI',
    biome:'littoral_aride', zoomCrise:true, forcesCrise:['FS'], frappes:true, soutien:6,
    forceLocale:{ nom:'Forces djiboutiennes et partenaires', force:30 }, reserveEnnemie:[15,25],
    lieux:[
      { id:'DJIBOUTI',     lon:43.15, lat:11.59, nom:'Djibouti',               type:'base',  controle:'allie',  defense:60, force:null,    civils:3, littoral:true },
      { id:'ARTA',         lon:42.85, lat:11.53, nom:'Arta',                   type:'base',  controle:'allie',  defense:25, force:null,    civils:1 },
      { id:'TADJOURAH',    lon:42.88, lat:11.79, nom:'Tadjourah',              type:'ville', controle:'allie',  defense:15, force:null,    civils:2, littoral:true },
      { id:'OBOCK',        lon:43.29, lat:11.97, nom:'Obock',                  type:'ville', controle:'neutre', defense:10, force:null,    civils:1, littoral:true },
      { id:'ALI_SABIEH',   lon:42.71, lat:11.15, nom:'Ali Sabieh',             type:'ville', controle:'allie',  defense:15, force:null,    civils:2 },
      { id:'BAB_EL_MANDEB', lon:43.33, lat:12.58, nom:'Bab-el-Mandeb',         type:'zone',  controle:'neutre', defense:0,  force:null,    civils:0, littoral:true },
      { id:'ADEN',         lon:45.03, lat:12.79, nom:'Aden',                   type:'ville', controle:'neutre', defense:10, force:null,    civils:3, littoral:true },
      { id:'ZEILA',        lon:43.47, lat:11.35, nom:'Zeila',                  type:'ville', controle:'neutre', defense:5,  force:null,    civils:1, littoral:true },
      { id:'BERBERA',      lon:45.01, lat:10.44, nom:'Berbera',                type:'ville', controle:'neutre', defense:10, force:null,    civils:2, littoral:true },
      { id:'GOLIS',        lon:46.3,  lat:10.3,  nom:'Monts Golis',            type:'zone',  controle:'ennemi', defense:0,  force:[15,25], civils:1 },
      { id:'GOLFE_ADEN',   lon:47.2,  lat:12.3,  nom:'Golfe d’Aden',           type:'zone',  controle:'ennemi', defense:0,  force:[15,30], civils:0, littoral:true }
    ],
    liens:[['DJIBOUTI','ARTA'],['ARTA','ALI_SABIEH'],['DJIBOUTI','TADJOURAH'],['TADJOURAH','OBOCK'],['OBOCK','BAB_EL_MANDEB'],['DJIBOUTI','BAB_EL_MANDEB'],
           ['BAB_EL_MANDEB','ADEN'],['ADEN','GOLFE_ADEN'],['GOLFE_ADEN','BERBERA'],['BERBERA','GOLIS'],['GOLIS','GOLFE_ADEN'],['BERBERA','ZEILA'],
           ['ZEILA','DJIBOUTI'],['ALI_SABIEH','ZEILA']],
    scenarios:[
      { id:'EVAC_ADEN', titre:'Ressortissants bloqués à Aden',
        texte:'Les combats gagnent Aden. Des ressortissants français et européens attendent sur le port ; Djibouti servira de point de recueil.',
        objectifs:[{type:'evacuer', lieu:'ADEN', nombre:2}, {type:'tenir', lieu:'DJIBOUTI'}],
        modifs:{ ADEN:{ressortissants:2} } },
      { id:'CARGO_DETOURNE', titre:'Cargo détourné dans le golfe d’Aden',
        texte:'Des pirates ont pris le contrôle d’un cargo et de son équipage. Le navire dérive vers la côte somalienne.',
        objectifs:[{type:'evacuer', lieu:'GOLFE_ADEN', nombre:1}, {type:'attrition', valeur:25}],
        modifs:{ GOLFE_ADEN:{ressortissants:1} } },
      { id:'MENACE_EMPRISES', titre:'Menace sur les emprises françaises',
        texte:'Un groupe armé venu des monts Golis préparerait une action contre nos emprises ou les lieux fréquentés par nos militaires.',
        objectifs:[{type:'tenir', lieu:'DJIBOUTI'}, {type:'tenir', lieu:'ARTA'}, {type:'attrition', valeur:30}],
        modifs:{ GOLIS:{force:10} } }
    ]
  },
  METRO: {
    id:'METRO', nom:'Territoire national', theatre:'METRO', largeur:760, hauteur:540, depart:'PARIS',
    biome:'urbain_bocage', zoomCrise:false, forcesCrise:['INT'], frappes:false, soutien:20,
    fleuves:[{ nom:'Seine', points:[[4.5,48.3],[3.0,48.4],[2.35,48.86],[1.6,49.1],[1.1,49.44],[0.1,49.48]] }, { nom:'Loire', points:[[4.0,46.0],[3.1,46.9],[2.4,47.6],[1.9,47.9],[0.69,47.39],[-0.55,47.47],[-1.55,47.22],[-2.2,47.27]] }, { nom:'Rhône', points:[[6.1,46.15],[5.5,45.9],[4.84,45.76],[4.89,44.93],[4.81,43.95],[4.63,43.68],[4.75,43.35]] }, { nom:'Garonne', points:[[0.6,43.0],[1.44,43.6],[0.6,44.2],[-0.58,44.84],[-1.0,45.5]] }],
    forceLocale:{ nom:'Forces de sécurité intérieure', force:60 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'INTERVENTION', nom:'Engager les forces d’intervention', description:'GIGN, RAID ou BRI interviennent sur renseignement. Décisif si l’information est bonne.', requiert:['INT'], p:0.65,
        effets:{ fatigue:[{categorie:'INT', delta:8}] }, succes:{ opinion:4, credibilite:2, menaceInt:-6 }, echec:{ opinion:-5, menaceInt:4 }, baisseMenace:15 },
      { id:'PLAN_URGENCE', nom:'Déclencher le plan d’urgence', description:'Renforts sur les sites sensibles, contrôles, annulation de rassemblements. Sûr, mais coûteux et impopulaire à la longue.', p:0.9,
        effets:{ budget:-8, capital:-1 }, succes:{ menaceInt:-4, opinion:1 }, echec:{ opinion:-2 }, baisseMenace:6 }
    ],
    lieux:[
      { id:'PARIS',      lon:2.35,  lat:48.86, nom:'Paris',      type:'ville', controle:'allie', defense:60, force:null, civils:3 },
      { id:'LILLE',      lon:3.06,  lat:50.63, nom:'Lille',      type:'ville', controle:'allie', defense:30, force:null, civils:3 },
      { id:'STRASBOURG', lon:7.75,  lat:48.58, nom:'Strasbourg', type:'ville', controle:'allie', defense:30, force:null, civils:3 },
      { id:'LYON',       lon:4.84,  lat:45.76, nom:'Lyon',       type:'ville', controle:'allie', defense:35, force:null, civils:3 },
      { id:'MARSEILLE',  lon:5.37,  lat:43.3,  nom:'Marseille',  type:'ville', controle:'allie', defense:35, force:null, civils:3, littoral:true },
      { id:'NICE',       lon:7.27,  lat:43.7,  nom:'Nice',       type:'ville', controle:'allie', defense:25, force:null, civils:3, littoral:true },
      { id:'TOULOUSE',   lon:1.44,  lat:43.6,  nom:'Toulouse',   type:'ville', controle:'allie', defense:30, force:null, civils:3 },
      { id:'BORDEAUX',   lon:-0.58, lat:44.84, nom:'Bordeaux',   type:'ville', controle:'allie', defense:30, force:null, civils:3, littoral:true },
      { id:'BREST',      lon:-4.49, lat:48.39, nom:'Brest',      type:'base',  controle:'allie', defense:40, force:null, civils:2, littoral:true },
      { id:'TOULON',     lon:5.93,  lat:43.12, nom:'Toulon',     type:'base',  controle:'allie', defense:45, force:null, civils:2, littoral:true }
    ],
    liens:[['PARIS','LILLE'],['PARIS','STRASBOURG'],['PARIS','LYON'],['PARIS','BORDEAUX'],['PARIS','BREST'],['LYON','STRASBOURG'],['LYON','MARSEILLE'],
           ['MARSEILLE','TOULON'],['TOULON','NICE'],['MARSEILLE','TOULOUSE'],['TOULOUSE','BORDEAUX'],['BORDEAUX','BREST']],
    scenarios:[
      { id:'RASSEMBLEMENT', titre:'Menace sur un grand rassemblement', texte:'Plusieurs services signalent un projet visant une manifestation de grande ampleur. Les préfets attendent des renforts.', objectifs:[], modifs:{} },
      { id:'CELLULE_FUITE', titre:'Une cellule en fuite', texte:'Après une interpellation manquée, des suspects armés sont en fuite. Les forces d’intervention sont en alerte.', objectifs:[], modifs:{} },
      { id:'SITE_SENSIBLE', titre:'Alerte sur un site industriel sensible', texte:'Des repérages autour d’un site classé ont été signalés. Une action contre l’installation aurait des effets graves.', objectifs:[], modifs:{} }
    ]
  },
  BALTIQUE: {
    id:'BALTIQUE', nom:'Pays baltes et Pologne', theatre:'EST', largeur:760, hauteur:540, depart:'TAPA',
    biome:'foret_plaine', zoomCrise:false, forcesCrise:[], frappes:false, soutien:6,
    fleuves:[{ nom:'Daugava', points:[[27.6,55.6],[26.5,55.9],[25.5,56.4],[24.11,56.95]] }, { nom:'Vistule', points:[[21.5,51.0],[21.01,52.23],[19.5,52.6],[18.6,53.5],[18.8,54.3]] }],
    forceLocale:{ nom:'Forces baltes et polonaises', force:50 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'REASSURANCE', nom:'Déployer une force de réassurance', description:'Des unités françaises rejoignent l’allié menacé. Un signal fort, au prix d’un engagement durable.', requiert:['TERRE','AIR'], p:0.8,
        effets:{ relation:[{allie:'USA', delta:2}, {allie:'DEU', delta:2}] }, succes:{ credibilite:4 }, echec:{ credibilite:-2, menace:[{type:'ETAT_EST', delta:3}] }, baisseMenace:10 },
      { id:'DIPLOMATIE', nom:'Proposer une désescalade', description:'Médiation avec Berlin et canal direct avec Moscou. Peut désamorcer la crise, ou passer pour de la faiblesse.', p:0.45,
        effets:{ capital:-2 }, succes:{ credibilite:3 }, echec:{ credibilite:-3, relation:[{allie:'USA', delta:-2}] }, baisseMenace:12 }
    ],
    lieux:[
      { id:'TALLINN',     lon:24.75, lat:59.44, nom:'Tallinn',           type:'ville', controle:'allie',  defense:30, force:null,    civils:3, littoral:true },
      { id:'TAPA',        lon:25.96, lat:59.26, nom:'Tapa',              type:'base',  controle:'allie',  defense:35, force:null,    civils:1 },
      { id:'NARVA',       lon:28.19, lat:59.38, nom:'Narva',             type:'ville', controle:'allie',  defense:15, force:null,    civils:2 },
      { id:'RIGA',        lon:24.11, lat:56.95, nom:'Riga',              type:'ville', controle:'allie',  defense:30, force:null,    civils:3, littoral:true },
      { id:'SIAULIAI',    lon:23.39, lat:55.89, nom:'Šiauliai',          type:'base',  controle:'allie',  defense:35, force:null,    civils:1 },
      { id:'VILNIUS',     lon:25.28, lat:54.69, nom:'Vilnius',           type:'ville', controle:'allie',  defense:30, force:null,    civils:3 },
      { id:'SUWALKI',     lon:22.93, lat:54.1,  nom:'Trouée de Suwałki', type:'zone',  controle:'neutre', defense:10, force:null,    civils:1 },
      { id:'VARSOVIE',    lon:21.01, lat:52.23, nom:'Varsovie',          type:'ville', controle:'allie',  defense:40, force:null,    civils:3 },
      { id:'ORZYSZ',      lon:21.95, lat:53.81, nom:'Orzysz',            type:'base',  controle:'allie',  defense:30, force:null,    civils:1 },
      { id:'KALININGRAD', lon:20.51, lat:54.71, nom:'Kaliningrad',       type:'zone',  controle:'ennemi', defense:0,  force:[30,45], civils:2, littoral:true },
      { id:'PSKOV',       lon:28.33, lat:57.82, nom:'Pskov',             type:'zone',  controle:'ennemi', defense:0,  force:[25,40], civils:1 }
    ],
    liens:[['TALLINN','TAPA'],['TAPA','NARVA'],['TALLINN','RIGA'],['RIGA','SIAULIAI'],['NARVA','PSKOV'],['RIGA','VILNIUS'],['SIAULIAI','VILNIUS'],
           ['SIAULIAI','KALININGRAD'],['VILNIUS','SUWALKI'],['SUWALKI','ORZYSZ'],['SUWALKI','KALININGRAD'],['ORZYSZ','VARSOVIE'],['ORZYSZ','KALININGRAD']],
    scenarios:[
      { id:'MANOEUVRES', titre:'Manœuvres massives près de la trouée de Suwałki', texte:'Des dizaines de milliers de soldats manœuvrent de part et d’autre de l’étroit couloir qui relie la Pologne aux pays baltes. Les alliés demandent une démonstration de solidarité.', objectifs:[], modifs:{} },
      { id:'ESPACE_AERIEN', titre:'Violations répétées de l’espace aérien balte', texte:'Des appareils militaires volent transpondeur coupé à proximité de l’espace aérien estonien. Les interceptions se multiplient.', objectifs:[], modifs:{} },
      { id:'INCIDENT_FRONTIERE', titre:'Incident à la frontière estonienne', texte:'Un agent des services estoniens a été enlevé près de la frontière. Tallinn invoque la solidarité alliée.', objectifs:[], modifs:{} }
    ]
  },
  MER_CHINE: {
    id:'MER_CHINE', nom:'Mer de Chine méridionale', theatre:'INDOPAC', largeur:760, hauteur:540, depart:'SINGAPOUR',
    biome:'archipel_ocean', zoomCrise:false, forcesCrise:[], frappes:false, soutien:3,
    forceLocale:{ nom:'Marines riveraines partenaires', force:30 }, reserveEnnemie:[0,0],
    reponsesCrise:[
      { id:'NAVIGATION', nom:'Patrouille de liberté de navigation', description:'Un bâtiment français transite avec des partenaires dans les eaux disputées, sans provocation.', requiert:['MER'], p:0.75,
        effets:{ fatigue:[{categorie:'MER', delta:5}] }, succes:{ credibilite:4, relation:[{allie:'JPN', delta:3}, {allie:'AUS', delta:3}] }, echec:{ credibilite:-2, opinion:-1 }, baisseMenace:10 },
      { id:'PROTESTATION', nom:'Protestation diplomatique coordonnée', description:'Déclaration commune avec les partenaires régionaux et rappel du droit de la mer.', p:0.5,
        effets:{ capital:-1 }, succes:{ credibilite:2 }, echec:{ credibilite:-2 }, baisseMenace:6 }
    ],
    lieux:[
      { id:'SINGAPOUR',      lon:103.85, lat:1.29,  nom:'Singapour',              type:'base',  controle:'allie',  defense:40, force:null,    civils:3, littoral:true },
      { id:'MALACCA',        lon:101.2,  lat:2.6,   nom:'Détroit de Malacca',     type:'zone',  controle:'neutre', defense:0,  force:null,    civils:0, littoral:true },
      { id:'CAM_RANH',       lon:109.2,  lat:11.95, nom:'Baie de Cam Ranh',       type:'base',  controle:'neutre', defense:20, force:null,    civils:1, littoral:true },
      { id:'SPRATLEYS',      lon:114.3,  lat:10.0,  nom:'Îles Spratleys',         type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:0, littoral:true },
      { id:'PARACELS',       lon:112.0,  lat:16.5,  nom:'Îles Paracels',          type:'zone',  controle:'ennemi', defense:0,  force:[20,35], civils:0, littoral:true },
      { id:'SCARBOROUGH',    lon:117.76, lat:15.15, nom:'Récif de Scarborough',   type:'zone',  controle:'ennemi', defense:0,  force:[10,20], civils:0, littoral:true },
      { id:'SANYA',          lon:109.5,  lat:18.25, nom:'Sanya',                  type:'zone',  controle:'ennemi', defense:0,  force:[30,45], civils:2, littoral:true },
      { id:'MANILLE',        lon:120.98, lat:14.6,  nom:'Manille',                type:'ville', controle:'allie',  defense:20, force:null,    civils:3, littoral:true },
      { id:'BRUNEI',         lon:114.9,  lat:4.9,   nom:'Bandar Seri Begawan',    type:'ville', controle:'neutre', defense:10, force:null,    civils:2, littoral:true },
      { id:'DETROIT_TAIWAN', lon:119.5,  lat:24.0,  nom:'Détroit de Taïwan',      type:'zone',  controle:'neutre', defense:0,  force:null,    civils:0, littoral:true }
    ],
    liens:[['SINGAPOUR','MALACCA'],['SINGAPOUR','BRUNEI'],['SINGAPOUR','CAM_RANH'],['CAM_RANH','PARACELS'],['CAM_RANH','SPRATLEYS'],['SPRATLEYS','BRUNEI'],
           ['SPRATLEYS','MANILLE'],['SPRATLEYS','SCARBOROUGH'],['SCARBOROUGH','MANILLE'],['PARACELS','SANYA'],['PARACELS','SCARBOROUGH'],
           ['SCARBOROUGH','DETROIT_TAIWAN'],['SANYA','DETROIT_TAIWAN'],['MANILLE','DETROIT_TAIWAN']],
    scenarios:[
      { id:'COLLISION', titre:'Collision évitée de justesse près d’un récif', texte:'Un bâtiment de garde-côtes a coupé la route d’un navire partenaire à moins de cinquante mètres. Une vidéo circule déjà.', objectifs:[], modifs:{} },
      { id:'ESCALE_ESCORTEE', titre:'Un bâtiment français suivi de près', texte:'Notre frégate en transit est talonnée par plusieurs navires qui exigent qu’elle quitte des eaux qu’ils revendiquent.', objectifs:[], modifs:{} },
      { id:'ZONE_TIR', titre:'Zone de tir décrétée sur une route maritime', texte:'Une zone d’exercice à tirs réels est décrétée sans préavis sur une route empruntée par le commerce mondial.', objectifs:[], modifs:{} }
    ]
  }
};
