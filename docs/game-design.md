# Red Lines — document de design, version 0.3

> Document vivant. Les décisions ouvertes sont marquées **[À TRANCHER]**.
> Les faits à sourcer sont marqués **[À SOURCER]** et renvoient aux prompts de `docs/recherche/prompts.md`.

## 1. Vision

Un jeu de gestion de crise au tour par tour (1 tour = 1 mois). Le joueur dirige la **cellule de crise** d'une puissance militaire. Il répartit ses capteurs de renseignement, projette ses forces, négocie avec ses alliés et tranche des dilemmes. Il le fait sous une contrainte politique **propre à son pays**.

L'objectif est un réalisme de **décideur**, pas de tacticien. Le joueur ne pilote pas un char : il décide d'engager ou non un groupement, sachant ce que cela coûtera en budget, en opinion, en crédibilité et en risque d'escalade.

**Ce qui doit rendre chaque nation différente :** ses institutions et sa procédure d'emploi de la force, plus que ses unités. La France vote l'article 35. Les États-Unis négocient avec le Congrès. La Russie gère la possibilité de nier. La Chine arbitre entre légitimité du Parti et croissance. Israël tient une coalition gouvernementale fragile.

## 2. Période

**Décidé : départ commun en janvier 2015**, juste après les attentats de Paris, avec la menace russe et nord-coréenne en toile de fond. Campagnes 2015-2018.

Raisons :
- **Les 6 nations se croisent au Levant.** Coalition contre Daech (États-Unis, Royaume-Uni, France), intervention russe (septembre 2015), opérations israéliennes en Syrie contre les transferts d'armes iraniens. La Chine reste en retrait. C'est un théâtre commun naturel pour faire interagir les joueurs et les IA.
- Chaque nation a ses propres fronts : Sahel (France), flanc est de l'OTAN et Ukraine après 2014 (Russie, Royaume-Uni, États-Unis), mer de Chine méridionale (Chine), Gaza, Liban et programme nucléaire iranien (Israël).
- **On évite les guerres en cours** (Ukraine depuis 2022, Gaza depuis 2023). C'est plus sûr pour la sensibilité, la réception publique et la modération Steam. C'est aussi plus solide pour le réalisme, car les sources sur 2015-2018 sont publiées et stabilisées.
- Le prototype est déjà calé sur 2015-2017.

Les campagnes **divergent** de l'histoire réelle selon les choix du joueur. Le contexte est réel, la suite est originale.

## 3. Nations jouables

Pour chaque nation, la **mécanique signature** est le cœur du gameplay. Les détails chiffrés sont **[À SOURCER]**.

### France *(prototype existant, sert de référence)*
- **Rôle du joueur :** conseil de défense et de sécurité nationale.
- **Contrainte politique :** l'article 35 de la Constitution. Information du Parlement, puis vote au-delà de 4 mois d'intervention. S'y ajoutent l'opinion et l'état d'urgence.
- **Renseignement :** DGSE, DGSI, DRM, ANSSI.
- **Signature :** autonomie stratégique. Une armée complète mais échantillonnaire (peu d'exemplaires de chaque capacité), des bases prépositionnées en Afrique et dans l'océan Indien, et une dépendance aux États-Unis pour la surveillance et le transport stratégique.
- **Fronts :** Sahel, Levant, territoire national, Libye, flanc est.

### États-Unis
- **Rôle :** Conseil de sécurité nationale (*NSC*).
- **Contrainte :** loi sur les pouvoirs de guerre (*War Powers Resolution*, délai de 60 + 30 jours), autorisations d'emploi de la force (*AUMF*) héritées de 2001 et 2002, budget voté par le Congrès, cycle électoral (élection présidentielle de novembre 2016 et transition).
- **Renseignement :** CIA, NSA, DIA, FBI, NGA.
- **Signature :** **attention dispersée.** Des moyens immenses, mais des capacités rares (porte-avions, ISR, forces spéciales) réclamées sur tous les théâtres à la fois. L'enjeu est de choisir ce qu'on néglige. Les États-Unis sont le partenaire indispensable de tous les autres joueurs.
- **Fronts :** Levant, Afghanistan, Corée, mer de Chine méridionale, flanc est, Corne de l'Afrique.

### Royaume-Uni
- **Rôle :** comité de crise du gouvernement (*COBR*) et Conseil de sécurité nationale.
- **Contrainte :** convention parlementaire. Le vote sur la Syrie est rejeté en 2013, celui sur les frappes contre Daech approuvé en décembre 2015. Revue stratégique (*SDSR*) de 2015, référendum sur le Brexit en juin 2016.
- **Renseignement :** MI6, MI5, GCHQ, Defence Intelligence.
- **Signature :** **effet de levier.** Une masse militaire limitée, mais un accès privilégié aux États-Unis (*Five Eyes*, relation spéciale). Une partie de la puissance se joue en influence sur le jeu américain.
- **Fronts :** Levant, flanc est (présence avancée), territoire (terrorisme et Irlande du Nord), Atlantique Nord.
- **Jouable** (`src/data/royaume-uni.ts`) : 28 unités sans porte-avions, MI6, MI5, GCHQ, DI, convention parlementaire, relation spéciale, 20 dossiers.

### Russie
- **Rôle :** Conseil de sécurité de la Fédération.
- **Contrainte :** peu de contre-pouvoirs internes (autorisation du Conseil de la Fédération, accordée en septembre 2015 pour la Syrie). Les vraies contraintes sont **économiques** (sanctions depuis 2014, prix du pétrole) et de **coût humain visible**.
- **Renseignement :** FSB, SVR, GRU.
- **Signature :** **possibilité de nier.** Sociétés militaires privées, forces « non attribuées », guerre de l'information. Une jauge d'exposition remplace en partie l'opinion : une opération niable coûte moins cher politiquement, mais son exposition entraîne sanctions et isolement.
- **Fronts :** Syrie, Donbass, flanc ouest (OTAN), Caucase, Arctique.

### Chine
- **Rôle :** Commission militaire centrale.
- **Contrainte :** **légitimité du Parti**, adossée à la croissance et à la stabilité intérieure. Réforme de l'Armée populaire de libération (création des cinq commandements de théâtre en février 2016). Image internationale (initiative des Nouvelles routes de la soie).
- **Renseignement :** ministère de la Sécurité d'État (*MSS*) et renseignement militaire de l'APL.
- **Signature :** **temps long et zone grise.** Milices maritimes, garde-côtes, construction d'îles artificielles. Le joueur gagne par accumulation sous le seuil de la guerre et perd s'il déclenche une crise ouverte trop tôt. Première base à l'étranger à Djibouti en 2017.
- **Fronts :** mer de Chine méridionale, détroit de Taïwan, péninsule coréenne, frontière indienne, Xinjiang, Corne de l'Afrique.

### Israël
- **Rôle :** cabinet de sécurité.
- **Contrainte :** **coalition gouvernementale.** Chaque décision lourde peut faire tomber le gouvernement. S'y ajoutent le soutien américain (aide militaire, couverture diplomatique) et l'opinion internationale.
- **Renseignement :** Mossad, Shin Bet, Aman (dont l'unité 8200).
- **Signature :** **fronts simultanés et délais très courts.** Excellent renseignement, réaction en heures plutôt qu'en mois. Doctrine de « campagne entre les guerres » : frappes limitées pour retarder l'adversaire sans déclencher de guerre ouverte. Le programme nucléaire iranien est la toile de fond (accord de Vienne en juillet 2015).
- **Fronts :** Liban (Hezbollah), Syrie, Gaza, Iran (à distance), Sinaï. La Cisjordanie n’est pas un théâtre du jeu.
- **Jouable** (`src/data/israel.ts`) : six théâtres propres, 22 unités, Mossad, Shin Bet, Aman, Cabinet de sécurité, campagne entre les guerres, 18 dossiers.

## 4. Acteurs non jouables

Toutes les nations jouables non choisies sont pilotées par l'IA, en partenaires ou en rivaux selon le contexte. Liste de départ, à enrichir :

**États**
- **Moyen-Orient :** Iran, Syrie (régime), Turquie, Arabie saoudite, Émirats, Qatar, Égypte, Irak, Jordanie.
- **Asie :** Corée du Nord, Corée du Sud, Japon, Inde, Pakistan, Taïwan, Vietnam, Philippines, Australie.
- **Europe :** Ukraine, Pologne, États baltes, Allemagne, Italie, Norvège, Biélorussie, Serbie.
- **Afrique :** Mali, Niger, Tchad, Nigeria, Libye (deux gouvernements rivaux), Algérie, Éthiopie, Djibouti.
- **Amériques :** Venezuela, Cuba, Canada.

**Groupes armés et réseaux**
- **Djihadistes :** Daech et ses branches, al-Qaïda et ses branches (AQMI, al-Nosra, AQPA, al-Shabaab), Boko Haram.
- **Liés à l'Iran :** Hezbollah, Houthis, milices chiites irakiennes.
- **Gaza :** Hamas, Jihad islamique.
- **Kurdes :** PKK, YPG/FDS. Ce dernier est un cas à double statut : partenaire des Occidentaux, ennemi de la Turquie.
- **Divers :** Taliban, pirates (Corne de l'Afrique, golfe de Guinée), groupes cyber parrainés par des États, sociétés militaires privées.

**Principe :** chaque acteur a des **intérêts**, des **lignes rouges** et une **IA à base de scores** (*utility AI*). Il note chaque action possible et choisit la mieux notée selon ses intérêts. C'est cette IA qui produit la rejouabilité.

## 5. Histoires

Chaque nation propose **plusieurs campagnes originales** (objectif : 3 au lancement) et un **mode bac à sable**.

- **Une campagne** est une chaîne d'événements avec embranchements, déclenchée par des conditions. Le moteur d'événements du prototype (`cond`, `choix`, `suite`, `suiteDelai`) est la base.
- **Personnages et groupes fictifs :** les personnages et les groupes précis sont inventés, dans un contexte réel. Aucune victime réelle n'est mise en scène et aucun dirigeant réel n'est nommé : on parle du « Président », du « Premier ministre », etc. **[À TRANCHER : faut-il nommer les dirigeants réels ?]**
- **Pistes à développer**, une par nation pour commencer :
  - **France :** réseau logistique transsaharien qui relie le Sahel à la Libye et à la Méditerranée.
  - **États-Unis :** transition présidentielle en pleine crise d'otages.
  - **Royaume-Uni :** fuite d'une source des Five Eyes pendant la campagne du Brexit.
  - **Russie :** une société militaire privée devenue trop autonome.
  - **Chine :** collision en mer de Chine méridionale, avec une vidéo qui circule.
  - **Israël :** transfert d'armes vers le Liban détecté la veille d'un vote de confiance.

## 6. Règles de sensibilité

1. **Les pertes civiles sont toujours un coût**, jamais une stratégie récompensée. Elles pèsent sur l'opinion, la légitimité ou l'exposition, et sur la relation avec les alliés.
2. **Pas de mécanique de crime de guerre** (cibler des civils, torturer) comme option efficace. Ces options peuvent apparaître dans un dilemme, mais elles sont alors lourdement sanctionnées.
3. **Les attentats sur le territoire restent génériques.** Aucun attentat réel n'est reproduit.
4. Le ton est **sobre et documentaire**, sans héroïsation.

## 7. Implications techniques

Le prototype est écrit pour la France. Il faut le généraliser :

- **`nation`** : institutions, services de renseignement, forces, ressources de départ, jauges propres (opinion, légitimité, exposition, coalition).
- **`procedureEmploiForce`** : la contrainte politique décrite **en données** (délais, votes, seuils), interprétée par un moteur commun.
- **Monde partagé :** un seul état mondial. Les nations IA y jouent leurs tours avec la même simulation que le joueur.
- **Théâtres mondiaux :** le graphe actuel de 8 théâtres passe à environ 25-30 théâtres. Les cartes régionales de zoom sont réutilisées.
- **Traductions :** tous les textes dans des fichiers de langue (français et anglais au lancement).

### 7 bis. Modèle `nation` (fait)

- Une nation est une entrée de `NATIONS` (`src/data/nations.ts`) : théâtres de la partie, territoire, bases prépositionnées, unités, services, alliés et relations initiales, opérations, doctrines, procédure d’emploi de la force (avec catégories exemptées), effet de levier éventuel sur un allié, nombre de fronts tolérés par l’opinion, cadre de la carte du monde, devise, libellés, briefing.
- Le monde est un **catalogue partagé** à identifiants uniques : théâtres, cartes régionales, menaces, alliés, opérations. Une menace n’apparaît que si son théâtre de départ fait partie de la partie ; les services qui la renseignent sont listés pour toutes les nations.
- La simulation et l’interface passent par des accesseurs (`unitesDe`, `theatresDe`, `alliesDe`, `operationsDe`, `doctrinesDe`, `territoire`, `devise`). Un dossier n’est proposé qu’à la nation de son auteur.
- `verifierDonnees` contrôle chaque nation : références, au moins 15 dossiers, un service capable de renseigner chaque menace de ses théâtres.
- Nations jouables : **France**, **Royaume-Uni**, **Israël**. Le tutoriel suit la campagne de la France.
- Prochaine étape (phase 3) : le monde partagé, où les autres nations jouent avec la même simulation.

## 8. Feuille de route

| Phase | Contenu | Critère de sortie |
|---|---|---|
| 0 ✅ | Migration du prototype en TypeScript, tests en ligne de commande, nouvelle interface, tutoriel | Parties de référence rejouées à l’identique |
| 1 ✅ | France généralisée (modèle `nation`) et robot testeur. Cartes régionales, saisons, tactique, identité des forces, robot prudent | Une partie complète jouable et équilibrée par le robot |
| 2 ✅ | Royaume-Uni, puis Israël (avancé de la phase 4 : fiche de recherche la plus complète, aucun théâtre commun avec la France) | Prouve que le modèle est générique |
| 3 | Monde partagé avec nations IA | Les 6 nations coexistent, dont 5 pilotées par l'IA |
| 4 | États-Unis jouables (fiche de recherche à refaire) | |
| 5 | Russie et Chine jouables (systèmes politiques les plus différents) | |
| 6 | Campagnes, graphismes, Steam (accès anticipé ?) | |

## 9. Nom du jeu

**Décidé : Red Lines.** Vérification de marque à faire avant la page Steam.

Contrainte : le jeu sort sur Steam, donc le nom doit fonctionner en anglais. Une recherche web rapide a été faite le 9 octobre 2026. Ce n'est pas une recherche de marque déposée.

| Proposition | Idée | Conflit repéré |
|---|---|---|
| **Red Lines** / Lignes rouges | Chaque nation a ses lignes rouges, et le jeu consiste à les tester sans les franchir | Un petit jeu de plateau « Red Lines » (Gumroad). Pas de jeu vidéo Steam trouvé. |
| **Threshold** / Seuil | Le seuil de la guerre ouverte, cœur de la mécanique de zone grise | Pas vérifié |
| **Six Rooms** | Les six salles de crise | Pas vérifié |
| **Raison d'État** | Exact sur le thème, compris en anglais | Extension du jeu de plateau *Coalitions* (2024). Risque de confusion. |
| **Grey Zone** | Exact sur le thème | Déjà pris (*Gray Zone*, *Grey Zone Warfare* sur Steam). À écarter. |
| **Escalation** | | Très encombré. À écarter. |

## 10. Théâtres régionaux, biomes et saisons

Chaque théâtre a une **carte régionale** (`src/data/cartes-regionales.ts`) : 10 à 12 lieux réels, des liaisons cohérentes avec le terrain et trois scénarios de crise. Un clic sur un théâtre ouvre cette carte à la place de la carte du monde ; la fiche du théâtre reste à droite et une barre d’onglets permet de passer d’un théâtre à l’autre.

- **Biomes** (`src/data/biomes.ts`) : palette, textures et éléments de relief. Le décor est peint par code sur un canvas à partir de Natural Earth, puis affiché comme une image : aucun fichier lourd, aucune dépendance réseau.
- **Saisons** : déclarées dans la définition de chaque théâtre (`SAISONS` dans `src/data/monde.ts`). Chaque mois appartient à une seule saison, ce que `verifierDonnees()` contrôle. Effets possibles : pression par catégorie de force, fatigue, coûts mensuels, croissance d’une menace, frappes et reconnaissances disponibles en crise. L’indicateur de saison apparaît dans la fiche, la vue régionale, l’intervention et sur la carte du monde (pastille colorée).

## 11. Profondeur tactique

Une fois déployée, une unité se commande sur la carte régionale (`src/sim/tactique.ts`, données dans `src/data/tactique.ts`). La vue stratégique reste mensuelle : la tactique s’agrège en effets du mois.

- **Implantation** : les forces au sol (Terre, forces spéciales, sécurité intérieure) occupent un lieu non tenu par l’adversaire, relié à leur position ; avec des hélicoptères sur le théâtre, n’importe quel lieu libre. Aviation et Marine opèrent « hors carte » (bases aériennes, mer).
- **Postures** : offensive (pression ×1,4, fatigue ×1,5, risque de pertes), défensive (protège le lieu tenu, renforce sa défense en crise), reconnaissance (renseignement ×2, identifie les positions voisines), formation des partenaires, réserve (repos sur place).
- **Missions** : patrouille de zone, escorte de convoi, contrôle d’un axe, raid sur un lieu identifié, frappe, appui à une unité partenaire, sauvetage et évacuation.
- **Coordination interarmes** : chaque lieu adverse a un niveau de connaissance ; au-delà de 50, il est identifié. Drones, reconnaissance et patrouilles identifient ; seules les positions identifiées peuvent être frappées ou attaquées ; un raid sur une position frappée le même mois réussit mieux ; les hélicoptères donnent l’allonge (raids à deux liaisons).
- **Contraintes** : soutien logistique par théâtre (capacité de la carte, A400M, ravitailleurs, BPC, escortes, transport allié) ; en pénurie, efficacité réduite jusqu’à −50 % et coûts +25 % ; règles d’engagement (aucune frappe sur le territoire national, à l’est ni en mer de Chine) ; risques de pertes et de dommages collatéraux affichés avant chaque ordre.
- **Ergonomie** : deux clics pour un ordre courant (l’unité, puis le lieu marqué ; ou l’unité, puis un ordre du panneau).
- **Lien avec les crises** : l’intervention de six semaines part de la situation du théâtre (contrôle des lieux, activité adverse, garnisons) et la met à jour à la fin.

## 12. Identité visuelle des forces

- **Insignes** : un par unité, créés par code (écu, couleurs, symbole de spécialité, devise fictive). Ils s’inspirent des conventions héraldiques sans reproduire d’insigne officiel.
- **Symboles OTAN (APP-6)** : générés par la bibliothèque libre milsymbol à partir d’un code SIDC déclaré en données. Ils remplacent les jetons sur les cartes régionales et accompagnent les listes.
- **Catalogue des matériels** (`src/data/materiels.ts`) : 22 matériels avec rôle, caractéristiques et source de chaque valeur, et une illustration dessinée par code. Chaque unité renvoie vers ses matériels (`src/data/identite-unites.ts`). Accessible par le menu (« Catalogue des forces et matériels »), dans la fiche d’unité et dans les fenêtres d’événement qui mobilisent des moyens.
- Ce qui mériterait un travail d’artiste est suivi dans `docs/illustrations.md`.

## Décisions prises (validées par le propriétaire le 10 octobre 2026 : « privilégier la jouabilité, trancher en l’absence d’information »)

1. **Article 35** : la jouabilité prime sur le réalisme (les votes réels de 2015-2018 ont été quasi unanimes). Le vote reste incertain mais lisible : la fiche du théâtre détaille ses facteurs (opinion, capital, crédibilité, doctrine, crise en cours) et le joueur peut **organiser un débat au Parlement** (1 action, 2 de capital, +15 %). Un refus impose toujours le retrait.
2. **Crises hors carte** (Métropole, Est, Indo-Pacifique) : plus de tirage abstrait. Chaque théâtre propose deux réponses propres, avec leurs moyens, leur probabilité et leurs effets en cas de succès ou d’échec (forces d’intervention ou plan d’urgence ; réassurance ou désescalade ; patrouille de liberté de navigation ou protestation coordonnée).
3. **Ordres tactiques gratuits** : confirmé. Ils sont limités par le soutien, les coûts et les risques, et l’adversaire réagit désormais (embuscades, harcèlement, dispersion après une frappe).
4. **Posture défensive par défaut** au déploiement : confirmé.
5. **Difficulté** : cible pour un joueur méthodique (robot prudent) ≈ 0-5 % de défaites en facile, ≈ 15 % en normal, ≈ 30 % en difficile.
6. **Score** : un domaine « Contrôle du terrain » (part des lieux non tenus par l’adversaire sur les théâtres d’intervention) récompense le travail tactique.
7. Les autres décisions de la première session (cinq théâtres à crises sur carte, lieux russes et chinois en lecture seule, coefficients saisonniers, capacités de soutien, devises fictives, caractéristiques « À VÉRIFIER ») sont maintenues.

## Décisions de la troisième session (10 octobre 2026, « prendre la meilleure décision »)

1. **Modèle nation** : catalogue mondial partagé, identifiants uniques, listes de la partie tirées de la nation. Préféré à une copie des données par nation (doublons) et à un état global mutable (rejouabilité). Il prépare le monde partagé de la phase 3.
2. **Nations créées d’abord** : le Royaume-Uni (proche de la France, mêmes théâtres) puis Israël (fiche la plus complète). Russie et Chine attendent : leurs systèmes politiques demandent des jauges propres (exposition, légitimité du Parti) et leurs fiches sont moins fournies. Les États-Unis attendent une fiche refaite.
3. **Royaume-Uni** : vote des Communes dès le premier mois, forces spéciales exemptées ; effet de levier sur les États-Unis (+12 points, un point de capital et de relation de moins par demande).
4. **Israël** : le Cabinet de sécurité avalise les engagements terrestres durables ; frappes, forces spéciales et marine en sont exemptées (campagne entre les guerres). Gaza, le Liban, la Syrie et l’Iran se résolvent hors carte : pas de bataille tactique dans des quartiers peuplés ; toute frappe sur un lieu habité a un coût civil. L’Iran n’est frappable que par une décision politique (opération « Frappe préventive »). La Cisjordanie n’est pas un théâtre du jeu.
5. **Monnaies** : chaque nation affiche la sienne (M€, M£, M ILS) sur une échelle de jeu commune ; les coûts ne sont pas convertis.
6. **Chargement** : l’écran de jeu (carte du monde, milsymbol) est un morceau séparé, préchargé pendant l’accueil. Accueil interactif en 0,58 s au lieu de 1,46 s (processeur ralenti ×4) ; arrivée sur la carte inchangée.
7. **Équilibre** visé et atteint pour les trois nations (robot prudent) : 0 % en facile, 7 à 13 % en normal, 27 à 33 % en difficile.

## Décisions de la première session (historique)


Décisions prises pendant la session autonome du 10 octobre 2026, avec l’option la plus prudente. À confirmer ou corriger.

1. **Crises sur carte régionale limitées à cinq théâtres** (Levant, Sahel, Libye, golfe de Guinée, Djibouti). Sur le territoire national, à l’est et en Indo-Pacifique, l’adversaire est un État ou il s’agit du sol national : raids et frappes y seraient absurdes ou dangereux pour le ton. La crise y reste résolue globalement, avec un titre et un texte propres au théâtre.
2. **Lieux russes et chinois marqués « adversaire »** sur les cartes de l’est et de la mer de Chine, pour la lecture seulement : aucune action offensive n’est possible contre eux.
3. **Coefficients saisonniers** choisis à dire d’expert (par exemple −30 % de pression terrestre au Sahel pendant les pluies, +35 % de fatigue au Levant l’été). Ils sont marqués « À VÉRIFIER » et devraient être calés sur des retours d’expérience.
4. **Vote de l’article 35** : la recherche montre que tous les votes de 2015-2018 ont été quasi unanimes ; le jeu garde un vote incertain (probabilité selon l’opinion et le capital) pour préserver la tension. À trancher : rendre le refus beaucoup plus rare ?
5. **Mesure de l’équilibre** : le robot aléatoire des parties de référence a une forte variance (un changement mineur de carte fait varier la part de défaites de plus de 10 points). Les chiffres d’équilibre des commits doivent être lus avec prudence ; un robot heuristique est prévu.
6. **Ordres tactiques gratuits** : implantation, posture et mission ne consomment pas d’action du mois ; ils sont limités par le soutien logistique, les coûts des missions et les risques. Alternative possible : un nombre d’ordres par théâtre.
7. **Posture par défaut « défensive »** à chaque déploiement, pour conserver l’équilibre antérieur (même pression qu’avant).
8. **Capacités de soutien des théâtres** (Sahel 8, Djibouti et pays baltes 6, golfe de Guinée 5, Levant 4, Libye et mer de Chine 3) : valeurs de conception, à confronter aux élongations réelles.
9. **Difficulté** : le robot prudent (`tests/bot-prudent.ts`) ne perd que 4 à 7 % de ses parties, même en difficile. Le jeu est sans doute trop clément pour un joueur méthodique ; à rééquilibrer après les retours de parties humaines.
10. **Devises des insignes** : fictives et volontairement génériques. À faire vérifier : aucune ne doit coïncider avec la devise réelle d’une unité.
11. **Caractéristiques des matériels** : seules celles issues de la recherche portent une source ; les valeurs de constructeur (longueur, équipage, capacité) sont marquées « À VÉRIFIER ».
