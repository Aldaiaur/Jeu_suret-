// Dossiers du Royaume-Uni, tirés de la fiche nation-GBR.md (décision, renseignement, alliances, doctrine).
// Ce sont des possibles : ils se déclenchent selon l’état de la partie et ne reproduisent aucun événement
// réel postérieur à janvier 2015. Personnages fictifs, institutions et lieux réels.
import type { EvenementDef } from '../sim/types';

export const EVENEMENTS_GBR: EvenementDef[] = [
  // ---------- Décision : la convention parlementaire ----------
  { id:'GBR_SYRIE_VOTE', titre:'Étendre les frappes à la Syrie ?', auteur:'GBR_PM', poids:5, max:1, cond:{ tourMin:6, theatreDeploye:'LEVANT', menace:{type:'DAECH', forceMin:50} },
    texte:'Nos avions frappent Daech en Irak, mais ses chefs et ses camps d’entraînement sont en Syrie. Washington et Paris nous pressent d’étendre les frappes. Edward Ainsley se souvient du vote perdu de 2013 : une nouvelle défaite aux Communes serait un désaveu durable.',
    choix:[
      { texte:'Soumettre une motion aux Communes', effets:{ capital:-2, alea:{ p:0.6, succes:{ pression:[{theatre:'LEVANT', delta:10}], credibilite:3, relation:[{allie:'USA', delta:3}, {allie:'FRA', delta:2}] }, echec:{ capital:-6, credibilite:-4 } } } },
      { texte:'Frapper au seul titre de la légitime défense, sans vote', effets:{ capital:-3, opinion:-3, pression:[{theatre:'LEVANT', delta:5}], relation:[{allie:'USA', delta:1}] } },
      { texte:'Rester en Irak', effets:{ credibilite:-2, relation:[{allie:'USA', delta:-2}, {allie:'FRA', delta:-1}] } }
    ] },
  { id:'GBR_RECRUTEUR', titre:'Un recruteur localisé en Syrie', auteur:'GBR_SIS', poids:3, max:1, cond:{ tourMin:4, theatreDeploye:'LEVANT', menace:{type:'TERRO', forceMin:40} },
    texte:'Le MI6 a localisé un ressortissant britannique qui, depuis la Syrie, guide à distance des projets d’attentat sur notre sol. Martin Ellery estime la fenêtre à quelques jours. Une frappe de drone serait une première, sans vote et sur un pays où nous ne sommes pas autorisés à frapper.',
    choix:[
      { texte:'Frapper au titre de la légitime défense', effets:{ capital:-2, opinion:-1, menace:[{type:'TERRO', delta:-7}], alea:{ p:0.85, succes:{ credibilite:1 }, echec:{ opinion:-3, credibilite:-2 } } } },
      { texte:'Transmettre la cible aux Américains', effets:{ menace:[{type:'TERRO', delta:-4}], relation:[{allie:'USA', delta:2}] } },
      { texte:'Le surveiller pour remonter son réseau', effets:{ rens:[{theatre:'GB', delta:7}], menace:[{type:'TERRO', delta:3}] } }
    ] },
  { id:'GBR_CIVILS_FRAPPE', titre:'Des victimes civiles après une frappe', auteur:'GBR_SHADER', poids:3, max:2, cond:{ tourMin:4, theatreDeploye:'LEVANT' },
    texte:'Une organisation de surveillance publie des témoignages : une de nos frappes près d’une ville du nord de l’Irak aurait tué plusieurs civils. Le général Gareth Penrose reconnaît que l’enquête interne n’a pas encore exclu cette hypothèse.',
    choix:[
      { texte:'Ouvrir une enquête indépendante et publier ses conclusions', effets:{ capital:-1, opinion:-1, credibilite:2 } },
      { texte:'Reconnaître les faits et indemniser les familles', effets:{ budget:-2, opinion:1, credibilite:1, partenaire:[{theatre:'LEVANT', delta:2}] } },
      { texte:'Contester les chiffres', effets:{ opinion:-4, credibilite:-3 } }
    ] },
  { id:'GBR_YEMEN_ARMES', titre:'Des ventes d’armes contestées', auteur:'GBR_FCO', poids:2, max:1, cond:{ tourMin:4 },
    texte:'Des organisations humanitaires saisissent la justice : des armes vendues à une coalition du Golfe seraient employées contre des civils au Yémen. Charles Wetherby rappelle le poids de ces contrats et des bases que ces monarchies nous ouvrent.',
    choix:[
      { texte:'Maintenir les contrats', effets:{ budget:8, opinion:-4, credibilite:-1 } },
      { texte:'Suspendre les livraisons le temps d’un examen', effets:{ budget:-4, opinion:2, relation:[{allie:'USA', delta:-1}] } },
      { texte:'Conditionner les ventes à des garanties d’emploi', effets:{ capital:-2, opinion:1 } }
    ] },
  { id:'GBR_REFERENDUM', titre:'Le référendum européen', auteur:'GBR_PM', poids:6, max:1, cond:{ tourMin:15, tourMax:22 },
    texte:'La date du référendum promis sur l’appartenance à l’Union européenne approche. Les services craignent pour la coopération policière et le partage de renseignement ; les armées, pour la coopération industrielle. Edward Ainsley vous demande quelle place la sécurité doit prendre dans la campagne.',
    choix:[
      { texte:'Mettre la sécurité au cœur de la campagne pour le maintien', effets:{ capital:-2, alea:{ p:0.5, succes:{ capital:4, opinion:2 }, echec:{ capital:-10, credibilite:-3, relation:[{allie:'DEU', delta:-4}, {allie:'FRA', delta:-3}] } } } },
      { texte:'Rester à l’écart de la campagne', effets:{ alea:{ p:0.48, succes:{ capital:2 }, echec:{ capital:-8, relation:[{allie:'DEU', delta:-3}, {allie:'FRA', delta:-3}] } } } },
      { texte:'Préparer dès maintenant des accords bilatéraux de sécurité', effets:{ budget:-4, capital:-3, relation:[{allie:'FRA', delta:3}, {allie:'DEU', delta:2}] } }
    ] },

  // ---------- Territoire ----------
  { id:'GBR_POUVOIRS_ENQUETE', titre:'Une loi sur les pouvoirs d’enquête', auteur:'GBR_HOME', poids:4, max:1, cond:{ tourMin:2, menace:{type:'TERRO', forceMin:35} },
    texte:'Les services réclament une base légale claire pour la collecte massive de données. Helen Marsden propose un texte ambitieux ; les défenseurs des libertés et une partie de la majorité promettent une bataille aux Communes.',
    choix:[
      { texte:'Présenter le texte complet', effets:{ capital:-4, opinion:-2, rens:[{theatre:'GB', delta:10}] } },
      { texte:'Une version allégée, avec un contrôle judiciaire renforcé', effets:{ capital:-1, rens:[{theatre:'GB', delta:5}] } },
      { texte:'Renoncer pour cette session', effets:{ menace:[{type:'TERRO', delta:3}, {type:'CYBER', delta:2}] } }
    ] },
  { id:'GBR_RETOURS', titre:'Le retour des combattants', auteur:'GBR_MI5', poids:4, max:1, cond:{ tourMin:6, menace:{type:'TERRO', forceMin:40} },
    texte:'Plusieurs dizaines de ressortissants partis en Syrie cherchent à rentrer. Ruth Calloway prévient : le MI5 ne peut pas surveiller chacun d’eux en permanence.',
    choix:[
      { texte:'Ordres d’exclusion temporaire et mesures de contrôle', effets:{ capital:-2, opinion:-1, menace:[{type:'TERRO', delta:-6}] } },
      { texte:'Programme de suivi et de désengagement', effets:{ budget:-6, menace:[{type:'TERRO', delta:-3}], rens:[{theatre:'GB', delta:5}] } },
      { texte:'Poursuites au cas par cas', effets:{ menace:[{type:'TERRO', delta:2}] } }
    ] },
  { id:'GBR_SOLDATS_RUES', titre:'Des soldats dans les rues ?', auteur:'GBR_CDS', poids:3, max:1, cond:{ tourMin:3, menaceIntMin:55 },
    texte:'Le plan Temperer permet d’envoyer des militaires relever la police armée sur les sites sensibles. Le général Sir Hugh Carrow est prêt, mais prévient que chaque soldat posté devant une gare manque à l’entraînement.',
    choix:[
      { texte:'Préparer l’engagement des militaires', effets:{ menaceInt:-5, opinion:-1, budget:-5 } },
      { texte:'Financer plutôt des policiers armés supplémentaires', effets:{ budget:-8, capital:-1, menaceInt:-4 } },
      { texte:'Ne rien changer au dispositif', effets:{ opinion:-2 } }
    ] },
  { id:'GBR_NIVEAU_CRITIQUE', titre:'Le niveau de menace à « critique » ?', auteur:'GBR_MI5', poids:3, max:2, cond:{ tourMin:2, menaceIntMin:62 },
    texte:'Après une série d’alertes, l’évaluateur indépendant de la menace propose de passer au niveau « critique » : une attaque serait imminente. Ce niveau déclenche des renforts, des annulations et une inquiétude visible.',
    choix:[
      { texte:'Passer au niveau critique pour quelques jours', effets:{ menaceInt:-8, budget:-6, opinion:-1 } },
      { texte:'Rester au niveau grave et renforcer la surveillance', effets:{ rens:[{theatre:'GB', delta:6}], menace:[{type:'TERRO', delta:-2}] } }
    ] },
  { id:'GBR_RANCONGICIEL', titre:'Un rançongiciel paralyse des hôpitaux', auteur:'GBR_GCHQ', poids:4, max:1, cond:{ tourMin:8, menace:{type:'CYBER', forceMin:40} },
    texte:'Un logiciel de rançon se propage dans des dizaines d’hôpitaux : rendez-vous annulés, urgences détournées. Duncan Freer pense pouvoir l’attribuer à un État, mais pas avant plusieurs mois.',
    choix:[
      { texte:'Créer un centre national de cybersécurité ouvert aux entreprises', effets:{ budget:-10, menace:[{type:'CYBER', delta:-8}], rens:[{theatre:'GB', delta:4}] } },
      { texte:'Attribuer publiquement l’attaque avec les Five Eyes', effets:{ menace:[{type:'CYBER', delta:-3}], credibilite:2, relation:[{allie:'USA', delta:2}, {allie:'AUS', delta:1}] } },
      { texte:'Laisser chaque établissement gérer la crise', effets:{ opinion:-4, menace:[{type:'CYBER', delta:2}] } }
    ] },

  // ---------- Russie et flanc est ----------
  { id:'GBR_MANCHE', titre:'Un groupe naval russe dans la Manche', auteur:'GBR_DEF', poids:3, max:1, cond:{ tourMin:8, menace:{type:'ETAT_EST', forceMin:40} },
    texte:'Un porte-avions russe et son escorte remontent vers la Manche pour rejoindre la Méditerranée. Fiona Mackenzie-Hale veut une escorte visible ; la presse demande pourquoi nous n’avons plus de porte-avions.',
    choix:[
      { texte:'Escorter le groupe avec un destroyer et une frégate', effets:{ budget:-2, credibilite:3, fatigue:[{unite:'T45', delta:8}] } },
      { texte:'Laisser nos alliés de l’OTAN s’en charger', effets:{ credibilite:-2, relation:[{allie:'DEU', delta:-1}] } },
      { texte:'En faire un argument pour accélérer le porte-avions', effets:{ opinion:2, budget:-4, menace:[{type:'ETAT_EST', delta:1}] } }
    ] },
  { id:'GBR_EMPOISONNEMENT', titre:'Un transfuge empoisonné sur notre sol', auteur:'GBR_MI5', poids:4, max:1, cond:{ tourMin:18, menace:{type:'ETAT_EST', forceMin:50} },
    texte:'Un ancien officier de renseignement russe, réfugié chez nous, a été empoisonné par un agent innervant dans une ville de province. Ruth Calloway n’a guère de doute sur le commanditaire. Des passants ont été exposés.',
    choix:[
      { texte:'Expulsions coordonnées avec nos alliés', effets:{ credibilite:4, menace:[{type:'ETAT_EST', delta:-4}, {type:'CYBER', delta:4}], relation:[{allie:'USA', delta:3}, {allie:'FRA', delta:2}, {allie:'DEU', delta:2}] } },
      { texte:'Attribution publique, sans mesures de rétorsion', effets:{ credibilite:1, menace:[{type:'CYBER', delta:2}] } },
      { texte:'Traiter l’affaire discrètement', effets:{ credibilite:-4, opinion:-3 } }
    ] },
  { id:'GBR_ESTONIE', titre:'Un bataillon pour l’Estonie ?', auteur:'GBR_CDS', poids:4, max:1, cond:{ tourMin:12, menace:{type:'ETAT_EST', forceMin:45} },
    texte:'L’OTAN prépare des bataillons multinationaux dans les pays baltes. On nous propose d’être la nation-cadre en Estonie, avec des chars et plusieurs centaines d’hommes en permanence.',
    choix:[
      { texte:'Prendre la tête du bataillon', effets:{ budget:-8, pression:[{theatre:'EST', delta:10}], credibilite:4, relation:[{allie:'USA', delta:3}, {allie:'DEU', delta:2}] } },
      { texte:'Contribuer par la police du ciel', effets:{ budget:-3, pression:[{theatre:'EST', delta:5}], credibilite:1 } },
      { texte:'Décliner : nos forces sont engagées ailleurs', effets:{ credibilite:-4, relation:[{allie:'USA', delta:-2}] } }
    ] },
  { id:'GBR_UKRAINE', titre:'Former l’armée ukrainienne', auteur:'GBR_FCO', poids:3, max:1, cond:{ tourMin:2, menace:{type:'ETAT_EST', forceMin:35} },
    texte:'Kiev demande des instructeurs : tactique, médecine de combat, logistique. Charles Wetherby y voit un geste fort et peu coûteux ; Moscou le lira comme une provocation.',
    choix:[
      { texte:'Envoyer une mission de formation', effets:{ budget:-3, partenaire:[{theatre:'EST', delta:6}], menace:[{type:'ETAT_EST', delta:2}] } },
      { texte:'Se limiter à du matériel non létal', effets:{ budget:-2, partenaire:[{theatre:'EST', delta:3}] } },
      { texte:'Refuser', effets:{ credibilite:-2 } }
    ] },

  // ---------- Alliances ----------
  { id:'GBR_LANCASTER', titre:'Une force expéditionnaire franco-britannique', auteur:'GBR_FCO', poids:3, max:1, cond:{ tourMin:10, relationMin:{allie:'FRA', val:58} },
    texte:'Paris propose de valider la force expéditionnaire conjointe prévue par les traités de Lancaster House, par un grand exercice commun. En échange, la France ouvrirait plus largement sa base de Djibouti.',
    choix:[
      { texte:'Organiser l’exercice et accepter l’offre', effets:{ budget:-4, relation:[{allie:'FRA', delta:5}], credibilite:2, appui:{allie:'FRA', appui:'DJIBOUTI', theatre:'CORNE', tours:4} } },
      { texte:'Un exercice d’état-major seulement', effets:{ relation:[{allie:'FRA', delta:2}] } },
      { texte:'Différer', effets:{ relation:[{allie:'FRA', delta:-2}] } }
    ] },
  { id:'GBR_CHINOOK_BARKHANE', titre:'Paris demande des hélicoptères lourds', auteur:'GBR_DEF', poids:3, max:1, cond:{ tourMin:12, menace:{type:'DJIHAD', forceMin:45} },
    texte:'La force française au Sahel manque d’hélicoptères lourds. Paris demande des Chinook. Fiona Mackenzie-Hale y voit une occasion de peser à Paris, au prix d’une présence durable au Mali.',
    choix:[
      { texte:'Détacher des Chinook au profit de la France', effets:{ budget:-5, relation:[{allie:'FRA', delta:6}], partenaire:[{theatre:'SAHEL', delta:3}], credibilite:2 } },
      { texte:'Offrir du transport stratégique', effets:{ budget:-2, relation:[{allie:'FRA', delta:3}] } },
      { texte:'Décliner', effets:{ relation:[{allie:'FRA', delta:-3}] } }
    ] },
  { id:'GBR_NIGERIA', titre:'Abuja demande des formateurs', auteur:'GBR_FCO', poids:3, max:1, cond:{ tourMin:2, menace:{type:'BOKO_HARAM', forceMin:40} },
    texte:'Le Nigeria peine à reprendre l’initiative autour du lac Tchad. Il demande des formateurs et du renseignement, mais refuse toute troupe étrangère au combat.',
    choix:[
      { texte:'Envoyer une équipe de formation', effets:{ budget:-3, partenaire:[{theatre:'GUINEE', delta:6}], relation:[{allie:'NGA', delta:4}] } },
      { texte:'Partager du renseignement seulement', effets:{ rens:[{theatre:'GUINEE', delta:6}], relation:[{allie:'NGA', delta:2}] } },
      { texte:'Décliner', effets:{ relation:[{allie:'NGA', delta:-3}], menace:[{type:'BOKO_HARAM', delta:2}] } }
    ] },
  { id:'GBR_MER_CHINE', titre:'Liberté de navigation en mer de Chine', auteur:'GBR_FCO', poids:3, max:1, cond:{ tourMin:12, menace:{type:'INDOPAC_P', forceMin:30} },
    texte:'Washington souhaite qu’un bâtiment britannique passe près des récifs fortifiés. Pékin, avec qui nous venons de signer des contrats importants, prévient qu’il y verrait un acte hostile.',
    choix:[
      { texte:'Faire passer un bâtiment au plus près des récifs', effets:{ pression:[{theatre:'INDOPAC', delta:6}], credibilite:3, relation:[{allie:'USA', delta:3}, {allie:'AUS', delta:2}, {allie:'JPN', delta:2}], budget:-3 } },
      { texte:'Un transit discret, sans communication', effets:{ relation:[{allie:'AUS', delta:1}], credibilite:1 } },
      { texte:'Préserver les relations commerciales avec Pékin', effets:{ budget:8, credibilite:-2, relation:[{allie:'USA', delta:-3}] } }
    ] },
  { id:'GBR_ATALANTA', titre:'Atalanta commandée depuis Northwood', auteur:'GBR_DEF', poids:2, max:1, cond:{ tourMin:2, menace:{type:'PIRATERIE', forceMin:40} },
    texte:'L’opération européenne contre la piraterie est commandée depuis notre quartier général de Northwood. Nos partenaires demandent que nous fournissions aussi un bâtiment.',
    choix:[
      { texte:'Engager une frégate', effets:{ budget:-3, pression:[{theatre:'CORNE', delta:8}], fatigue:[{unite:'T23', delta:6}], credibilite:2 } },
      { texte:'Conserver le commandement seulement', effets:{ credibilite:1, rens:[{theatre:'CORNE', delta:4}] } }
    ] },

  // ---------- Forces spéciales ----------
  { id:'GBR_SAS_LIBYE', titre:'Des forces spéciales en Libye ?', auteur:'GBR_DSF', poids:3, max:1, cond:{ tourMin:6, menace:{type:'DAECH', forceMin:30, theatre:'LIBYE'} },
    texte:'Une milice libyenne alliée demande des conseillers pour reprendre une ville côtière tenue par Daech. Le directeur des forces spéciales peut y envoyer une petite équipe, sans annonce et sans vote. Si elle est capturée, tout se saura.',
    choix:[
      { texte:'Envoyer une équipe de conseillers', requiert:{categorie:'FS'}, effets:{ fatigue:[{categorie:'FS', delta:8}], alea:{ p:0.7, succes:{ menace:[{type:'DAECH', delta:-7, theatre:'LIBYE'}], partenaire:[{theatre:'LIBYE', delta:4}] }, echec:{ opinion:-4, capital:-3 } } } },
      { texte:'Se limiter au renseignement', effets:{ rens:[{theatre:'LIBYE', delta:8}] } },
      { texte:'Refuser', effets:{ menace:[{type:'DAECH', delta:3, theatre:'LIBYE'}] } }
    ] }
];
