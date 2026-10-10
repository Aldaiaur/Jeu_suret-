// Personnages fictifs. Aucun nom de personne réelle : les fonctions et institutions sont réelles,
// les titulaires sont inventés, avec des noms plausibles pour leur pays.
// Quand une fonction existe réellement, le texte du jeu cite la fonction ; le nom n'apparaît qu'en signature
// ou dans les dialogues.

export interface Personnage { id: string; nom: string; fonction: string; pays: string }

export const PERSONNAGES: Personnage[] = [
  // France
  { id: 'FRA_PR',    nom: 'Bertrand Lacassagne',      fonction: 'Président de la République',                         pays: 'FRA' },
  { id: 'FRA_PM',    nom: 'Claire Vautrin',           fonction: 'Première ministre',                                   pays: 'FRA' },
  { id: 'FRA_DEF',   nom: 'Olivier Ferrandi',         fonction: 'Ministre de la Défense',                              pays: 'FRA' },
  { id: 'FRA_INT',   nom: 'Hélène Castagnet',         fonction: 'Ministre de l’Intérieur',                             pays: 'FRA' },
  { id: 'FRA_MAE',   nom: 'Jean-Marc Sorel',          fonction: 'Ministre des Affaires étrangères',                    pays: 'FRA' },
  { id: 'FRA_SGDSN', nom: 'Laurent Ternier',          fonction: 'Secrétaire général de la défense et de la sécurité nationale', pays: 'FRA' },
  { id: 'FRA_CEMA',  nom: 'général Antoine de Kervéguen', fonction: 'Chef d’état-major des armées',                     pays: 'FRA' },
  { id: 'FRA_COS',   nom: 'général Marc Dussollier',  fonction: 'Commandant des opérations spéciales',                 pays: 'FRA' },
  { id: 'FRA_DGSE',  nom: 'Philippe Maurand',         fonction: 'Directeur général de la sécurité extérieure',         pays: 'FRA' },
  { id: 'FRA_DGSI',  nom: 'Sophie Arnaud-Delmas',     fonction: 'Directrice générale de la sécurité intérieure',       pays: 'FRA' },
  { id: 'FRA_DRM',   nom: 'général Yves Pellerin',    fonction: 'Directeur du renseignement militaire',                pays: 'FRA' },
  { id: 'FRA_ANSSI', nom: 'Nicolas Berthelot-Rey',    fonction: 'Directeur général de l’ANSSI',                        pays: 'FRA' },

  // États-Unis
  { id: 'USA_PR',    nom: 'Thomas W. Halvorsen',      fonction: 'Président des États-Unis',                            pays: 'USA' },
  { id: 'USA_NSA',   nom: 'Denise Okafor',            fonction: 'Conseillère à la sécurité nationale',                 pays: 'USA' },
  { id: 'USA_DEF',   nom: 'Richard Callahan',         fonction: 'Secrétaire à la Défense',                             pays: 'USA' },
  { id: 'USA_SEC',   nom: 'Margaret Ellison-Ward',    fonction: 'Secrétaire d’État',                                   pays: 'USA' },

  // Royaume-Uni
  { id: 'GBR_PM',    nom: 'Edward Ainsley',           fonction: 'Premier ministre',                                    pays: 'GBR' },
  { id: 'GBR_DEF',   nom: 'Fiona Mackenzie-Hale',     fonction: 'Secrétaire d’État à la Défense',                      pays: 'GBR' },

  // Russie
  { id: 'RUS_PR',    nom: 'Viktor Sokoline',          fonction: 'Président de la Fédération de Russie',                pays: 'RUS' },
  { id: 'RUS_DEF',   nom: 'Guennadi Bortnikov-Lazarev', fonction: 'Ministre de la Défense',                            pays: 'RUS' },
  { id: 'RUS_MAE',   nom: 'Arkadi Voronine',          fonction: 'Ministre des Affaires étrangères',                    pays: 'RUS' },

  // Chine
  { id: 'CHN_PR',    nom: 'Liang Wenhao',             fonction: 'Président de la République populaire, secrétaire général du Parti', pays: 'CHN' },
  { id: 'CHN_MAE',   nom: 'Zhou Mingrui',             fonction: 'Ministre des Affaires étrangères',                    pays: 'CHN' },

  // Israël
  { id: 'ISR_PM',    nom: 'Avraham Ben-Dor',          fonction: 'Premier ministre',                                    pays: 'ISR' },
  { id: 'ISR_DEF',   nom: 'Yossi Harel-Amit',         fonction: 'Ministre de la Défense',                              pays: 'ISR' },

  // Autres acteurs
  { id: 'DEU_CH',    nom: 'Katharina Albrecht',       fonction: 'Chancelière fédérale',                                pays: 'DEU' },
  { id: 'ITA_PM',    nom: 'Lorenzo Cattaneo',         fonction: 'Président du Conseil',                                pays: 'ITA' },
  { id: 'MLI_PR',    nom: 'Mamadou Kéïta-Diallo',     fonction: 'Président de la République du Mali',                  pays: 'MLI' },
  { id: 'IRN_PR',    nom: 'Hossein Moradi-Far',       fonction: 'Président de la République islamique',                pays: 'IRN' },
  { id: 'PRK_MAE',   nom: 'Ri Chol-hwan',             fonction: 'Ministre des Affaires étrangères de Corée du Nord',   pays: 'PRK' }
];

export const PERS: Record<string, Personnage> = Object.fromEntries(PERSONNAGES.map(p => [p.id, p]));
