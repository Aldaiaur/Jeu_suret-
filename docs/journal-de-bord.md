# Journal de bord

## 10 octobre 2026 — session autonome (branche `dev`)

Session menée sans le propriétaire, selon la mission « poursuivre le développement de Red Lines ». Toutes les étapes passent `npm test`, `npm run typecheck` et `npm run build`, ont été vérifiées par captures (`npm run screens`), puis committées et poussées sur `dev`. `main` n’a pas été touchée.

### Ce qui a été fait

| Commit | Contenu |
|---|---|
| `d65b68b` | **Intégration des recherches.** Fichiers renommés (`nation-FRA.md`, `nation-GBR.md`…, `nation-USA-a-refaire.md`). Valeurs sourcées dans `france.ts` avec leur code source : Sentinelle 13 M€/mois (MISSINT 2018), GTIA 10,5 M€/mois (Cour des comptes 2016), Rafale 12 et Mirage 2000D 7 M€/mois (heures de vol × coût d’entretien), flotte Reaper, calendrier du porte-avions (arrêt technique 02/2017-09/2018), CAESAR (task force Wagram). Deux menaces (lac Tchad, al-Shabaab) et dix événements tirés des acteurs non étatiques. Outil `tools/equilibre.ts`. |
| `8722985` | **Cartes régionales des huit théâtres**, biomes et saisons. Un clic sur un théâtre ouvre sa carte (lieux réels, liaisons, fleuves schématiques, trois scénarios). Biomes peints par code sur canvas. Saisons déclarées en données et testées (pluies au Sahel, chaleur au Levant, raspoutitsa et hiver à l’est, moussons, typhons). Crises sur carte étendues à la Libye, au golfe de Guinée et à Djibouti. |
| `2331837` | **Profondeur tactique.** Implantation sur un lieu, cinq postures, sept missions (patrouille, escorte, axe, raid, frappe, appui partenaire, sauvetage), coordination interarmes (identification, frappe, exploitation, allonge des hélicoptères), soutien logistique, règles d’engagement, risques visibles avant l’ordre, deux clics pour un ordre courant. Résolution mensuelle agrégée. L’intervention de crise part de l’état des lieux et le met à jour. Robot prudent pour mesurer l’équilibre. |
| `51f0296` | **Insignes, symboles OTAN, catalogue des matériels.** Un insigne original par unité, symboles APP-6 (milsymbol, MIT), 22 matériels avec caractéristiques et sources, illustrations dessinées par code ; fiche d’unité, catalogue (menu ≡), moyens concernés dans les événements. |
| `d4eaf40` | **Ergonomie et immersion.** Les personnages présentent les dossiers (portrait, ouverture, signature), compte rendu du mois, retours animés des ordres, crochets pour les sons, tutoriel étendu, accessibilité au clavier, contraste, mesure des performances. |
| `e48d260` | Trois événements de crises entre États (ligne rouge chimique, empoisonnement d’un ancien agent chez un allié, piratage d’une campagne électorale), sans reprise d’événements réels. |

Outils ajoutés : `node tools/equilibre.ts [--robot] [révision]`, `node tools/performances.ts`, `CHROMIUM=… npm run screens`, planche `?galerie` en développement.

### Chiffres d’équilibre (début de session `6e1f835` → fin `e48d260`)

**Robot prudent** (45 parties, joueur méthodique, `tests/bot-prudent.ts`) :

| | Défaites | Durée moyenne | Score moyen |
|---|---|---|---|
| Ensemble | 4,4 % → 6,7 % | 35,6 → 35,8 mois | 61,5 → 62,7 |
| Facile | 0 % → 0 % | 36 → 36 | 70,1 → 71,6 |
| Normal | 0 % → 0 % | 36 → 36 | 62,5 → 63,7 |
| Difficile | 13,3 % → 20 % | 34,7 → 35,3 | 52,0 → 52,7 |

**Robot aléatoire** (60 parties de référence, très bruité) : défaites 63,3 % → 73,3 %, durée 29,2 → 27 mois, score 36 → 33,3. Ce robot joue au hasard ; un changement mineur fait varier la part de défaites de plus de dix points. Il sert à la non-régression, pas à l’équilibre.

Lecture : pour un joueur méthodique, le jeu reste clément (aucune défaite en facile et en normal). La difficulté est surtout portée par le mode difficile.

Performances (Chromium sans accélération matérielle, mode développement) : vue régionale 60 à 290 ms, retour au monde 130 ms, passage de mois 80 ms en moyenne (290 ms au pire), ouverture d’une intervention 140 ms. Le premier fond SVG des cartes prenait jusqu’à 9 s : il est désormais peint sur canvas.

### Ce qui reste à faire

- **Équilibrage** : le jeu est trop facile pour un joueur méthodique ; recaler la croissance des menaces, le coût des postures offensives et la capacité de soutien, puis rejouer `tools/equilibre.ts --robot`.
- **Recherche** : lancer le prompt 6 (`verification-prototype-FRA.md`) ; une vingtaine de valeurs restent « À VÉRIFIER » (effectifs des forces spéciales, coûts de mise en place, équipages, coefficients saisonniers et tactiques). Refaire la fiche États-Unis.
- **Tactique** : l’IA adverse est passive sur la carte (activité qui suit la menace, infiltration simple) ; lui donner des actions propres (embuscades, déplacements) ; résumer la tactique dans le score de fin.
- **Crises globales** (Métropole, Est, Indo-Pacifique) : concevoir une résolution propre à ces théâtres (posture de dissuasion, interception, gestion de foule) plutôt qu’un tirage.
- **Interface** : la carte régionale est étroite quand la fiche est ouverte ; envisager une fiche repliable. Les traits de mission depuis les unités hors carte partent du bord gauche.
- **Sons** : produire les fichiers et brancher `src/ui/sons.ts`, avec réglage de volume.
- **Phase 1 de la feuille de route** (modèle `nation` générique) : pas encore commencée ; les ajouts de cette session restent compatibles (tout est en données).

### Questions pour le propriétaire

1. Les crises de la Métropole, de l’Est et de l’Indo-Pacifique doivent-elles avoir une intervention sur carte, et sous quelle forme ?
2. Les ordres tactiques doivent-ils rester gratuits (limités par le soutien et les risques) ou consommer des actions ?
3. Faut-il rendre le refus de l’article 35 beaucoup plus rare, comme dans la réalité 2015-2018 (votes quasi unanimes) ?
4. Quel niveau de difficulté viser pour un joueur méthodique ?
5. Les décisions marquées « en attente » dans `docs/game-design.md` (onze points) sont-elles acceptées ?

### Ce qui demande une intervention humaine

- **Art** : illustrations des matériels, portraits, insignes plus riches, écran d’accueil ; liste détaillée dans `docs/illustrations.md`. Toute image générée par IA devra être déclarée à Steam.
- **Validation des données** : valeurs « À VÉRIFIER », caractéristiques de constructeur des matériels, coordonnées et tracés des fleuves (schématiques), devises fictives (à contrôler pour éviter toute coïncidence avec une devise réelle), noms des personnages fictifs (à vérifier contre des personnes réelles homonymes).
- **Insignes** : confirmation par un connaisseur que les créations ne ressemblent à aucun insigne officiel.
- **Comptes et dépendances** : nouvelle dépendance `milsymbol` 3.0.4 (licence MIT) à mentionner dans les crédits. Vérification de marque « Red Lines » toujours à faire.
- **Environnement** : la version de Playwright du projet attend un navigateur non installé ; les captures se lancent avec `CHROMIUM=/chemin/vers/chrome npm run screens`.

## 10 octobre 2026 — deuxième session (branche `dev`)

Consigne du propriétaire : « privilégier la jouabilité, résoudre et améliorer tout ce qui peut l’être, trancher en l’absence d’information ; l’art viendra plus tard ». Les décisions prises sont consignées dans `docs/game-design.md` (section « Décisions prises »). Chaque étape passe `npm test`, `npm run typecheck`, `npm run build` et a été vérifiée par captures. `main` n’a pas été touchée.

### Ce qui a été fait

| Commit | Contenu |
|---|---|
| `00f7526` | **Jouabilité.** Article 35 lisible (facteurs détaillés, débat au Parlement), réponses propres aux crises de la Métropole, de l’Est et de l’Indo-Pacifique, réaction adverse sur la carte (embuscades, harcèlement, dispersion après frappe), plancher de connaissance des lieux lié au renseignement, domaine de score « Contrôle du terrain », difficulté recalée, fiche repliable. |
| `d2a7e73` | **Sons synthétisés par code** (Web Audio, aucun fichier) : ordres, déploiements, succès, échecs, alertes, passage de mois ; activation et volume dans le menu. |
| `380a628` | Données vérifiées par recherche : effectifs du GIGN et du RAID, livraisons d’A400M, équipages des frégates, effectif du porte-avions. |
| `4657880` | **Modèle `nation`, phase 1** : la procédure d’emploi de la force (durée avant vote, débat, effets) est en données (`src/data/nations.ts`) et interprétée par le moteur. |
| `de7eaf1` | Tutoriel : chaque étape reste visible à l’écran ; parcours complet vérifié automatiquement (`node tools/tutoriel.ts`). |
| `dcaf5f6` | Campagne « La route du Fezzan » (quatre dossiers enchaînés selon les choix) ; échéances enrichies (arrêts techniques, suites de dossiers, pénurie de soutien, dépassement budgétaire). Tous les événements ont désormais un auteur. |
| `14ae226` | Impact logistique visible avant chaque engagement (soutien après déploiement, pénurie signalée). |

### Chiffres d’équilibre (début `4236dce` → fin `14ae226`)

**Robot prudent** (45 parties) :

| | Défaites | Durée moyenne | Score moyen |
|---|---|---|---|
| Ensemble | 6,7 % → 13,3 % | 35,8 → 35 mois | 62,7 → 59,9 |
| Facile | 0 % → 0 % | 36 → 36 | 71,6 → 70,5 |
| Normal | 0 % → 6,7 % | 36 → 36 | 63,7 → 60,9 |
| Difficile | 20 % → 33,3 % | 35,3 → 33,1 | 52,7 → 48,4 |

**Robot aléatoire** (60 parties de référence) : défaites 73,3 % → 75 %, durée 27 → 24,9 mois, score 33,3 → 33,9.

Lecture : facile et difficile atteignent la cible fixée ; le mode normal reste un peu clément (6,7 % pour une cible d’environ 15 %). Sur 15 parties par niveau, un écart de 7 points correspond à une seule partie : à confirmer avec davantage de parties avant de durcir.

### Ce qui reste à faire

- **Modèle `nation`, suite de la phase 1** : rattacher unités, services, alliés et personnages à la nation. Volontairement différé : environ 150 appels à modifier pour un gain nul tant qu’une seconde nation n’existe pas. C’est le prérequis du Royaume-Uni (`nation-GBR.md`).
- **Équilibrage fin** du mode normal (voir ci-dessus).
- **Recherche** : prompt 6 (`verification-prototype-FRA.md`), fiche États-Unis à refaire, valeurs « À VÉRIFIER » restantes (coefficients tactiques et saisonniers, caractéristiques de constructeur).
- **Taille du paquet** : 2,2 Mo (630 ko compressés), surtout les fonds de carte ; découper le chargement (import dynamique de `world-atlas` et de `milsymbol`).

### Ce qui demande une intervention humaine

- **Art** (reporté par le propriétaire) : illustrations des matériels, portraits, insignes, écran d’accueil ; liste dans `docs/illustrations.md`. Les dessins actuels sont des substituts tracés par code.
- **Sons** : les sons synthétisés sont des substituts sobres ; une banque sonore réelle pourra les remplacer dans `src/ui/sons.ts`.
- **Validation** : noms des personnages fictifs (homonymies), valeurs « À VÉRIFIER », ressemblance des insignes avec des insignes officiels.

## 10 octobre 2026 — troisième session (branche `dev`)

Consigne du propriétaire : « rattacher les unités, les services, etc. à chaque nation, créer d’abord les nations les plus complètes, approfondir la tension et prendre la meilleure décision ». Décisions détaillées dans `docs/game-design.md` (« Décisions de la troisième session »). Chaque étape passe `npm test`, `npm run typecheck`, `npm run build`, les captures et le parcours du tutoriel. `main` n’a pas été touchée.

### Ce qui a été fait

| Commit | Contenu |
|---|---|
| `dd47edc` | **Modèle nation complet et Royaume-Uni jouable.** Tout ce qui distingue une nation est en données ; catalogue mondial à identifiants uniques ; accesseurs dans la simulation et l’interface ; contrôle de cohérence par nation. Royaume-Uni : territoire et carte, 28 unités, quatre services, trois doctrines, convention parlementaire, relation spéciale, opération cyber, 11 personnages, 20 dossiers, 17 matériels. |
| `0e67953` | **Démarrage** : l’écran de jeu est chargé à part. Premier chargement 2,28 Mo → 490 ko ; accueil interactif 1 459 → 578 ms (processeur ralenti ×4). |
| `13b2671` | **Israël jouable** : six théâtres propres et leurs cartes, cinq menaces, 22 unités, quatre services, Cabinet de sécurité, campagne entre les guerres, partenaires (États-Unis, Égypte, Jordanie, Russie), 10 personnages, 18 dossiers, 13 matériels ; carte du monde recadrée ; fronts tolérés par l’opinion en données. |

### Tension tranchée : taille du paquet

Le jeu visera Steam (bureau), où le réseau compte peu ; mais l’analyse et l’exécution de 2,2 Mo de JavaScript retardaient l’accueil. Mesure avant de décider : le découpage divise par 2,5 le temps d’accueil sans ralentir l’arrivée sur la carte (préchargement pendant la lecture). Retenu. Écarté : une carte du monde moins détaillée (perte visuelle) et le remplacement de milsymbol (travail lourd pour un gain marginal).

### Chiffres d’équilibre (robot prudent, 45 parties par nation)

| Nation | Facile | Normal | Difficile | Ensemble | Score moyen |
|---|---|---|---|---|---|
| France | 0 % | 6,7 % | 33,3 % | 13,3 % | 59,9 |
| Royaume-Uni | 0 % | 6,7 % | 26,7 % | 11,1 % | 60,0 |
| Israël | 0 % | 13,3 % | 33,3 % | 15,6 % | 59,9 |

Israël était d’abord trop facile (0 % de défaites) : quatre fois moins d’attaques que la France et un renseignement trop fort. Recalage : croissance et seuils de ses menaces frontalières, capteurs et efficacité des services, et un trait national (au-delà de deux fronts, l’opinion se lasse). Les parties de référence de la France ne changent qu’en libellés du journal (régénérées une fois, tours, issues et scores identiques).

### Ce qui reste à faire

- **Phase 3, monde partagé** : faire jouer les autres nations par l’IA dans le même état mondial.
- **Russie et Chine** : jauges propres (exposition et déni plausible ; légitimité du Parti), fiches de recherche à compléter. **États-Unis** : fiche à refaire.
- **Dossiers partagés** : les dossiers liés aux menaces communes (Daech, piraterie, Russie) sont écrits par nation ; un auteur désigné par sa fonction permettrait de les partager.
- **Tutoriel** du Royaume-Uni et d’Israël.

### Ce qui demande une intervention humaine

- **Art** : 16 matériels utilisent provisoirement la silhouette d’un autre (`docs/illustrations.md`), portraits, insignes, drapeaux.
- **Relecture sensible** du contenu israélien (Gaza, Liban, Iran) et des dossiers britanniques par un connaisseur, et vérification des noms fictifs contre des homonymes réels.
- **Recherche** : la fiche du Royaume-Uni a été rédigée de mémoire ; ses chiffres sont à vérifier.

## 10 octobre 2026 — quatrième session (branche `dev`)

Consigne : agrandir menus et boutons, catégoriser les actions et expliquer à quoi elles servent, améliorer les interventions de quelques semaines en restant court, rendre les biomes plus beaux, proposer des pistes.

| Commit | Contenu |
|---|---|
| `a928583` | **Ergonomie** : tailles relevées partout, réglage « Taille de l’interface » (100 à 130 %), fiche de théâtre en onglets (Situation, Engager, Opérations, Renseignement), « Recommandées ici » et sous-catégories repliables pour engager des forces, spécialité et effet attendu de chaque unité, chances et risques des opérations visibles d’emblée. Correctif du symbole qui s’étirait pendant une intervention. |
| `09dee9b` | **Interventions de crise** : intention adverse annoncée chaque semaine (flèche, chances, parades), frictions hebdomadaires, bilan en étoiles, conclusion anticipée quand les objectifs sont atteints. Référence régénérée. |
| `5fa4f14` | **Cartes régionales** : relief ombré, courbes de niveau, hauts-fonds, fleuves avec halo, carroyage militaire. |

Équilibre après la refonte des interventions (robot prudent, 45 parties par nation, dans le bruit de mesure) : France 13,3 % de défaites, Royaume-Uni 20 %, Israël 8,9 %.

Pistes classées pour la suite : `docs/game-design.md`, section « Pistes pour rendre le jeu prenant ».
