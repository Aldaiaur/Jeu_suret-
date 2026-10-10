// Fenêtre modale : un dossier posé sur la table de la cellule de crise.
import type { ReactNode } from 'react';

interface Props {
  tampon?: string;
  ton?: 'rouge' | 'ambre' | 'turquoise' | 'neutre';
  titre: string;
  sousTitre?: string;
  largeur?: number;
  children: ReactNode;
  pied?: ReactNode;
  onFermer?: () => void;
}

export function Fenetre({ tampon, ton = 'neutre', titre, sousTitre, largeur = 720, children, pied, onFermer }: Props) {
  return (
    <div className="voile" onMouseDown={e => { if (e.target === e.currentTarget && onFermer) onFermer(); }}>
      <div className={'fenetre ton-' + ton} style={{ width: largeur }} role="dialog" aria-modal="true" aria-label={titre}>
        <div className="fenetre-entete">
          {tampon && <span className={'tampon ton-' + ton}>{tampon}</span>}
          <h2 className="fenetre-titre">{titre}</h2>
          {sousTitre && <div className="fenetre-sous-titre">{sousTitre}</div>}
          {onFermer && <button className="btn fantome carre fenetre-fermer" onClick={onFermer} aria-label="Fermer">✕</button>}
        </div>
        <div className="fenetre-corps">{children}</div>
        {pied && <div className="fenetre-pied">{pied}</div>}
      </div>
    </div>
  );
}
