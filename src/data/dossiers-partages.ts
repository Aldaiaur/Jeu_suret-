// Dossiers partagés entre nations : leur auteur est une fonction (« @defense »), incarnée par le responsable
// de la nation jouée ; un dossier n’est proposé qu’aux nations qui possèdent tout ce qu’il mentionne
// (théâtres, alliés, unités), et le cas échéant à celles de sa liste `nations`.
// Deux familles : menaces communes (Daech, piraterie, cyber, Russie) et demandes croisées des autres puissances,
// qui dépendent de leurs engagements dans le monde partagé (condition `puissance`).
// Fiction plausible postérieure à janvier 2015 ; aucun nom réel. {auteur}, {fonction}, {territoire} sont remplacés.
import type { EvenementDef } from '../sim/types';

export const DOSSIERS_PARTAGES: EvenementDef[] = [
  // ---------- Menaces communes ----------
  { id:'DP_CIBLAGE_COALITION', titre:'Washington propose une cellule de ciblage commune', auteur:'@defense', poids:4, max:1,
    cond:{ tourMin:2, menace:{type:'DAECH', forceMin:45}, puissance:{ id:'USA', theatre:'LEVANT', min:2 } },
    texte:'Le Pentagone propose d’intégrer nos officiers à la cellule de ciblage de la coalition contre Daech. Nos frappes gagneraient en précision et en volume ; elles deviendraient aussi tributaires des priorités américaines. {auteur}, {fonction}, attend votre arbitrage.',
    choix:[
      { texte:'Intégrer la cellule commune', effets:{ relation:[{allie:'USA', delta:4}], pression:[{theatre:'LEVANT', delta:6}], credibilite:1 } },
      { texte:'Coordonner, mais garder notre propre chaîne de ciblage', effets:{ credibilite:2, relation:[{allie:'USA', delta:-1}], rens:[{theatre:'LEVANT', delta:4}] } },
      { texte:'Laisser l’effort aérien à Washington et réduire nos frappes', effets:{ budget:5, credibilite:-3, pression:[{theatre:'LEVANT', delta:-4}] } }
    ] },
  { id:'DP_ESCORTES', titre:'Les armateurs réclament des équipes de protection', auteur:'@defense', poids:3, max:2,
    cond:{ tourMin:2, menace:{type:'PIRATERIE', forceMin:42} },
    texte:'Deux attaques en une semaine contre des navires sous notre pavillon : les armateurs demandent des équipes militaires de protection embarquées, comme au plus fort de la piraterie somalienne.',
    choix:[
      { texte:'Embarquer des équipes de protection de la Marine', requiert:{categorie:'MER'}, effets:{ fatigue:[{categorie:'MER', delta:6}], budget:-3, menace:[{type:'PIRATERIE', delta:-6}], opinion:1 } },
      { texte:'Financer la formation des garde-côtes riverains', effets:{ budget:-6, menace:[{type:'PIRATERIE', delta:-3}] } },
      { texte:'Autoriser les sociétés de sécurité privées et s’en tenir là', effets:{ menace:[{type:'PIRATERIE', delta:3}], credibilite:-1 } }
    ] },
  { id:'DP_INGERENCE_ELECTORALE', titre:'Intrusion dans les systèmes d’un parti politique', auteur:'@cyber', poids:3, max:1,
    cond:{ tourMin:8, menace:{type:'CYBER', forceMin:35} },
    texte:'{auteur} vous alerte : les messageries d’un grand parti ont été vidées à quelques mois d’une élection. Les premiers indices désignent un service étranger, mais l’attribution prendra des semaines et pourrait ne jamais être certaine.',
    choix:[
      { texte:'Attribuer publiquement l’intrusion dès maintenant', effets:{ alea:{ p:0.5, succes:{ credibilite:4, menace:[{type:'CYBER', delta:-4}] }, echec:{ credibilite:-4, opinion:-2 } }, puissance:[{ id:'RUS', attitude:-5 }] } },
      { texte:'Alerter discrètement tous les partis et durcir leurs systèmes', effets:{ budget:-5, menace:[{type:'CYBER', delta:-6}] } },
      { texte:'Ne rien dire avant d’en savoir plus', effets:{ menace:[{type:'CYBER', delta:4}], opinion:-1 } }
    ] },
  { id:'DP_FICHIER_COMMUN', titre:'Un fichier européen des combattants de retour', auteur:'@rens_int', nations:['FRA', 'GBR'], poids:3, max:1,
    cond:{ tourMin:3, menace:{type:'TERRO', forceMin:40} },
    texte:'Plusieurs services européens proposent de mettre en commun leurs signalements de combattants revenus du Levant. {auteur} y voit un gain réel, mais craint que nos sources ne fuient par le maillon le plus faible.',
    choix:[
      { texte:'Rejoindre le fichier commun', effets:{ capital:-2, menace:[{type:'TERRO', delta:-5}], relation:[{allie:'DEU', delta:3}] } },
      { texte:'Échanger au cas par cas, en bilatéral', effets:{ menace:[{type:'TERRO', delta:-2}], relation:[{allie:'DEU', delta:1}] } },
      { texte:'Garder nos signalements pour nous', effets:{ relation:[{allie:'DEU', delta:-3}] } }
    ] },
  { id:'DP_POLICE_CIEL', titre:'Les pays baltes demandent des chasseurs', auteur:'@defense', poids:4, max:1,
    cond:{ tourMin:2, menace:{type:'ETAT_EST', forceMin:40}, puissance:{ id:'RUS', theatre:'EST', min:2 } },
    texte:'Les incursions d’avions militaires russes se multiplient au-dessus de la Baltique. Vilnius, Riga et Tallinn demandent un renfort de la mission de police du ciel de l’OTAN avant l’été.',
    choix:[
      { texte:'Détacher des avions de chasse', requiert:{categorie:'AIR'}, effets:{ fatigue:[{categorie:'AIR', delta:6}], pression:[{theatre:'EST', delta:6}], credibilite:2, menace:[{type:'ETAT_EST', delta:-3}] } },
      { texte:'Envoyer une compagnie pour un exercice conjoint', effets:{ budget:-6, pression:[{theatre:'EST', delta:3}], credibilite:1 } },
      { texte:'Contribuer seulement au financement de la mission', effets:{ budget:-3, credibilite:-1 } }
    ] },

  // ---------- Demandes croisées des autres puissances ----------
  { id:'DP_DECONFLICTION', titre:'Moscou propose une ligne de déconfliction', auteur:'@diplomatie', nations:['FRA', 'GBR'], poids:4, max:1,
    cond:{ tourMin:4, puissance:{ id:'RUS', theatre:'LEVANT', min:1 } },
    texte:'L’aviation russe opère désormais dans le même ciel que la coalition. L’état-major russe propose un canal direct pour éviter les incidents. Accepter, c’est éviter un drame ; c’est aussi reconnaître sa présence.',
    choix:[
      { texte:'Accepter un canal militaire technique', effets:{ puissance:[{ id:'RUS', attitude:6 }], relation:[{allie:'USA', delta:-1}] } },
      { texte:'Accepter, à condition que Washington y participe', effets:{ capital:-1, puissance:[{ id:'RUS', attitude:3 }], relation:[{allie:'USA', delta:2}] } },
      { texte:'Refuser et dénoncer l’intervention russe', effets:{ credibilite:2, puissance:[{ id:'RUS', attitude:-6 }], alea:{ p:0.7, succes:{}, echec:{ opinion:-3, credibilite:-2 } } } }
    ] },
  { id:'DP_PARTAGE_FARDEAU', titre:'Washington réclame un partage du fardeau', auteur:'@chef', poids:3, max:2,
    cond:{ tourMin:10, puissance:{ id:'USA', min:6 } },
    texte:'Engagés sur tous les fronts, les États-Unis demandent à leurs alliés d’en faire davantage. Le message est passé au plus haut niveau, sans détour : « Nous ne pouvons pas tout porter seuls. »',
    choix:[
      { texte:'Annoncer un effort supplémentaire et le financer', effets:{ capital:-4, enveloppe:5, relation:[{allie:'USA', delta:5}] } },
      { texte:'Promettre une revue de notre effort, sans chiffre', effets:{ relation:[{allie:'USA', delta:-2}] } },
      { texte:'Rappeler notre effort actuel et refuser d’aller plus loin', effets:{ relation:[{allie:'USA', delta:-5}], credibilite:1, opinion:1 } }
    ] },
  { id:'DP_BASE_CHINOISE', titre:'La Chine ouvre une base militaire à Djibouti', auteur:'@diplomatie', poids:3, max:1,
    cond:{ tourMin:15, puissance:{ id:'CHN', theatre:'CORNE', min:1 } },
    texte:'Pékin inaugure sa première base militaire à l’étranger, à quelques kilomètres des installations occidentales de Djibouti. Elle se présente comme une base logistique contre la piraterie ; nos marins y voient surtout un poste d’écoute.',
    choix:[
      { texte:'Renforcer notre présence et nos moyens d’écoute', effets:{ budget:-5, rens:[{theatre:'CORNE', delta:6}], pression:[{theatre:'CORNE', delta:3}] } },
      { texte:'Proposer une coopération contre la piraterie', effets:{ puissance:[{ id:'CHN', attitude:6 }], relation:[{allie:'USA', delta:-2}], menace:[{type:'PIRATERIE', delta:-3}] } },
      { texte:'Observer sans réagir', effets:{ rens:[{theatre:'CORNE', delta:3}] } }
    ] },
  { id:'DP_MILICES_IRAK', titre:'Des milices pro-iraniennes près de nos positions', auteur:'@rens_ext', nations:['FRA', 'GBR'], poids:3, max:1,
    cond:{ tourMin:5, theatreDeploye:'LEVANT', puissance:{ id:'IRN', theatre:'LEVANT', min:1 } },
    texte:'{auteur} signale des milices soutenues par Téhéran à quelques kilomètres d’un de nos camps en Irak. Elles combattent Daech, comme nous, mais ont déjà menacé les forces occidentales dans leurs communiqués.',
    choix:[
      { texte:'Passer un message à Téhéran par un canal discret', effets:{ puissance:[{ id:'IRN', attitude:3 }], alea:{ p:0.6, succes:{}, echec:{ opinion:-2 } } } },
      { texte:'Renforcer la protection du camp', effets:{ fatigue:[{categorie:'TERRE', delta:5}], budget:-3 } },
      { texte:'Demander à Washington de dissuader Téhéran', effets:{ relation:[{allie:'USA', delta:-1}], puissance:[{ id:'IRN', theatre:'LEVANT', delta:-1, attitude:-4 }] } }
    ] },
  { id:'DP_FRAPPES_ISRAELIENNES', titre:'Frappes israéliennes en Syrie', auteur:'@diplomatie', nations:['FRA', 'GBR'], poids:3, max:1,
    cond:{ tourMin:6, puissance:{ id:'ISR', min:3 } },
    texte:'L’aviation israélienne a frappé des dépôts d’armes en Syrie, à proximité d’une zone survolée par la coalition. Personne n’avait été prévenu. Nos pilotes demandent des garanties.',
    choix:[
      { texte:'Demander un mécanisme de coordination', effets:{ puissance:[{ id:'ISR', attitude:2 }], credibilite:1 } },
      { texte:'Protester publiquement', effets:{ puissance:[{ id:'ISR', attitude:-5 }], credibilite:1, opinion:1 } },
      { texte:'Ne rien dire', effets:{ credibilite:-1 } }
    ] },
  { id:'DP_DEFENSE_AERIENNE_RUSSE', titre:'Moscou déploie une défense antiaérienne en Syrie', auteur:'@defense', nations:['ISR'], poids:4, max:1,
    cond:{ tourMin:4, puissance:{ id:'RUS', theatre:'SYRIE', min:1 } },
    texte:'La Russie installe des systèmes antiaériens modernes en Syrie. Nos frappes contre les transferts d’armes vers le Hezbollah deviennent risquées. {auteur} veut savoir s’il faut négocier avec Moscou ou passer outre.',
    choix:[
      { texte:'Négocier un mécanisme de déconfliction avec Moscou', effets:{ relation:[{allie:'RUS', delta:5}], capital:-1 } },
      { texte:'Poursuivre les frappes sans prévenir', effets:{ alea:{ p:0.6, succes:{ menace:[{type:'IRAN_SYRIE', delta:-6}] }, echec:{ relation:[{allie:'RUS', delta:-8}], opinion:-3 } } } },
      { texte:'Suspendre les frappes le temps d’y voir clair', effets:{ menace:[{type:'IRAN_SYRIE', delta:5}] } }
    ] },
  { id:'DP_NEGOCIATION_NUCLEAIRE', titre:'Washington négocie avec Téhéran', auteur:'@chef', nations:['ISR'], poids:3, max:1,
    cond:{ tourMin:3, tourMax:14, menace:{type:'NUCLEAIRE_IRAN', forceMin:30} },
    texte:'Les négociations sur le programme nucléaire iranien approchent d’un accord. Washington demande notre retenue ; nos services jugent les garanties de contrôle insuffisantes.',
    choix:[
      { texte:'Faire campagne contre l’accord au Congrès', effets:{ relation:[{allie:'USA', delta:-6}], opinion:3 } },
      { texte:'Négocier des garanties et une aide militaire en échange', effets:{ relation:[{allie:'USA', delta:3}], budget:8 } },
      { texte:'Préparer en silence une option militaire', effets:{ budget:-8, menace:[{type:'NUCLEAIRE_IRAN', delta:-2}], relation:[{allie:'USA', delta:-2}] } }
    ] }
];
