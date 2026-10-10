import type { NationDef } from '../sim/types';

// ---------------------------------------------------------------------
// NATIONS JOUABLES. La procédure d'emploi de la force est décrite ici et interprétée par un moteur commun.
// France : article 35 de la Constitution (révision de 2008) — information du Parlement, vote au-delà
// de 4 mois (S1, élevé). Les coefficients du vote sont des choix de jouabilité : dans la réalité, tous
// les votes de 2015-2018 ont été quasi unanimes (nation-FRA.md, section 1.2).
// ---------------------------------------------------------------------
export const NATIONS: Record<string, NationDef> = {
  FRA: {
    id: 'FRA', nom: 'France', role: 'Conseil de défense et de sécurité nationale', signature: 'Autonomie stratégique, article 35',
    procedure: {
      nom: 'Article 35', institution: 'le Parlement',
      description: 'Au-delà de quatre mois, une intervention extérieure doit être autorisée par le Parlement. Un refus impose le retrait.',
      dureeAvantVote: 4,
      poids: { base: 0.25, opinion: 0.45, capital: 0.35, credibilite: 1 / 250, crise: 0.05 },
      debat: { nom: 'Débat au Parlement', description: 'Exposer les objectifs de l’intervention devant les assemblées.', bonus: 0.15, capital: 2 },
      succes: { capital: 3 },
      refus: { capital: -10, credibilite: -5 },
      texteAutorise: 'Article 35 : le Parlement autorise la prolongation de l’intervention ({theatre}).',
      texteRefus: 'Article 35 : le Parlement refuse la prolongation ({theatre}). Retrait des forces.'
    }
  }
};
