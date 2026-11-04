// Objectifs de mandat : récompenses et sanctions (valeurs de conception, à caler sur les parties).
// Chaque janvier, le chef de l’exécutif fixe trois objectifs pour l’année ; ils sont évalués en décembre.
export const PARAMS_MANDAT = {
  nombre: 3,
  reussite: { capital: 3, opinion: 1 },
  echec: { capital: -3, opinion: -1 },
  surcoutMax: 40,           // surcoût toléré sur l’année (M€, M£… : échelle de jeu commune)
  ecartMenace: 12           // objectif sur une menace : niveau estimé en janvier moins cet écart (arrondi à 5)
};
