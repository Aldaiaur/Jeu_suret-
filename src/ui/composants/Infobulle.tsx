// Infobulle unique pour toute l'interface : tout élément portant data-tip en affiche le texte,
// après un court délai pour ne pas clignoter au passage de la souris.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function Infobulle() {
  const [texte, setTexte] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const cible = useRef<Element | null>(null);
  const souris = useRef({ x: 0, y: 0 });
  const minuteur = useRef<number>(0);

  const placer = () => {
    const el = ref.current;
    if (!el) return;
    const { x, y } = souris.current, w = el.offsetWidth, h = el.offsetHeight;
    el.style.left = Math.max(8, Math.min(x + 14, window.innerWidth - w - 8)) + 'px';
    el.style.top = (y + 18 + h > window.innerHeight - 8 ? Math.max(8, y - h - 12) : y + 18) + 'px';
  };
  useLayoutEffect(placer, [texte]);

  useEffect(() => {
    const survol = (ev: MouseEvent) => {
      const el = (ev.target as Element).closest?.('[data-tip]') || null;
      if (el === cible.current) return;
      cible.current = el;
      clearTimeout(minuteur.current);
      if (!el) { setTexte(null); return; }
      minuteur.current = window.setTimeout(() => setTexte(el.getAttribute('data-tip')), 280);
    };
    const mouvement = (ev: MouseEvent) => { souris.current = { x: ev.clientX, y: ev.clientY }; placer(); };
    const cacher = () => { cible.current = null; clearTimeout(minuteur.current); setTexte(null); };
    // Clavier : l'infobulle suit l'élément qui reçoit le focus
    const focus = (ev: FocusEvent) => {
      if (!(ev.target as Element).matches?.(':focus-visible')) return;   // pas au clic de souris
      const el = (ev.target as Element).closest?.('[data-tip]') || null;
      cible.current = el;
      clearTimeout(minuteur.current);
      if (!el) { setTexte(null); return; }
      const r = el.getBoundingClientRect();
      souris.current = { x: r.left, y: r.bottom };
      setTexte(el.getAttribute('data-tip'));
    };
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', cacher);
    document.addEventListener('mouseover', survol);
    document.addEventListener('mousemove', mouvement);
    document.addEventListener('mousedown', cacher);
    return () => {
      document.removeEventListener('focusin', focus);
      document.removeEventListener('focusout', cacher);
      document.removeEventListener('mouseover', survol);
      document.removeEventListener('mousemove', mouvement);
      document.removeEventListener('mousedown', cacher);
    };
  }, []);

  if (!texte) return null;
  const [titre, ...reste] = texte.split('\n');
  return (
    <div ref={ref} className="infobulle" role="tooltip">
      {reste.length ? <><div className="infobulle-titre">{titre}</div>{reste.map((l, i) => <div key={i}>{l}</div>)}</> : titre}
    </div>
  );
}
