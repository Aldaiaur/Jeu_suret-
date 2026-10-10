// Campagne France « La route du Fezzan » : un réseau logistique transsaharien relie le Sahel à la Libye
// et à la Méditerranée (piste prévue par docs/game-design.md, section 5). Chaîne d'événements avec
// embranchements, déclenchée par l'état de la partie. Lieux réels, réseau et personnes fictifs.
import type { EvenementDef } from '../sim/types';

export const CAMPAGNE_TRANSSAHARIENNE: EvenementDef[] = [
  { id:'ROUTE_SIGNAL', titre:'Des convois entre le Fezzan et l’Adrar', auteur:'FRA_DGSE', poids:4, max:1,
    cond:{ tourMin:5, menace:{type:'DJIHAD', forceMin:45, theatre:'SAHEL'} },
    texte:'Les interceptions recoupent des mouvements de pick-up entre le sud libyen et l’Adrar des Ifoghas : carburant, munitions, combattants. Un même intermédiaire, surnommé « le Transitaire », semble organiser les relais. Si ce réseau se consolide, il reliera les groupes sahéliens à la côte libyenne.',
    choix:[
      { texte:'Remonter la filière : renseignement humain et interceptions', effets:{ budget:-4, rens:[{theatre:'SAHEL', delta:6}, {theatre:'LIBYE', delta:8}] }, suite:'ROUTE_FILIERE', suiteDelai:2 },
      { texte:'Frapper le prochain convoi repéré', requiert:{categorie:'AIR'}, effets:{ fatigue:[{categorie:'AIR', delta:5}], menace:[{type:'DJIHAD', delta:-4, theatre:'SAHEL'}] }, suite:'ROUTE_ADAPTATION', suiteDelai:2 },
      { texte:'Rester concentré sur le nord du Mali', effets:{ menace:[{type:'DJIHAD', delta:3, theatre:'SAHEL'}] }, suite:'ROUTE_PROSPERE', suiteDelai:3 }
    ] },
  { id:'ROUTE_ADAPTATION', titre:'Le réseau s’adapte', auteur:'FRA_SAHEL', poids:0, max:1, cond:{ chaine:true },
    texte:'Après la frappe, les convois se fractionnent et empruntent des pistes plus à l’est, par le Niger. Les éléments recueillis sur les épaves confirment l’existence d’un centre de redistribution à Sabha.',
    choix:[
      { texte:'Exploiter les éléments recueillis', effets:{ rens:[{theatre:'LIBYE', delta:8}] }, suite:'ROUTE_FILIERE', suiteDelai:1 },
      { texte:'Multiplier les frappes sur les axes', requiert:{categorie:'AIR'}, effets:{ fatigue:[{categorie:'AIR', delta:8}], pression:[{theatre:'SAHEL', delta:10}], alea:{ p:0.6, succes:{ menace:[{type:'DJIHAD', delta:-5, theatre:'SAHEL'}] }, echec:{ credibilite:-2, opinion:-2 } } } }
    ] },
  { id:'ROUTE_PROSPERE', titre:'La route prospère', auteur:'FRA_CEMA', poids:0, max:1, cond:{ chaine:true },
    texte:'Une base de nos partenaires a été frappée avec des roquettes et des explosifs passés par le sud libyen. Le réseau du Transitaire tient désormais les puits et les relais de la route. Le chef d’état-major demande une décision : laisser faire, c’est accepter une logistique adverse durable.',
    choix:[
      { texte:'Remonter la filière, même tardivement', effets:{ budget:-6, rens:[{theatre:'LIBYE', delta:6}], menace:[{type:'DJIHAD', delta:4, theatre:'SAHEL'}] }, suite:'ROUTE_FILIERE', suiteDelai:2 },
      { texte:'Renforcer la protection des emprises partenaires', effets:{ budget:-5, partenaire:[{theatre:'SAHEL', delta:4}], menace:[{type:'DJIHAD', delta:2, theatre:'SAHEL'}] } }
    ] },
  { id:'ROUTE_FILIERE', titre:'Le Transitaire identifié', auteur:'FRA_DGSE', poids:0, max:1, cond:{ chaine:true },
    texte:'Nos sources situent le Transitaire à Sabha, sous la protection d’une milice locale qui vend ses services à tous les camps. Trois options se présentent, aucune sans risque.',
    choix:[
      { texte:'Opération des forces spéciales dans le sud libyen', requiert:{categorie:'FS'}, effets:{ capital:-2, fatigue:[{categorie:'FS', delta:12}], alea:{ p:0.6, succes:{ menace:[{type:'DJIHAD', delta:-8, theatre:'SAHEL'}, {type:'DAECH', delta:-4, theatre:'LIBYE'}] }, echec:{ opinion:-4, credibilite:-3 } } }, suite:'ROUTE_DENOUEMENT', suiteDelai:2 },
      { texte:'Retourner la milice par la négociation et l’argent', effets:{ budget:-10, alea:{ p:0.5, succes:{ rens:[{theatre:'LIBYE', delta:12}], menace:[{type:'DJIHAD', delta:-5, theatre:'SAHEL'}] }, echec:{ credibilite:-2, menace:[{type:'DJIHAD', delta:3, theatre:'SAHEL'}] } } }, suite:'ROUTE_DENOUEMENT', suiteDelai:2 },
      { texte:'Transmettre le dossier aux Américains', effets:{ relation:[{allie:'USA', delta:2}], appui:{allie:'USA', appui:'FRAPPES', theatre:'LIBYE', tours:3} }, suite:'ROUTE_DENOUEMENT', suiteDelai:3 }
    ] },
  { id:'ROUTE_DENOUEMENT', titre:'La route du Fezzan coupée', auteur:'FRA_PR', poids:0, max:1, cond:{ chaine:true },
    texte:'Les relais du réseau tombent les uns après les autres ; les groupes sahéliens manquent de carburant et de munitions. Le Président souhaite savoir comment valoriser ce résultat sans compromettre les sources.',
    choix:[
      { texte:'Garder le silence et exploiter le renseignement', effets:{ rens:[{theatre:'SAHEL', delta:8}, {theatre:'LIBYE', delta:8}], menace:[{type:'DJIHAD', delta:-4, theatre:'SAHEL'}] } },
      { texte:'Annoncer publiquement le démantèlement', effets:{ opinion:4, credibilite:3, menace:[{type:'DJIHAD', delta:-2, theatre:'SAHEL'}] } },
      { texte:'Proposer aux voisins une coopération durable contre les trafics', effets:{ budget:-6, partenaire:[{theatre:'SAHEL', delta:6}, {theatre:'LIBYE', delta:4}], relation:[{allie:'ITA', delta:3}] } }
    ] }
];
