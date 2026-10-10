// Rend un élément SVG (lieu, jeton, marqueur) atteignable au clavier : Tab pour le sélectionner,
// Entrée ou Espace pour l'activer, avec un nom accessible.
import type { KeyboardEvent } from 'react';

export function activable(action: () => void, nom: string) {
  return {
    tabIndex: 0, role: 'button', 'aria-label': nom,
    onKeyDown: (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); action(); }
    }
  };
}
