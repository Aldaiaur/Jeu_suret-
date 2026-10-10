// Planche de contrôle visuel (développement seulement, ?galerie) : toutes les illustrations et tous les insignes.
import { MATERIELS, PERSONNAGES, UNITES } from '../../data';
import { Portrait } from '../composants/Portrait';
import { IllustrationMateriel } from '../composants/IllustrationMateriel';
import { Insigne } from '../composants/Insigne';
import { SymboleHtml } from '../composants/SymboleOtan';

export function Galerie() {
  return (
    <div className="galerie">
      <div className="galerie-grille">
        {MATERIELS.map(m => <figure key={m.id}><IllustrationMateriel id={m.id} largeur={300} /><figcaption>{m.nom}</figcaption></figure>)}
      </div>
      <div className="galerie-insignes">
        {PERSONNAGES.map(p => <figure key={p.id}><Portrait id={p.id} taille={86} /><figcaption>{p.nom}</figcaption></figure>)}
      </div>
      <div className="galerie-insignes">
        {UNITES.map(u => <figure key={u.id}><Insigne unite={u.id} taille={86} avecDevise /><figcaption><SymboleHtml unite={u.id} taille={18} /> {u.nom}</figcaption></figure>)}
      </div>
    </div>
  );
}
