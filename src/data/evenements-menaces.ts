// Événements tirés de la fiche des acteurs non étatiques et de la chronologie 2015-2018
// (docs/recherche/resultats/). Ce sont des possibles : ils se déclenchent selon l’état de la partie
// et ne reproduisent aucun événement réel postérieur à janvier 2015. Lieux génériques, personnages fictifs.
import type { EvenementDef } from '../sim/types';

export const EVENEMENTS_MENACES: EvenementDef[] = [
  // ---------- Sahel : attaques complexes, recomposition des groupes (JNIM, 2017, en montée) ----------
  { id:'HOTEL_CAPITALE', titre:'Prise d’otages dans un hôtel', auteur:'FRA_SAHEL', poids:3, max:1, cond:{ tourMin:6, menace:{type:'DJIHAD', forceMin:55} },
    texte:'Un commando a pris d’assaut un hôtel fréquenté par des expatriés dans une capitale sahélienne. Les forces locales encerclent le bâtiment ; plusieurs ressortissants français seraient à l’intérieur. Le général Loïc Kerdraon, commandant de la force au Sahel, attend vos ordres.',
    choix:[
      { texte:'Engager les forces spéciales en appui des unités locales', requiert:{categorie:'FS'}, effets:{ fatigue:[{categorie:'FS', delta:10}], alea:{ p:0.65, succes:{ opinion:3, credibilite:4, menace:[{type:'DJIHAD', delta:-6}] }, echec:{ opinion:-4, credibilite:-2 } } } },
      { texte:'Laisser l’assaut aux forces locales, avec notre renseignement', effets:{ partenaire:[{theatre:'SAHEL', delta:3}], alea:{ p:0.45, succes:{ credibilite:2 }, echec:{ opinion:-5 } } } },
      { texte:'Se limiter à l’évacuation des ressortissants une fois l’assaut terminé', effets:{ opinion:-2, credibilite:-3 } }
    ] },
  { id:'FUSION_KATIBAS', titre:'Les groupes sahéliens se rapprochent', auteur:'FRA_DGSE', poids:3, max:1, cond:{ tourMin:12, menace:{type:'DJIHAD', forceMin:50} },
    texte:'La DGSE intercepte des échanges entre plusieurs katibas jusque-là rivales : elles discutent d’une bannière commune et d’un partage des zones. Philippe Maurand estime qu’une fusion donnerait au mouvement un ancrage dans les conflits locaux du centre du Mali.',
    choix:[
      { texte:'Cibler les chefs avant la fusion', requiert:{categorie:'FS'}, effets:{ fatigue:[{categorie:'FS', delta:8}], capital:-2, alea:{ p:0.55, succes:{ menace:[{type:'DJIHAD', delta:-10}] }, echec:{ menace:[{type:'DJIHAD', delta:3}], opinion:-2 } } } },
      { texte:'Financer la médiation entre communautés du centre', effets:{ budget:-8, partenaire:[{theatre:'SAHEL', delta:5}], menace:[{type:'DJIHAD', delta:-3}] } },
      { texte:'Laisser faire et observer', effets:{ rens:[{theatre:'SAHEL', delta:6}], menace:[{type:'DJIHAD', delta:7}] } }
    ] },
  { id:'CAMP_MORTIERS', titre:'Tirs de mortier sur un camp partagé', auteur:'FRA_SAHEL', poids:3, max:2, cond:{ tourMin:3, theatreDeploye:'SAHEL', menace:{type:'DJIHAD', forceMin:45} },
    texte:'Un camp que nos forces partagent avec des casques bleus a essuyé des tirs de mortier et une tentative de véhicule piégé. Pas de victime française, mais les contingents onusiens réclament une protection renforcée.',
    choix:[
      { texte:'Renforcer la protection du camp (radars de contre-batterie, patrouilles)', effets:{ budget:-5, fatigue:[{categorie:'TERRE', delta:6}], credibilite:2 } },
      { texte:'Riposter sur les zones de tir identifiées', effets:{ pression:[{theatre:'SAHEL', delta:8}], alea:{ p:0.75, succes:{ menace:[{type:'DJIHAD', delta:-4}] }, echec:{ credibilite:-3, opinion:-2 } } } },
      { texte:'Laisser l’ONU gérer sa propre protection', effets:{ credibilite:-3, relation:[{allie:'DEU', delta:-2}] } }
    ] },
  { id:'CHINOOK_UK', titre:'Londres propose des hélicoptères lourds', auteur:'FRA_DEF', poids:3, max:1, cond:{ tourMin:12, theatreDeploye:'SAHEL', relationMin:{allie:'UK', val:62} },
    texte:'Fiona Mackenzie-Hale, secrétaire d’État britannique à la Défense, propose de détacher des hélicoptères lourds au profit de notre force au Sahel, au nom de la coopération de Lancaster House. En échange, Londres attend un geste sur le flanc est.',
    choix:[
      { texte:'Accepter et renforcer notre présence avancée à l’est', effets:{ appui:{allie:'UK', appui:'HELICOS', theatre:'SAHEL', tours:6}, pression:[{theatre:'EST', delta:4}], budget:-4 } },
      { texte:'Accepter sans contrepartie', effets:{ appui:{allie:'UK', appui:'HELICOS', theatre:'SAHEL', tours:4}, relation:[{allie:'UK', delta:-5}] } },
      { texte:'Décliner poliment', effets:{ relation:[{allie:'UK', delta:-2}] } }
    ] },

  // ---------- Lac Tchad (Boko Haram puis branche ralliée à Daech) ----------
  { id:'LAC_TCHAD', titre:'N’Djamena demande de l’aide autour du lac', auteur:'FRA_CEMA', poids:4, max:2, cond:{ tourMin:1, menace:{type:'BOKO_HARAM', forceMin:45} },
    texte:'Les armées riveraines du lac Tchad lancent une contre-offensive contre l’insurrection. Le Tchad, pilier de notre dispositif sahélien, demande du renseignement aérien et des frappes ponctuelles.',
    choix:[
      { texte:'Fournir renseignement et frappes ponctuelles', requiert:{categorie:'AIR'}, effets:{ fatigue:[{categorie:'AIR', delta:6}], menace:[{type:'BOKO_HARAM', delta:-8}], partenaire:[{theatre:'GUINEE', delta:4}] } },
      { texte:'Partager seulement le renseignement', effets:{ menace:[{type:'BOKO_HARAM', delta:-3}], partenaire:[{theatre:'GUINEE', delta:2}] } },
      { texte:'Refuser : nos moyens sont comptés', effets:{ credibilite:-2, menace:[{type:'BOKO_HARAM', delta:3}, {type:'DJIHAD', delta:2}] } }
    ] },
  { id:'SCISSION_LAC', titre:'Scission dans l’insurrection du lac Tchad', auteur:'FRA_DRM', poids:2, max:1, cond:{ tourMin:15, menace:{type:'BOKO_HARAM', forceMin:25} },
    texte:'Une faction ralliée à Daech conteste le chef historique du mouvement. Les deux branches s’affrontent, mais la nouvelle se montre plus disciplinée et cible d’abord les militaires.',
    choix:[
      { texte:'Exploiter la division par le renseignement', effets:{ rens:[{theatre:'GUINEE', delta:8}], menace:[{type:'BOKO_HARAM', delta:-5}] } },
      { texte:'Former les armées riveraines à contrer la nouvelle branche', effets:{ budget:-6, partenaire:[{theatre:'GUINEE', delta:6}] } },
      { texte:'Ne rien changer', effets:{ menace:[{type:'BOKO_HARAM', delta:3}] } }
    ] },

  // ---------- Corne de l’Afrique ----------
  { id:'DJIBOUTI_MENACE', titre:'Menace sur les emprises de Djibouti', auteur:'FRA_FFDJ', poids:3, max:2, cond:{ menace:{type:'SHABAAB', forceMin:40} },
    texte:'Le général Étienne Maupoint, commandant des forces françaises à Djibouti, signale des repérages autour de lieux fréquentés par nos militaires et leurs familles. Les autorités djiboutiennes proposent une coopération étroite.',
    choix:[
      { texte:'Durcir la protection et restreindre les sorties', effets:{ budget:-3, opinion:-1, menace:[{type:'SHABAAB', delta:-5}] } },
      { texte:'Monter une opération conjointe avec les services djiboutiens', effets:{ rens:[{theatre:'CORNE', delta:8}], alea:{ p:0.6, succes:{ menace:[{type:'SHABAAB', delta:-10}] }, echec:{ credibilite:-2 } } } },
      { texte:'Maintenir le dispositif actuel', effets:{ menace:[{type:'SHABAAB', delta:4}] } }
    ] },

  // ---------- Golfe de Guinée : mutation vers les enlèvements d’équipages (IMB, 2018) ----------
  { id:'ENLEVEMENT_MARINS', titre:'Équipage enlevé au large du Delta', auteur:'FRA_MAE', poids:3, max:2, cond:{ tourMin:4, menace:{type:'PIRATERIE', forceMin:40, theatre:'GUINEE'} },
    texte:'Des pirates ont abordé un navire de ravitaillement pétrolier et emmené plusieurs marins, dont un Français, vers les criques du Delta. L’armateur négocie déjà ; la marine nigériane propose une opération commune.',
    choix:[
      { texte:'Engager un bâtiment et coordonner avec la marine nigériane', requiert:{categorie:'MER'}, effets:{ fatigue:[{categorie:'MER', delta:6}], relation:[{allie:'NGA', delta:4}], menace:[{type:'PIRATERIE', delta:-6, theatre:'GUINEE'}] } },
      { texte:'Soutenir la coopération régionale de sûreté maritime', effets:{ budget:-4, partenaire:[{theatre:'GUINEE', delta:5}] } },
      { texte:'Laisser l’armateur négocier', effets:{ opinion:-2, menace:[{type:'PIRATERIE', delta:4, theatre:'GUINEE'}] } }
    ] },

  // ---------- Libye : implantation de Daech sur la côte ----------
  { id:'VILLE_COTIERE', titre:'Daech s’empare d’une ville côtière libyenne', auteur:'FRA_DGSE', poids:4, max:1, cond:{ tourMin:3, menace:{type:'DAECH', forceMin:30, theatre:'LIBYE'} },
    texte:'Profitant de la rivalité entre les deux gouvernements libyens, une branche de Daech contrôle désormais une ville du littoral et son port. Rome s’inquiète des flux vers la Sicile ; Washington envisage des frappes.',
    choix:[
      { texte:'Envoyer des forces spéciales conseiller les milices qui l’assiègent', requiert:{categorie:'FS'}, effets:{ fatigue:[{categorie:'FS', delta:8}], rens:[{theatre:'LIBYE', delta:10}], partenaire:[{theatre:'LIBYE', delta:5}] } },
      { texte:'Appuyer une campagne de frappes américaine', effets:{ appui:{allie:'USA', appui:'FRAPPES', theatre:'LIBYE', tours:4}, relation:[{allie:'ITA', delta:3}], capital:-2 } },
      { texte:'Rester en dehors du chaos libyen', effets:{ menace:[{type:'DAECH', delta:6, theatre:'LIBYE'}], relation:[{allie:'ITA', delta:-4}] } }
    ] },

  // ---------- Territoire national ----------
  { id:'SENTINELLE_CIBLE', titre:'Des soldats en patrouille agressés', auteur:'FRA_CEMA', poids:3, max:2, cond:{ tourMin:1, theatreDeploye:'METRO', menace:{type:'TERRO', forceMin:40} },
    texte:'Un homme armé d’un couteau a attaqué une patrouille militaire devant un lieu de culte. Les soldats l’ont maîtrisé sans tirer. La question de la vulnérabilité des patrouilles statiques revient au premier plan.',
    choix:[
      { texte:'Rendre les patrouilles mobiles et imprévisibles', effets:{ fatigue:[{categorie:'INT', delta:4}], menaceInt:-2 } },
      { texte:'Saluer le sang-froid des soldats et maintenir le dispositif', effets:{ opinion:2 } },
      { texte:'Réduire la présence militaire dans les rues', effets:{ menaceInt:3, capital:2 } }
    ] },
  // ---------- Crises entre États (la chronologie 2017-2018 montre leur montée) ----------
  { id:'LIGNE_ROUGE_CHIMIQUE', titre:'Allégations d’emploi d’armes chimiques', auteur:'FRA_MAE', poids:3, max:1, cond:{ tourMin:16, menace:{type:'DAECH', forceMin:30, theatre:'LEVANT'} },
    texte:'Des images montrent des civils suffoquant après un bombardement dans une banlieue assiégée. Les premiers prélèvements évoquent un agent chimique. Washington et Londres consultent Paris : une riposte commune est envisagée.',
    choix:[
      { texte:'Frappes punitives limitées sur des sites liés au programme', requiert:{categorie:'AIR'}, effets:{ capital:-3, fatigue:[{categorie:'AIR', delta:6}], relation:[{allie:'USA', delta:4}, {allie:'UK', delta:3}], alea:{ p:0.75, succes:{ credibilite:6 }, echec:{ credibilite:-2, opinion:-2 } } } },
      { texte:'Exiger une enquête internationale et des sanctions ciblées', effets:{ credibilite:1, relation:[{allie:'DEU', delta:2}] } },
      { texte:'Ne pas réagir faute de preuve définitive', effets:{ credibilite:-6, relation:[{allie:'USA', delta:-3}] } }
    ] },
  { id:'EMPOISONNEMENT', titre:'Un ancien agent empoisonné chez un allié', auteur:'FRA_DGSE', poids:2, max:1, cond:{ tourMin:18, menace:{type:'ETAT_EST', forceMin:45} },
    texte:'Un ancien officier de renseignement réfugié dans un pays allié a été retrouvé inconscient, empoisonné par un agent neurotoxique militaire. Notre allié demande une réponse coordonnée : expulsions de diplomates et mesures contre les réseaux de renseignement.',
    choix:[
      { texte:'Expulser des agents sous couverture diplomatique', effets:{ credibilite:3, relation:[{allie:'UK', delta:6}, {allie:'USA', delta:2}], menace:[{type:'ETAT_EST', delta:3}, {type:'CYBER', delta:2}] } },
      { texte:'Exprimer notre solidarité sans mesure de rétorsion', effets:{ relation:[{allie:'UK', delta:-3}] } },
      { texte:'Renforcer le contre-espionnage sur notre sol', effets:{ budget:-5, rens:[{theatre:'METRO', delta:6}], menace:[{type:'CYBER', delta:-3}] } }
    ] },
  { id:'FUITE_CAMPAGNE', titre:'Piratage d’une équipe de campagne', auteur:'FRA_ANSSI', poids:3, max:1, cond:{ tourMin:24, tourMax:30, menace:{type:'CYBER', forceMin:30} },
    texte:'À quelques jours d’un scrutin national, des milliers de courriels d’une équipe de campagne sont publiés, mêlés à de faux documents. L’ANSSI relève des techniques déjà observées dans des opérations attribuées à un service étranger.',
    choix:[
      { texte:'Saisir l’autorité de contrôle et alerter publiquement sur la manipulation', effets:{ credibilite:2, opinion:1, menace:[{type:'CYBER', delta:-4}] } },
      { texte:'Attribuer publiquement l’opération à un État', effets:{ alea:{ p:0.5, succes:{ credibilite:4 }, echec:{ credibilite:-3 } }, menace:[{type:'ETAT_EST', delta:3}] } },
      { texte:'Rester silencieux pour ne pas peser sur le scrutin', effets:{ opinion:-3, menace:[{type:'CYBER', delta:4}] } }
    ] }
];
