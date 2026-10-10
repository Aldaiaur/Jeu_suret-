import type { BiomeDef, BiomeId } from '../sim/types';

// ---------------------------------------------------------------------
// BIOMES des cartes régionales : palette (sur fond sombre), textures et éléments de relief.
// Les fonds sont générés par code dans l’interface à partir de ces données.
// ---------------------------------------------------------------------
export const BIOMES: Record<BiomeId, BiomeDef> = {
  urbain_bocage: { id:'urbain_bocage', nom:'Tissu urbain et bocage',
    palette:{ mer:'#0c1822', merProfonde:'#08111a', terre:'#1d2620', terre2:'#243024', relief:'#3c4a38', trait:'#56664e', route:'#6d6a5c' },
    textures:['bocage','champs','urbain'], relief:['haie','arbre','batiment','champ'], densite:140 },
  foret_plaine: { id:'foret_plaine', nom:'Forêt et plaine',
    palette:{ mer:'#0d1923', merProfonde:'#08121b', terre:'#19241c', terre2:'#1f2d21', relief:'#2f4530', trait:'#4a6248', route:'#6a6858' },
    textures:['foret','champs'], relief:['arbre','arbre','marais','champ'], densite:170 },
  littoral_desert: { id:'littoral_desert', nom:'Littoral méditerranéen et désert',
    palette:{ mer:'#0d1d2a', merProfonde:'#08131d', terre:'#2e2a20', terre2:'#3a3326', relief:'#5a4c34', trait:'#7a6646', route:'#8a7a5a' },
    textures:['reg','dunes'], relief:['dune','rocher','palmier'], densite:110 },
  steppe_fluviale: { id:'steppe_fluviale', nom:'Steppe et plaine fluviale',
    palette:{ mer:'#0d1a22', merProfonde:'#08121a', terre:'#29281e', terre2:'#302e22', relief:'#4b4632', trait:'#6a6246', route:'#857a5c' },
    textures:['steppe','champs'], relief:['montagne','rocher','champ','palmier'], densite:120 },
  desert_reg: { id:'desert_reg', nom:'Désert et reg',
    palette:{ mer:'#0d1820', merProfonde:'#08111a', terre:'#332b1d', terre2:'#3f3423', relief:'#624f32', trait:'#836a44', route:'#94805a' },
    textures:['dunes','reg'], relief:['dune','dune','rocher','acacia'], densite:130 },
  mangrove_littoral: { id:'mangrove_littoral', nom:'Mangrove et littoral',
    palette:{ mer:'#0b1c22', merProfonde:'#07131a', terre:'#17251d', terre2:'#1c2e22', relief:'#2c4a33', trait:'#466a4c', route:'#6a6a52' },
    textures:['mangrove','foret'], relief:['mangrove','palmier','arbre','marais'], densite:150 },
  littoral_aride: { id:'littoral_aride', nom:'Littoral aride',
    palette:{ mer:'#0b1b26', merProfonde:'#07121b', terre:'#2c2721', terre2:'#36302a', relief:'#574a3c', trait:'#776552', route:'#8a7a62' },
    textures:['reg','steppe'], relief:['rocher','montagne','acacia'], densite:100 },
  archipel_ocean: { id:'archipel_ocean', nom:'Archipels et océan',
    palette:{ mer:'#0b1c2a', merProfonde:'#06111c', terre:'#1a2a22', terre2:'#20332a', relief:'#2e4a3c', trait:'#4a6a5a', route:'#6a7a6a' },
    textures:['houle','foret'], relief:['ile','vague','vague','palmier'], densite:120 }
};
