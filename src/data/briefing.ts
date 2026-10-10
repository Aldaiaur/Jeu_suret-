// Note de situation d'ouverture (janvier 2015). Faits réels antérieurs au début de la partie,
// sans nom de personne réelle. Tout ce qui suit le début de la partie est fictif.

import type { BriefingDef } from '../sim/types';

export const BRIEFING_FRA: BriefingDef = {
  date: 'Paris, le 15 janvier 2015',
  diffusion: 'Diffusion restreinte',
  expediteur: 'FRA_SGDSN',
  destinataire: 'Chef de la cellule de crise interministérielle',
  introduction: 'Vous prenez la tête de la cellule de crise interministérielle, placée auprès du Président de la République. Vous disposez des services de renseignement, des forces spéciales, des armées et de l’appui de nos partenaires. Voici l’état de la menace à votre prise de fonctions.',
  paragraphes: [
    { theatre: 'METRO', titre: 'Territoire national', texte: 'Les attentats commis à Paris du 7 au 9 janvier ont fait dix-sept victimes. Le 11 janvier, plusieurs millions de personnes ont manifesté dans tout le pays. Plus d’un millier de personnes seraient liées aux filières djihadistes syro-irakiennes. Le Président attend votre recommandation sur l’engagement durable de 10 000 militaires pour protéger le territoire.' },
    { theatre: 'METRO', titre: 'Cyberespace', texte: 'Depuis les attentats, des milliers de sites internet français ont été défigurés par des groupes se réclamant du djihad. L’ANSSI redoute des attaques plus sérieuses contre des infrastructures vitales.' },
    { theatre: 'LEVANT', titre: 'Levant', texte: 'Daech tient Mossoul depuis juin 2014 et une large part de l’Irak et de la Syrie. La France participe à la coalition depuis septembre 2014 (opération Chammal) avec des avions de combat basés dans la région.' },
    { theatre: 'SAHEL', titre: 'Sahel', texte: 'L’opération Barkhane a pris le relais de Serval en août 2014 : environ 3 000 militaires répartis entre cinq pays. Les groupes armés se réorganisent dans le nord du Mali et le long des frontières.' },
    { theatre: 'LIBYE', titre: 'Libye', texte: 'Le pays est déchiré entre deux gouvernements rivaux depuis l’été 2014. Des groupes ralliés à Daech s’y installent, à quelques centaines de kilomètres de nos côtes.' },
    { theatre: 'EST', titre: 'Flanc est de l’Europe', texte: 'La Russie a annexé la Crimée en mars 2014. Les combats se poursuivent dans le Donbass malgré le protocole de Minsk. Nos alliés baltes et polonais demandent des gages de solidarité.' },
    { theatre: 'INDOPAC', titre: 'Indo-Pacifique', texte: 'La Corée du Nord a mené trois essais nucléaires (2006, 2009, 2013) et multiplie les tirs balistiques. En mer de Chine méridionale, la construction d’îles artificielles s’accélère. Nos territoires et nos forces dans la zone sont exposés.' }
  ],
  conclusion: 'Le Président vous demande d’arrêter, dès cette semaine, la doctrine qui guidera l’action de l’État pendant les trois années à venir.'
};
