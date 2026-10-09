# Document de design — version 0.1

> Document vivant. Les décisions ouvertes sont marquées **[À TRANCHER]**.
> Les faits à sourcer sont marqués **[À SOURCER]** et renvoient aux prompts de `docs/recherche/prompts.md`.

## 1. Vision

Un jeu de gestion de crise au tour par tour (1 tour = 1 mois). Le joueur dirige la **cellule de crise** d'une puissance militaire. Il répartit ses capteurs de renseignement, projette ses forces, négocie avec ses alliés et tranche des dilemmes. Il le fait sous une contrainte politique **propre à son pays**.

L'objectif est un réalisme de **décideur**, pas de tacticien. Le joueur ne pilote pas un char : il décide d'engager ou non un groupement, sachant ce que cela coûtera en budget, en opinion, en crédibilité et en risque d'escalade.

**Ce qui doit rendre chaque nation différente :** ses institutions et sa procédure d'emploi de la force, plus que ses unités. La France vote l'article 35. Les États-Unis négocient avec le Congrès. La Russie gère la possibilité de nier. La Chine arbitre entre légitimité du Parti et croissance. Israël tient une coalition gouvernementale fragile.

## 2. Période

**Proposition : départ commun en janvier 2015**, avec des campagnes couvrant 2015-2018. **[À TRANCHER]**

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
- **Fronts :** Liban (Hezbollah), Syrie, Gaza, Cisjordanie, Iran (à distance), Sinaï.

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

## 8. Feuille de route

| Phase | Contenu | Critère de sortie |
|---|---|---|
| 0 | Migration du prototype en TypeScript, tests en ligne de commande, intégration continue (*CI*) | `simuler()` passe dans la CI |
| 1 | France généralisée (modèle `nation`) et robot testeur | Une partie complète jouable et équilibrée par le robot |
| 2 | Royaume-Uni, la nation la plus proche de la France | Prouve que le modèle est générique |
| 3 | Monde partagé avec nations IA | Les 6 nations coexistent, dont 5 pilotées par l'IA |
| 4 | États-Unis et Israël jouables | |
| 5 | Russie et Chine jouables (systèmes politiques les plus différents) | |
| 6 | Campagnes, graphismes, Steam (accès anticipé ?) | |

## 9. Nom du jeu

Nom de travail : **Cellule de crise**. **[À TRANCHER]**

Contrainte : le jeu sort sur Steam, donc le nom doit fonctionner en anglais. Une recherche web rapide a été faite le 9 octobre 2026. Ce n'est pas une recherche de marque déposée.

| Proposition | Idée | Conflit repéré |
|---|---|---|
| **Red Lines** / Lignes rouges | Chaque nation a ses lignes rouges, et le jeu consiste à les tester sans les franchir | Un petit jeu de plateau « Red Lines » (Gumroad). Pas de jeu vidéo Steam trouvé. |
| **Threshold** / Seuil | Le seuil de la guerre ouverte, cœur de la mécanique de zone grise | Pas vérifié |
| **Six Rooms** | Les six salles de crise | Pas vérifié |
| **Raison d'État** | Exact sur le thème, compris en anglais | Extension du jeu de plateau *Coalitions* (2024). Risque de confusion. |
| **Grey Zone** | Exact sur le thème | Déjà pris (*Gray Zone*, *Grey Zone Warfare* sur Steam). À écarter. |
| **Escalation** | | Très encombré. À écarter. |
