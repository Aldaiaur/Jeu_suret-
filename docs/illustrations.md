# Illustrations : état et besoins

Toutes les images du jeu sont aujourd’hui **dessinées par code** : aucun fichier image externe, aucune licence inconnue, aucune image générée par IA. Planche de contrôle : `npm run dev`, puis `http://localhost:5173/?galerie`.

## Ce qui existe

| Élément | Fichier | Technique |
|---|---|---|
| Fonds des cartes régionales (9 biomes, 15 cartes) | `src/ui/composants/FondRegional.tsx` | Canvas : côtes Natural Earth, textures et relief procéduraux |
| Effets de saison (pluie, neige, boue, chaleur, poussière, houle, brouillard) | `src/ui/composants/Saison.tsx` | SVG animé |
| Insignes des 78 unités (France 28, Royaume-Uni 28, Israël 22) | `src/ui/composants/Insigne.tsx`, données dans `src/data/identite-unites.ts` | SVG : écu, couleurs, symbole, devise fictive |
| Symboles militaires OTAN (APP-6) | `src/ui/composants/SymboleOtan.tsx` | Bibliothèque milsymbol 3.0.4 (licence MIT) |
| Illustrations de 52 matériels | `src/ui/composants/IllustrationMateriel.tsx` | SVG : silhouettes, éclairage rasant, halo. 16 matériels réutilisent provisoirement la silhouette d’un matériel proche (table `ALIAS`) |

## Ce qui mériterait un vrai travail d’artiste (ou d’image générée)

Par ordre de priorité pour une page Steam et l’immersion :

1. **Illustrations des matériels** (52) : en priorité les 16 substituts de la table `ALIAS` (Voyager, Sentinel, Rivet Joint, E-3D, Foxhound, Type 45, Type 23, Astute, classe Albion, G550, Boeing 707 Re’em, UH-60, Namer, Arrow, Sa’ar 5, Dolphin), qui empruntent la silhouette d’un autre matériel. Les silhouettes actuelles sont lisibles mais schématiques (vues de dessus pour l’aviation, profils pour le reste). Cible : vues de trois quarts détaillées, éclairage dramatique, fond sombre cohérent avec l’interface. Rafale, Charles de Gaulle, CAESAR, Typhoon, Tornado, F-35I, Merkava et Iron Dome en premier.
2. **Portraits des personnages** (une cinquantaine dans `src/data/personnages.ts`) : aujourd’hui génériques. Cible : portraits peints, sobres, fictifs (aucune ressemblance avec une personne réelle).
3. **Insignes** : créations originales générées par code. Un graphiste héraldiste pourrait les rendre plus riches, **sans reproduire d’insigne officiel** (emblèmes protégés). Vérifier aussi que les devises fictives ne coïncident avec aucune devise réelle.
4. **Fonds des cartes régionales** : relief ombré (modèle numérique de terrain), villes, routes réelles. Attention au poids des fichiers et aux licences des données (Natural Earth est dans le domaine public).
5. **Écran d’accueil et briefing** : une illustration d’ambiance (salle de crise, carte murale).
6. **Fenêtres d’événement** : vignettes illustrées par grand type d’événement (attentat déjoué, crise navale, cyberattaque, otages…), en restant génériques sur les attentats.
7. **Drapeaux** : simplifiés et dessinés par code (`Drapeau.tsx`) ; à vérifier par un graphiste.
8. **Icônes de saison** et pictogrammes d’ordres tactiques : à harmoniser avec la charte finale.

## Sons

Les sons sont **synthétisés par code** (Web Audio, `src/ui/sons.ts`) : clic, ordre tactique (bip radio), déploiement et rapatriement (balayage), succès (arpège), échec et alerte, passage de mois (téléscripteur), crise (alarme), dossier (cloche). Réglage dans le menu ≡ (activé ou coupé, trois volumes). Un travail de conception sonore pourra remplacer ces synthèses par des fichiers, sans changer les points d’accroche.

## Règles

- **Toute image générée par IA devra être déclarée à Steam** (questionnaire de contenu généré par IA), et listée ici avec l’outil utilisé et la date.
- Pas d’image téléchargée dont la licence est inconnue.
- Pas de reproduction d’insigne, d’écusson ou de marquage officiel existant.
- Aucun visage ni nom de personne réelle.

## Images générées par IA

Aucune à ce jour.
