// Monde partagé : les puissances non jouées décident chaque mois de leurs engagements et pèsent sur les menaces.
// Elles voient les menaces réelles (leur propre renseignement). Sur un théâtre absent de la partie, elles gardent
// un engagement de principe sans effet visible.
import { PARAMS, PUI, PUISSANCES, TH } from '../data';
import type { Etat, EtatPuissance, Menace, PuissanceDef } from './types';
import { alea, borner } from './outils';
import { journaliser, unitesDans } from './acces';

export const NIVEAU_MAX = 3;
export const SEUIL_COALITION = 55;   // attitude à partir de laquelle une puissance coopère avec le joueur
const LIBELLES_NIVEAU = ['aucun engagement', 'présence limitée', 'engagement soutenu', 'engagement massif'];
export const libelleNiveau = (n: number) => LIBELLES_NIVEAU[n] || LIBELLES_NIVEAU[0];

export function puissancesDe(s: Etat): PuissanceDef[] { return PUISSANCES.filter(P => s.monde.puissances[P.id]); }

export function mondeInitial(nation: string): { puissances: Record<string, EtatPuissance> } {
  const puissances: Record<string, EtatPuissance> = {};
  for (const P of PUISSANCES) if (P.nation !== nation) puissances[P.id] = { engagements: { ...P.depart }, attitude: P.attitude[nation] ?? 50, mouvements: [] };
  return { puissances };
}

// Une puissance alliée du joueur partage sa relation (une seule source de vérité) ; sinon, attitude propre.
export function attitude(s: Etat, id: string): number {
  const P = PUI[id], al = P.allie ? s.allies[P.allie] : undefined;
  return al ? al.relation : s.monde.puissances[id]?.attitude ?? 50;
}
export function modifierAttitude(s: Etat, id: string, delta: number): void {
  const P = PUI[id], al = P.allie ? s.allies[P.allie] : undefined;
  if (al) al.relation = borner(al.relation + delta, 0, 100);
  else if (s.monde.puissances[id]) s.monde.puissances[id].attitude = borner(s.monde.puissances[id].attitude + delta, 0, 100);
}
export function engagement(s: Etat, id: string, theatre: string): number { return s.monde.puissances[id]?.engagements[theatre] || 0; }

// Pression des puissances sur une menace (ajoutée à celle du joueur) et croissance qu'elles y ajoutent
export function pressionPuissances(s: Etat, m: Menace): number {
  let p = 0;
  for (const P of puissancesDe(s)) p += engagement(s, P.id, m.theatre) * (P.contre[m.type] || 0);
  return p * PARAMS.facteurPuissances;
}
export function croissancePuissances(s: Etat, m: Menace): number {
  let c = 0;
  for (const P of puissancesDe(s)) c += engagement(s, P.id, m.theatre) * (P.attise?.[m.type] || 0);
  return c;
}

// Puissances qui combattent avec le joueur sur ce théâtre : engagées, bien disposées, contre une menace présente
export function coalition(s: Etat, theatre: string): PuissanceDef[] {
  const types = new Set(s.menaces.filter(m => m.theatre === theatre).map(m => m.type));
  return puissancesDe(s).filter(P => engagement(s, P.id, theatre) > 0 && attitude(s, P.id) >= SEUIL_COALITION && Object.keys(P.contre).some(t => types.has(t)));
}
// Puissances qui attisent une menace présente sur ce théâtre
export function rivaux(s: Etat, theatre: string): PuissanceDef[] {
  const types = new Set(s.menaces.filter(m => m.theatre === theatre).map(m => m.type));
  return puissancesDe(s).filter(P => engagement(s, P.id, theatre) > 0 && Object.keys(P.attise || {}).some(t => types.has(t)));
}
// Bonus de réussite des opérations du joueur au sein d'une coalition (renseignement et appuis partagés)
export function bonusCoalition(s: Etat, theatre: string): number { return Math.min(0.09, coalition(s, theatre).length * 0.03); }

// Besoin d'engagement d'une puissance sur un théâtre (0 à ~1,6)
function besoin(s: Etat, P: PuissanceDef, theatre: string): number {
  const interet = P.interets[theatre] || 0;
  if (!s.theatres[theatre]) return interet * 0.9;
  const ms = s.menaces.filter(m => m.theatre === theatre);
  const combat = Math.max(0, ...ms.filter(m => P.contre[m.type]).map(m => m.force));
  const attise = ms.some(m => P.attise?.[m.type]) ? 1 : 0;   // un rival tient sa position là où il attise une menace
  let b = interet * (combat / 45 + attise);
  if (P.style === 'interventionniste') b += 0.15 * interet;
  if (P.style === 'prudent') b -= 0.15;
  const joueur = unitesDans(s, theatre).length > 0, att = attitude(s, P.id);
  if (joueur && att >= SEUIL_COALITION) b += 0.15 * interet;                 // partage du fardeau
  if (P.attise && joueur && att < 40) b += 0.2 * interet;                    // un rival conteste la présence du joueur
  if (P.style === 'opportuniste' && s.ressources.credibilite < 40) b += 0.2 * interet;   // il profite d'une faiblesse
  return b;
}
const cible = (b: number) => (b >= 1.3 ? 3 : b >= 0.8 ? 2 : b >= 0.4 ? 1 : 0);

// Décisions mensuelles des puissances (appelée par finDeTour avant l'évolution des menaces)
export function deciderPuissances(s: Etat): void {
  for (const P of puissancesDe(s)) {
    const st = s.monde.puissances[P.id];
    st.mouvements = [];
    const theatres = Object.keys(P.interets).map(t => ({ t, b: besoin(s, P, t) })).sort((a, b) => b.b - a.b);
    let reste = P.capacite;
    const voulu: Record<string, number> = {};
    for (const { t, b } of theatres) { voulu[t] = Math.min(cible(b), reste, NIVEAU_MAX); reste -= voulu[t]; }
    // Retraits d'abord, renforts ensuite : la capacité n'est jamais dépassée, même pendant une bascule
    const ordre = theatres.filter(x => voulu[x.t] < (st.engagements[x.t] || 0)).concat(theatres.filter(x => voulu[x.t] > (st.engagements[x.t] || 0)));
    for (const { t } of ordre) {
      const avant = st.engagements[t] || 0;
      if (alea(s) < 0.2) continue;   // inertie : une décision sur cinq attend le mois suivant
      const apres = avant + Math.sign(voulu[t] - avant);
      if (apres > avant && Object.values(st.engagements).reduce((x, y) => x + y, 0) >= P.capacite) continue;
      st.engagements[t] = apres;
      if (!s.theatres[t]) continue;
      const txt = P.nom + (apres > avant ? ' renforce' : ' réduit') + ' son engagement : ' + TH[t].nom + ' (' + libelleNiveau(apres) + ').';
      st.mouvements.push(txt);
      journaliser(s, txt, 'monde');
    }
    // Attitude : rappel vers la référence, coopération ou rivalité sur les théâtres où le joueur est présent
    const ref = P.attitude[s.nation] ?? 50;
    if (!(P.allie && s.allies[P.allie])) st.attitude = borner(Math.round((st.attitude + (ref - st.attitude) * 0.05) * 10) / 10, 0, 100);
    for (const t in st.engagements) {
      if (!st.engagements[t] || !s.theatres[t] || !unitesDans(s, t).length) continue;
      if (coalition(s, t).includes(P)) modifierAttitude(s, P.id, 0.2);
      else if (rivaux(s, t).includes(P)) modifierAttitude(s, P.id, -0.3);
    }
  }
}
