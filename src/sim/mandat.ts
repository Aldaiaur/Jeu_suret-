// Objectifs de mandat : fixés en janvier selon la situation que rapportent les services, évalués en décembre.
import { ANNEE_DEPART, MT, NATIONS, PARAMS_MANDAT, PERS, TH } from '../data';
import type { Etat, ObjectifMandat } from './types';
import { alea, borner } from './outils';
import { alliesDe, devise, journaliser, territoire } from './acces';

type Candidat = Omit<ObjectifMandat, 'depart' | 'resultat'>;
const arrondi5 = (v: number) => Math.round(v / 5) * 5;
export const anneeDuTour = (tour: number) => ANNEE_DEPART + Math.floor(tour / 12);

function candidats(s: Etat): Candidat[] {
  const annee = anneeDuTour(s.tour), r: Candidat[] = [];
  // Le chef de l'exécutif s'appuie sur ce que les services lui rapportent : estimations, pas valeurs réelles
  const ext = s.menaces.filter(m => m.detectee && m.estimation !== null && TH[m.theatre].exterieur && m.estimation >= 30)
    .sort((a, b) => b.estimation! - a.estimation!);
  for (const m of ext.slice(0, 2)) {
    const val = Math.max(20, arrondi5(m.estimation! - PARAMS_MANDAT.ecartMenace));
    r.push({ type: 'menace_sous', menace: m.type, theatre: m.theatre, val, texte: MT[m.type].nom + ' (' + TH[m.theatre].nom + ') ramené sous ' + val });
  }
  if (s.menaces.some(m => m.theatre === territoire(s))) r.push({ type: 'aucune_attaque', val: 0, texte: 'Aucune attaque sur le territoire en ' + annee });
  const mi = borner(arrondi5(s.ressources.menaceInt - 5), 25, 60);
  r.push({ type: 'menace_int_sous', val: mi, texte: 'Menace intérieure sous ' + mi + ' en décembre' });
  r.push({ type: 'surcout_max', val: PARAMS_MANDAT.surcoutMax, texte: 'Surcoût opérationnel limité à ' + PARAMS_MANDAT.surcoutMax + ' ' + devise(s) + ' sur l’année' });
  const A = alliesDe(s)[0];
  if (A) { const v = Math.max(55, arrondi5(s.allies[A.id].relation)); r.push({ type: 'relation_min', allie: A.id, val: v, texte: 'Relation avec ' + A.nom + ' d’au moins ' + v }); }
  if (s.tour > 0) r.push({ type: 'crises_reussies', val: 1, texte: 'Réussir au moins une intervention de crise' });
  return r;
}

export function fixerObjectifs(s: Etat): void {
  const c = candidats(s), choisis: Candidat[] = [];
  const menace = c.find(x => x.type === 'menace_sous');
  if (menace) choisis.push(menace);
  const reste = c.filter(x => !choisis.includes(x) && !choisis.some(y => y.type === x.type));
  while (choisis.length < PARAMS_MANDAT.nombre && reste.length) {
    const x = reste.splice(Math.floor(alea(s) * reste.length), 1)[0];
    if (!choisis.some(y => y.type === x.type)) choisis.push(x);
  }
  const depart = { attaquesTerritoire: s.stats.attaquesTerritoire, surcout: s.ressources.surcout, crisesReussies: s.stats.crisesReussies };
  s.mandat.annee = anneeDuTour(s.tour);
  s.mandat.objectifs = choisis.map(x => ({ ...x, depart: { ...depart }, resultat: 'en_cours' }));
  const chef = PERS[(NATIONS[s.nation] || NATIONS.FRA).roles.chef];
  journaliser(s, chef.fonction + ' : objectifs pour ' + s.mandat.annee + ' — ' + s.mandat.objectifs.map(o => o.texte).join(' ; ') + '.', 'evenement');
}

// Objectif tenu à cet instant. `reel` : force réelle des menaces (évaluation de décembre) ; sinon estimation des services.
export function objectifAtteint(s: Etat, o: ObjectifMandat, reel: boolean): boolean {
  const R = s.ressources;
  switch (o.type) {
    case 'menace_sous': {
      const ms = s.menaces.filter(m => m.type === o.menace && m.theatre === o.theatre);
      return ms.every(m => (reel ? m.force : (m.estimation ?? m.force)) < o.val);
    }
    case 'aucune_attaque': return s.stats.attaquesTerritoire === o.depart.attaquesTerritoire;
    case 'menace_int_sous': return R.menaceInt < o.val;
    case 'surcout_max': return R.surcout - o.depart.surcout <= o.val;
    case 'relation_min': return (s.allies[o.allie!]?.relation ?? 0) >= o.val;
    case 'crises_reussies': return s.stats.crisesReussies - o.depart.crisesReussies >= o.val;
  }
}
// Où en est l'objectif, en clair (pour l'interface)
export function progresObjectif(s: Etat, o: ObjectifMandat): string {
  const R = s.ressources;
  switch (o.type) {
    case 'menace_sous': {
      const m = s.menaces.filter(x => x.type === o.menace && x.theatre === o.theatre).sort((a, b) => b.force - a.force)[0];
      return m ? 'estimée à ' + (m.estimation ?? '?') + (m.detectee ? ' ± ' + m.marge : '') : 'plus aucun signalement';
    }
    case 'aucune_attaque': { const n = s.stats.attaquesTerritoire - o.depart.attaquesTerritoire; return n ? n + ' attaque' + (n > 1 ? 's' : '') + ' subie' + (n > 1 ? 's' : '') : 'aucune attaque à ce jour'; }
    case 'menace_int_sous': return 'actuellement ' + Math.round(R.menaceInt);
    case 'surcout_max': return Math.round(R.surcout - o.depart.surcout) + ' ' + devise(s) + ' à ce jour';
    case 'relation_min': return 'actuellement ' + Math.round(s.allies[o.allie!]?.relation ?? 0);
    case 'crises_reussies': return (s.stats.crisesReussies - o.depart.crisesReussies) + ' réussie(s) à ce jour';
  }
}

export function evaluerMandat(s: Etat): void {
  const R = s.ressources, P = PARAMS_MANDAT;
  let reussis = 0;
  for (const o of s.mandat.objectifs) {
    if (o.resultat !== 'en_cours') continue;
    const ok = objectifAtteint(s, o, true);
    o.resultat = ok ? 'reussi' : 'echoue';
    if (ok) { reussis++; R.capital = borner(R.capital + P.reussite.capital, 0, 100); R.opinion = borner(R.opinion + P.reussite.opinion, 0, 100); }
    else { R.capital = borner(R.capital + P.echec.capital, 0, 100); R.opinion = borner(R.opinion + P.echec.opinion, 0, 100); }
    journaliser(s, 'Objectif ' + s.mandat.annee + (ok ? ' tenu : ' : ' manqué : ') + o.texte + (ok ? ' (capital +' + P.reussite.capital + ', opinion +' + P.reussite.opinion + ').' : ' (capital ' + P.echec.capital + ', opinion ' + P.echec.opinion + ').'), ok ? 'succes' : 'alerte');
  }
  if (s.mandat.objectifs.length) s.mandat.bilans.push({ annee: s.mandat.annee, reussis, total: s.mandat.objectifs.length });
}
