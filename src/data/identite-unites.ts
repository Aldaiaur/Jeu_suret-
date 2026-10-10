import type { IdentiteUnite } from '../sim/types';

// ---------------------------------------------------------------------
// IDENTITÉ DES UNITÉS : sigle court, symbole militaire OTAN (APP-6, code SIDC à 15 caractères
// rendu par la bibliothèque libre milsymbol), matériels, insigne.
// Les insignes sont des créations originales inspirées des conventions héraldiques (écu, couleurs
// d’arme, symbole de spécialité) ; ils ne reproduisent aucun insigne officiel, qui sont des emblèmes
// protégés. Les devises sont fictives ou génériques.
// Échelons SIDC (12e caractère) : D section, E compagnie ou escadron, F bataillon, G régiment.
// ---------------------------------------------------------------------
const MARINE = '#16233f', OR = '#c9a54a', ARGENT = '#c8cdd2', ROUGE = '#9b2b2b', CIEL = '#3d6f9e', VERT = '#2f5b3e', NOIR = '#14181c', BLEU = '#25467a';

export const IDENTITES: Record<string, IdentiteUnite> = {
  RPIMA1:  { sigle:'1RPIMa', sidc:'SFGPUCIA---G---', materiels:['VBL'],
    insigne:{ forme:'ecu', fond:MARINE, bordure:OR, symbole:'parachute', couleurSymbole:OR, bande:ROUGE, devise:'Au-delà des sables' } },
  RDP13:   { sigle:'13RDP', sidc:'SFGPUCR----G---', materiels:['VBL'],
    insigne:{ forme:'ecu', fond:NOIR, bordure:ARGENT, symbole:'oeil', couleurSymbole:ARGENT, bande:CIEL, devise:'Voir loin, rester invisible' } },
  CPA10:   { sigle:'CPA10', sidc:'SFFPG------E---', materiels:['VBL'],
    insigne:{ forme:'insigne_aile', fond:CIEL, bordure:ARGENT, symbole:'parachute', couleurSymbole:ARGENT, devise:'Du ciel à la terre' } },
  CDOMAR:  { sigle:'CDOMAR', sidc:'SFFPN------F---', materiels:['EMBARCATION'],
    insigne:{ forme:'rond', fond:MARINE, bordure:OR, symbole:'dague', couleurSymbole:OR, bande:VERT, devise:'Par la mer, en silence' } },
  RHFS4:   { sigle:'4RHFS', sidc:'SFFPAH-----G---', materiels:['CARACAL', 'TIGRE'],
    insigne:{ forme:'ecu', fond:NOIR, bordure:OR, symbole:'rotor', couleurSymbole:OR, bande:CIEL, devise:'La nuit est notre alliée' } },
  GIGN:    { sigle:'GIGN', sidc:'SFGPUULC---E---', materiels:[],
    insigne:{ forme:'ecu_pointe', fond:BLEU, bordure:ARGENT, symbole:'bouclier', couleurSymbole:ARGENT, devise:'Protéger d’abord' } },
  RAID:    { sigle:'RAID', sidc:'SFGPUULF---E---', materiels:[],
    insigne:{ forme:'ecu_pointe', fond:NOIR, bordure:ARGENT, symbole:'cible', couleurSymbole:ARGENT, bande:BLEU, devise:'Sang-froid et précision' } },
  SENTI:   { sigle:'SENTI', sidc:'SFGPUCI----H---', materiels:['VAB'],
    insigne:{ forme:'rond', fond:BLEU, bordure:ARGENT, symbole:'tour', couleurSymbole:ARGENT, bande:ROUGE, devise:'Veiller sur la cité' } },
  GTIA1:   { sigle:'GTIA1', sidc:'SFGPUCIZ---F---', materiels:['VBCI', 'VAB'],
    insigne:{ forme:'ecu', fond:VERT, bordure:OR, symbole:'etoile', couleurSymbole:OR, bande:ROUGE, devise:'Tenir et durer' } },
  GTIA2:   { sigle:'GTIA2', sidc:'SFGPUCIZ---F---', materiels:['VBCI', 'VAB'],
    insigne:{ forme:'ecu', fond:VERT, bordure:ARGENT, symbole:'etoile', couleurSymbole:ARGENT, bande:BLEU, devise:'Ensemble jusqu’au bout' } },
  GTIA3:   { sigle:'GTIA3', sidc:'SFGPUCIZ---F---', materiels:['VBCI', 'VAB'],
    insigne:{ forme:'ecu', fond:VERT, bordure:OR, symbole:'bouclier', couleurSymbole:OR, bande:NOIR, devise:'Toujours prêts' } },
  RAFALE:  { sigle:'RAFALE', sidc:'SFAPMFF----E---', materiels:['RAFALE'],
    insigne:{ forme:'insigne_aile', fond:CIEL, bordure:ARGENT, symbole:'eclair', couleurSymbole:'#f2d16b', devise:'Vite et loin' } },
  M2000D:  { sigle:'M2000D', sidc:'SFAPMFA----E---', materiels:['M2000D'],
    insigne:{ forme:'rond', fond:'#4a2a2a', bordure:OR, symbole:'cible', couleurSymbole:OR, devise:'Frapper juste' } },
  REAPER:  { sigle:'REAPER', sidc:'SFAPMFQ----D---', materiels:['REAPER'],
    insigne:{ forme:'rond', fond:NOIR, bordure:CIEL, symbole:'oeil', couleurSymbole:'#8fd0e8', devise:'L’œil qui veille' } },
  ATL2:    { sigle:'ATL2', sidc:'SFAPMFP----D---', materiels:['ATL2'],
    insigne:{ forme:'rond', fond:MARINE, bordure:ARGENT, symbole:'ancre', couleurSymbole:ARGENT, bande:CIEL, devise:'Sur la mer, au-dessus' } },
  MRTT:    { sigle:'C135', sidc:'SFAPMFK----D---', materiels:['C135FR'],
    insigne:{ forme:'insigne_aile', fond:CIEL, bordure:OR, symbole:'goutte', couleurSymbole:OR, devise:'Plus loin, plus longtemps' } },
  A400M:   { sigle:'A400M', sidc:'SFAPMFC----D---', materiels:['A400M'],
    insigne:{ forme:'insigne_aile', fond:'#3a4a5a', bordure:ARGENT, symbole:'helice', couleurSymbole:ARGENT, devise:'Porter sans faillir' } },
  CDG:     { sigle:'CDG', sidc:'SFSPCLCV-------', materiels:['CDG', 'RAFALE'],
    insigne:{ forme:'ecu', fond:MARINE, bordure:OR, symbole:'trident', couleurSymbole:OR, bande:CIEL, devise:'La mer comme base' } },
  FREMM:   { sigle:'FREMM', sidc:'SFSPCLFF-------', materiels:['FREMM'],
    insigne:{ forme:'rond', fond:MARINE, bordure:ARGENT, symbole:'ancre', couleurSymbole:ARGENT, devise:'Vigilance et maîtrise' } },
  SNA:     { sigle:'SNA', sidc:'SFUPSNA--------', materiels:['RUBIS'],
    insigne:{ forme:'rond', fond:NOIR, bordure:OR, symbole:'onde', couleurSymbole:OR, devise:'Silence et patience' } },
  BPC:     { sigle:'BPC', sidc:'SFSPCALS-------', materiels:['MISTRAL'],
    insigne:{ forme:'ecu', fond:MARINE, bordure:ARGENT, symbole:'ancre', couleurSymbole:ARGENT, bande:VERT, devise:'De la mer à la terre' } },
  GAM:     { sigle:'GAM', sidc:'SFGPUCVRA--F---', materiels:['TIGRE', 'CAIMAN', 'GAZELLE'],
    insigne:{ forme:'ecu', fond:CIEL, bordure:OR, symbole:'helice', couleurSymbole:OR, bande:VERT, devise:'Au ras du sol' } },
  CAESAR:  { sigle:'CAESAR', sidc:'SFGPUCFHE--E---', materiels:['CAESAR'],
    insigne:{ forme:'ecu', fond:ROUGE, bordure:OR, symbole:'canon', couleurSymbole:OR, bande:MARINE, devise:'Précision et portée' } },
  RH2:     { sigle:'2RH', sidc:'SFGPUCR----G---', materiels:['VBL'],
    insigne:{ forme:'losange', fond:CIEL, bordure:ARGENT, symbole:'oeil', couleurSymbole:ARGENT, bande:ROUGE, devise:'Chercher, trouver, rendre compte' } },
  BRI:     { sigle:'BRI', sidc:'SFGPUULC---D---', materiels:[],
    insigne:{ forme:'ecu_pointe', fond:BLEU, bordure:ROUGE, symbole:'cible', couleurSymbole:ARGENT, devise:'Aller au contact' } },
  AWACS:   { sigle:'E-3F', sidc:'SFAPMFRW---D---', materiels:['E3F'],
    insigne:{ forme:'rond', fond:CIEL, bordure:ARGENT, symbole:'onde', couleurSymbole:ARGENT, devise:'Tout voir, tout coordonner' } },
  GABRIEL: { sigle:'GABRL', sidc:'SFAPMFRZ---D---', materiels:['C160G'],
    insigne:{ forme:'rond', fond:NOIR, bordure:CIEL, symbole:'onde', couleurSymbole:'#8fd0e8', bande:ARGENT, devise:'Écouter le ciel' } },
  HORIZON: { sigle:'HORZN', sidc:'SFSPCLDD-------', materiels:['HORIZON'],
    insigne:{ forme:'ecu', fond:MARINE, bordure:ARGENT, symbole:'bouclier', couleurSymbole:ARGENT, bande:CIEL, devise:'Bouclier de la flotte' } }
};
