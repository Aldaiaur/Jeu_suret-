// Mesure des temps de réponse de l'interface : ouverture des vues régionales, retour au monde,
// passage de mois, ouverture d'une intervention. Usage : npm run dev, puis node tools/performances.ts
import { chromium } from '@playwright/test';

const navigateur = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await navigateur.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(process.argv[2] || 'http://localhost:5173/');
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.click('text=Nouvelle partie'); await page.click('text=Arrêter la doctrine'); await page.click('[data-tuto="doctrine-RENS"]');
await page.click('text=Passer le tutoriel');

// Durée entre une commande et la deuxième image peinte après elle
const mesurer = (code: string) => page.evaluate((c) => new Promise<number>(res => {
  const t0 = performance.now();
  new Function(c)();
  requestAnimationFrame(() => requestAnimationFrame(() => res(Math.round(performance.now() - t0))));
}), code);

const r: Record<string, number> = {};
for (const t of ['METRO', 'EST', 'LIBYE', 'LEVANT', 'SAHEL', 'GUINEE', 'CORNE', 'INDOPAC'])
  r['vue ' + t] = await mesurer(`window.__jeu.majUi({ selection: { kind: 'theatre', id: '${t}' } })`);
r['retour au monde'] = await mesurer(`window.__jeu.majUi({ selection: null })`);
const mois: number[] = [];
for (let i = 0; i < 8; i++) {
  await page.evaluate(() => { const j = (window as any).__jeu; const s = structuredClone(j.etat); s.file = []; s.phase = 'jeu'; s.evenementCourant = null; s.criseCourante = null; j.remplacer(s); j.majUi({ transition: null }); });
  await page.waitForTimeout(100);
  mois.push(await mesurer(`window.__jeu.terminerTour()`));
}
r['passage de mois (moyenne)'] = Math.round(mois.reduce((a, b) => a + b, 0) / mois.length);
r['passage de mois (max)'] = Math.max(...mois);
await page.evaluate(() => { const j = (window as any).__jeu; j.majUi({ transition: null }); const s = structuredClone(j.etat); const m = s.menaces.find((x: any) => x.theatre === 'SAHEL');
  s.theatres.SAHEL.crise = { titre: 'Test', texte: 'Test', menaceId: m.id, scenario: 'TOMBOUCTOU_MENACEE', statut: 'ouverte', toursLibres: 0 }; s.file = []; s.phase = 'crise'; s.criseCourante = 'SAHEL'; j.remplacer(s); });
await page.waitForTimeout(200);
r['ouverture d’une intervention'] = await mesurer(`window.__jeu.jouer({ type: 'CRISE', intervenir: true })`);
console.table(r);
await navigateur.close();
