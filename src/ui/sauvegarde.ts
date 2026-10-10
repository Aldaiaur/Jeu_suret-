// Export et import de parties au format JSON.
import { EV, MT, TH } from '../data';
import type { Etat } from '../sim';

export function exporter(s: Etat): void {
  const blob = new Blob([JSON.stringify(s, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'red-lines-' + s.graine + '-tour' + (s.tour + 1) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function validerSauvegarde(s: unknown): Etat {
  const e = s as Etat;
  if (!e || e.version !== 1 || typeof e.rngState !== 'number' || !e.ressources || !e.unites || !e.theatres || !Array.isArray(e.menaces)) throw new Error('format inconnu');
  if (e.evenementCourant && !EV[e.evenementCourant]) throw new Error('événement inconnu : ' + e.evenementCourant);
  if (e.menaces.some(m => !MT[m.type] || !TH[m.theatre])) throw new Error('menace incohérente');
  return e;
}

export function importerFichier(charger: (s: Etat) => void, erreur: (m: string) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = () => {
    const f = input.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { charger(validerSauvegarde(JSON.parse(String(r.result)))); }
      catch (e) { erreur((e as Error).message); }
    };
    r.readAsText(f);
  };
  input.click();
}
