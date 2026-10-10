// Événements : conditions de tirage, application des effets, file des événements et crises.
import { AL, EV, MT, PERS, TH, UN } from '../data';
import { devise, unitesDe } from './acces';
import type { Action, Effets, Etat, EvenementDef } from './types';
import { alea, borner } from './outils';
import { appuiDef, decider, journaliser, menacesDans, unitesDans } from './acces';
import { calculerRens } from './renseignement';
import { activerAppui, rapatrier } from './actions';
import { creerCrise } from './crises';

export function conditionsRemplies(s: Etat, E: EvenementDef): boolean {
  const c = E.cond || {};
  if (c.chaine) return false;
  if (PERS[E.auteur]?.pays !== s.nation) return false;   // chaque nation a ses dossiers, présentés par ses responsables
  if ((s.compteurEvenements[E.id] || 0) >= (E.max || 1)) return false;
  if (c.tourMin !== undefined && s.tour < c.tourMin) return false;
  if (c.tourMax !== undefined && s.tour > c.tourMax) return false;
  const R = s.ressources;
  if (c.opinionMax !== undefined && R.opinion > c.opinionMax) return false;
  if (c.opinionMin !== undefined && R.opinion < c.opinionMin) return false;
  if (c.menaceIntMin !== undefined && R.menaceInt < c.menaceIntMin) return false;
  if (c.surcoutMin !== undefined && R.surcout < c.surcoutMin) return false;
  const cm = c.menace;
  if (cm && !s.menaces.some(m => m.type === cm.type && m.force >= cm.forceMin && (!cm.theatre || m.theatre === cm.theatre))) return false;
  if (c.deploiementExterieur && !unitesDe(s).some(u => s.unites[u.id].etat === 'deployee' && TH[s.unites[u.id].theatre!].exterieur)) return false;
  if (c.theatreDeploye && unitesDans(s, c.theatreDeploye).length === 0) return false;
  if (c.rensMin && s.theatres[c.rensMin.theatre]?.rens < c.rensMin.val) return false;
  if (c.relationMin && !(s.allies[c.relationMin.allie]?.relation >= c.relationMin.val)) return false;
  if (c.relationMax && !(s.allies[c.relationMax.allie]?.relation <= c.relationMax.val)) return false;
  return true;
}

const LIBELLES = { opinion: 'Opinion', capital: 'Capital politique', credibilite: 'Crédibilité', menaceInt: 'Menace intérieure' };

export function appliquerEffets(s: Etat, e: Effets, res: string[]): string[] {
  const R = s.ressources;
  for (const k of ['opinion', 'capital', 'credibilite', 'menaceInt'] as const) if (e[k]) { R[k] = borner(R[k] + e[k]!, 0, 100); res.push(LIBELLES[k] + ' ' + (e[k]! > 0 ? '+' : '') + e[k]); }
  if (e.budget) { R.budget += e.budget; res.push('Budget (' + devise(s) + ') ' + (e.budget > 0 ? '+' : '') + e.budget); }
  if (e.enveloppe) { R.enveloppe = Math.max(20, R.enveloppe + e.enveloppe); res.push('Enveloppe mensuelle (' + devise(s) + ') ' + (e.enveloppe > 0 ? '+' : '') + e.enveloppe); }
  for (const x of (e.menace || [])) {
    const cands = s.menaces.filter(m => m.type === x.type && (!x.theatre || m.theatre === x.theatre)).sort((a, b) => b.force - a.force);
    if (cands.length) cands[0].force = borner(cands[0].force + x.delta, 0, 100);
  }
  for (const x of (e.rens || [])) { if (x.delta >= 10 && x.theatre && s.theatres[x.theatre]) s.theatres[x.theatre].rensPermanent += Math.round(x.delta / 2); if (s.theatres[x.theatre]) s.theatres[x.theatre].rensBonus += x.delta; res.push('Renseignement ' + TH[x.theatre].nom + ' ' + (x.delta > 0 ? '+' : '') + x.delta); }
  for (const x of (e.partenaire || [])) { if (s.theatres[x.theatre]) { s.theatres[x.theatre].partenaire = borner(s.theatres[x.theatre].partenaire + x.delta, 0, 60); res.push('Capacité partenaire ' + TH[x.theatre].nom + ' ' + (x.delta > 0 ? '+' : '') + x.delta); } }
  for (const x of (e.pression || [])) if (s.theatres[x.theatre]) s.theatres[x.theatre].pressionBonus += x.delta;
  for (const x of (e.fatigue || [])) for (const u of unitesDe(s)) if ((x.unite && u.id === x.unite) || (x.categorie && u.categorie === x.categorie)) s.unites[u.id].fatigue = borner(s.unites[u.id].fatigue + x.delta, 0, 100);
  if (e.indispo && s.unites[e.indispo.unite]) {
    const st = s.unites[e.indispo.unite];
    if (st.etat === 'deployee' || st.etat === 'projection') rapatrier(s, e.indispo.unite, 'immobilisation technique');
    st.etat = 'indisponible'; st.theatre = null; st.indispo = e.indispo.tours;
    res.push(UN[e.indispo.unite].nom + ' indisponible ' + e.indispo.tours + ' mois');
  }
  if (e.allie && s.theatres[e.allie.theatre]) { s.theatres[e.allie.theatre].allie = Math.max(s.theatres[e.allie.theatre].allie, e.allie.tours); res.push('Appui allié sur ' + TH[e.allie.theatre].nom); }
  for (const x of (e.relation || [])) if (s.allies[x.allie]) { s.allies[x.allie].relation = borner(s.allies[x.allie].relation + x.delta, 0, 100); res.push('Relation ' + AL[x.allie].nom + ' ' + (x.delta > 0 ? '+' : '') + x.delta); }
  if (e.appui && s.allies[e.appui.allie]) { activerAppui(s, e.appui.allie, e.appui.appui, e.appui.theatre, e.appui.tours); res.push(appuiDef(e.appui.allie, e.appui.appui).nom + ' (' + TH[e.appui.theatre].nom + ')'); }
  if (e.crise) {
    let theatre: string | null = TH[e.crise] ? e.crise : null, menace = null;
    if (theatre) menace = menacesDans(s, theatre).sort((a, b) => b.force - a.force)[0] || null;
    else { menace = s.menaces.filter(m => m.type === e.crise).sort((a, b) => b.force - a.force)[0] || null; theatre = menace ? menace.theatre : null; }
    if (theatre && menace) creerCrise(s, theatre, menace.id);
  }
  if (e.alea) {
    const ok = alea(s) < e.alea.p;
    res.push(ok ? 'Issue favorable.' : 'Issue défavorable.');
    appliquerEffets(s, ok ? e.alea.succes : e.alea.echec, res);
  }
  nettoyerMenaces(s);
  return res;
}

export function actChoix(s: Etat, a: Extract<Action, { type: 'CHOIX' }>): void {
  const E = EV[s.evenementCourant!], c = E.choix[a.index];
  const res = appliquerEffets(s, c.effets, []);
  if (c.suite && (c.suiteP === undefined || alea(s) < c.suiteP)) s.chaines.push({ id: c.suite, tour: s.tour + (c.suiteDelai || 1) });
  const txt = E.titre + ' : ' + c.texte + '.' + (res.length ? ' (' + res.join(', ') + ')' : '');
  decider(s, txt);
  journaliser(s, txt, 'decision');
  s.dernierResultat = { titre: E.titre, texte: c.texte + (res.length ? ' — ' + res.join(', ') : '') };
  s.evenementCourant = null;
  calculerRens(s);
  avancerFile(s);
}

// ---------- File des événements et crises ----------
export function avancerFile(s: Etat): void {
  if (s.fin) { s.phase = 'fin'; return; }
  while (s.file.length) {
    const it = s.file.shift()!;
    if (it.kind === 'evenement') {
      s.compteurEvenements[it.id] = (s.compteurEvenements[it.id] || 0) + 1;
      s.evenementCourant = it.id; s.phase = 'evenement';
      journaliser(s, 'Événement : ' + EV[it.id].titre + '.', 'evenement');
      return;
    }
    const crise = s.theatres[it.theatre].crise;
    if (crise && crise.statut === 'ouverte') {
      s.criseCourante = it.theatre; s.phase = 'crise';
      return;
    }
  }
  s.phase = 'jeu';
}
export function nettoyerMenaces(s: Etat): void {
  const restantes = [];
  for (const m of s.menaces) {
    const pl = MT[m.type].plancher || 0;
    if (pl && m.force < pl && MT[m.type].theatresDepart.includes(m.theatre)) m.force = pl;
    if (m.force <= 0) { if (m.detectee) journaliser(s, MT[m.type].nom + ' (' + TH[m.theatre].nom + ') : plus aucun signalement, réseau considéré comme démantelé.', 'succes'); }
    else restantes.push(m);
  }
  s.menaces = restantes;
}
