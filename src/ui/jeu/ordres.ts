// Ordres tactiques proposés pour une unité : liste complète et ordre par défaut sur un lieu (deux clics :
// l'unité, puis le lieu).
import { MISSIONS } from '../../data';
import { evaluerMission, lieuxAccessibles, missionsPossibles, nomLieuCarte, type Action, type Etat, type EvaluationMission, type OrdreMission } from '../../sim';

export interface Ordre { action: Action; libelle: string; cible: string; ev: EvaluationMission | null; type: string }

export function ordresUnite(s: Etat, uniteId: string): Ordre[] {
  const e = s.unites[uniteId], t = e.theatre!;
  const r: Ordre[] = [];
  for (const l of lieuxAccessibles(s, uniteId)) r.push({ action: { type: 'POSITIONNER', unite: uniteId, lieu: l }, libelle: 'S’implanter à ' + nomLieuCarte(t, l), cible: nomLieuCarte(t, l), ev: null, type: 'positionner' });
  for (const o of missionsPossibles(s, uniteId)) {
    if (e.mission && e.mission.type === o.type && e.mission.lieu === o.lieu && e.mission.vers === o.vers) continue;
    const cible = nomLieuCarte(t, o.lieu) + (o.vers ? ' ↔ ' + nomLieuCarte(t, o.vers) : '');
    r.push({ action: actionMission(uniteId, o), libelle: MISSIONS[o.type].verbe + ' ' + cible, cible, ev: evaluerMission(s, uniteId, o), type: o.type });
  }
  return r;
}
export function actionMission(unite: string, o: OrdreMission): Action {
  return o.vers ? { type: 'MISSION', unite, mission: o.type, lieu: o.lieu, vers: o.vers } : { type: 'MISSION', unite, mission: o.type, lieu: o.lieu };
}

const PRIORITE_ENNEMI = ['frappe', 'raid', 'patrouille'];
const PRIORITE_AMI = ['positionner', 'appui', 'patrouille', 'evacuation'];
export function ordreParDefaut(s: Etat, uniteId: string, lieu: string): Ordre | null {
  const e = s.unites[uniteId];
  if (!e.theatre) return null;
  const ennemi = s.theatres[e.theatre].lieux[lieu].controle === 'ennemi';
  const sur = ordresUnite(s, uniteId).filter(o => 'lieu' in o.action && o.action.lieu === lieu && !('vers' in o.action && o.action.vers));
  for (const t of ennemi ? PRIORITE_ENNEMI : PRIORITE_AMI) { const o = sur.find(x => x.type === t); if (o) return o; }
  return null;
}
