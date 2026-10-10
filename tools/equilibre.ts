// Mesure de l'équilibre avant / après une évolution des règles.
// Usage :
//   node tools/equilibre.ts [révision]           parties de référence (robot aléatoire) : révision vs fichier courant
//   node tools/equilibre.ts --robot [révision]   robot prudent : rejoué sur la révision (copie de travail temporaire) et sur l'état courant
// Révision par défaut : HEAD.
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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
function afficher(avant: Partie[], apres: Partie[], rev: string) {
  console.log('Avant (' + rev + ') :', JSON.stringify(resumer(avant)));
  console.log('Après           :', JSON.stringify(resumer(apres)));
  for (const d of ['facile', 'normal', 'difficile'])
    console.log('  ' + d.padEnd(9) + ' ' + JSON.stringify(resumer(avant.filter(p => p.difficulte === d))) + ' → ' + JSON.stringify(resumer(apres.filter(p => p.difficulte === d))));
}

const racine = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const args = process.argv.slice(2);
const robot = args[0] === '--robot';
const rev = (robot ? args[1] : args[0]) || 'HEAD';

function lancerRobot(dossier: string): Partie[] {
  const sortie = join(mkdtempSync(join(tmpdir(), 'robot-')), 'r.json');
  execSync('npx vitest run tests/equilibre-robot.test.ts', { cwd: dossier, stdio: 'ignore', env: { ...process.env, ROBOT: '1', ROBOT_SORTIE: sortie } });
  return JSON.parse(readFileSync(sortie, 'utf8'));
}

if (!robot) {
  const avant: Partie[] = JSON.parse(execSync('git show ' + rev + ':tests/reference-parties.json', { encoding: 'utf8', cwd: racine }));
  const apres: Partie[] = JSON.parse(readFileSync(join(racine, 'tests/reference-parties.json'), 'utf8'));
  afficher(avant, apres, rev);
} else {
  const wt = mkdtempSync(join(tmpdir(), 'equilibre-'));
  try {
    execSync('git worktree add --detach "' + wt + '" ' + rev, { cwd: racine, stdio: 'ignore' });
    symlinkSync(join(racine, 'node_modules'), join(wt, 'node_modules'), 'junction');
    for (const f of ['tests/bot-prudent.ts', 'tests/equilibre-robot.test.ts']) copyFileSync(join(racine, f), join(wt, f));
    const avant = lancerRobot(wt);
    const apres = lancerRobot(racine);
    afficher(avant, apres, rev + ', robot prudent');
  } finally {
    execSync('git worktree remove --force "' + wt + '"', { cwd: racine, stdio: 'ignore' });
    if (existsSync(wt)) rmSync(wt, { recursive: true, force: true });
  }
}
