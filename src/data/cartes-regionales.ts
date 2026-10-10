import type { CarteRegionaleDef } from '../sim/types';

// ---------------------------------------------------------------------
// CARTES RÉGIONALES (zoom)
// lieux : controle allie | ennemi | neutre ; force : fourchette initiale si ennemi
// objectifs : tenir {lieu}, controler {lieu}, evacuer {lieu, nombre}, attrition {valeur en %}
// ---------------------------------------------------------------------
export const CARTES_REGIONALES: Record<string, CarteRegionaleDef> = {
  IRAK_NORD: {
    id:'IRAK_NORD', nom:'Irak du Nord', theatre:'LEVANT', largeur:700, hauteur:560, depart:'ERBIL',
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
  }
};
