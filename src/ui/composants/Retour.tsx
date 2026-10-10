// Confirmation brève et animée du dernier ordre (disparaît seule ; animation désactivée par prefers-reduced-motion).
import { useEffect, useState } from 'react';
import { useJeu } from '../contexte';

export function Retour() {
  const { ui } = useJeu();
  const [visible, setVisible] = useState<{ cle: number; texte: string } | null>(null);
  useEffect(() => {
    if (!ui.retour?.texte) return;
    setVisible({ cle: ui.retour.cle, texte: ui.retour.texte });
    const id = setTimeout(() => setVisible(null), 1800);
    return () => clearTimeout(id);
  }, [ui.retour]);
  if (!visible) return null;
  return <div key={visible.cle} className="retour-ordre" role="status" aria-live="polite"><span className="retour-coche">✓</span>{visible.texte}</div>;
}
