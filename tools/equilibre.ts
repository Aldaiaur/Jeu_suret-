// Compare l’issue des parties de référence entre la dernière version committée et le fichier courant.
// Usage : node tools/equilibre.ts [révision]   (révision par défaut : HEAD)
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

interface Partie { difficulte: string; tour: number; fin: string; score: number }

function resumer(l: Partie[]) {
  const n = l.length || 1;
  const def = l.filter(p => p.fin === 'defaite').length;
  return {
    parties: l.length,
    defaites: Math.round(def / n * 1000) / 10 + ' %',
    dureeMoyenne: Math.round(l.reduce((a, p) => a + p.tour, 0) / n * 10) / 10,
    scoreMoyen: Math.round(l.reduce((a, p) => a + p.score, 0) / n * 10) / 10
  };
}

const rev = process.argv[2] || 'HEAD';
const avant: Partie[] = JSON.parse(execSync('git show ' + rev + ':tests/reference-parties.json', { encoding: 'utf8' }));
const apres: Partie[] = JSON.parse(readFileSync(new URL('../tests/reference-parties.json', import.meta.url), 'utf8'));
console.log('Avant (' + rev + ') :', resumer(avant));
console.log('Après (fichier)  :', resumer(apres));
for (const d of ['facile', 'normal', 'difficile']) {
  console.log('  ' + d.padEnd(9), 'avant', resumer(avant.filter(p => p.difficulte === d)), '\n  ' + ' '.repeat(9), 'après', resumer(apres.filter(p => p.difficulte === d)));
}
