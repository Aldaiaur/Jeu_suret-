// Dossiers d’Israël, tirés de la fiche nation-ISR.md (décision, coalition, campagne entre les guerres, Gaza, Iran).
// Ce sont des possibles : ils se déclenchent selon l’état de la partie et ne reproduisent aucun événement réel
// postérieur à janvier 2015. Personnages fictifs, institutions et lieux réels. Les pertes civiles sont toujours un coût.
import type { EvenementDef } from '../sim/types';

export const EVENEMENTS_ISR: EvenementDef[] = [
  // ---------- Campagne entre les guerres ----------
  { id:'ISR_CONVOI', titre:'Un convoi d’armes vers le Hezbollah', auteur:'ISR_AMAN', poids:4, max:2, cond:{ tourMin:1, menace:{type:'HEZBOLLAH', forceMin:45} },
    texte:'L’unité 8200 suit un convoi de missiles sol-air qui quitte un dépôt près de Damas pour le Liban. Le général Ofer Tzur estime qu’il franchira la frontière dans la nuit.',
    choix:[
      { texte:'Frapper sans revendiquer', effets:{ menace:[{type:'HEZBOLLAH', delta:-5}], alea:{ p:0.85, succes:{ credibilite:1 }, echec:{ menace:[{type:'IRAN_SYRIE', delta:3}] } } } },
      { texte:'Frapper et le revendiquer publiquement', effets:{ opinion:2, credibilite:3, menace:[{type:'HEZBOLLAH', delta:-5}], alea:{ p:0.6, succes:{}, echec:{ crise:'LIBAN' } } } },
      { texte:'Laisser passer et surveiller la livraison', effets:{ rens:[{theatre:'LIBAN', delta:6}], menace:[{type:'HEZBOLLAH', delta:5}] } }
    ] },
  { id:'ISR_PRECISION', titre:'Le Hezbollah veut des missiles de précision', auteur:'ISR_MOSSAD', poids:3, max:1, cond:{ tourMin:10, menace:{type:'HEZBOLLAH', forceMin:45} },
    texte:'Le Mossad a localisé des ateliers où des ingénieurs iraniens transforment des roquettes en missiles guidés, au cœur de quartiers habités. Nimrod Katzir propose plusieurs options.',
    choix:[
      { texte:'Révéler publiquement les sites, avec les preuves', effets:{ credibilite:3, menace:[{type:'HEZBOLLAH', delta:-3}], relation:[{allie:'USA', delta:2}] } },
      { texte:'Saboter la chaîne d’approvisionnement', effets:{ budget:-6, menace:[{type:'HEZBOLLAH', delta:-5}], alea:{ p:0.7, succes:{}, echec:{ credibilite:-2 } } } },
      { texte:'Frapper les ateliers malgré les habitants alentour', effets:{ credibilite:-5, opinion:1, menace:[{type:'HEZBOLLAH', delta:-8}], relation:[{allie:'USA', delta:-2}], alea:{ p:0.5, succes:{}, echec:{ crise:'LIBAN' } } } }
    ] },
  { id:'ISR_DRONE_IRANIEN', titre:'Un drone iranien abattu au-dessus de notre territoire', auteur:'ISR_AMAN', poids:4, max:1, cond:{ tourMin:18, menace:{type:'IRAN_SYRIE', forceMin:45} },
    texte:'Un hélicoptère a abattu un drone chargé d’explosifs, lancé depuis une base aérienne syrienne où opèrent des Gardiens de la révolution. C’est la première attaque directe de l’Iran contre nous.',
    choix:[
      { texte:'Frapper la base de lancement et ses défenses', effets:{ alea:{ p:0.7, succes:{ credibilite:4, menace:[{type:'IRAN_SYRIE', delta:-8}] }, echec:{ credibilite:-3, opinion:-2 } } } },
      { texte:'Protester par le canal russe', effets:{ relation:[{allie:'RUS', delta:2}], menace:[{type:'IRAN_SYRIE', delta:3}] } },
      { texte:'Présenter les débris au Conseil de sécurité', effets:{ credibilite:1, relation:[{allie:'USA', delta:1}] } }
    ] },
  { id:'ISR_AVION_RUSSE', titre:'Un avion russe abattu pendant notre raid', auteur:'ISR_DEF', poids:3, max:1, cond:{ tourMin:20, menace:{type:'IRAN_SYRIE', forceMin:40} },
    texte:'Pendant un de nos raids sur la côte syrienne, la défense antiaérienne syrienne a abattu par erreur un avion de reconnaissance russe. Moscou nous accuse. Yossi Harel-Amit veut une réponse ferme.',
    choix:[
      { texte:'Envoyer une délégation militaire à Moscou', effets:{ capital:-1, relation:[{allie:'RUS', delta:4}] } },
      { texte:'Rejeter toute responsabilité', effets:{ credibilite:1, relation:[{allie:'RUS', delta:-6}] } },
      { texte:'Suspendre les frappes quelques semaines', effets:{ relation:[{allie:'RUS', delta:2}], menace:[{type:'IRAN_SYRIE', delta:6}] } }
    ] },

  // ---------- Iran ----------
  { id:'ISR_ACCORD', titre:'Un accord sur le nucléaire iranien se dessine', auteur:'ISR_PM', poids:5, max:1, cond:{ tourMin:4, tourMax:12 },
    texte:'Les grandes puissances s’approchent d’un accord avec Téhéran : enrichissement limité, inspections, levée des sanctions. Avraham Ben-Dor hésite à affronter publiquement Washington.',
    choix:[
      { texte:'S’opposer publiquement à l’accord, jusque devant le Congrès', effets:{ opinion:3, relation:[{allie:'USA', delta:-6}], credibilite:-1 } },
      { texte:'Négocier des garanties et une aide militaire accrue', effets:{ capital:-2, budget:10, relation:[{allie:'USA', delta:3}] } },
      { texte:'Préparer en silence une option clandestine', effets:{ budget:-5, rens:[{theatre:'IRAN', delta:8}] } }
    ] },
  { id:'ISR_ARCHIVES', titre:'Des archives nucléaires à portée de main', auteur:'ISR_MOSSAD', poids:3, max:1, cond:{ tourMin:24, menace:{type:'NUCLEAIRE_IRAN', forceMin:40} },
    texte:'Le Mossad a localisé un entrepôt anodin, à Téhéran, où l’Iran conserve les archives de son ancien programme d’armement. Une équipe pourrait les emporter en une nuit.',
    choix:[
      { texte:'Lancer l’opération', effets:{ alea:{ p:0.65, succes:{ credibilite:5, menace:[{type:'NUCLEAIRE_IRAN', delta:-5}], relation:[{allie:'USA', delta:4}] }, echec:{ credibilite:-4, opinion:-3 } } } },
      { texte:'Se contenter de les photographier discrètement', effets:{ rens:[{theatre:'IRAN', delta:10}] } },
      { texte:'Renoncer : le risque est trop grand', effets:{} }
    ] },

  // ---------- Gaza ----------
  { id:'ISR_MARCHE', titre:'Des manifestations massives à la clôture de Gaza', auteur:'ISR_SUD', poids:4, max:1, cond:{ tourMin:20, menace:{type:'HAMAS', forceMin:45} },
    texte:'Des dizaines de milliers de Gazaouis manifestent chaque vendredi le long de la clôture ; certains tentent de la franchir, d’autres lancent des cerfs-volants incendiaires. La générale Dalia Ben-Ami demande des ordres d’ouverture du feu clairs.',
    choix:[
      { texte:'Moyens non létaux et ordres de feu très restrictifs', effets:{ budget:-4, credibilite:2, menaceInt:3 } },
      { texte:'Tir réel contre quiconque approche de la clôture', effets:{ opinion:1, credibilite:-8, relation:[{allie:'USA', delta:-2}, {allie:'EGY', delta:-3}] } },
      { texte:'Négocier par l’Égypte des allègements du blocus', effets:{ capital:-3, menace:[{type:'HAMAS', delta:-3}], relation:[{allie:'EGY', delta:3}] } }
    ] },
  { id:'ISR_COALITION_GAZA', titre:'Un partenaire de coalition exige la fermeté', auteur:'ISR_COALITION', poids:4, max:2, cond:{ tourMin:3, menace:{type:'HAMAS', forceMin:50} },
    texte:'Après de nouveaux tirs de roquettes, Aryeh Tal-Mor menace de quitter la coalition si le gouvernement accepte une nouvelle trêve. Sans ses sièges, la majorité ne tient qu’à une voix.',
    choix:[
      { texte:'Céder : frappes plus nombreuses sur Gaza', effets:{ pression:[{theatre:'GAZA', delta:8}], credibilite:-3, relation:[{allie:'EGY', delta:-2}] } },
      { texte:'Refuser et maintenir la trêve', effets:{ capital:-8, menace:[{type:'HAMAS', delta:-2}] } },
      { texte:'Lui offrir des contreparties budgétaires', effets:{ budget:-6, capital:-2 } }
    ] },
  { id:'ISR_RAID_DECOUVERT', titre:'Une équipe de forces spéciales découverte à Gaza', auteur:'ISR_CEMG', poids:3, max:1, cond:{ tourMin:28, menace:{type:'HAMAS', forceMin:40} },
    texte:'Une équipe infiltrée à Khan Younès a été démasquée. Un officier est tombé, les autres se replient sous le feu. Le général Eitan Bar-Lavi doit couvrir l’exfiltration.',
    choix:[
      { texte:'Couvrir l’exfiltration par des frappes, puis accepter un cessez-le-feu', effets:{ credibilite:-2, capital:-6, menace:[{type:'HAMAS', delta:2}] } },
      { texte:'Riposter massivement aux tirs qui suivent', effets:{ opinion:2, credibilite:-4, crise:'GAZA' } },
      { texte:'Demander à l’Égypte d’arracher une trêve immédiate', effets:{ capital:-3, relation:[{allie:'EGY', delta:2}] } }
    ] },

  // ---------- Liban ----------
  { id:'ISR_TUNNELS', titre:'Des tunnels sous la frontière nord', auteur:'ISR_NORD', poids:4, max:1, cond:{ tourMin:12, menace:{type:'HEZBOLLAH', forceMin:50} },
    texte:'Des capteurs sismiques et des forages confirment plusieurs tunnels creusés depuis le Liban sous nos villages frontaliers. Le général Moshe Levanon veut les détruire avant qu’ils ne servent.',
    choix:[
      { texte:'Opération du génie, côté israélien', effets:{ budget:-8, menace:[{type:'HEZBOLLAH', delta:-6}], credibilite:3, opinion:2 } },
      { texte:'Les surveiller pour piéger leurs utilisateurs', effets:{ rens:[{theatre:'LIBAN', delta:8}] } },
      { texte:'Saisir la FINUL et le Conseil de sécurité', effets:{ credibilite:2, relation:[{allie:'USA', delta:1}] } }
    ] },

  // ---------- Territoire ----------
  { id:'ISR_ATTAQUES_ISOLEES', titre:'Une vague d’attaques isolées', auteur:'ISR_SHINBET', poids:4, max:1, cond:{ tourMin:6, menace:{type:'TERRO', forceMin:40} },
    texte:'Des attaques au couteau et à la voiture-bélier se succèdent, souvent menées par de jeunes gens sans lien avec une organisation. Ilan Rosenthal met en garde contre les punitions collectives.',
    choix:[
      { texte:'Renforts de sécurité dans les lieux exposés', effets:{ menaceInt:-5, budget:-4 } },
      { texte:'Surveiller les réseaux sociaux pour repérer les signaux faibles', effets:{ capital:-1, rens:[{theatre:'ISRAEL', delta:6}], menace:[{type:'TERRO', delta:-4}] } },
      { texte:'Bouclages et mesures collectives', effets:{ opinion:2, menaceInt:-3, credibilite:-4 } }
    ] },
  { id:'ISR_SOLDAT_JUGE', titre:'Un soldat a abattu un assaillant neutralisé', auteur:'ISR_CEMG', poids:3, max:1, cond:{ tourMin:8 },
    texte:'Une vidéo montre un soldat tirant sur un assaillant blessé et déjà maîtrisé. L’état-major veut des poursuites ; une partie de la coalition prend la défense du soldat.',
    choix:[
      { texte:'Soutenir l’état-major et la justice militaire', effets:{ capital:-4, credibilite:3 } },
      { texte:'Prendre publiquement la défense du soldat', effets:{ opinion:3, capital:1, credibilite:-5 } },
      { texte:'Rester en retrait et laisser la justice suivre son cours', effets:{ capital:-1 } }
    ] },
  { id:'ISR_INTERCEPTEURS', titre:'Les intercepteurs s’épuisent', auteur:'ISR_DEF', poids:3, max:1, cond:{ tourMin:2, menaceIntMin:50 },
    texte:'Après plusieurs semaines de tirs, les stocks d’intercepteurs baissent dangereusement. Yossi Harel-Amit veut une commande d’urgence.',
    choix:[
      { texte:'Commande d’urgence à l’industrie', effets:{ budget:-12, menaceInt:-3 } },
      { texte:'Demander un renfort américain', effets:{ relation:[{allie:'USA', delta:-1}], appui:{allie:'USA', appui:'ANTIMISSILE', theatre:'ISRAEL', tours:4} } },
      { texte:'Réserver les intercepteurs aux villes', effets:{ menaceInt:4, opinion:-2 } }
    ] },
  { id:'ISR_CONTROLEUR', titre:'Le Contrôleur de l’État publie son rapport', auteur:'ISR_NSC', poids:2, max:1, cond:{ tourMin:18 },
    texte:'Le Contrôleur de l’État accuse le gouvernement de ne pas avoir informé le Cabinet de sécurité d’une menace majeure avant la dernière guerre. Rina Meidan propose de réformer la circulation du renseignement.',
    choix:[
      { texte:'Réformer l’information du Cabinet', effets:{ capital:-2, credibilite:2, rens:[{theatre:'ISRAEL', delta:4}] } },
      { texte:'Contester les conclusions', effets:{ opinion:-3 } }
    ] },
  { id:'ISR_SOUS_MARINS', titre:'Une commande de sous-marins sous enquête', auteur:'ISR_NSC', poids:2, max:1, cond:{ tourMin:20 },
    texte:'La police enquête sur des soupçons de corruption autour d’une commande de sous-marins et de corvettes à un chantier allemand. Des proches du gouvernement sont cités.',
    choix:[
      { texte:'Laisser l’enquête se dérouler', effets:{ capital:-4, credibilite:2 } },
      { texte:'Geler la commande en attendant', effets:{ budget:8, credibilite:-1 } },
      { texte:'Défendre publiquement le contrat', effets:{ opinion:-3 } }
    ] },

  // ---------- Partenaires ----------
  { id:'ISR_SINAI_SECRET', titre:'Le Caire demande des frappes discrètes', auteur:'ISR_MOSSAD', poids:3, max:1, cond:{ tourMin:6, menace:{type:'SINAI_EI', forceMin:40} },
    texte:'L’armée égyptienne ne parvient pas à contenir la Province du Sinaï. Le Caire accepte, à condition que rien ne se sache, que nos drones et nos avions frappent les groupes près de notre frontière.',
    choix:[
      { texte:'Accepter : frappes secrètes', effets:{ pression:[{theatre:'SINAI', delta:8}], relation:[{allie:'EGY', delta:5}], alea:{ p:0.8, succes:{}, echec:{ relation:[{allie:'EGY', delta:-5}], opinion:-1 } } } },
      { texte:'Partager seulement du renseignement', effets:{ rens:[{theatre:'SINAI', delta:6}], relation:[{allie:'EGY', delta:2}] } },
      { texte:'Refuser', effets:{ relation:[{allie:'EGY', delta:-3}], menace:[{type:'SINAI_EI', delta:3}] } }
    ] },
  { id:'ISR_JORDANIE', titre:'Amman s’inquiète du sud de la Syrie', auteur:'ISR_PM', poids:2, max:1, cond:{ tourMin:10, menace:{type:'IRAN_SYRIE', forceMin:40} },
    texte:'La Jordanie craint de voir des milices pro-iraniennes s’installer près de sa frontière. Elle propose une coordination discrète du renseignement.',
    choix:[
      { texte:'Coordonner le renseignement', effets:{ relation:[{allie:'JOR', delta:5}], rens:[{theatre:'SYRIE', delta:5}] } },
      { texte:'Aider les rebelles du Sud (aide humanitaire et armes légères)', effets:{ budget:-4, partenaire:[{theatre:'SYRIE', delta:5}], relation:[{allie:'RUS', delta:-2}] } }
    ] },
  { id:'ISR_DECONFLICTION', titre:'Moscou propose un canal militaire direct', auteur:'ISR_DEF', poids:3, max:1, cond:{ tourMin:8 },
    texte:'L’intervention russe en Syrie met nos avions au contact de la défense aérienne russe. Moscou propose un mécanisme de déconfliction entre états-majors.',
    choix:[
      { texte:'Accepter le mécanisme', effets:{ relation:[{allie:'RUS', delta:6}], credibilite:1 } },
      { texte:'Le limiter à une ligne d’urgence', effets:{ relation:[{allie:'RUS', delta:2}] } },
      { texte:'Refuser : la Syrie reste notre espace d’action', effets:{ relation:[{allie:'RUS', delta:-4}], credibilite:1 } }
    ] }
];
