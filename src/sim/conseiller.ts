// Conseiller du mois : trois priorités argumentées, tirées de l'état visible par le joueur (estimations,
// pas valeurs réelles). Lecture seule, sans aléatoire : même état, mêmes conseils.
import { MT, NATIONS, PERS, TH } from '../data';
import type { Personnage } from '../data/personnages';
import type { Etat } from './types';
import { actionsParTour, devise, procedure, probaVote, soumisProcedure, theatresDe, unitesDans, unitesDe } from './acces';
import { pressionMenace } from './evaluation';
import { horlogeVisible } from './renseignement';
import { objectifAtteint, progresObjectif } from './mandat';
import { coalition, puissancesDe, rivaux } from './monde';
import { coutsMensuels } from './tactique';

export interface Conseil { texte: string; raison: string; theatre?: string; priorite: number }

export function conseilDuMois(s: Etat): { auteur: Personnage; conseils: Conseil[] } {
  const N = NATIONS[s.nation] || NATIONS.FRA, c: Conseil[] = [], mois = s.tour % 12;
  const pct = (p: number) => Math.round(p * 100) + ' %';

  for (const m of s.menaces) {
    const h = horlogeVisible(s, m);
    if (h && h.precise && h.niveau >= h.duree - 2) c.push({ priorite: 100 + h.niveau, theatre: m.theatre,
      texte: MT[m.type].nom + ' prépare une action (' + TH[m.theatre].nom + ', ' + h.niveau + '/' + h.duree + ').',
      raison: 'Une opération réussie ou une pression accrue repousse l’échéance ; sinon, l’action surviendra sous ' + Math.max(1, h.duree - h.niveau) + ' mois.' });
    else if (h && !h.precise && h.niveau >= 2) c.push({ priorite: 60, theatre: m.theatre,
      texte: 'Préparatifs signalés : ' + MT[m.type].nom + ' (' + TH[m.theatre].nom + ').',
      raison: 'Le renseignement ne permet pas de dater l’échéance : affectez des capteurs à ce théâtre.' });
  }
  for (const T of theatresDe(s)) {
    const th = s.theatres[T.id];
    if (soumisProcedure(s, T.id) && !th.voteFait && th.toursIntervention > 0) {
      const dans = Math.max(1, procedure(s).dureeAvantVote + 1 - th.toursIntervention), p = probaVote(s, T.id);
      if (dans <= 2 && p < 0.7) c.push({ priorite: 90 - dans * 5, theatre: T.id,
        texte: procedure(s).nom + ' : vote dans ' + dans + ' mois (' + T.nom + '), adoption ' + pct(p) + '.',
        raison: th.debat ? 'Le débat est acquis : l’opinion et le capital politique feront la différence.' : procedure(s).debat.nom + ' : +' + pct(procedure(s).debat.bonus) + ' de chances.' });
    }
    const ms = s.menaces.filter(m => m.theatre === T.id && m.detectee && (m.estimation ?? 0) >= 55);
    const faible = ms.find(m => pressionMenace(s, m) < 12);
    if (faible && !unitesDans(s, T.id).length) c.push({ priorite: 65, theatre: T.id,
      texte: MT[faible.type].nom + ' progresse sans opposition (' + T.nom + ', estimé ' + faible.estimation + ').',
      raison: 'Aucune force sur place et une pression faible : la menace continuera de croître.' });
    if (s.menaces.some(m => m.theatre === T.id) && th.rens < 30) c.push({ priorite: 45, theatre: T.id,
      texte: 'Renseignement insuffisant : ' + T.nom + ' (' + th.rens + ').',
      raison: 'Sous 30, les estimations sont larges et les rapports peuvent être faux. Réaffecter des capteurs est gratuit.' });
    const co = coalition(s, T.id);
    if (co.length && !unitesDans(s, T.id).length && s.menaces.some(m => m.theatre === T.id && (m.estimation ?? 0) >= 45)) c.push({ priorite: 40, theatre: T.id,
      texte: co.map(P => P.nom).join(' et ') + ' combat' + (co.length > 1 ? 'tent' : '') + ' déjà sur ce théâtre : ' + T.nom + '.',
      raison: 'Rejoindre la coalition donne jusqu’à +9 % de réussite aux opérations et améliore la relation.' });
  }
  for (const P of puissancesDe(s)) for (const t of Object.keys(s.monde.puissances[P.id].engagements)) {
    if (!s.theatres[t] || !s.monde.puissances[P.id].mouvements.some(x => x.includes(' renforce ') && x.includes(TH[t].nom))) continue;
    if (rivaux(s, t).includes(P)) c.push({ priorite: 55, theatre: t, texte: P.nom + ' renforce sa présence : ' + TH[t].nom + '.', raison: 'Sa présence attise une menace sur ce théâtre ; une posture de réassurance la contient.' });
  }
  const prevu = s.ressources.budget + s.ressources.enveloppe - coutsMensuels(s);
  if (prevu < 0) c.push({ priorite: 85, texte: 'Dépassement budgétaire prévu : ' + prevu.toFixed(0) + ' ' + devise(s) + '.',
    raison: 'Rapatriez une unité ou demandez une rallonge (onglet Situation) : chaque dépassement coûte du capital politique.' });
  if (mois >= 8) for (const o of s.mandat.objectifs) if (o.resultat === 'en_cours' && !objectifAtteint(s, o, false)) c.push({ priorite: 70 + mois, theatre: o.theatre,
    texte: 'Objectif ' + s.mandat.annee + ' menacé : ' + o.texte + '.', raison: 'Bilan en décembre (' + progresObjectif(s, o) + ').' });
  for (const u of unitesDe(s)) {
    const e = s.unites[u.id];
    if (e.etat === 'deployee' && e.fatigue >= 80) c.push({ priorite: 72, theatre: e.theatre!, texte: u.nom + ' est à bout (fatigue ' + Math.round(e.fatigue) + ').', raison: 'À 100, l’unité est relevée d’office et indisponible deux mois.' });
  }
  if (!c.length && s.actionsRestantes >= actionsParTour(s)) c.push({ priorite: 10, texte: 'Situation sous contrôle.', raison: 'Profitez du mois pour former des partenaires ou renforcer le renseignement.' });
  c.sort((a, b) => b.priorite - a.priorite);
  // Un conseil par théâtre au plus, pour couvrir la situation d'ensemble
  const retenus: Conseil[] = [], vus = new Set<string>();
  for (const x of c) { if (x.theatre && vus.has(x.theatre)) continue; if (x.theatre) vus.add(x.theatre); retenus.push(x); if (retenus.length === 3) break; }
  return { auteur: PERS[N.roles.securite], conseils: retenus };
}
