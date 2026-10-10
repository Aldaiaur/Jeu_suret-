// Placement des noms de lieux sur une carte : on essaie au-dessus, en dessous, à droite puis à gauche,
// et on garde la position qui chevauche le moins les autres lieux et les étiquettes déjà posées.
export interface Etiquette { x: number; y: number; ancre: 'start' | 'middle' | 'end' }
interface Boite { x0: number; y0: number; x1: number; y1: number }

const recouvrement = (a: Boite, b: Boite) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

export function placerEtiquettes(lieux: { id: string; nom: string }[], pos: Record<string, [number, number]>, rayon = 16, chasse = 6.6): Record<string, Etiquette> {
  const r: Record<string, Etiquette> = {}, posees: Boite[] = [];
  const marqueurs: Boite[] = lieux.map(l => ({ x0: pos[l.id][0] - rayon, y0: pos[l.id][1] - rayon, x1: pos[l.id][0] + rayon, y1: pos[l.id][1] + rayon }));
  const ordre = [...lieux].sort((a, b) => pos[a.id][1] - pos[b.id][1]);
  for (const l of ordre) {
    const [x, y] = pos[l.id], w = l.nom.length * chasse, h = 14;
    const candidats: (Etiquette & { b: Boite })[] = [
      { x: 0, y: -rayon - 6, ancre: 'middle', b: { x0: x - w / 2, y0: y - rayon - 6 - h + 3, x1: x + w / 2, y1: y - rayon - 3 } },
      { x: 0, y: rayon + 14, ancre: 'middle', b: { x0: x - w / 2, y0: y + rayon + 3, x1: x + w / 2, y1: y + rayon + 3 + h } },
      { x: rayon + 5, y: 4, ancre: 'start', b: { x0: x + rayon + 5, y0: y - h / 2, x1: x + rayon + 5 + w, y1: y + h / 2 } },
      { x: -rayon - 5, y: 4, ancre: 'end', b: { x0: x - rayon - 5 - w, y0: y - h / 2, x1: x - rayon - 5, y1: y + h / 2 } }
    ];
    let meilleur = candidats[0], cout = Infinity;
    candidats.forEach((c, i) => {
      const k = posees.reduce((a, b) => a + recouvrement(c.b, b), 0) * 2 + marqueurs.reduce((a, b) => a + recouvrement(c.b, b), 0) + i * 0.5;
      if (k < cout) { cout = k; meilleur = c; }
    });
    posees.push(meilleur.b);
    r[l.id] = { x: meilleur.x, y: meilleur.y, ancre: meilleur.ancre };
  }
  return r;
}
