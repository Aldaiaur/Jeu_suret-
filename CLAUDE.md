# Red Lines — conventions du projet

Jeu de gestion de crise au tour par tour (1 tour = 1 mois, départ janvier 2015). Le joueur dirige la cellule de crise d'une puissance. Vision, nations et feuille de route : `docs/game-design.md`.

## Commandes

- `npm run dev` : lance le jeu dans le navigateur (Vite).
- `npm test` : tests (Vitest). À lancer avant chaque commit.
- `npm run typecheck` : contrôle de types strict.
- `npm run build` : contrôle de types + build de production dans `dist/`.
- `npm run screens` : captures d'écran automatiques de l'interface (Playwright), dans `captures/`. `CHROMIUM=/chemin/chrome npm run screens` utilise un navigateur déjà installé.
- `node tools/equilibre.ts` : compare l'issue des parties de référence (défaites, durée, score) avec la dernière version committée.
- `node tools/tutoriel.ts` : parcourt tout le tutoriel dans le navigateur et signale une étape bloquée. À relancer après toute modification de l'interface ou du tutoriel.
- `node tools/performances.ts` : temps de réponse de l'interface (vues régionales, passage de mois, intervention), serveur de développement lancé.
- `http://localhost:5173/?galerie` (développement) : planche de toutes les illustrations, insignes et portraits.
- `node tools/equilibre.ts --robot` : rejoue 45 parties avec le robot prudent (`tests/bot-prudent.ts`) sur HEAD et sur l'état courant. Ce sont les chiffres d'équilibre à citer dans les commits.

## Architecture (à respecter)

```
src/data/   Données pures, typées (aucune règle). Une nouvelle unité, un événement, un théâtre = une entrée ici.
src/sim/    Simulation pure : aucune lecture ni écriture du DOM. Chaque fonction publique reçoit un état,
            le clone et renvoie un nouvel état. Tout l'aléatoire passe par alea(s) (graine dans s.rngState).
src/ui/     Interface React. Lit l'état, envoie des actions. Ne modifie jamais l'état directement.
tests/      Tests Vitest, robots joueurs (aléatoire pour la non-régression, prudent pour l'équilibre).
prototype/  Maquette HTML d'origine, conservée comme référence. Ne pas modifier.
```

- L'interface n'importe la simulation que via `src/sim/index.ts`.
- Une action du joueur est un objet `Action` (voir `src/sim/types.ts`). `actionsPossibles(s)` est la seule source de vérité sur ce qui est permis ; l'interface désactive ce qui n'y figure pas.
- L'état est sérialisable en JSON (sauvegardes). Pas de `Map`, `Set`, classe ni fonction dans l'état.
- Pas de `Math.random()` dans `src/sim/` : utiliser `alea(s)`, sinon les parties ne sont plus rejouables.
- `verifierDonnees()` doit rester vide : toute référence croisée dans les données y est contrôlée. Ajouter un contrôle quand on ajoute un nouveau type de référence.
- Chaque théâtre a une carte régionale et des saisons déclarées en données ; un effet saisonnier passe par les accesseurs `saisonDu`, `multPression`, `multFatigue`, `multCout`, `multCroissance` (`src/sim/acces.ts`).
- Décors des cartes : générés par code (canvas ou SVG), jamais de fichier image lourd ni de ressource réseau.

## Tests de non-régression

`tests/reference-parties.json` contient 60 parties jouées par un robot (au départ sur la maquette d'origine, via `npm run golden`). Le test vérifie que la simulation produit exactement les mêmes états finaux.

Quand une évolution **volontaire** des règles ou des données change ces parties, le test échoue : c'est attendu. Régénérer alors la référence depuis la simulation courante avec `MAJ_REFERENCE=1 npm test`, vérifier que le changement est bien celui voulu, et le signaler dans le message de commit.

## Contenu et réalisme

- Contexte réel jusqu'en janvier 2015 ; tout ce qui suit est **fictif mais plausible** et dépend des choix du joueur.
- **Aucun nom de personne réelle.** Dirigeants, responsables et personnages sont fictifs, avec des noms crédibles pour leur pays (`src/data/personnages.ts`). Les pays, institutions, unités et lieux sont réels.
- Les pertes civiles sont toujours un coût, jamais une stratégie récompensée. Les attentats en métropole restent génériques.
- Les valeurs non sourcées portent le commentaire `// À VÉRIFIER (...)`. Les résultats de recherche arrivent dans `docs/recherche/resultats/`.
- Chaque événement a un `auteur` (personnage fictif de `personnages.ts`) qui présente le dossier avec son ton, sa formule d'ouverture et sa signature.
- Images : dessinées par code uniquement ; tout besoin d'art réel ou d'image générée est noté dans `docs/illustrations.md` (les images générées par IA doivent être déclarées à Steam).

## Style

- Code, données et textes en français. Identifiants sans accents.
- Typographie française dans les textes affichés : apostrophe typographique ’, espaces avant `: ; ! ?` et `%`.
- Commentaires rares, pour expliquer un pourquoi.

## Git

- Travail sur `dev`, poussé régulièrement. `main` ne reçoit une fusion que sur demande explicite du propriétaire.
