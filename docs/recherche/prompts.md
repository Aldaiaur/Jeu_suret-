# Prompts de recherche

Chaque prompt se colle tel quel dans un outil de recherche approfondie (Claude Research, ChatGPT Deep Research, Perplexity…). Ils sont indépendants : lance-les en parallèle.

**Où déposer les résultats :** dans `docs/recherche/resultats/`, sous le nom indiqué pour chaque prompt (par exemple `nation-USA.md`). Je les convertis ensuite en fichiers de données du jeu et je signale les contradictions entre sources.

---

## Consignes communes (déjà incluses dans chaque prompt)

> Période : 1er janvier 2015 – 31 décembre 2018. Donne des valeurs datées. Si une valeur change au cours de la période, donne chaque valeur avec sa date.
> Pour chaque chiffre : la source (titre, éditeur, année, URL) et un niveau de confiance (élevé = source officielle ou référence comme l'IISS Military Balance ou le SIPRI ; moyen = presse spécialisée ou think tank ; faible = estimation ou source unique).
> Si une donnée n'existe pas publiquement, écris « non public » plutôt que d'estimer sans le dire.
> Présente les résultats en tableaux Markdown.

---

## 1. Fiche nation — un prompt par nation (6 prompts)

Remplace `{NATION}` successivement par : **États-Unis, Royaume-Uni, Russie, Chine, France, Israël**.
Fichier de sortie : `nation-{CODE}.md` (USA, GBR, RUS, CHN, FRA, ISR).

```
Je conçois un jeu de stratégie réaliste sur la gestion de crises militaires et sécuritaires entre 2015 et 2018. J'ai besoin d'une fiche documentée sur {NATION}.

Période : 1er janvier 2015 – 31 décembre 2018. Donne des valeurs datées. Si une valeur change au cours de la période, donne chaque valeur avec sa date.
Pour chaque chiffre : la source (titre, éditeur, année, URL) et un niveau de confiance (élevé = source officielle ou référence comme l'IISS Military Balance ou le SIPRI ; moyen = presse spécialisée ou think tank ; faible = estimation ou source unique).
Si une donnée n'existe pas publiquement, écris « non public » plutôt que d'estimer sans le dire.
Présente les résultats en tableaux Markdown.

1. DÉCISION ET CONTRAINTES POLITIQUES
- Qui décide de l'emploi de la force (organe, composition, fréquence de réunion) ?
- Procédure juridique d'engagement à l'étranger : textes, délais, votes, autorisations nécessaires, précédents 2015-2018 (dates, résultats des votes).
- Procédures d'exception sur le territoire (état d'urgence, lois antiterroristes) et leur durée.
- Contre-pouvoirs réels : parlement, justice, opinion, médias, coalition gouvernementale, Parti.
- Événements politiques intérieurs majeurs 2015-2018 (élections, référendums, remaniements, crises gouvernementales).

2. BUDGET
- Budget de défense annuel 2015-2018 (en monnaie locale et en dollars courants, en % du PIB).
- Coût des opérations extérieures par an et, si disponible, par opération.
- Budget des services de renseignement (si public).

3. RENSEIGNEMENT
- Liste des services (nom, tutelle, domaine : extérieur, intérieur, militaire, technique, cyber).
- Effectifs et capacités notables (satellites, interception, réseaux humains, drones).
- Partenariats de renseignement (Five Eyes, accords bilatéraux).

4. FORCES PROJETABLES (pas l'ordre de bataille complet, seulement ce qu'un décideur engage)
Pour chaque type : nom, nombre d'unités ou de vecteurs disponibles, effectif type d'un détachement projeté, délai de projection typique, contraintes (entretien, rotation), coût de déploiement estimé.
Types : forces spéciales ; unités d'intervention intérieure ; brigades ou groupements terrestres projetables ; aviation de combat ; drones armés et non armés ; ISR aérien ; ravitaillement en vol ; transport stratégique ; porte-avions ou groupes aéronavals ; sous-marins d'attaque ; bâtiments amphibies ; frégates ; artillerie à longue portée ; défense antiaérienne et antimissile ; capacités cyber offensives (ce qui est public) ; sociétés militaires privées liées à l'État (si applicable).

5. PRÉSENCE À L'ÉTRANGER
- Bases et déploiements permanents (lieu, effectif, moyens).
- Opérations extérieures 2015-2018 : nom, théâtre, dates, effectif maximal, moyens, résultats, pertes.

6. ALLIANCES ET RIVALITÉS
- Alliés formels et partenaires de fait, avec ce que chacun apporte concrètement.
- Rivaux et adversaires, avec les points de friction et les incidents 2015-2018.
- Lignes rouges déclarées ou observées.

7. DOCTRINE
- Documents stratégiques de la période (livres blancs, revues, stratégies de sécurité nationale) et leurs priorités.
- Style d'emploi de la force caractéristique (exemples concrets).
```

---

## 2. Coûts et délais comparés des déploiements

Fichier de sortie : `couts-deploiements.md`

```
Pour un jeu de stratégie réaliste (2015-2018), compare les coûts et délais de déploiement militaire de six pays : États-Unis, Royaume-Uni, Russie, Chine, France, Israël.

Période : 2015-2018. Pour chaque chiffre : source (titre, éditeur, année, URL) et niveau de confiance (élevé / moyen / faible). Si non public, écris « non public ». Tableaux Markdown.

Pour chaque pays et si possible chaque type de moyen :
- coût de l'heure de vol (avion de combat, drone MALE, ravitailleur, transport, hélicoptère) ;
- coût journalier ou mensuel d'un groupe aéronaval ou d'une frégate déployée ;
- coût mensuel d'un détachement terrestre d'environ 1 000 personnes en opération extérieure ;
- coût unitaire des munitions guidées courantes (bombe guidée, missile de croisière) ;
- délais réels observés entre la décision et l'arrivée sur zone (exemples datés) ;
- durée de rotation et temps de régénération après un déploiement.
```

---

## 3. Groupes armés non étatiques

Fichier de sortie : `acteurs-non-etatiques.md`

```
Pour un jeu de stratégie réaliste (2015-2018), fais une fiche sur chacun de ces acteurs : Daech (Irak-Syrie, Libye, Sinaï, Afrique de l'Ouest), al-Qaïda au Maghreb islamique et JNIM, al-Nosra / HTS, AQPA, al-Shabaab, Boko Haram, Hezbollah, Hamas, Jihad islamique palestinien, Houthis, milices chiites irakiennes (Hachd al-Chaabi), PKK, YPG/FDS, Taliban, pirates somaliens, pirates du golfe de Guinée.

Période : 2015-2018. Pour chaque chiffre : source et niveau de confiance (élevé / moyen / faible). Si non public, « non public ». Tableaux Markdown.

Pour chaque acteur :
- effectifs estimés par année et zones contrôlées ou d'opération ;
- armement et capacités notables (roquettes, drones, missiles antichars, capacités navales) ;
- financement et soutiens étatiques ;
- mode d'action typique et cibles ;
- relations avec les six puissances (États-Unis, Royaume-Uni, Russie, Chine, France, Israël) ;
- principales opérations menées contre lui, avec leurs résultats ;
- évolution 2015-2018 (montée, apogée, déclin).
```

---

## 4. États non jouables

Fichier de sortie : `etats-non-jouables.md`

```
Pour un jeu de stratégie réaliste (2015-2018), décris la posture des États suivants vis-à-vis de six puissances (États-Unis, Royaume-Uni, Russie, Chine, France, Israël) : Iran, Syrie, Turquie, Arabie saoudite, Émirats arabes unis, Qatar, Égypte, Irak, Jordanie, Corée du Nord, Corée du Sud, Japon, Inde, Pakistan, Taïwan, Vietnam, Philippines, Australie, Ukraine, Pologne, États baltes, Allemagne, Italie, Biélorussie, Mali, Niger, Tchad, Nigeria, Libye (GNA et forces de Haftar), Algérie, Éthiopie, Djibouti, Venezuela.

Période : 2015-2018. Sources et niveau de confiance pour chaque affirmation factuelle. Tableaux Markdown.

Pour chaque État :
- relation avec chacune des six puissances (note de 0 à 100 avec justification, et évolution sur la période) ;
- intérêts principaux et lignes rouges ;
- capacités militaires notables (en bref) ;
- crises et incidents marquants 2015-2018 ;
- ce que cet État peut apporter ou refuser à chaque puissance (bases, survol, renseignement, troupes).
```

---

## 5. Chronologie des crises

Fichier de sortie : `chronologie-crises.md`

```
Établis une chronologie mois par mois (janvier 2015 – décembre 2018) des crises militaires, sécuritaires et diplomatiques ayant impliqué au moins une de ces puissances : États-Unis, Royaume-Uni, Russie, Chine, France, Israël.

Pour chaque entrée : date, lieu, acteurs, description factuelle en deux phrases, décisions prises par chaque puissance impliquée, conséquences, source (URL).
Inclus : attentats, prises d'otages, incidents navals ou aériens, cyberattaques attribuées, coups d'État, essais nucléaires ou balistiques, votes parlementaires sur l'emploi de la force, débuts et fins d'opérations.
Tableau Markdown, une ligne par événement.
```

---

## 6. Vérification des données du prototype (France)

Fichier de sortie : `verification-prototype-FRA.md`

Les 30 valeurs marquées « À VÉRIFIER » dans le prototype, prêtes à coller.

```
Vérifie les valeurs suivantes, issues d'un jeu de stratégie réaliste sur la France 2015-2017. « Effectif » désigne le personnel engagé quand l'unité est déployée en opération extérieure, ou l'effectif total de l'unité quand il s'agit d'un régiment. Les coûts sont en millions d'euros : coût de mise en place sur le théâtre, puis coût mensuel en opération.
Pour chaque ligne : valeur correcte (ou fourchette), date, source (URL), niveau de confiance (élevé / moyen / faible), et correction proposée si la valeur du jeu est fausse. Tableau Markdown.

- 1er RPIMa : effectif 900 ; déploiement 3 ; mensuel 3
- 13e RDP : effectif 900 ; déploiement 3 ; mensuel 3
- CPA 10 : effectif 120 ; déploiement 2 ; mensuel 2
- Commandos marine (ensemble) : effectif 650 ; déploiement 3 ; mensuel 3
- 4e RHFS : effectif 400 ; déploiement 5 ; mensuel 4
- GIGN : effectif 380 ; déploiement 0,5 ; mensuel 1
- RAID : effectif 170 ; déploiement 0,5 ; mensuel 1
- Opération Sentinelle (contrat de 10 000 militaires) : déploiement 5 ; mensuel 25
- GTIA en opération extérieure (type Barkhane) : effectif 1 000 ; déploiement 20 ; mensuel 15
- Détachement Rafale en opération (type Chammal) : effectif 250 ; déploiement 6 ; mensuel 10
- Détachement Mirage 2000D en opération (type Barkhane) : effectif 200 ; déploiement 5 ; mensuel 8
- Drones Reaper (Niamey) : nombre de vecteurs en 2015-2017 ; effectif 80 ; déploiement 2 ; mensuel 2. Préciser la date d'armement des Reaper français.
- Détachement Atlantique 2 : effectif 120 ; déploiement 2 ; mensuel 3
- Détachement de ravitailleurs C-135FR : effectif 150 ; déploiement 2 ; mensuel 4
- A400M : nombre d'appareils livrés en 2015, 2016, 2017 ; effectif d'un détachement 120 ; déploiement 2 ; mensuel 4
- Groupe aéronaval Charles de Gaulle : effectif embarqué avec escorte 2 600 ; déploiement 15 ; mensuel 25 ; calendrier réel des déploiements et arrêts techniques 2015-2018 (le jeu suppose un arrêt de mai à septembre 2015 et de janvier à novembre 2017)
- FREMM : équipage 110 ; déploiement 2 ; mensuel 4
- SNA classe Rubis : équipage 70 ; déploiement 2 ; mensuel 3
- BPC classe Mistral : équipage hors troupes embarquées 180 ; déploiement 4 ; mensuel 5
- Groupement aéromobile ALAT en opération (Tigre, Gazelle, Caïman) : effectif 300 ; déploiement 8 ; mensuel 7
- Batterie CAESAR en opération (type Wagram en Irak) : effectif 150 ; déploiement 6 ; mensuel 4
- 2e régiment de hussards : effectif 900 ; déploiement 2 ; mensuel 2
- BRI de la préfecture de police : effectif 100 ; déploiement 0,5 ; mensuel 0,5
- E-3F AWACS : effectif d'un détachement 100 ; déploiement 2 ; mensuel 4
- C-160 Gabriel : effectif d'un détachement 60 ; déploiement 1,5 ; mensuel 2
- Frégate Horizon : équipage 190 ; déploiement 2 ; mensuel 4
- Appui américain au Sahel, au Levant, en Libye, dans la Corne et le golfe de Guinée : moyens ISR (drones, avions) réellement mis à disposition de la France, par théâtre
- Hélicoptères lourds Chinook britanniques au Sahel : date de début du déploiement et volume
```
