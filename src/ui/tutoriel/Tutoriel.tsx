// Tutoriel guidé : met en lumière un élément de l'interface sans bloquer les clics,
// et avance tout seul quand le joueur fait ce qui est demandé.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { usePartie } from '../contexte';
import { ASTUCES, ETAPES, type Astuce, type Etape } from './etapes';
import { ecrireTutoriel, lireTutoriel } from './etat';

interface Rect { x: number; y: number; w: number; h: number }

function rectDe(cible?: string): Rect | null {
  if (!cible) return null;
  const el = document.querySelector(`[data-tuto="${cible}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

export function Tutoriel() {
  const { etat: s, ui, majUi } = usePartie();
  const [mem, setMem] = useState(lireTutoriel);
  const [rect, setRect] = useState<Rect | null>(null);
  const carteRef = useRef<HTMLDivElement>(null);

  const maj = (m: typeof mem) => { setMem(m); ecrireTutoriel(m); };
  const etape: Etape | undefined = mem.actif && !mem.fini ? ETAPES[mem.etape] : undefined;

  // Astuce contextuelle : la première dont la condition est remplie et qui n'a pas encore été vue
  const astuce: Astuce | undefined = mem.actif || mem.fini
    ? ASTUCES.find(a => !mem.astuces.includes(a.id) && a.condition(s, ui) && !(etape && s.phase === 'jeu'))
    : undefined;

  const enJeu = s.phase === 'jeu' && ui.ecran === 'jeu' && !ui.aide && !ui.apercu && !ui.bilan;
  const courant: { titre: string; texte: string; cible?: string; consigne?: string } | undefined = astuce || (etape && enJeu ? etape : undefined);

  // Validation automatique des étapes à condition
  useEffect(() => {
    if (etape?.condition && etape.condition(s, ui)) avancer();
  });
  // Préparation de l'interface en arrivant sur une étape
  useEffect(() => {
    if (etape?.preparer) majUi(etape.preparer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mem.etape]);

  // Suivi de la position de l'élément mis en lumière (il peut bouger ou apparaître)
  useLayoutEffect(() => {
    if (!courant) { setRect(null); return; }
    let id = 0;
    const suivre = () => {
      const r = rectDe(courant.cible);
      setRect(p => (p && r && p.x === r.x && p.y === r.y && p.w === r.w && p.h === r.h) || (!p && !r) ? p : r);
      id = window.setTimeout(suivre, 250);
    };
    suivre();
    return () => clearTimeout(id);
  }, [courant?.cible, courant]);

  function avancer() {
    const n = mem.etape + 1;
    if (n >= ETAPES.length) maj({ ...mem, etape: n, fini: true });
    else maj({ ...mem, etape: n });
  }
  const passerTout = () => maj({ ...mem, actif: false, fini: true });
  const fermerAstuce = (id: string) => maj({ ...mem, astuces: [...mem.astuces, id] });

  if (!courant) return null;

  // Placement de la fiche : à côté de la cible si possible, sinon au centre
  const W = 360, marge = 14;
  const estAstuce = !!astuce;
  // Sans cible : au centre pour le tutoriel, dans le coin pour un conseil (pour ne pas masquer une fenêtre de décision)
  let style: CSSProperties = estAstuce ? { right: 24, top: 84 } : { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' };
  if (rect) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const hCarte = carteRef.current?.offsetHeight || 190;
    if (rect.y + rect.h + marge + hCarte < vh) style = { left: Math.min(Math.max(12, rect.x), vw - W - 12), top: rect.y + rect.h + marge };
    else if (rect.y - marge - hCarte > 0) style = { left: Math.min(Math.max(12, rect.x), vw - W - 12), top: rect.y - marge - hCarte };
    else if (rect.x - W - marge > 0) style = { left: rect.x - W - marge, top: Math.min(Math.max(12, rect.y), vh - hCarte - 12) };
    else style = { left: Math.min(rect.x + rect.w + marge, vw - W - 12), top: Math.min(Math.max(12, rect.y), vh - hCarte - 12) };
  }
  const avecCondition = !estAstuce && !!etape?.condition;

  return (
    <div className="tuto" aria-live="polite">
      {rect && <div className="tuto-projecteur" style={{ left: rect.x - 6, top: rect.y - 6, width: rect.w + 12, height: rect.h + 12 }} />}
      <div ref={carteRef} className={'tuto-carte' + (estAstuce ? ' astuce' : '')} style={{ ...style, width: W }} key={estAstuce ? astuce!.id : etape!.id}>
        <div className="tuto-haut">
          <span className="tuto-type">{estAstuce ? 'Conseil' : 'Tutoriel · ' + (mem.etape + 1) + '/' + ETAPES.length}</span>
          {!estAstuce && <button className="tuto-passer" onClick={passerTout}>Passer le tutoriel</button>}
        </div>
        <div className="tuto-titre">{courant.titre}</div>
        <p className="tuto-texte">{courant.texte}</p>
        {courant.consigne && <div className="tuto-consigne"><span>→</span>{courant.consigne}</div>}
        <div className="tuto-pied">
          {estAstuce
            ? <button className="btn petit principal" onClick={() => fermerAstuce(astuce!.id)}>Compris</button>
            : <>
              {avecCondition && <button className="btn petit fantome" onClick={avancer}>Passer cette étape</button>}
              {!avecCondition && <button className="btn petit principal" onClick={avancer} autoFocus>{mem.etape + 1 === ETAPES.length ? 'Commencer' : 'Suivant'}</button>}
            </>}
        </div>
        {!estAstuce && <div className="tuto-progression"><i style={{ width: ((mem.etape + 1) / ETAPES.length) * 100 + '%' }} /></div>}
      </div>
    </div>
  );
}
