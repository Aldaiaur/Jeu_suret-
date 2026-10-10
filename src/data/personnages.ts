// Personnages fictifs. Aucun nom de personne réelle : les fonctions et institutions sont réelles,
// les titulaires sont inventés, avec des noms plausibles pour leur pays.
// Quand une fonction existe réellement, le texte du jeu cite la fonction ; le nom n'apparaît qu'en signature
// ou dans les dialogues.
// Portrait : paramètres d'un buste générique dessiné par code (aucune ressemblance recherchée).
// Ton : manière de parler, qui donne la formule d'ouverture et la signature dans les événements.

export interface Portrait {
  teint: string; cheveux: string;
  coupe: 'court' | 'raie' | 'chignon' | 'degarni' | 'long' | 'ras' | 'carre';
  tenue: 'costume' | 'tailleur' | 'terre' | 'air' | 'mer' | 'gendarmerie';
  lunettes?: boolean; barbe?: boolean; etoiles?: number;
}
export interface Personnage {
  id: string; nom: string; fonction: string; pays: string;
  ton: string;              // description du ton, pour l'écriture des textes
  ouverture: string;        // formule d'ouverture d'une note
  signature: string;        // formule finale
  portrait: Portrait;
}

const P = (teint: string, cheveux: string, coupe: Portrait['coupe'], tenue: Portrait['tenue'], o: Partial<Portrait> = {}): Portrait => ({ teint, cheveux, coupe, tenue, ...o });
const CLAIR = '#e2b99a', MAT = '#c99a74', HALE = '#b07a55', FONCE = '#7a5038', TRES_FONCE = '#5a3a28';
const GRIS = '#9a9a9a', BLANC = '#d8d4cc', BRUN = '#4a3324', NOIR = '#1e1a18', CHATAIN = '#6b4a30', BLOND = '#b89a62', POIVRE = '#6e6a66';

export const PERSONNAGES: Personnage[] = [
  // France
  { id: 'FRA_PR', nom: 'Bertrand Lacassagne', fonction: 'Président de la République', pays: 'FRA', ton: 'solennel, attentif aux symboles',
    ouverture: 'Je veux que nous soyons à la hauteur.', signature: 'Le Président de la République', portrait: P(CLAIR, POIVRE, 'degarni', 'costume', { lunettes: true }) },
  { id: 'FRA_PM', nom: 'Claire Lestrade', fonction: 'Première ministre', pays: 'FRA', ton: 'pragmatique, soucieuse du Parlement et du budget',
    ouverture: 'Il nous faut une position claire devant les assemblées.', signature: 'Claire Lestrade', portrait: P(CLAIR, CHATAIN, 'carre', 'tailleur') },
  { id: 'FRA_DEF', nom: 'Olivier Ferrandi', fonction: 'Ministre de la Défense', pays: 'FRA', ton: 'direct, protecteur des armées',
    ouverture: 'Les armées tiennent, mais elles sont à la limite.', signature: 'Olivier Ferrandi, ministre de la Défense', portrait: P(MAT, BRUN, 'raie', 'costume') },
  { id: 'FRA_INT', nom: 'Hélène Castagnet', fonction: 'Ministre de l’Intérieur', pays: 'FRA', ton: 'ferme, préoccupée par l’usure des forces de sécurité',
    ouverture: 'Mes services ne peuvent pas tout tenir seuls.', signature: 'Hélène Castagnet, ministre de l’Intérieur', portrait: P(CLAIR, NOIR, 'chignon', 'tailleur') },
  { id: 'FRA_MAE', nom: 'Jean-Marc Sorel', fonction: 'Ministre des Affaires étrangères', pays: 'FRA', ton: 'diplomatique, nuancé',
    ouverture: 'Nos partenaires attendent un signal, et chacun le lira à sa façon.', signature: 'Jean-Marc Sorel, ministre des Affaires étrangères', portrait: P(CLAIR, BLANC, 'raie', 'costume', { lunettes: true }) },
  { id: 'FRA_SGDSN', nom: 'Laurent Ternier', fonction: 'Secrétaire général de la défense et de la sécurité nationale', pays: 'FRA', ton: 'administratif, précis, factuel',
    ouverture: 'Note à l’attention du conseil de défense.', signature: 'Laurent Ternier, SGDSN', portrait: P(CLAIR, GRIS, 'court', 'costume', { lunettes: true }) },
  { id: 'FRA_CEMA', nom: 'général Antoine de Kervéguen', fonction: 'Chef d’état-major des armées', pays: 'FRA', ton: 'militaire, sobre, exigeant sur les moyens',
    ouverture: 'Monsieur le Président, mon appréciation est la suivante.', signature: 'Général d’armée A. de Kervéguen, CEMA', portrait: P(CLAIR, GRIS, 'ras', 'terre', { etoiles: 5 }) },
  { id: 'FRA_COS', nom: 'général Marc Dussollier', fonction: 'Commandant des opérations spéciales', pays: 'FRA', ton: 'laconique, opérationnel',
    ouverture: 'Fenêtre courte. Il faut décider vite.', signature: 'Général M. Dussollier, COS', portrait: P(HALE, NOIR, 'ras', 'terre', { barbe: true, etoiles: 2 }) },
  { id: 'FRA_SAHEL', nom: 'général Loïc Kerdraon', fonction: 'Commandant de la force au Sahel', pays: 'FRA', ton: 'de terrain, concret, inquiet pour ses hommes',
    ouverture: 'Depuis le poste de commandement, la situation est la suivante.', signature: 'Général L. Kerdraon, commandant de la force', portrait: P(HALE, CHATAIN, 'ras', 'terre', { etoiles: 3 }) },
  { id: 'FRA_FFDJ', nom: 'général Étienne Maupoint', fonction: 'Commandant des forces françaises à Djibouti', pays: 'FRA', ton: 'méthodique, attentif aux relations locales',
    ouverture: 'Les autorités djiboutiennes ont été informées.', signature: 'Général É. Maupoint, COMFOR Djibouti', portrait: P(MAT, POIVRE, 'court', 'air', { etoiles: 2, lunettes: true }) },
  { id: 'FRA_DGSE', nom: 'Philippe Maurand', fonction: 'Directeur général de la sécurité extérieure', pays: 'FRA', ton: 'feutré, allusif, prudent sur les sources',
    ouverture: 'Ce que je vais vous dire ne doit pas sortir de cette pièce.', signature: 'P. Maurand, DGSE', portrait: P(CLAIR, POIVRE, 'raie', 'costume') },
  { id: 'FRA_DGSI', nom: 'Sophie Arnaud-Delmas', fonction: 'Directrice générale de la sécurité intérieure', pays: 'FRA', ton: 'analytique, alerte, sans dramatiser',
    ouverture: 'Le niveau de menace reste très élevé. Voici ce que nous savons.', signature: 'S. Arnaud-Delmas, DGSI', portrait: P(MAT, BRUN, 'long', 'tailleur', { lunettes: true }) },
  { id: 'FRA_DRM', nom: 'général Yves Pellerin', fonction: 'Directeur du renseignement militaire', pays: 'FRA', ton: 'technique, chiffré',
    ouverture: 'Les capteurs indiquent, avec un degré de confiance moyen, ceci.', signature: 'Général Y. Pellerin, DRM', portrait: P(CLAIR, GRIS, 'degarni', 'air', { etoiles: 2 }) },
  { id: 'FRA_ANSSI', nom: 'Nicolas Berthelot-Rey', fonction: 'Directeur général de l’ANSSI', pays: 'FRA', ton: 'pédagogue, technique',
    ouverture: 'En termes simples : nous avons un problème sérieux.', signature: 'N. Berthelot-Rey, ANSSI', portrait: P(CLAIR, BLOND, 'court', 'costume', { barbe: true }) },

  // États-Unis
  { id: 'USA_PR', nom: 'Thomas W. Halvorsen', fonction: 'Président des États-Unis', pays: 'USA', ton: 'assuré', ouverture: '', signature: 'Thomas W. Halvorsen', portrait: P(CLAIR, BLANC, 'raie', 'costume') },
  { id: 'USA_NSA', nom: 'Denise Okafor', fonction: 'Conseillère à la sécurité nationale', pays: 'USA', ton: 'directe', ouverture: '', signature: 'Denise Okafor', portrait: P(FONCE, NOIR, 'carre', 'tailleur') },
  { id: 'USA_DEF', nom: 'Richard Callahan', fonction: 'Secrétaire à la Défense', pays: 'USA', ton: 'martial', ouverture: '', signature: 'Richard Callahan', portrait: P(CLAIR, GRIS, 'ras', 'costume') },
  { id: 'USA_SEC', nom: 'Margaret Ellison-Ward', fonction: 'Secrétaire d’État', pays: 'USA', ton: 'diplomatique', ouverture: '', signature: 'Margaret Ellison-Ward', portrait: P(CLAIR, BLOND, 'carre', 'tailleur') },
  // Royaume-Uni
  { id: 'GBR_PM', nom: 'Edward Ainsley', fonction: 'Premier ministre', pays: 'GBR', ton: 'courtois', ouverture: '', signature: 'Edward Ainsley', portrait: P(CLAIR, CHATAIN, 'raie', 'costume') },
  { id: 'GBR_DEF', nom: 'Fiona Mackenzie-Hale', fonction: 'Secrétaire d’État à la Défense', pays: 'GBR', ton: 'franche', ouverture: '', signature: 'Fiona Mackenzie-Hale', portrait: P(CLAIR, '#8a4a2a', 'long', 'tailleur') },
  // Russie
  { id: 'RUS_PR', nom: 'Viktor Sokoline', fonction: 'Président de la Fédération de Russie', pays: 'RUS', ton: 'froid', ouverture: '', signature: 'Viktor Sokoline', portrait: P(CLAIR, BLOND, 'degarni', 'costume') },
  { id: 'RUS_DEF', nom: 'Guennadi Bortnikov-Lazarev', fonction: 'Ministre de la Défense', pays: 'RUS', ton: 'sec', ouverture: '', signature: 'G. Bortnikov-Lazarev', portrait: P(CLAIR, POIVRE, 'court', 'terre', { etoiles: 4 }) },
  { id: 'RUS_MAE', nom: 'Arkadi Voronine', fonction: 'Ministre des Affaires étrangères', pays: 'RUS', ton: 'ironique', ouverture: '', signature: 'Arkadi Voronine', portrait: P(CLAIR, GRIS, 'raie', 'costume', { lunettes: true }) },
  // Chine
  { id: 'CHN_PR', nom: 'Liang Wenhao', fonction: 'Président de la République populaire, secrétaire général du Parti', pays: 'CHN', ton: 'mesuré', ouverture: '', signature: 'Liang Wenhao', portrait: P(MAT, NOIR, 'raie', 'costume') },
  { id: 'CHN_MAE', nom: 'Zhou Mingrui', fonction: 'Ministre des Affaires étrangères', pays: 'CHN', ton: 'formel', ouverture: '', signature: 'Zhou Mingrui', portrait: P(MAT, NOIR, 'court', 'costume', { lunettes: true }) },
  // Israël
  { id: 'ISR_PM', nom: 'Avraham Ben-Dor', fonction: 'Premier ministre', pays: 'ISR', ton: 'combatif', ouverture: '', signature: 'Avraham Ben-Dor', portrait: P(MAT, GRIS, 'degarni', 'costume') },
  { id: 'ISR_DEF', nom: 'Yossi Harel-Amit', fonction: 'Ministre de la Défense', pays: 'ISR', ton: 'abrupt', ouverture: '', signature: 'Yossi Harel-Amit', portrait: P(HALE, NOIR, 'ras', 'costume', { barbe: true }) },
  // Autres acteurs
  { id: 'DEU_CH', nom: 'Katharina Albrecht', fonction: 'Chancelière fédérale', pays: 'DEU', ton: 'méthodique', ouverture: '', signature: 'Katharina Albrecht', portrait: P(CLAIR, BLOND, 'carre', 'tailleur') },
  { id: 'ITA_PM', nom: 'Lorenzo Cattaneo', fonction: 'Président du Conseil', pays: 'ITA', ton: 'chaleureux', ouverture: '', signature: 'Lorenzo Cattaneo', portrait: P(MAT, NOIR, 'raie', 'costume') },
  { id: 'MLI_PR', nom: 'Mamadou Kéïta-Diallo', fonction: 'Président de la République du Mali', pays: 'MLI', ton: 'grave', ouverture: '', signature: 'Mamadou Kéïta-Diallo', portrait: P(TRES_FONCE, NOIR, 'ras', 'costume', { lunettes: true }) },
  { id: 'IRN_PR', nom: 'Hossein Moradi-Far', fonction: 'Président de la République islamique', pays: 'IRN', ton: 'prudent', ouverture: '', signature: 'Hossein Moradi-Far', portrait: P(MAT, GRIS, 'court', 'costume', { barbe: true }) },
  { id: 'PRK_MAE', nom: 'Ryang Sok-chol', fonction: 'Ministre des Affaires étrangères de Corée du Nord', pays: 'PRK', ton: 'véhément', ouverture: '', signature: 'Ryang Sok-chol', portrait: P(MAT, NOIR, 'raie', 'costume') }
];

export const PERS: Record<string, Personnage> = Object.fromEntries(PERSONNAGES.map(p => [p.id, p]));
