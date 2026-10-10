// Panneau de débogage : état réel caché au joueur, contrôles de données, événements forcés.
import { useState } from 'react';
import { EVENEMENTS, MT, TH } from '../../data';
import { alliesDe } from '../../sim';
import { changerGraine, forcerEvenement, nomLieu, pressionMenace, verifierDonnees } from '../../sim';
import { usePartie } from '../contexte';

export function Debug() {
  const { etat: s, ui, majUi, remplacer } = usePartie();
  const [ev, setEv] = useState(EVENEMENTS[0].id);
  const [graine, setGraine] = useState(s.graine);
  if (!ui.debug) return null;
  const erreurs = verifierDonnees();
  return (
    <div className="debug">
      <div className="debug-haut"><b>Débogage — état réel</b><button className="btn fantome carre" onClick={() => majUi({ debug: false })}>✕</button></div>
      <div className="discret">Graine {s.graine} · rngState {s.rngState} · phase {s.phase} · tour {s.tour} · menaceInt100 {s.menaceInt100}</div>
      <table className="tableau compact">
        <thead><tr><th>Id</th><th>Type</th><th>Théâtre</th><th>Réelle</th><th>Estimée</th><th>Marge</th><th>Détectée</th><th>Faux</th><th>Pression</th></tr></thead>
        <tbody>
          {s.menaces.map(m => (
            <tr key={m.id}><td>{m.id}</td><td>{MT[m.type].nom}</td><td>{TH[m.theatre].court}</td><td className="c-ambre">{m.force}</td><td>{m.estimation ?? '—'}</td><td>{m.marge}</td><td>{m.detectee ? 'oui' : 'non'}</td><td>{m.rapportFaux ? 'oui' : ''}</td><td>{pressionMenace(s, m).toFixed(1)}</td></tr>
          ))}
        </tbody>
      </table>
      {s.zoom && <div><b>Zoom</b> (réserve {s.zoom.reserve}) : {Object.keys(s.zoom.lieux).filter(k => s.zoom!.lieux[k].controle === 'ennemi').map(k => nomLieu(s.zoom!, k) + ' ' + s.zoom!.lieux[k].force).join(' · ')}</div>}
      <div><b>Alliés</b> : {alliesDe(s).map(A => A.nom + ' ' + s.allies[A.id].relation).join(' · ')}</div>
      <div className={erreurs.length ? 'c-rouge' : 'c-vert'}>{erreurs.length ? erreurs.join(' ; ') : 'Données cohérentes.'}</div>
      <div className="debug-ligne">
        <select className="champ" value={ev} onChange={e => setEv(e.target.value)}>{EVENEMENTS.map(e => <option key={e.id} value={e.id}>{e.id} — {e.titre}</option>)}</select>
        <button className="btn petit" onClick={() => remplacer(forcerEvenement(s, ev))}>Forcer</button>
      </div>
      <div className="debug-ligne">
        <input className="champ" value={graine} onChange={e => setGraine(e.target.value)} />
        <button className="btn petit" onClick={() => remplacer(changerGraine(s, graine.trim() || '1'))}>Changer la graine</button>
      </div>
    </div>
  );
}
