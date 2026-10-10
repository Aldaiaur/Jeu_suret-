import type { NationDef } from '../sim/types';
import { DOCTRINES_FRA, SERVICES_FRA, UNITES_FRA } from './france';
import { BRIEFING_FRA } from './briefing';
import { NATION_GBR } from './royaume-uni';

// ---------------------------------------------------------------------
// NATIONS JOUABLES. Tout ce qui distingue une nation est décrit ici et interprété par un moteur commun :
// théâtres, forces, services, alliés, doctrines, procédure d'emploi de la force, briefing.
// France : article 35 de la Constitution (révision de 2008) — information du Parlement, vote au-delà
// de 4 mois (S1, élevé). Les coefficients du vote sont des choix de jouabilité : dans la réalité, tous
// les votes de 2015-2018 ont été quasi unanimes (nation-FRA.md, section 1.2).
// ---------------------------------------------------------------------
export const NATIONS: Record<string, NationDef> = {
  FRA: {
    id: 'FRA', nom: 'France', role: 'Conseil de défense et de sécurité nationale', signature: 'Autonomie stratégique, article 35',
    devise: '€', cellule: 'cellule de crise interministérielle',
    territoire: 'METRO',
    theatres: ['METRO', 'EST', 'LIBYE', 'LEVANT', 'SAHEL', 'GUINEE', 'CORNE', 'INDOPAC'],
    basesPermanentes: ['METRO', 'GUINEE', 'CORNE', 'INDOPAC'],   // forces prépositionnées (Abidjan, Djibouti, Pacifique)
    unites: UNITES_FRA, services: SERVICES_FRA, doctrines: DOCTRINES_FRA,
    operations: ['FRAPPE', 'RAID', 'FORMATION', 'PROTECTION', 'CYBERDEF', 'REASSURANCE'],
    allies: { USA: 60, UK: 65, DEU: 65, ITA: 60, JPN: 55, AUS: 55, NGA: 50 },
    categories: { FS: 'Forces spéciales', INT: 'Sécurité intérieure', TERRE: 'Armée de Terre', AIR: 'Armée de l’Air', MER: 'Marine nationale' },
    briefing: BRIEFING_FRA,
    procedure: {
      nom: 'Article 35', institution: 'du Parlement',
      description: 'Au-delà de quatre mois, une intervention extérieure doit être autorisée par le Parlement. Un refus impose le retrait.',
      dureeAvantVote: 4,
      poids: { base: 0.25, opinion: 0.45, capital: 0.35, credibilite: 1 / 250, crise: 0.05 },
      debat: { nom: 'Débat au Parlement', description: 'Exposer les objectifs de l’intervention devant les assemblées.', bonus: 0.15, capital: 2 },
      succes: { capital: 3 },
      refus: { capital: -10, credibilite: -5 },
      texteAutorise: 'Article 35 : le Parlement autorise la prolongation de l’intervention ({theatre}).',
      texteRefus: 'Article 35 : le Parlement refuse la prolongation ({theatre}). Retrait des forces.',
      motifRetrait: 'vote négatif du Parlement'
    }
  },
  GBR: NATION_GBR
};
