// Contrôles : cohérence des données, invariants de l'état, outils de débogage, simulation de parties.
import {
  AL, ALLIES, BIOMES, CARTES_REGIONALES, PERS, IDENTITES, MAT, MATERIELS, MISSIONS, MOBILITE_HELICO, POSTURES, SOUTIEN_UNITE, CATEGORIES, ETATS_UNITE, EV, EVENEMENTS, MENACES, MT,
  OPERATIONS, SERVICES, TH, THEATRES, TYPES_CAPTEURS, UN, UNITES
} from '../data';
import type { Effets, Etat } from './types';
import { cloner, graineVersEntier } from './outils';
import { appuiDef, capteursLibres, journaliser } from './acces';
import { actionsPossibles } from './actions';
import { avancerFile } from './evenements';

export function forcerEvenement(s: Etat, id: string): Etat {
  if (!EV[id] || s.fin) return s;
  const n = cloner(s);
  n.file.unshift({ kind: 'evenement', id });
  if (n.phase === 'jeu') avancerFile(n);
  return n;
}
export function changerGraine(s: Etat, g: string): Etat {
  const n = cloner(s);
  n.graine = String(g);
  n.rngState = graineVersEntier(g);
  journaliser(n, 'Graine modifiée : ' + n.graine + '.', 'info');
  return n;
}

// ---------- Contrôle de cohérence des données ----------
// Permet d'ajouter pays, théâtres ou unités dans les données en étant prévenu des références cassées.
export function verifierDonnees(): string[] {
  const err: string[] = [];
  const ids = (l: { id: string }[], nom: string) => { const v: Record<string, number> = {}; for (const x of l) { if (v[x.id]) err.push(nom + ' : identifiant en double ' + x.id); v[x.id] = 1; } };
  ids(THEATRES, 'THEATRES'); ids(UNITES, 'UNITES'); ids(SERVICES, 'SERVICES'); ids(MENACES, 'MENACES'); ids(EVENEMENTS, 'EVENEMENTS'); ids(ALLIES, 'ALLIES');
  const th = (t: string) => TH[t] !== undefined;
  for (const T of THEATRES) for (const v of T.voisins) { if (!th(v)) err.push('Théâtre ' + T.id + ' : voisin inconnu ' + v); else if (!TH[v].voisins.includes(T.id)) err.push('Théâtre ' + T.id + ' : liaison non réciproque avec ' + v); }
  for (const T of THEATRES) {
    const C = CARTES_REGIONALES[T.carteRegionale];
    if (!C) err.push('Théâtre ' + T.id + ' : carte régionale inconnue');
    else if (C.theatre !== T.id) err.push('Théâtre ' + T.id + ' : la carte ' + C.id + ' appartient à ' + C.theatre);
    // Saisons : chaque mois appartient à exactement une saison
    for (let m = 0; m < 12; m++) {
      const n = T.saisons.filter(x => x.mois.includes(m)).length;
      if (n !== 1) err.push('Théâtre ' + T.id + ' : le mois ' + m + ' appartient à ' + n + ' saison(s)');
    }
    for (const sa of T.saisons) {
      for (const m of sa.mois) if (!(Number.isInteger(m) && m >= 0 && m <= 11)) err.push('Théâtre ' + T.id + '/' + sa.id + ' : mois invalide ' + m);
      for (const t in (sa.effets.croissance || {})) if (!MT[t]) err.push('Théâtre ' + T.id + '/' + sa.id + ' : menace inconnue ' + t);
      for (const c in (sa.effets.pression || {})) if (!CATEGORIES[c as keyof typeof CATEGORIES]) err.push('Théâtre ' + T.id + '/' + sa.id + ' : catégorie inconnue ' + c);
    }
  }
  for (const u of UNITES) { for (const t of u.theatres) if (!th(t)) err.push('Unité ' + u.id + ' : théâtre inconnu ' + t); if (!CATEGORIES[u.categorie]) err.push('Unité ' + u.id + ' : catégorie inconnue'); if (u.depart && !u.theatres.includes(u.depart)) err.push('Unité ' + u.id + ' : théâtre de départ non accessible'); }
  for (const sv of SERVICES) { for (const t of sv.theatres) if (!th(t)) err.push('Service ' + sv.id + ' : théâtre inconnu ' + t); for (const t in sv.affectationInitiale) if (!sv.theatres.includes(t)) err.push('Service ' + sv.id + ' : affectation hors périmètre ' + t); }
  for (const m of MENACES) { for (const t of m.theatresDepart.concat(m.expansion)) if (!th(t)) err.push('Menace ' + m.id + ' : théâtre inconnu ' + t); for (const t in m.alimentePar) if (!MT[t]) err.push('Menace ' + m.id + ' : alimentation par type inconnu ' + t); }
  for (const o of OPERATIONS) for (const c of (o.cibles || [])) if (!MT[c]) err.push('Opération ' + o.id + ' : cible inconnue ' + c);
  for (const A of ALLIES) for (const ap of A.appuis) for (const t of ap.theatres) if (!th(t)) err.push('Allié ' + A.id + '/' + ap.id + ' : théâtre inconnu ' + t);
  const verifEffets = (e: Effets | undefined, ou: string): void => {
    if (!e) return;
    for (const x of (e.menace || [])) if (!MT[x.type]) err.push(ou + ' : menace inconnue ' + x.type);
    for (const k of ['rens', 'partenaire', 'pression'] as const) for (const x of (e[k] || [])) if (!th(x.theatre)) err.push(ou + ' : théâtre inconnu ' + x.theatre);
    for (const x of (e.fatigue || [])) if ((x.unite && !UN[x.unite]) || (x.categorie && !CATEGORIES[x.categorie])) err.push(ou + ' : unité ou catégorie inconnue');
    if (e.indispo && !UN[e.indispo.unite]) err.push(ou + ' : unité inconnue ' + e.indispo.unite);
    for (const x of (e.relation || [])) if (!AL[x.allie]) err.push(ou + ' : allié inconnu ' + x.allie);
    if (e.appui && (!AL[e.appui.allie] || !appuiDef(e.appui.allie, e.appui.appui))) err.push(ou + ' : appui inconnu');
    if (e.crise && !th(e.crise) && !MT[e.crise]) err.push(ou + ' : crise sur cible inconnue ' + e.crise);
    if (e.alea) { verifEffets(e.alea.succes, ou); verifEffets(e.alea.echec, ou); }
  };
  for (const E of EVENEMENTS) {
    if (!E.choix || E.choix.length < 2 || E.choix.length > 3) err.push('Événement ' + E.id + ' : 2 ou 3 choix attendus');
    if (E.choix.every(c => c.requiert)) err.push('Événement ' + E.id + ' : au moins un choix doit être toujours possible');
    for (const c of E.choix) { verifEffets(c.effets, 'Événement ' + E.id); if (c.suite && !EV[c.suite]) err.push('Événement ' + E.id + ' : suite inconnue ' + c.suite); }
    if (E.auteur && !PERS[E.auteur]) err.push('Événement ' + E.id + ' : auteur inconnu ' + E.auteur);
    const k = E.cond || {};
    if (k.menace && !MT[k.menace.type]) err.push('Événement ' + E.id + ' : condition sur menace inconnue');
    for (const r of [k.relationMin, k.relationMax]) if (r && !AL[r.allie]) err.push('Événement ' + E.id + ' : condition sur allié inconnu');
  }
  for (const P of Object.values(POSTURES)) for (const c of P.categories) if (!CATEGORIES[c]) err.push('Posture ' + P.id + ' : catégorie inconnue ' + c);
  for (const M of Object.values(MISSIONS)) for (const c of M.categories) if (!CATEGORIES[c]) err.push('Mission ' + M.id + ' : catégorie inconnue ' + c);
  for (const u in SOUTIEN_UNITE) if (!UN[u]) err.push('Soutien : unité inconnue ' + u);
  for (const u of MOBILITE_HELICO) if (!UN[u]) err.push('Mobilité : unité inconnue ' + u);
  for (const u of UNITES) if (!Object.values(POSTURES).some(P => P.categories.includes(u.categorie))) err.push('Unité ' + u.id + ' : aucune posture possible');
  ids(MATERIELS, 'MATERIELS');
  for (const u of UNITES) {
    const I = IDENTITES[u.id];
    if (!I) { err.push('Unité ' + u.id + ' : identité (sigle, symbole, insigne) manquante'); continue; }
    if (!/^[SGWIOE][PUAFNSHGWMDLJKO-][PAGSUFXZ-][APCDXF-][A-Z0-9-]{6}[A-Z0-9-]{5}$/.test(I.sidc)) err.push('Unité ' + u.id + ' : code SIDC invalide ' + I.sidc);
    for (const m of I.materiels) if (!MAT[m]) err.push('Unité ' + u.id + ' : matériel inconnu ' + m);
    if (I.sigle.length > 6) err.push('Unité ' + u.id + ' : sigle trop long');
    if (u.categorie !== 'INT' && !I.materiels.length) err.push('Unité ' + u.id + ' : au moins un matériel attendu');
  }
  for (const id in IDENTITES) if (!UN[id]) err.push('Identité pour une unité inconnue ' + id);
  for (const m of MATERIELS) if (!m.caracteristiques.length || m.caracteristiques.some(c => !c.source)) err.push('Matériel ' + m.id + ' : caractéristiques sourcées attendues');
  for (const id in CARTES_REGIONALES) {
    const C = CARTES_REGIONALES[id], L: Record<string, unknown> = {};
    for (const l of C.lieux) L[l.id] = l;
    if (!L[C.depart]) err.push('Carte ' + id + ' : lieu de départ inconnu');
    for (const [a, b] of C.liens) if (!L[a] || !L[b]) err.push('Carte ' + id + ' : lien vers un lieu inconnu ' + a + '-' + b);
    for (const sc of C.scenarios) for (const o of sc.objectifs) if (o.lieu && !L[o.lieu]) err.push('Carte ' + id + ' : objectif sur lieu inconnu ' + o.lieu);
    if (C.lieux.length < 8 || C.lieux.length > 12) err.push('Carte ' + id + ' : 8 à 12 lieux attendus');
    if (C.id !== id) err.push('Carte ' + id + ' : identifiant incohérent');
    if (!TH[C.theatre] || TH[C.theatre].carteRegionale !== id) err.push('Carte ' + id + ' : théâtre inconnu ou non rattaché ' + C.theatre);
    if (!BIOMES[C.biome]) err.push('Carte ' + id + ' : biome inconnu ' + C.biome);
    for (const c of C.forcesCrise) if (!CATEGORIES[c]) err.push('Carte ' + id + ' : catégorie inconnue ' + c);
    if (!C.scenarios.length) err.push('Carte ' + id + ' : au moins un scénario de crise attendu');
    if (C.zoomCrise) {
      if (!C.forcesCrise.length) err.push('Carte ' + id + ' : forces de crise attendues');
      if ((L[C.depart] as { controle?: string } | undefined)?.controle !== 'allie') err.push('Carte ' + id + ' : le lieu de départ doit être allié');
      for (const sc of C.scenarios) if (!sc.objectifs.length) err.push('Carte ' + id + '/' + sc.id + ' : objectifs attendus');
    }
    for (const l of C.lieux) if ((l.controle === 'ennemi') !== (l.force !== null)) err.push('Carte ' + id + '/' + l.id + ' : force attendue pour un lieu adverse seulement');
    for (const sc of C.scenarios) for (const k in sc.modifs) if (!L[k]) err.push('Carte ' + id + '/' + sc.id + ' : modification d’un lieu inconnu ' + k);
  }
  return err;
}

// ---------- Invariants de l'état ----------
export function verifierInvariants(s: Etat, complet: boolean): string[] {
  const err: string[] = [];
  const R = s.ressources;
  for (const k of ['opinion', 'capital', 'menaceInt', 'credibilite'] as const) if (!(R[k] >= 0 && R[k] <= 100)) err.push(k + ' hors bornes : ' + R[k]);
  for (const k of ['budget', 'enveloppe', 'surcout'] as const) if (!Number.isFinite(R[k])) err.push(k + ' invalide');
  for (const m of s.menaces) if (!(m.force > 0 && m.force <= 100)) err.push('force de menace invalide ' + m.id + ' : ' + m.force);
  for (const u of UNITES) {
    const e = s.unites[u.id];
    if (!ETATS_UNITE[e.etat]) err.push('état inconnu ' + u.id);
    if ((e.etat === 'deployee' || e.etat === 'projection') && !TH[e.theatre!]) err.push('unité sans théâtre ' + u.id);
    if (!(e.fatigue >= 0 && e.fatigue <= 100)) err.push('fatigue invalide ' + u.id);
    if (!POSTURES[e.posture] || !POSTURES[e.posture].categories.includes(u.categorie)) err.push('posture invalide ' + u.id);
    if (e.lieu && (!e.theatre || !s.theatres[e.theatre].lieux[e.lieu])) err.push('implantation invalide ' + u.id);
    if (e.mission && (e.etat !== 'deployee' || !MISSIONS[e.mission.type])) err.push('mission invalide ' + u.id);
  }
  for (const sv of SERVICES) for (const ty of TYPES_CAPTEURS) if (capteursLibres(s, sv.id, ty) < 0) err.push('capteurs négatifs ' + sv.id);
  for (const A of ALLIES) if (!(s.allies[A.id].relation >= 0 && s.allies[A.id].relation <= 100)) err.push('relation invalide ' + A.id);
  for (const T of THEATRES) for (const a of s.theatres[T.id].appuis) if (!(a.tours > 0) || !appuiDef(a.allie, a.appui)) err.push('appui invalide ' + T.id);
  const j = complet ? JSON.stringify(s) : null;
  if (complet && JSON.stringify(JSON.parse(j!)) !== j) err.push('état non sérialisable');
  if (!s.fin && actionsPossibles(s).length === 0 && s.phase !== 'jeu') err.push('blocage : aucune action en phase ' + s.phase);
  return err;
}
