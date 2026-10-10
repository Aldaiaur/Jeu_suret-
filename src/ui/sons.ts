// Sons de l'interface : points d'accroche prêts, sans fichier son pour l'instant.
// Chaque action déclenche un nom de son ; il suffira d'associer un fichier à chaque nom
// (voir docs/illustrations.md, section sons) et de respecter le réglage de volume.
import type { Action, Etat } from '../sim';

export type NomSon = 'clic' | 'ordre' | 'deploiement' | 'rapatriement' | 'operation' | 'succes' | 'echec' | 'alerte' | 'mois' | 'crise' | 'evenement';

let dernier: NomSon | null = null;
export function jouerSon(nom: NomSon): void {
  dernier = nom;
  // Branchement futur : new Audio(fichier).play(), selon le volume choisi.
}
export function dernierSon(): NomSon | null { return dernier; }

export function sonAction(a: Action, n: Etat): NomSon {
  switch (a.type) {
    case 'DEPLOYER': return 'deploiement';
    case 'RAPATRIER': return 'rapatriement';
    case 'OPERATION': return n.journal[0]?.genre === 'succes' ? 'succes' : 'echec';
    case 'CRISE': return 'crise';
    case 'POSITIONNER': case 'POSTURE': case 'MISSION': case 'ANNULER_MISSION': return 'ordre';
    default: return 'clic';
  }
}
