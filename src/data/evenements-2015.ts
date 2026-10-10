// Événements de la campagne 2015-2017 : fictifs mais plausibles, ancrés dans le contexte réel de janvier 2015.
// Les personnes citées sont fictives (voir personnages.ts) ; les institutions et les pays sont réels.
import type { EvenementDef } from '../sim/types';

export const EVENEMENTS_2015: EvenementDef[] = [
  // ---------- Après les attentats de janvier ----------
  { id:'UNITE_NATIONALE', titre:'L’élan d’unité nationale', poids:8, max:1, cond:{ tourMax:2 },
    texte:'Après les attentats et les grandes marches du 11 janvier, l’opinion attend des actes. La Première ministre, Claire Vautrin, vous demande quelles mesures porter devant le Parlement pendant que le consensus tient encore.',
    choix:[
      { texte:'Un plan de lutte antiterroriste : recrutements et moyens pour les services', effets:{ capital:-3, budget:-8, menace:[{type:'TERRO', delta:-5}], rens:[{theatre:'METRO', delta:6}] } },
      { texte:'Une réserve citoyenne et des mesures de cohésion', effets:{ opinion:4, budget:-4 } },
      { texte:'Ne pas légiférer dans l’émotion', effets:{ opinion:-3, credibilite:1 } }
    ] },
  { id:'PRISONS', titre:'Radicalisation en détention', poids:4, max:1, cond:{ tourMin:2 },
    texte:'Un rapport de l’inspection pénitentiaire décrit des détenus radicalisés qui recrutent dans les cours de promenade. Le renseignement pénitentiaire est embryonnaire.',
    choix:[
      { texte:'Créer des quartiers dédiés aux détenus radicalisés', effets:{ budget:-6, menace:[{type:'TERRO', delta:-4}], opinion:1 } },
      { texte:'Bâtir un véritable renseignement pénitentiaire', effets:{ capital:-1, rens:[{theatre:'METRO', delta:8}] } },
      { texte:'Renvoyer la question à la prochaine loi de programmation', effets:{ menace:[{type:'TERRO', delta:4}] } }
    ] },
  { id:'TRAIN_DEJOUE', titre:'Attaque déjouée dans un train international', poids:4, max:1, cond:{ tourMin:4, menace:{type:'TERRO', forceMin:35} },
    texte:'Un homme armé a été maîtrisé par des passagers dans un train reliant deux capitales européennes. Aucun mort, mais l’individu était signalé par plusieurs services. La ministre de l’Intérieur, Hélène Castagnet, est interpellée sur les contrôles dans les gares.',
    choix:[
      { texte:'Installer des portiques et des contrôles dans les grandes gares', effets:{ budget:-8, menaceInt:-3, opinion:-1 } },
      { texte:'Renforcer les patrouilles et l’échange d’informations européen', effets:{ fatigue:[{categorie:'INT', delta:6}], menaceInt:-2, relation:[{allie:'DEU', delta:2}] } },
      { texte:'Mettre en avant le courage des passagers et garder le cap', effets:{ opinion:3, menace:[{type:'TERRO', delta:2}] } }
    ] },
  { id:'MINISTRE_RENFORTS', titre:'L’Intérieur réclame des renforts', poids:3, max:1, cond:{ tourMin:3, menaceIntMin:45 },
    texte:'Hélène Castagnet, ministre de l’Intérieur, vous écrit : policiers et gendarmes cumulent les heures supplémentaires, et les grands événements de l’été approchent. Elle demande que les armées prennent une part plus large de la protection des sites.',
    choix:[
      { texte:'Accepter : les armées prennent le relais sur les sites sensibles', effets:{ menaceInt:-4, fatigue:[{categorie:'TERRE', delta:8}], budget:-5 } },
      { texte:'Financer des recrutements dans les forces de sécurité intérieure', effets:{ budget:-10, capital:-2, menace:[{type:'TERRO', delta:-3}] } },
      { texte:'Refuser : les armées sont déjà en limite d’emploi', effets:{ capital:-2, menaceInt:2 } }
    ] },

  // ---------- Russie ----------
  { id:'MISTRAL', titre:'Les navires vendus à la Russie', poids:6, max:1, cond:{ tourMin:1, tourMax:10 },
    texte:'Deux bâtiments de projection construits à Saint-Nazaire pour la Marine russe attendent leur livraison, suspendue à l’automne 2014 après l’annexion de la Crimée. Moscou exige une décision ; Washington et Varsovie surveillent la réponse française.',
    choix:[
      { texte:'Annuler le contrat et rembourser Moscou', effets:{ budget:-25, credibilite:5, relation:[{allie:'USA', delta:4}], menace:[{type:'ETAT_EST', delta:3}] } },
      { texte:'Livrer les navires : un contrat est un contrat', effets:{ credibilite:-8, relation:[{allie:'USA', delta:-8}, {allie:'UK', delta:-4}], menace:[{type:'ETAT_EST', delta:6}] } },
      { texte:'Repousser encore la décision', effets:{ capital:-2, credibilite:-2 }, suite:'MISTRAL_ULTIMATUM', suiteDelai:3 }
    ] },
  { id:'MISTRAL_ULTIMATUM', titre:'Ultimatum sur les navires', poids:0, max:1, cond:{ chaine:true },
    texte:'Moscou menace de saisir l’arbitrage international et réclame des pénalités. Les chantiers de Saint-Nazaire s’inquiètent pour leurs emplois.',
    choix:[
      { texte:'Annuler, rembourser et revendre les navires à un partenaire', effets:{ budget:-15, credibilite:3, relation:[{allie:'USA', delta:2}] } },
      { texte:'Livrer finalement', effets:{ credibilite:-10, relation:[{allie:'USA', delta:-10}], menace:[{type:'ETAT_EST', delta:6}] } }
    ] },
  { id:'SOUS_MARIN_BREST', titre:'Un sous-marin russe au large de Brest', poids:3, max:2, cond:{ menace:{type:'ETAT_EST', forceMin:35} },
    texte:'Les capteurs de la Marine signalent un sous-marin d’attaque russe à proximité des approches de l’Île Longue, d’où appareillent nos sous-marins nucléaires lanceurs d’engins.',
    choix:[
      { texte:'Le traquer avec avions de patrouille et frégates', requiert:{categorie:'MER'}, effets:{ fatigue:[{categorie:'MER', delta:8}], credibilite:2, menace:[{type:'ETAT_EST', delta:-3}] } },
      { texte:'Demander l’appui des avions de patrouille britanniques', effets:{ relation:[{allie:'UK', delta:-2}], rens:[{theatre:'EST', delta:5}] } },
      { texte:'Le suivre discrètement sans réaction visible', effets:{ rens:[{theatre:'EST', delta:4}], credibilite:-1 } }
    ] },
  { id:'NORMANDIE', titre:'Sommet de crise au format Normandie', poids:5, max:1, cond:{ tourMin:1, tourMax:8, menace:{type:'ETAT_EST', forceMin:30} },
    texte:'Une offensive séparatiste menace un nœud ferroviaire du Donbass. La chancelière Katharina Albrecht propose un sommet nocturne avec Kiev et Moscou. Le Président Lacassagne vous demande quelle ligne tenir.',
    choix:[
      { texte:'Porter un compromis ambitieux : cessez-le-feu et retrait des armes lourdes', effets:{ capital:-3, alea:{ p:0.5, succes:{ credibilite:6, menace:[{type:'ETAT_EST', delta:-10}] }, echec:{ credibilite:-3 } } } },
      { texte:'Laisser Berlin mener et soutenir sa position', effets:{ relation:[{allie:'DEU', delta:4}], credibilite:1 } },
      { texte:'Conditionner tout accord au maintien des sanctions', effets:{ relation:[{allie:'USA', delta:3}], menace:[{type:'ETAT_EST', delta:3}], credibilite:2 } }
    ] },
  { id:'CHAINE_PIRATEE', titre:'Une chaîne de télévision sabotée', poids:3, max:1, cond:{ tourMin:2, menace:{type:'CYBER', forceMin:30} },
    texte:'Une chaîne d’information à diffusion internationale a été mise hors d’antenne pendant une nuit. Les pirates se réclament du djihad, mais l’ANSSI relève des traces qui évoquent un service de renseignement étatique.',
    choix:[
      { texte:'Attribuer publiquement l’attaque à un État', effets:{ alea:{ p:0.5, succes:{ credibilite:4, menace:[{type:'CYBER', delta:-5}] }, echec:{ credibilite:-4 } }, menace:[{type:'ETAT_EST', delta:2}] } },
      { texte:'Durcir en urgence les opérateurs d’importance vitale', effets:{ budget:-6, menace:[{type:'CYBER', delta:-6}] } },
      { texte:'Traiter l’affaire comme un acte terroriste', effets:{ opinion:1, menace:[{type:'CYBER', delta:3}] } }
    ] },

  // ---------- Corée du Nord et Indo-Pacifique ----------
  { id:'ESSAI_NUCLEAIRE', titre:'Quatrième essai nucléaire nord-coréen', poids:4, max:1, cond:{ tourMin:6, menace:{type:'COREE_NORD', forceMin:45} },
    texte:'Pyongyang annonce un essai réussi et revendique une arme « miniaturisée ». Tokyo et Séoul demandent une réaction ferme du Conseil de sécurité, où la France dispose d’un siège permanent.',
    choix:[
      { texte:'Porter un projet de sanctions renforcées au Conseil de sécurité', effets:{ capital:-1, credibilite:3, relation:[{allie:'JPN', delta:5}, {allie:'USA', delta:2}], menace:[{type:'COREE_NORD', delta:-4}] } },
      { texte:'Proposer une médiation européenne', effets:{ alea:{ p:0.3, succes:{ credibilite:6, menace:[{type:'COREE_NORD', delta:-8}] }, echec:{ credibilite:-3 } } } },
      { texte:'S’en tenir à une condamnation', effets:{ credibilite:-2 } }
    ] },
  { id:'TRANSBORDEMENTS', titre:'Transbordements illicites en mer', poids:3, max:2, cond:{ tourMin:4, menace:{type:'COREE_NORD', forceMin:30} },
    texte:'Des pétroliers transfèrent leur cargaison en pleine mer vers des navires nord-coréens, en violation des sanctions. Le Japon propose à la France de participer à la surveillance.',
    choix:[
      { texte:'Engager une frégate et un avion de patrouille maritime', requiert:{categorie:'MER'}, effets:{ fatigue:[{categorie:'MER', delta:8}], budget:-4, relation:[{allie:'JPN', delta:5}], menace:[{type:'COREE_NORD', delta:-6}] } },
      { texte:'Partager nos images satellitaires', effets:{ relation:[{allie:'JPN', delta:3}], menace:[{type:'COREE_NORD', delta:-2}] } },
      { texte:'Décliner : nos moyens sont pris ailleurs', effets:{ relation:[{allie:'JPN', delta:-3}] } }
    ] },
  { id:'MISSILE_JAPON', titre:'Missile au-dessus du Japon', poids:3, max:1, cond:{ tourMin:10, menace:{type:'COREE_NORD', forceMin:50} },
    texte:'Un missile balistique nord-coréen a survolé l’archipel japonais avant de tomber dans le Pacifique. Les sirènes ont retenti à Hokkaido. Tokyo demande des gestes de solidarité concrets.',
    choix:[
      { texte:'Organiser un exercice naval conjoint dans la zone', requiert:{categorie:'MER'}, effets:{ fatigue:[{categorie:'MER', delta:6}], credibilite:3, relation:[{allie:'JPN', delta:6}, {allie:'AUS', delta:2}] } },
      { texte:'Déclaration commune avec le G7', effets:{ credibilite:1, relation:[{allie:'JPN', delta:2}] } },
      { texte:'Appeler toutes les parties à la retenue', effets:{ relation:[{allie:'JPN', delta:-4}, {allie:'USA', delta:-2}] } }
    ] },

  // ---------- Services ----------
  { id:'ALERTE_DGSE', titre:'Mise en garde du directeur de la DGSE', poids:3, max:1, cond:{ tourMin:3, rensMin:{theatre:'LEVANT', val:1} },
    texte:'Philippe Maurand, directeur général de la sécurité extérieure, demande à vous voir seul. Ses sources au Levant décrivent des cellules entraînées pour frapper en Europe, mais elles s’épuisent et deux ont disparu.',
    choix:[
      { texte:'Lui donner les moyens de reconstituer son réseau', effets:{ budget:-6, rens:[{theatre:'LEVANT', delta:10}], menace:[{type:'TERRO', delta:-3}] } },
      { texte:'Partager l’alerte avec nos partenaires européens', effets:{ relation:[{allie:'DEU', delta:2}, {allie:'UK', delta:2}], rens:[{theatre:'METRO', delta:5}] } },
      { texte:'Lui demander des éléments plus solides', effets:{ menace:[{type:'TERRO', delta:3}] } }
    ] }
];
