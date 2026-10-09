// Fige les parties de référence jouées par le robot sur la maquette HTML d'origine.
// Usage : node tools/golden-prototype.ts  →  tests/reference-parties.json
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { jouerParties } from '../tests/bot-aleatoire.ts';

const html = readFileSync(new URL('../prototype/cellule-de-crise.html', import.meta.url), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.indexOf('</script>'));
const moteur = script.slice(0, script.indexOf('// COUCHE 3 — INTERFACE'));
const ctx = vm.createContext({ console: { log() {}, table() {}, warn() {} } });
vm.runInContext(moteur + '\n;globalThis.__M = { nouvellePartie, actionsPossibles, appliquerAction, finDeTour, alea, verifierInvariants };', ctx);
const M = (ctx as any).__M;

const parties = jouerParties(M, 60, ['facile', 'normal', 'difficile']);
writeFileSync(new URL('../tests/reference-parties.json', import.meta.url), JSON.stringify(parties, null, 1) + '\n');
console.log(parties.length + ' parties figées. Fins : ' + JSON.stringify(parties.reduce((a: Record<string, number>, p) => (a[p.fin] = (a[p.fin] || 0) + 1, a), {})));
