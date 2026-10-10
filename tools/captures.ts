// Captures d'écran automatiques de l'interface, pour vérifier le rendu sans intervention humaine.
// Usage : npm run dev (dans un autre terminal), puis npm run screens [url]
import { chromium, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const URL_JEU = process.argv[2] || 'http://localhost:5173/';
const DOSSIER = new URL('../captures/', import.meta.url);
mkdirSync(DOSSIER, { recursive: true });

// CHROMIUM : chemin d’un navigateur déjà installé, quand la version de Playwright n’a pas le sien
const navigateur = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await navigateur.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const erreurs: string[] = [];
page.on('pageerror', e => erreurs.push(e.message));
page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });

const capture = async (nom: string) => { await page.waitForTimeout(700); await page.screenshot({ path: new URL(nom + '.png', DOSSIER).pathname.replace(/^\/([A-Z]:)/, '$1') }); console.log('capture ' + nom); };
const jeu = (p: Page, code: string) => p.evaluate(code);

await page.goto(URL_JEU);
await page.evaluate(() => localStorage.clear());
await page.reload();
await capture('01-accueil');

await page.click('text=Nouvelle partie');
await capture('02-briefing');
await page.click('text=Arrêter la doctrine');
await capture('03-doctrines');
await page.click('[data-tuto="doctrine-RENS"]');
await capture('04-jeu-tutoriel');

// Quelques étapes du tutoriel
for (let i = 0; i < 4; i++) await page.click('.tuto-carte .btn.principal');
await capture('05-tutoriel-metro');
await page.click('[data-tuto="theatre-METRO"]', { force: true });
await capture('06-fiche-metro');
await page.click('text=Passer le tutoriel');

await page.click('[data-tuto="theatre-SAHEL"]', { force: true });
await capture('07-fiche-sahel');
await page.click('[data-tuto="onglet-renseignement"]');
await page.click('[data-tuto="onglet-rapports"]');
await capture('08-renseignement-rapports');

// Fin du mois et transition
await page.keyboard.press('Escape');
await page.click('[data-tuto="fin-tour"]');
await page.waitForTimeout(300);
await capture('09-transition');
await page.waitForTimeout(2600);

// Événement forcé
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.phase = 'evenement'; s.evenementCourant = 'OTAGES_SAHEL'; s.file = []; j.remplacer(s); })()`);
await capture('10-evenement');
await page.click('.choix >> nth=2');
await page.waitForTimeout(300);

// Aperçu d'opération au Levant
await page.click('[data-tuto="theatre-LEVANT"]', { force: true });
const evaluer = page.locator('.fiche .btn.principal', { hasText: 'Évaluer' }).first();
if (await evaluer.count()) { await evaluer.click(); await capture('11-apercu-operation'); await page.keyboard.press('Escape'); }

// Crise au Levant puis zoom régional
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); const m = s.menaces.find(x => x.theatre === 'LEVANT');
  s.theatres.LEVANT.crise = { titre: 'Offensive contre le front kurde', texte: 'Daech concentre des forces autour de Hawija et Qayyarah et menace Makhmour et Kirkouk.', menaceId: m.id, scenario: 'FRONT_KURDE', statut: 'ouverte', toursLibres: 0 };
  s.phase = 'crise'; s.criseCourante = 'LEVANT'; j.remplacer(s); })()`);
await capture('12-crise');
await page.click('.fenetre .btn.principal');
await page.waitForTimeout(400);
await capture('13-zoom');
await page.click('.detachement', { force: true });
await capture('14-zoom-selection');

await page.keyboard.press('h');
await capture('15-aide');
await page.keyboard.press('h');

// Vues régionales de chaque théâtre (biome, saison du mois)
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.zoom = null; s.phase = 'jeu'; s.criseCourante = null; s.theatres.LEVANT.crise = null; j.remplacer(s); j.majUi({ bilan: null }); })()`);
await page.waitForTimeout(300);
for (const t of ['METRO', 'EST', 'LIBYE', 'LEVANT', 'SAHEL', 'GUINEE', 'CORNE', 'INDOPAC']) {
  await jeu(page, `window.__jeu.majUi({ selection: { kind: 'theatre', id: '${t}' } })`);
  await capture('20-regional-' + t);
}
// Saisons marquées : pluies au Sahel (juillet), raspoutitsa et hiver à l'est, mousson à Djibouti
for (const [t, tour, nom] of [['SAHEL', 6, 'sahel-pluies'], ['EST', 3, 'est-raspoutitsa'], ['EST', 12, 'est-hiver'], ['CORNE', 7, 'corne-mousson'], ['LEVANT', 7, 'levant-chaleur']] as const) {
  await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.tour = ${tour}; j.remplacer(s); j.majUi({ selection: { kind: 'theatre', id: '${t}' } }); })()`);
  await capture('21-saison-' + nom);
}

// Commandement tactique au Sahel : sélection d'une unité, ordre par défaut, compte rendu du mois
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.tour = 1; s.theatres.SAHEL.lieux.GOURMA.connu = 90; s.theatres.SAHEL.lieux.MENAKA.connu = 80; j.remplacer(s); j.majUi({ selection: { kind: 'theatre', id: 'SAHEL' }, uniteRegion: 'M2000D' }); })()`);
await capture('22-ordres-aviation');
await page.click('[data-tuto="jeton-GTIA1"]');
await capture('23-ordres-gtia');
await jeu(page, `(() => { const j = window.__jeu; j.jouer({ type: 'MISSION', unite: 'M2000D', mission: 'frappe', lieu: 'GOURMA' }); })()`);
await page.waitForTimeout(200);
await jeu(page, `(() => { const j = window.__jeu; j.jouer({ type: 'POSTURE', unite: 'REAPER', posture: 'reconnaissance' }); })()`);
await page.waitForTimeout(200);
await jeu(page, `(() => { const j = window.__jeu; j.jouer({ type: 'MISSION', unite: 'GTIA1', mission: 'patrouille', lieu: 'GAO' }); })()`);
await page.waitForTimeout(200);
await jeu(page, `window.__jeu.majUi({ uniteRegion: null })`);
await capture('24-missions');
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.file = []; s.phase = 'jeu'; j.remplacer(s); })()`);
await page.waitForTimeout(200);
await jeu(page, `window.__jeu.terminerTour()`);
await page.waitForTimeout(3200);
await jeu(page, `(() => { const j = window.__jeu; const s = structuredClone(j.etat); s.file = []; s.phase = 'jeu'; s.evenementCourant = null; j.remplacer(s); j.majUi({ selection: { kind: 'theatre', id: 'SAHEL' }, uniteRegion: null }); })()`);
await capture('25-compte-rendu-tactique');

await navigateur.close();
if (erreurs.length) { console.error('Erreurs dans la page :\n' + erreurs.join('\n')); process.exitCode = 1; }
else console.log('Aucune erreur dans la page.');
