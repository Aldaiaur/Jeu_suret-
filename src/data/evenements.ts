import type { EvenementDef } from '../sim/types';

// ---------------------------------------------------------------------
// ÉVÉNEMENTS
// cond : tourMin, tourMax, menace:{type,forceMin,theatre}, opinionMax, opinionMin, menaceIntMin,
//        surcoutMin, deploiementExterieur, theatreDeploye, rensMin:{theatre,val}, chaine
// effets : opinion, capital, credibilite, menaceInt, budget, enveloppe, menace:[{type,delta,theatre}],
//          rens:[{theatre,delta}], partenaire:[{theatre,delta}], fatigue:[{unite|categorie,delta}],
//          indispo:{unite,tours}, crise:theatre, pression:[{theatre,delta}], allie:{theatre,tours},
//          relation:[{allie,delta}], appui:{allie,appui,theatre,tours},
// cond (suite) : relationMin:{allie,val}, relationMax:{allie,val}
//          alea:{p,succes,echec}
// choix.requiert : {categorie} (une unité de cette catégorie disponible ou déployée)
// choix.suite / suiteDelai / suiteP : événement enchaîné, délai en mois, probabilité (1 par défaut)
// ---------------------------------------------------------------------
export const EVENEMENTS: EvenementDef[] = [
  { id:'OTAGES_SAHEL', titre:'Ressortissants enlevés au Sahel', poids:6, max:2,
    cond:{ tourMin:1, menace:{type:'DJIHAD', forceMin:35} },
    texte:'Deux ressortissants français ont été enlevés dans le nord du Niger. Une revendication circule. Les services estiment savoir dans quelle zone ils sont détenus.',
    choix:[
      { texte:'Préparer une opération de libération', requiert:{categorie:'FS'}, effets:{ fatigue:[{categorie:'FS', delta:10}], alea:{ p:0.55, succes:{opinion:8, credibilite:4, menace:[{type:'DJIHAD', delta:-4}]}, echec:{opinion:-10, capital:-5} } } },
      { texte:'Ouvrir un canal de négociation discret', effets:{ capital:-3, opinion:2, menace:[{type:'DJIHAD', delta:5}] }, suite:'OTAGES_FUITE', suiteDelai:2 },
      { texte:'Refuser toute négociation et attendre', effets:{ opinion:-4, credibilite:2 } }
    ] },
  { id:'OTAGES_FUITE', titre:'La presse évoque une négociation', poids:0, max:1, cond:{ chaine:true },
    texte:'Un hebdomadaire affirme qu’une rançon aurait été envisagée pour les ressortissants détenus au Sahel.',
    choix:[
      { texte:'Assumer une démarche humanitaire', effets:{ opinion:-2, capital:-2, credibilite:-2 } },
      { texte:'Démentir formellement', effets:{ alea:{ p:0.5, succes:{}, echec:{ opinion:-8, credibilite:-3 } } } }
    ] },
  { id:'MALI_RENFORT', titre:'Bamako demande un renfort', poids:5, max:2,
    cond:{ tourMin:2, menace:{type:'DJIHAD', forceMin:45, theatre:'SAHEL'} },
    texte:'Les autorités maliennes demandent un appui supplémentaire après une série d’attaques contre leurs postes.',
    choix:[
      { texte:'Renforcer l’appui aérien et le conseil', effets:{ budget:-12, credibilite:4, pression:[{theatre:'SAHEL', delta:8}] } },
      { texte:'Proposer un programme de formation', effets:{ budget:-5, credibilite:1, partenaire:[{theatre:'SAHEL', delta:6}] } },
      { texte:'Décliner poliment', effets:{ credibilite:-4 } }
    ] },
  { id:'FUITE_NOTE', titre:'Fuite d’une note classifiée', poids:4, max:2, cond:{ tourMin:3 },
    texte:'Une note de synthèse classifiée sur les moyens de surveillance a été publiée en ligne.',
    choix:[
      { texte:'Lancer une enquête interne et suspendre la diffusion', effets:{ capital:-2, rens:[{theatre:'METRO', delta:-4}] } },
      { texte:'Minimiser publiquement', effets:{ opinion:-3 } },
      { texte:'Engager des poursuites contre la publication', effets:{ opinion:-5, credibilite:-2, capital:1 } }
    ] },
  { id:'BAVURE', titre:'Victimes civiles alléguées', poids:4, max:3, cond:{ deploiementExterieur:true, tourMin:2 },
    texte:'Une ONG affirme qu’une opération française a causé des victimes civiles. Les éléments disponibles sont contradictoires.',
    choix:[
      { texte:'Ouvrir une enquête et communiquer', effets:{ opinion:-2, credibilite:2, capital:-2 } },
      { texte:'Contester les allégations', effets:{ alea:{ p:0.55, succes:{opinion:1}, echec:{opinion:-7, credibilite:-5} } } },
      { texte:'Suspendre temporairement les frappes', effets:{ credibilite:1, pression:[{theatre:'LEVANT', delta:-6}, {theatre:'SAHEL', delta:-6}] } }
    ] },
  { id:'COUP_ETAT', titre:'Coup d’État chez un partenaire', poids:3, max:1, cond:{ tourMin:6 },
    texte:'Des militaires ont pris le pouvoir dans un pays partenaire du Sahel. La coopération de défense est remise en question.',
    choix:[
      { texte:'Condamner et suspendre la coopération', effets:{ credibilite:2, partenaire:[{theatre:'SAHEL', delta:-12}], menace:[{type:'DJIHAD', delta:6}] } },
      { texte:'Maintenir une coopération pragmatique', effets:{ credibilite:-3, opinion:-2 } },
      { texte:'Soutenir une médiation régionale', effets:{ capital:-3, alea:{ p:0.5, succes:{credibilite:4}, echec:{partenaire:[{theatre:'SAHEL', delta:-6}]} } } }
    ] },
  { id:'PANNE_A400M', titre:'Défaut technique sur la flotte A400M', poids:3, max:1, cond:{ tourMin:2 },
    texte:'Un défaut moteur impose l’immobilisation temporaire d’une partie de la flotte de transport.',
    choix:[
      { texte:'Affréter des gros porteurs civils', effets:{ budget:-15, indispo:{unite:'A400M', tours:2} } },
      { texte:'Réduire le rythme logistique des opérations', effets:{ indispo:{unite:'A400M', tours:2}, fatigue:[{categorie:'TERRE', delta:12}, {categorie:'FS', delta:8}] } }
    ] },
  { id:'CYBER_HOPITAL', titre:'Rançongiciel dans un centre hospitalier', poids:5, max:2,
    cond:{ menace:{type:'CYBER', forceMin:30} },
    texte:'Un centre hospitalier régional fonctionne en mode dégradé après le chiffrement de ses serveurs.',
    choix:[
      { texte:'Projeter une équipe de l’ANSSI', effets:{ capital:-1, menace:[{type:'CYBER', delta:-8}], opinion:1 } },
      { texte:'Laisser l’établissement gérer avec son prestataire', effets:{ opinion:-4, menaceInt:3 } },
      { texte:'Communication publique et plan national de durcissement', effets:{ budget:-6, menace:[{type:'CYBER', delta:-5}], opinion:2 } }
    ] },
  { id:'ARBITRAGE', titre:'Arbitrage budgétaire', poids:4, max:3, cond:{ tourMin:4 },
    texte:'Le ministère chargé du budget demande un gel de crédits sur la défense et la sécurité.',
    choix:[
      { texte:'Accepter le gel', effets:{ enveloppe:-10, capital:5 } },
      { texte:'Défendre les crédits en conseil de défense', effets:{ capital:-6, enveloppe:5 } },
      { texte:'Redéployer des crédits internes', effets:{ budget:-10, capital:1 } }
    ] },
  { id:'OTAN_EST', titre:'Demande de l’OTAN', poids:5, max:2,
    cond:{ menace:{type:'ETAT_EST', forceMin:35} },
    texte:'L’Alliance demande une contribution aux mesures de réassurance sur le flanc oriental.',
    choix:[
      { texte:'Contribuer avec un détachement', effets:{ budget:-10, credibilite:5, menace:[{type:'ETAT_EST', delta:-5}], relation:[{allie:'USA', delta:3}, {allie:'DEU', delta:2}] } },
      { texte:'Contribution symbolique', effets:{ credibilite:1 } },
      { texte:'Refuser, priorité au Sahel', effets:{ credibilite:-6, relation:[{allie:'USA', delta:-4}] } }
    ] },
  { id:'ATTENTAT_DEJOUE', titre:'Projet d’attentat déjoué', poids:5, max:3,
    cond:{ menace:{type:'TERRO', forceMin:25}, rensMin:{theatre:'METRO', val:40} },
    texte:'Une cellule préparant une action violente a été interpellée à la suite d’une surveillance de plusieurs mois.',
    choix:[
      { texte:'Communiquer sur le succès des services', effets:{ opinion:4, capital:2, menace:[{type:'TERRO', delta:-6}] } },
      { texte:'Rester discret pour exploiter les suites', effets:{ menace:[{type:'TERRO', delta:-10}], rens:[{theatre:'METRO', delta:5}] } }
    ] },
  { id:'ATTENTAT', titre:'Attaque terroriste en métropole', poids:4, max:3,
    cond:{ menace:{type:'TERRO', forceMin:55} },
    texte:'Une attaque armée a fait de nombreuses victimes dans une grande ville. Les auteurs sont neutralisés ou en fuite.',
    choix:[
      { texte:'Déclarer l’état d’urgence', effets:{ menaceInt:-6, opinion:3, capital:-2, menace:[{type:'TERRO', delta:-8}] }, suite:'ETAT_URGENCE', suiteDelai:3 },
      { texte:'Réponse judiciaire et policière ordinaire', effets:{ opinion:-6, menaceInt:5 } },
      { texte:'Renforcer massivement la présence militaire', effets:{ budget:-15, menaceInt:-5, opinion:2 } }
    ] },
  { id:'ETAT_URGENCE', titre:'Prorogation de l’état d’urgence', poids:0, max:3, cond:{ chaine:true },
    texte:'Le Parlement doit se prononcer sur la prorogation de l’état d’urgence.',
    choix:[
      { texte:'Demander la prorogation', effets:{ capital:-3, menaceInt:-4, opinion:1 }, suite:'ETAT_URGENCE', suiteDelai:6 },
      { texte:'Laisser l’état d’urgence s’éteindre', effets:{ capital:2, opinion:-1 } }
    ] },
  { id:'NAUFRAGES', titre:'Naufrages en Méditerranée centrale', poids:4, max:2, cond:{ tourMin:3 },
    texte:'Une série de naufrages au large de la Libye conduit l’Union européenne à demander des moyens navals.',
    choix:[
      { texte:'Engager une frégate', effets:{ fatigue:[{unite:'FREMM', delta:15}], credibilite:3, opinion:1, rens:[{theatre:'LIBYE', delta:5}], relation:[{allie:'ITA', delta:4}] } },
      { texte:'Contribution financière', effets:{ budget:-5, credibilite:1 } },
      { texte:'Ne pas participer', effets:{ credibilite:-3 } }
    ] },
  { id:'LIBYE_CHAOS', titre:'Dégradation sécuritaire en Libye', poids:4, max:2,
    cond:{ menace:{type:'DAECH', forceMin:20, theatre:'LIBYE'} },
    texte:'Des groupes affiliés à Daech prennent le contrôle d’une ville côtière libyenne.',
    choix:[
      { texte:'Actions clandestines ciblées', effets:{ alea:{ p:0.6, succes:{menace:[{type:'DAECH', theatre:'LIBYE', delta:-10}]}, echec:{credibilite:-4, opinion:-2} } } },
      { texte:'Appui en renseignement aux alliés', effets:{ rens:[{theatre:'LIBYE', delta:10}], allie:{theatre:'LIBYE', tours:2} } },
      { texte:'Ne pas s’engager', effets:{ menace:[{type:'DAECH', theatre:'LIBYE', delta:5}] } }
    ] },
  { id:'PETROLIER', titre:'Pétrolier détourné', poids:4, max:2,
    cond:{ menace:{type:'PIRATERIE', forceMin:30} },
    texte:'Un pétrolier avec des marins européens à bord a été détourné. L’armateur demande assistance.',
    choix:[
      { texte:'Ouvrir une crise et étudier une intervention', effets:{ crise:'PIRATERIE' } },
      { texte:'S’en remettre à la marine riveraine', effets:{ credibilite:-1, menace:[{type:'PIRATERIE', delta:3}] } },
      { texte:'Faciliter une négociation privée', effets:{ capital:-1, menace:[{type:'PIRATERIE', delta:5}] } }
    ] },
  { id:'DJIBOUTI_BAIL', titre:'Renégociation à Djibouti', poids:3, max:1, cond:{ tourMin:8 },
    texte:'Djibouti renégocie les conditions de la présence militaire française alors que d’autres puissances s’installent.',
    choix:[
      { texte:'Accepter une contribution plus élevée', effets:{ budget:-10, credibilite:2 } },
      { texte:'Réduire l’empreinte', effets:{ budget:8, rens:[{theatre:'CORNE', delta:-10}], credibilite:-2 } }
    ] },
  { id:'DESINFO', titre:'Campagne de désinformation', poids:4, max:2,
    cond:{ menace:{type:'ETAT_EST', forceMin:40} },
    texte:'Une campagne coordonnée de faux comptes cible le débat public sur les opérations extérieures.',
    choix:[
      { texte:'Attribution publique', effets:{ capital:-2, credibilite:2, menace:[{type:'ETAT_EST', delta:3}] }, suite:'SANCTIONS', suiteDelai:2, suiteP:0.7 },
      { texte:'Riposte technique discrète', effets:{ menace:[{type:'CYBER', delta:-4}], opinion:-1 } },
      { texte:'Ignorer', effets:{ opinion:-3 } }
    ] },
  { id:'INTERCEPTION', titre:'Bombardiers à proximité de l’espace aérien', poids:3, max:2,
    cond:{ menace:{type:'ETAT_EST', forceMin:30} },
    texte:'Des bombardiers à long rayon d’action longent l’espace aérien national sans plan de vol.',
    choix:[
      { texte:'Interception et escorte', effets:{ fatigue:[{unite:'RAFALE', delta:5}], credibilite:1 } },
      { texte:'Protestation diplomatique', effets:{ credibilite:-1 } }
    ] },
  { id:'COUR_COMPTES', titre:'La Cour des comptes et les OPEX', poids:5, max:2, cond:{ surcoutMin:80 },
    texte:'Un rapport public souligne la sous-budgétisation chronique des opérations extérieures.',
    choix:[
      { texte:'Annoncer une hausse de la provision OPEX', effets:{ enveloppe:10, capital:-4 } },
      { texte:'Contester les chiffres', effets:{ opinion:-2, capital:-1 } }
    ] },
  { id:'SOLDATS_TUES', titre:'Soldats tués en opération', poids:3, max:3, cond:{ deploiementExterieur:true, tourMin:2 },
    texte:'Des militaires français ont été tués lors d’une embuscade. Leurs noms ne sont pas encore communiqués.',
    choix:[
      { texte:'Hommage national et maintien de l’engagement', effets:{ opinion:-1, capital:1, credibilite:1 } },
      { texte:'Annoncer une revue de la posture', effets:{ opinion:1, credibilite:-3, pression:[{theatre:'SAHEL', delta:-5}] } }
    ] },
  { id:'LOI_RENS', titre:'Projet de loi sur le renseignement', poids:4, max:1, cond:{ tourMin:3, tourMax:20 },
    texte:'Le gouvernement peut présenter un texte encadrant les techniques de renseignement.',
    choix:[
      { texte:'Présenter le texte en procédure accélérée', effets:{ capital:-5, rens:[{theatre:'METRO', delta:12}], opinion:-1 }, suite:'CENSURE_CC', suiteDelai:3, suiteP:0.6 },
      { texte:'Reporter', effets:{ } }
    ] },
  { id:'LPM', titre:'Actualisation de la programmation militaire', poids:4, max:1, cond:{ tourMin:5 },
    texte:'L’actualisation de la loi de programmation militaire est à l’ordre du jour.',
    choix:[
      { texte:'Obtenir une hausse des crédits', effets:{ capital:-6, enveloppe:15 } },
      { texte:'Stabiliser la trajectoire', effets:{ capital:2 } }
    ] },
  { id:'RETOURS', titre:'Retour de combattants du Levant', poids:4, max:2,
    cond:{ menace:{type:'DAECH', forceMin:45} },
    texte:'Plusieurs dizaines de ressortissants partis au Levant cherchent à rentrer en France.',
    choix:[
      { texte:'Judiciarisation systématique', effets:{ budget:-3, menace:[{type:'TERRO', delta:-4}], capital:-1 } },
      { texte:'Surveillance renforcée', effets:{ rens:[{theatre:'METRO', delta:6}], menace:[{type:'TERRO', delta:2}] } },
      { texte:'Traitement au cas par cas', effets:{ menace:[{type:'TERRO', delta:7}] } }
    ] },
  { id:'PESHMERGAS', titre:'Demande d’armement des forces kurdes', poids:4, max:1,
    cond:{ menace:{type:'DAECH', forceMin:40, theatre:'LEVANT'} },
    texte:'Les autorités régionales kurdes demandent des armes et des formateurs.',
    choix:[
      { texte:'Livrer des armes et des formateurs', effets:{ partenaire:[{theatre:'LEVANT', delta:8}], credibilite:2, relation:[{allie:'USA', delta:2}] }, suite:'ARMES_DETOURNEES', suiteDelai:4, suiteP:0.35 },
      { texte:'Conseil uniquement', effets:{ partenaire:[{theatre:'LEVANT', delta:3}] } },
      { texte:'Refuser', effets:{ credibilite:-3 } }
    ] },
  { id:'EPIDEMIE', titre:'Épidémie dans un pays partenaire', poids:2, max:1, cond:{ tourMin:1, tourMax:12 },
    texte:'Une épidémie de fièvre hémorragique touche un pays d’Afrique de l’Ouest partenaire.',
    choix:[
      { texte:'Déployer un centre de traitement militaire', effets:{ budget:-8, credibilite:3, opinion:1 } },
      { texte:'Aide financière uniquement', effets:{ budget:-3, credibilite:1 } }
    ] },
  { id:'NAVIGATION', titre:'Incident en mer de Chine méridionale', poids:3, max:2,
    cond:{ menace:{type:'INDOPAC_P', forceMin:30} },
    texte:'Un bâtiment étranger a effectué une manœuvre dangereuse à proximité d’un navire allié.',
    choix:[
      { texte:'Organiser un transit au titre de la liberté de navigation', effets:{ fatigue:[{unite:'FREMM', delta:10}], credibilite:3, menace:[{type:'INDOPAC_P', delta:-4}] } },
      { texte:'Déclaration commune avec les partenaires', effets:{ credibilite:1 } }
    ] },
  { id:'SOURCE', titre:'Source humaine compromise', poids:3, max:2, cond:{ tourMin:3 },
    texte:'Une source de la DGSE au Levant aurait été identifiée par l’adversaire.',
    choix:[
      { texte:'Exfiltrer la source', effets:{ budget:-3, rens:[{theatre:'LEVANT', delta:-5}] } },
      { texte:'Suspendre le contact', effets:{ rens:[{theatre:'LEVANT', delta:-12}], credibilite:-1 } }
    ] },
  { id:'SATELLITE', titre:'Défaillance d’un satellite d’observation', poids:2, max:1, cond:{ tourMin:4 },
    texte:'Un satellite d’observation connaît une défaillance. La couverture image est réduite.',
    choix:[
      { texte:'Acheter des images commerciales', effets:{ budget:-6 } },
      { texte:'Accepter la dégradation', effets:{ rens:[{theatre:'LEVANT', delta:-6}, {theatre:'SAHEL', delta:-6}, {theatre:'LIBYE', delta:-6}] } }
    ] },
  { id:'HELICOS', titre:'Disponibilité des hélicoptères', poids:3, max:2, cond:{ deploiementExterieur:true, tourMin:4 },
    texte:'Le taux de disponibilité des hélicoptères en opération chute sous l’effet de l’usure en milieu désertique.',
    choix:[
      { texte:'Contrat de soutien d’urgence', effets:{ budget:-8 } },
      { texte:'Réduire les vols', effets:{ fatigue:[{unite:'RHFS4', delta:20}], pression:[{theatre:'SAHEL', delta:-4}] } }
    ] },
  { id:'ALLIE_SYRIE', titre:'Washington demande d’élargir les frappes', poids:3, max:1,
    cond:{ tourMin:6, menace:{type:'DAECH', forceMin:45} },
    texte:'Les États-Unis demandent l’extension des frappes françaises à la Syrie.',
    choix:[
      { texte:'Accepter', effets:{ credibilite:4, opinion:-2, budget:-10, pression:[{theatre:'LEVANT', delta:8}], relation:[{allie:'USA', delta:6}] } },
      { texte:'Limiter à l’Irak', effets:{ credibilite:-1, relation:[{allie:'USA', delta:-1}] } },
      { texte:'Refuser', effets:{ credibilite:-4, capital:1, relation:[{allie:'USA', delta:-6}] } }
    ] },
  { id:'POLICE_EPUISEE', titre:'Forces de sécurité à bout de souffle', poids:4, max:2,
    cond:{ menaceIntMin:60 },
    texte:'Les syndicats de police et les états-majors alertent sur l’épuisement des effectifs mobilisés.',
    choix:[
      { texte:'Primes et rappel de réservistes', effets:{ budget:-10, opinion:2 } },
      { texte:'Alléger certaines missions de garde statique', effets:{ menaceInt:4, fatigue:[{categorie:'INT', delta:-15}] } }
    ] },
  { id:'ACCORD_PAIX', titre:'Processus de paix au Mali', poids:3, max:1, cond:{ tourMin:3, tourMax:10 },
    texte:'Un accord de paix entre le gouvernement malien et des groupes armés du Nord est en discussion.',
    choix:[
      { texte:'Soutenir activement l’accord', effets:{ capital:-2, partenaire:[{theatre:'SAHEL', delta:6}], menace:[{type:'DJIHAD', delta:-3}] } },
      { texte:'Rester en retrait', effets:{ credibilite:-2 } }
    ] },
  { id:'EVACUATION', titre:'Ressortissants menacés dans la Corne', poids:3, max:1, cond:{ tourMin:2 },
    texte:'La situation se dégrade dans un pays riverain de la mer Rouge. Plusieurs centaines de ressortissants demandent à partir.',
    choix:[
      { texte:'Opération d’évacuation depuis Djibouti', effets:{ budget:-6, opinion:4, credibilite:2, fatigue:[{categorie:'MER', delta:8}] } },
      { texte:'S’appuyer sur les vols affrétés par les alliés', effets:{ credibilite:-1, opinion:-1 } }
    ] },
  { id:'EXERCICE', titre:'Exercice national de gestion de crise', poids:2, max:2, cond:{ tourMin:2 },
    texte:'Un exercice majeur peut être organisé avec les préfectures, les hôpitaux et les forces d’intervention.',
    choix:[
      { texte:'Organiser l’exercice', effets:{ budget:-3, menaceInt:-3, fatigue:[{categorie:'INT', delta:5}] } },
      { texte:'Reporter', effets:{ } }
    ] },
  { id:'SANCTIONS', titre:'Sanctions européennes', poids:0, max:1, cond:{ chaine:true },
    texte:'À la suite de l’attribution publique, les partenaires européens examinent des sanctions ciblées.',
    choix:[
      { texte:'Porter les sanctions au Conseil européen', effets:{ capital:-2, credibilite:4, budget:-4, menace:[{type:'ETAT_EST', delta:-4}] } },
      { texte:'S’en tenir à la déclaration', effets:{ credibilite:-1 } }
    ] },
  { id:'CENSURE_CC', titre:'Décision du Conseil constitutionnel', poids:0, max:1, cond:{ chaine:true },
    texte:'Saisi sur la loi relative au renseignement, le Conseil constitutionnel censure plusieurs dispositions.',
    choix:[
      { texte:'Prendre acte et réécrire les dispositions', effets:{ capital:-1, rens:[{theatre:'METRO', delta:-3}] } },
      { texte:'Présenter un nouveau texte encadré', effets:{ capital:-4, opinion:-1 } }
    ] },
  { id:'ARMES_DETOURNEES', titre:'Armes livrées saisies par l’adversaire', poids:0, max:1, cond:{ chaine:true },
    texte:'Des armes livrées aux forces kurdes auraient été saisies par Daech lors de combats. La presse s’interroge sur le contrôle des livraisons.',
    choix:[
      { texte:'Renforcer le contrôle des livraisons', effets:{ budget:-3, partenaire:[{theatre:'LEVANT', delta:-2}] } },
      { texte:'Suspendre les livraisons', effets:{ partenaire:[{theatre:'LEVANT', delta:-6}], credibilite:-2, opinion:1 } }
    ] },
  { id:'ELECTION_US', titre:'Nouvelle administration américaine', poids:6, max:1, cond:{ tourMin:22, tourMax:26 },
    texte:'Une nouvelle administration s’installe à Washington. Ses priorités en matière d’alliances restent incertaines.',
    choix:[
      { texte:'Réaffirmer immédiatement le partenariat', effets:{ capital:-1, relation:[{allie:'USA', delta:6}] } },
      { texte:'Plaider pour l’autonomie stratégique européenne', effets:{ credibilite:2, relation:[{allie:'USA', delta:-6}, {allie:'DEU', delta:4}] } },
      { texte:'Attendre les premières décisions', effets:{ relation:[{allie:'USA', delta:-2}] } }
    ] },
  { id:'US_PARTAGE', titre:'Proposition américaine de partage de renseignement', poids:4, max:1, cond:{ tourMin:4, relationMin:{allie:'USA', val:55} },
    texte:'Washington propose d’élargir le partage de renseignement sur les théâtres africains et au Levant.',
    choix:[
      { texte:'Accepter l’accord', effets:{ opinion:-1, rens:[{theatre:'SAHEL', delta:10}, {theatre:'LEVANT', delta:10}], relation:[{allie:'USA', delta:3}] } },
      { texte:'Limiter l’accord au Levant', effets:{ rens:[{theatre:'LEVANT', delta:6}] } },
      { texte:'Décliner pour préserver l’autonomie d’appréciation', effets:{ credibilite:1, relation:[{allie:'USA', delta:-4}] } }
    ] },
  { id:'US_CONGRES', titre:'Le Congrès américain et le soutien au Sahel', poids:3, max:1, cond:{ tourMin:6, theatreDeploye:'SAHEL' },
    texte:'Le financement du soutien logistique américain aux opérations françaises au Sahel est discuté au Congrès.',
    choix:[
      { texte:'Mobiliser l’ambassade et les relais parlementaires', effets:{ capital:-2, appui:{allie:'USA', appui:'TRANSPORT', theatre:'SAHEL', tours:4}, relation:[{allie:'USA', delta:1}] } },
      { texte:'Ne pas intervenir', effets:{ relation:[{allie:'USA', delta:-1}] } }
    ] },
  { id:'ECOUTES', titre:'Révélations sur des écoutes', poids:3, max:1, cond:{ tourMin:5 },
    texte:'Des documents publiés indiquent qu’un service de renseignement allié aurait écouté de hauts responsables français.',
    choix:[
      { texte:'Convoquer l’ambassadeur et protester', effets:{ opinion:3, relation:[{allie:'USA', delta:-5}] } },
      { texte:'Régler l’affaire par les canaux discrets', effets:{ opinion:-2, relation:[{allie:'USA', delta:2}] } }
    ] },
  { id:'US_RETRAIT', titre:'Washington réduit ses moyens en Afrique', poids:3, max:1, cond:{ tourMin:24, relationMax:{allie:'USA', val:55} },
    texte:'Le Pentagone annonce une réduction de ses moyens de surveillance en Afrique au profit d’autres priorités.',
    choix:[
      { texte:'Compenser par des moyens nationaux', effets:{ budget:-10, rens:[{theatre:'SAHEL', delta:-4}] } },
      { texte:'Négocier un maintien partiel', effets:{ capital:-3, relation:[{allie:'USA', delta:3}] } },
      { texte:'Accepter la réduction', effets:{ rens:[{theatre:'SAHEL', delta:-12}] } }
    ] },
  { id:'CRISE_SAHEL', titre:'Offensive djihadiste au Sahel', poids:3, max:2,
    cond:{ menace:{type:'DJIHAD', forceMin:55, theatre:'SAHEL'} },
    texte:'Des colonnes armées convergent vers plusieurs localités du Nord. Les partenaires locaux demandent un appui immédiat.',
    choix:[
      { texte:'Ouvrir la cellule de crise', effets:{ crise:'SAHEL' } },
      { texte:'Laisser les forces locales tenir', effets:{ credibilite:-3, menace:[{type:'DJIHAD', delta:5}] } }
    ] }
];
