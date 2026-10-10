// Catalogue des forces : insignes, symboles OTAN et matériels avec leurs caractéristiques publiques.
import { useState } from 'react';
import { CATEGORIES, IDENTITES, MAT, MATERIELS } from '../../data';
import { nation, unitesDe } from '../../sim';
import type { Categorie } from '../../sim';
import { usePartie } from '../contexte';
import { Fenetre } from '../composants/Fenetre';
import { Insigne } from '../composants/Insigne';
import { SymboleHtml } from '../composants/SymboleOtan';
import { IllustrationMateriel } from '../composants/IllustrationMateriel';
import { COULEURS_CATEGORIE } from '../format';

export function FicheMateriel({ id, compacte = false }: { id: string; compacte?: boolean }) {
  const M = MAT[id];
  return (
    <div className={'materiel' + (compacte ? ' compacte' : '')}>
      <IllustrationMateriel id={id} largeur={compacte ? 200 : 260} />
      <div className="materiel-texte">
        <b>{M.nom}</b> <span className="discret petit">{M.type}</span>
        <div className="petit second">{M.role}</div>
        {!compacte && (
          <table className="tableau compact">
            <tbody>{M.caracteristiques.map(c => <tr key={c.lib}><th>{c.lib}</th><td>{c.val}<div className="source">{c.source}</div></td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function FenetreCatalogue() {
  const { etat: s, majUi } = usePartie();
  const [vue, setVue] = useState<'unites' | 'materiels'>('unites');
  const fermer = () => majUi({ catalogue: false });
  return (
    <Fenetre tampon="Catalogue" titre="Forces et matériels" largeur={980} onFermer={fermer} pied={<button className="btn principal" onClick={fermer}>Fermer</button>}>
      <div className="onglets catalogue-onglets">
        <button className={'onglet' + (vue === 'unites' ? ' actif' : '')} onClick={() => setVue('unites')}>Unités</button>
        <button className={'onglet' + (vue === 'materiels' ? ' actif' : '')} onClick={() => setVue('materiels')}>Matériels</button>
      </div>
      {vue === 'unites' && (Object.keys(CATEGORIES) as Categorie[]).map(c => (
        <section key={c} className="catalogue-groupe">
          <h3 className="titre-section"><i className="point" style={{ background: COULEURS_CATEGORIE[c] }} />{nation(s).categories[c]}</h3>
          <div className="catalogue-grille">
            {unitesDe(s).filter(u => u.categorie === c).map(u => (
              <button key={u.id} className="catalogue-unite" onClick={() => { majUi({ catalogue: false, selection: { kind: 'unite', id: u.id } }); }} data-tip={u.type + '\nDevise : « ' + IDENTITES[u.id].insigne.devise + ' »'}>
                <Insigne unite={u.id} taille={52} />
                <span className="catalogue-unite-nom">{u.nom}</span>
                <span className="catalogue-unite-symbole"><SymboleHtml unite={u.id} taille={16} /><span className="discret petit">{IDENTITES[u.id].materiels.map(m => MAT[m].nom).join(', ') || '—'}</span></span>
              </button>
            ))}
          </div>
        </section>
      ))}
      {vue === 'materiels' && <div className="catalogue-materiels">{MATERIELS.filter(m => unitesDe(s).some(u => IDENTITES[u.id].materiels.includes(m.id))).map(m => <FicheMateriel key={m.id} id={m.id} />)}</div>}
      <p className="discret petit">Insignes : créations originales inspirées des conventions héraldiques, sans reproduction d’insigne officiel. Devises fictives ou génériques. Symboles militaires OTAN (APP-6) générés par la bibliothèque libre milsymbol. Illustrations dessinées par code.</p>
    </Fenetre>
  );
}
