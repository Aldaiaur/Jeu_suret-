import type { AllieDef } from '../sim/types';

// ---------------------------------------------------------------------
// ALLIÉS : acteurs partagés par toutes les nations, avec leurs appuis par théâtre. La relation initiale
// (0-100) dépend de la nation jouée : voir NationDef.allies.
// appui.effets : rens, pression, frappesZoom, recosZoom, opBonus, delai (pendant duree mois),
//                partenaire (immédiat). base : probabilité d'accord avant relation et crédibilité.
// interets : théâtres où un engagement du joueur améliore la relation.
// ---------------------------------------------------------------------
export const ALLIES: AllieDef[] = [
  { id:'USA', nom:'États-Unis', interets:['LEVANT','EST','SAHEL'],
    description:'Premier partenaire militaire. Moyens de surveillance, de transport stratégique et de frappe sans équivalent, mais une attention fluctuante.',
    appuis:[
      { id:'ISR',       nom:'Drones et avions de surveillance',       theatres:['SAHEL','LEVANT','LIBYE','CORNE','GUINEE'], duree:4, capital:2, relation:3, base:0.8,  effets:{ rens:15, recosZoom:1 } }, // Appui américain au Sahel et au Levant : ravitaillement, ISR, C-17 (fiche FRA, S0 moyen). À VÉRIFIER (moyens par théâtre)
      { id:'FRAPPES',   nom:'Frappes de la coalition',                theatres:['LEVANT','LIBYE'],                          duree:4, capital:3, relation:4, base:0.65, effets:{ pression:10, frappesZoom:2, opBonus:0.05 } },
      { id:'TRANSPORT', nom:'Transport stratégique (C-17)',           theatres:['SAHEL','LEVANT','LIBYE','CORNE','GUINEE','EST'], duree:4, capital:1, relation:2, base:0.85, effets:{ delai:-1, soutien:2 } },
      { id:'RAVITO',    nom:'Ravitaillement en vol (KC-135)',         theatres:['SAHEL','LEVANT','LIBYE'],                  duree:4, capital:1, relation:2, base:0.8,  effets:{ pression:4, opBonus:0.05, soutien:1 } },
      { id:'REASSUR',   nom:'Présence renforcée de l’US Army',        theatres:['EST'],                                     duree:5, capital:2, relation:3, base:0.6,  effets:{ pression:12 } },
      { id:'NAVAL',     nom:'Patrouilles de l’US Navy',               theatres:['INDOPAC','CORNE'],                         duree:4, capital:1, relation:2, base:0.7,  effets:{ pression:8, rens:5 } }
    ] },
  { id:'UK', nom:'Royaume-Uni', interets:['LEVANT','EST'],
    description:'Partenaire militaire le plus proche en Europe (traités de Lancaster House).',
    appuis:[
      { id:'FRAPPES',   nom:'Frappes de la RAF',                      theatres:['LEVANT'],          duree:4, capital:2, relation:3, base:0.7,  effets:{ pression:6, frappesZoom:1 } },
      { id:'ISR',       nom:'Renseignement partagé',                  theatres:['LEVANT','LIBYE'],  duree:4, capital:1, relation:2, base:0.75, effets:{ rens:8 } },
      { id:'HELICOS',   nom:'Hélicoptères lourds Chinook',            theatres:['SAHEL'],           duree:5, capital:2, relation:3, base:0.5,  effets:{ pression:4, delai:-1 } } // Réel : 3 Chinook à Barkhane en 2018, hors calendrier du jeu (fiche FRA, S0 moyen). Ici un possible plus précoce. À VÉRIFIER
    ] },
  { id:'FRA', nom:'France', interets:['SAHEL','LEVANT','LIBYE'],
    description:'Seule autre puissance militaire complète d’Europe. Traités de Lancaster House (2010), force expéditionnaire conjointe validée en 2016.',
    appuis:[
      { id:'FRAPPES',   nom:'Frappes de l’armée de l’Air française',   theatres:['LEVANT','LIBYE'], duree:4, capital:2, relation:3, base:0.7,  effets:{ pression:6, frappesZoom:1 } },
      { id:'SAHEL',     nom:'Coopération avec l’opération Barkhane',   theatres:['SAHEL'],          duree:5, capital:1, relation:2, base:0.75, effets:{ rens:10, pression:4, soutien:2 } }, // Réciproque réelle : 3 Chinook britanniques à Gao depuis l’été 2018 (nation-GBR.md, section 5, moyen)
      { id:'DJIBOUTI',  nom:'Soutien depuis la base de Djibouti',      theatres:['CORNE'],          duree:4, capital:1, relation:2, base:0.8,  effets:{ soutien:3, delai:-1, rens:5 } },
      { id:'NAVAL',     nom:'Groupe aéronaval français',               theatres:['LEVANT','LIBYE','CORNE'], duree:3, capital:2, relation:4, base:0.5, effets:{ pression:8, frappesZoom:1, recosZoom:1 } } // À VÉRIFIER (disponibilité selon le calendrier du porte-avions)
    ] },
  { id:'DEU', nom:'Allemagne', interets:['SAHEL','EST'],
    description:'Partenaire européen central, engagé dans la formation au Mali et sur le flanc est.',
    appuis:[
      { id:'FORMATION', nom:'Formateurs (mission européenne au Mali)', theatres:['SAHEL'], duree:1, capital:1, relation:2, base:0.75, effets:{ partenaire:6 } },
      { id:'REASSUR',   nom:'Contribution à la présence avancée',      theatres:['EST'],   duree:5, capital:1, relation:2, base:0.7,  effets:{ pression:6 } }
    ] },
  { id:'ITA', nom:'Italie', interets:['LIBYE'],
    description:'Partenaire de premier plan en Méditerranée centrale et en Libye.',
    appuis:[ { id:'NAVAL', nom:'Opération navale en Méditerranée', theatres:['LIBYE'], duree:4, capital:1, relation:2, base:0.75, effets:{ pression:6, rens:6 } } ] },
  { id:'JPN', nom:'Japon', interets:['CORNE','INDOPAC'],
    description:'Présent à Djibouti pour la lutte contre la piraterie.',
    appuis:[ { id:'ISR', nom:'Patrouille maritime P-3C', theatres:['CORNE'], duree:4, capital:1, relation:2, base:0.7, effets:{ rens:8, pression:4 } } ] },
  { id:'AUS', nom:'Australie', interets:['INDOPAC'],
    description:'Partenaire stratégique dans le Pacifique Sud.',
    appuis:[ { id:'NAVAL', nom:'Patrouilles conjointes', theatres:['INDOPAC'], duree:4, capital:1, relation:2, base:0.7, effets:{ pression:6, rens:6 } } ] },
  { id:'NGA', nom:'Nigeria', interets:['GUINEE','SAHEL'],
    description:'Puissance riveraine du golfe de Guinée.',
    appuis:[ { id:'NAVAL', nom:'Patrouilles de la marine nigériane', theatres:['GUINEE'], duree:4, capital:1, relation:2, base:0.6, effets:{ pression:6 } } ] }
];
