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
