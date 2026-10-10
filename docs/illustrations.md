# Illustrations : état et besoins

Toutes les images du jeu sont aujourd’hui **dessinées par code** : aucun fichier image externe, aucune licence inconnue, aucune image générée par IA. Planche de contrôle : `npm run dev`, puis `http://localhost:5173/?galerie`.

## Ce qui existe

| Élément | Fichier | Technique |
|---|---|---|
| Fonds des cartes régionales (8 biomes) | `src/ui/composants/FondRegional.tsx` | Canvas : côtes Natural Earth, textures et relief procéduraux |
| Effets de saison (pluie, neige, boue, chaleur, poussière, houle, brouillard) | `src/ui/composants/Saison.tsx` | SVG animé |
| Insignes des 28 unités | `src/ui/composants/Insigne.tsx`, données dans `src/data/identite-unites.ts` | SVG : écu, couleurs, symbole, devise fictive |
| Symboles militaires OTAN (APP-6) | `src/ui/composants/SymboleOtan.tsx` | Bibliothèque milsymbol 3.0.4 (licence MIT) |
| Illustrations de 22 matériels | `src/ui/composants/IllustrationMateriel.tsx` | SVG : silhouettes, éclairage rasant, halo |

## Ce qui mériterait un vrai travail d’artiste (ou d’image générée)

Par ordre de priorité pour une page Steam et l’immersion :

1. **Illustrations des matériels** (22) : les silhouettes actuelles sont lisibles mais schématiques (vues de dessus pour l’aviation, profils pour le reste). Cible : vues de trois quarts détaillées, éclairage dramatique, fond sombre cohérent avec l’interface. Rafale, Charles de Gaulle, CAESAR et Tigre en premier.
2. **Portraits des personnages** (une trentaine dans `src/data/personnages.ts`) : aujourd’hui génériques. Cible : portraits peints, sobres, fictifs (aucune ressemblance avec une personne réelle).
3. **Insignes** : créations originales générées par code. Un graphiste héraldiste pourrait les rendre plus riches, **sans reproduire d’insigne officiel** (emblèmes protégés). Vérifier aussi que les devises fictives ne coïncident avec aucune devise réelle.
4. **Fonds des cartes régionales** : relief ombré (modèle numérique de terrain), villes, routes réelles. Attention au poids des fichiers et aux licences des données (Natural Earth est dans le domaine public).
5. **Écran d’accueil et briefing** : une illustration d’ambiance (salle de crise, carte murale).
6. **Fenêtres d’événement** : vignettes illustrées par grand type d’événement (attentat déjoué, crise navale, cyberattaque, otages…), en restant génériques sur les attentats.
7. **Icônes de saison** et pictogrammes d’ordres tactiques : à harmoniser avec la charte finale.

## Sons à prévoir

Les points d’accroche existent dans `src/ui/sons.ts` (aucun fichier son pour l’instant) : clic, ordre tactique, déploiement, rapatriement, opération (succès ou échec), alerte, passage de mois, crise, événement. À produire : sons courts et sobres (radio, téléscripteur, impulsion), avec un réglage de volume et une option muette.

## Règles

- **Toute image générée par IA devra être déclarée à Steam** (questionnaire de contenu généré par IA), et listée ici avec l’outil utilisé et la date.
- Pas d’image téléchargée dont la licence est inconnue.
- Pas de reproduction d’insigne, d’écusson ou de marquage officiel existant.
- Aucun visage ni nom de personne réelle.

## Images générées par IA

Aucune à ce jour.
