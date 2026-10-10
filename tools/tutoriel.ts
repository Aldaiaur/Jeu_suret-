// Parcours automatique du tutoriel : vérifie que chaque étape s'affiche et peut être franchie.
// Usage : npm run dev, puis node tools/tutoriel.ts
import { chromium } from '@playwright/test';
import { navigateurInstalle } from './navigateur.ts';

const b = await chromium.launch(navigateurInstalle());
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
const erreurs: string[] = []; p.on('pageerror', e => erreurs.push(e.message));
await p.goto(process.argv[2] || 'http://localhost:5173/'); await p.evaluate(() => localStorage.clear()); await p.reload();
await p.click('text=Nouvelle partie'); await p.click('text=Arrêter la doctrine'); await p.click('[data-tuto="doctrine-RENS"]');

// Action attendue pour les étapes à condition ; les autres se franchissent par « Suivant »
const actions: Record<string, () => Promise<void>> = {
  'Le territoire d’abord': () => p.click('[data-tuto="theatre-METRO"]', { force: true }),
  'Orienter le renseignement': () => p.click('[data-tuto="capteur-DGSI-HUMINT"] button:last-of-type'),
  'Protéger le territoire': () => p.click('[data-tuto="engager-SENTI"]'),
  'Le Sahel': () => p.click('[data-tuto="theatre-SAHEL"]'),
  'Vos unités sur le terrain': () => p.click('[data-tuto="jeton-GTIA1"]', { force: true }),
  'Donner un ordre en deux clics': () => p.click('.vr-posture >> text=Reconnaissance'),
  'Rapports de renseignement': () => p.click('[data-tuto="onglet-rapports"]'),
  'Clôturer le mois': async () => { await p.click('[data-tuto="fin-tour"]'); await p.waitForTimeout(400); await p.keyboard.press('Enter'); }
};
const vues: string[] = [];
for (let i = 0; i < 30; i++) {
  const t = await p.locator('.tuto-carte .tuto-titre').textContent({ timeout: 3000 }).catch(() => null);
  if (!t) break;
  if (vues[vues.length - 1] === t && vues[vues.length - 2] === t) { erreurs.push('Étape bloquée : ' + t); break; }
  vues.push(t);
  if (actions[t]) await actions[t]().catch(e => erreurs.push('Action impossible (' + t + ') : ' + String(e).slice(0, 80)));
  else await p.click('.tuto-carte .btn.principal', { timeout: 4000 }).catch(() => erreurs.push('Bouton introuvable : ' + t));
  await p.waitForTimeout(350);
  if (await p.locator('.fenetre .choix').count()) { await p.click('.fenetre .choix >> nth=0'); await p.waitForTimeout(250); }
}
console.log([...new Set(vues)].length + ' étapes parcourues : ' + [...new Set(vues)].join(' → '));
await b.close();
if (erreurs.length) { console.error(erreurs.join('\n')); process.exitCode = 1; } else console.log('Tutoriel complet, aucune erreur.');
