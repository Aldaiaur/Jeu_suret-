// Composants du monde partagé, des horloges de menace, des objectifs de mandat et du conseiller.
import { MT, PUI, TH } from '../../data';
import {
  attitude, coalition, conseilDuMois, engagement, horlogeVisible, libelleNiveau, objectifAtteint, progresObjectif, puissancesDe, rivaux,
  SEUIL_COALITION, SEUIL_HORLOGE_PRECISE, type Menace
} from '../../sim';
import { usePartie } from '../contexte';
import { Drapeau, type NationJouable } from '../composants/Drapeau';
import { Portrait } from '../composants/Portrait';
import { couleurNiveau } from '../format';

// ---------- Horloge de menace ----------
export function Horloge({ m, compacte = false }: { m: Menace; compacte?: boolean }) {
  const { etat: s } = usePartie();
  const h = horlogeVisible(s, m);
  if (!h) return null;
  const urgent = h.precise && h.niveau >= h.duree - 1;
  const tip = h.precise
    ? 'Préparation d’une action : ' + h.niveau + ' mois sur ' + h.duree + '.\nQuand l’horloge est pleine, la menace passe à l’action. Une opération réussie la fait reculer de deux crans, une pression forte d’un cran par mois.'
    : 'Les services signalent des préparatifs sans pouvoir les dater.\nAu-delà de ' + SEUIL_HORLOGE_PRECISE + ' de renseignement sur cette menace, l’échéance devient lisible.';
  return (
    <div className={'horloge' + (urgent ? ' urgente' : '') + (compacte ? ' compacte' : '')} data-tip={tip} data-tuto="horloge">
      <span className="horloge-lib">{h.precise ? (urgent ? 'Action imminente' : 'Préparation') : 'Préparatifs signalés'}</span>
      <span className="horloge-segments" aria-label={h.precise ? h.niveau + ' sur ' + h.duree : 'non daté'}>
        {Array.from({ length: h.duree }, (_, i) => <i key={i} className={h.precise ? (i < h.niveau ? 'plein' : '') : 'flou'} />)}
      </span>
      {h.precise && <span className="horloge-val chiffres">{h.niveau}/{h.duree}</span>}
    </div>
  );
}

// ---------- Puissances présentes sur un théâtre ----------
export function PuissancesTheatre({ theatre }: { theatre: string }) {
  const { etat: s } = usePartie();
  const co = coalition(s, theatre), ri = rivaux(s, theatre);
  const presentes = puissancesDe(s).filter(P => engagement(s, P.id, theatre) > 0);
  if (!presentes.length) return <p className="discret">Aucune autre puissance engagée ici.</p>;
  return (
    <div className="puissances-theatre">
      {presentes.map(P => {
        const n = engagement(s, P.id, theatre), role = co.includes(P) ? 'coalition' : ri.includes(P) ? 'rivale' : 'neutre';
        const contre = Object.keys(P.contre).filter(t => s.menaces.some(m => m.theatre === theatre && m.type === t)).map(t => MT[t].nom);
        const attise = Object.keys(P.attise || {}).filter(t => s.menaces.some(m => m.theatre === theatre && m.type === t)).map(t => MT[t].nom);
        return (
          <div key={P.id} className={'puissance-ligne ' + role}
            data-tip={P.nom + ' — ' + libelleNiveau(n) + '\n' + P.description + (contre.length ? '\nCombat : ' + contre.join(', ') : '') + (attise.length ? '\nAttise : ' + attise.join(', ') : '') +
              '\nAttitude envers vous : ' + Math.round(attitude(s, P.id)) + '/100' + (role === 'coalition' ? '\nCoalition : +3 % de réussite pour vos opérations ici.' : '')}>
            <Drapeau nation={P.id as NationJouable} taille={13} />
            <span className="puissance-nom">{P.nom}</span>
            <span className="niveau-pips">{[1, 2, 3].map(i => <i key={i} className={i <= n ? 'plein' : ''} />)}</span>
            <span className={'pastille ' + (role === 'coalition' ? 'vert' : role === 'rivale' ? 'rouge' : '')}>{role === 'coalition' ? 'Coalition' : role === 'rivale' ? 'Rivale' : 'Présente'}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Onglet « Monde » ----------
export function OngletMonde() {
  const { etat: s, majUi } = usePartie();
  return (
    <>
      <section className="groupe">
        <h3 className="titre-section">Puissances</h3>
        <p className="discret petit">Les autres puissances jouent avec les mêmes règles : elles s’engagent selon leurs intérêts et la menace, combattent ou attisent les menaces de vos théâtres. Au-delà de {SEUIL_COALITION}, une puissance coopère avec vous.</p>
        {puissancesDe(s).map(P => {
          const att = attitude(s, P.id), eng = s.monde.puissances[P.id].engagements;
          const visibles = Object.keys(eng).filter(t => eng[t] > 0 && s.theatres[t]);
          const ailleurs = Object.keys(eng).filter(t => eng[t] > 0 && !s.theatres[t]).length;
          return (
            <div key={P.id} className="carte-puissance" data-tip={P.description}>
              <div className="carte-puissance-haut">
                <Drapeau nation={P.id as NationJouable} taille={16} />
                <b>{P.nom}</b>
                <span className={'pastille ' + (att >= SEUIL_COALITION ? 'vert' : att < 35 ? 'rouge' : '')} data-tip={'Attitude envers vous : ' + Math.round(att) + '/100' + (PUI[P.id].allie && s.allies[PUI[P.id].allie!] ? '\nC’est aussi votre relation avec cet allié.' : '')}>{att >= SEUIL_COALITION ? 'Partenaire' : att < 35 ? 'Hostile' : 'Réservée'} · {Math.round(att)}</span>
              </div>
              <span className="barre"><i style={{ width: att + '%', background: couleurNiveau(att, true) }} /></span>
              <div className="carte-puissance-theatres">
                {visibles.map(t => (
                  <button key={t} className="puissance-theatre" onClick={() => majUi({ selection: { kind: 'theatre', id: t } })} data-tip={TH[t].nom + ' : ' + libelleNiveau(eng[t])}>
                    {TH[t].court}<span className="niveau-pips">{[1, 2, 3].map(i => <i key={i} className={i <= eng[t] ? 'plein' : ''} />)}</span>
                  </button>
                ))}
                {!visibles.length && <span className="discret petit">Absente de vos théâtres</span>}
                {ailleurs > 0 && <span className="discret petit">+ {ailleurs} théâtre{ailleurs > 1 ? 's' : ''} hors de votre champ</span>}
              </div>
              {s.monde.puissances[P.id].mouvements.map((x, i) => <div key={i} className="puissance-mouvement">{x}</div>)}
            </div>
          );
        })}
      </section>
    </>
  );
}

// ---------- Objectifs de mandat ----------
export function ObjectifsMandat() {
  const { etat: s, majUi } = usePartie();
  const M = s.mandat;
  if (!M.objectifs.length) return null;
  const bilan = M.bilans[M.bilans.length - 1];
  return (
    <section className="groupe" data-tuto="objectifs">
      <h3 className="titre-section">Objectifs {M.annee}</h3>
      {M.objectifs.map((o, i) => {
        const ok = objectifAtteint(s, o, false);
        return (
          <button key={i} className={'objectif-mandat ' + (o.resultat === 'en_cours' ? (ok ? 'ok' : 'attente') : o.resultat)}
            onClick={() => o.theatre && majUi({ selection: { kind: 'theatre', id: o.theatre } })}
            data-tip={'Bilan en décembre : tenu, capital +3 et opinion +1 ; manqué, capital −3 et opinion −1.\nÉtat estimé : ' + progresObjectif(s, o) + '.'}>
            <span className="objectif-mandat-icone">{ok ? '✓' : '○'}</span>
            <span><span className="objectif-mandat-texte">{o.texte}</span><span className="discret petit"> — {progresObjectif(s, o)}</span></span>
          </button>
        );
      })}
      {bilan && <p className="discret petit">Bilan {bilan.annee} : {bilan.reussis} objectif{bilan.reussis > 1 ? 's' : ''} tenu{bilan.reussis > 1 ? 's' : ''} sur {bilan.total}.</p>}
    </section>
  );
}

// ---------- Conseiller du mois ----------
export function Conseiller() {
  const { etat: s, ui, majUi } = usePartie();
  if (!ui.conseiller || s.phase !== 'jeu') return null;
  const { auteur, conseils } = conseilDuMois(s);
  return (
    <section className="conseiller" data-tuto="conseiller">
      <div className="conseiller-entete">
        <Portrait id={auteur.id} taille={34} />
        <div>
          <div className="titre-section">Conseil du mois</div>
          <div className="discret petit">{auteur.nom}, {auteur.fonction.charAt(0).toLowerCase() + auteur.fonction.slice(1)}</div>
        </div>
        <button className="btn fantome carre conseiller-fermer" onClick={() => majUi({ conseiller: false })} data-tip="Masquer le conseiller (réactivable dans le menu)" aria-label="Masquer le conseiller">✕</button>
      </div>
      <ol className="conseils">
        {conseils.map((c, i) => (
          <li key={i}>
            <button className="conseil" onClick={() => c.theatre && majUi({ selection: { kind: 'theatre', id: c.theatre } })} disabled={!c.theatre}>
              <span className="conseil-texte">{c.texte}</span>
              <span className="conseil-raison">{c.raison}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
