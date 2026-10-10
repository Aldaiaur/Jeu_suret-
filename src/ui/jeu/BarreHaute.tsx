import { useState } from 'react';
import { DOC, NB_TOURS, PARAMS } from '../../data';
import { actionsParTour, coutsMensuels, dateDuTour, devise, nation, procedure } from '../../sim';
import { jouerSon, reglageSon, regler } from '../sons';
import { echelleInterface, reglerEchelle as regler_echelle } from '../echelle';
import { usePartie } from '../contexte';
import { tonNiveau } from '../format';
import { Drapeau, type NationJouable } from '../composants/Drapeau';
import { exporter, importerFichier } from '../sauvegarde';

interface PropsJauge { lib: string; val: number; delta: number | null; inverse?: boolean; tip: string; tuto?: string; alerte?: string }

function Jauge({ lib, val, delta, inverse, tip, tuto, alerte }: PropsJauge) {
  const ton = tonNiveau(val, inverse);
  const bon = delta !== null && delta !== 0 && ((delta > 0) !== !!inverse);
  return (
    <div className="jauge" data-tip={tip} data-tuto={tuto}>
      <div className="jauge-haut">
        <span className="jauge-lib">{lib}</span>
        {delta !== null && delta !== 0 && <span className={'jauge-delta ' + (bon ? 'c-vert' : 'c-rouge')}>{delta > 0 ? '▲' : '▼'} {Math.abs(delta)}</span>}
      </div>
      <div className="jauge-val chiffres">{Math.round(val)}{alerte && <span className="c-rouge jauge-alerte">{alerte}</span>}</div>
      <div className="barre"><i style={{ width: val + '%', background: `var(--${ton})` }} /></div>
    </div>
  );
}

export function BarreHaute() {
  const { etat: s, ui, majUi, terminerTour } = usePartie();
  const R = s.ressources, ref = ui.refMois;
  const couts = coutsMensuels(s), prevu = R.budget + R.enveloppe - couts;
  const d = (k: 'opinion' | 'capital' | 'menaceInt' | 'credibilite') => (ref ? Math.round(R[k] - ref[k]) : null);
  const max = actionsParTour(s);
  const tour = Math.min(s.tour, NB_TOURS - 1);
  return (
    <header className="barre-haute">
      <div className="marque">
        <span className="marque-logo">RED<b>LINES</b></span>
        <span className="marque-nation"><Drapeau nation={s.nation as NationJouable} /> {nation(s).nom}</span>
      </div>

      <div className="date-bloc" data-tip={'Un tour représente un mois. La campagne couvre janvier 2015 à décembre 2017.\nTour ' + (tour + 1) + ' sur ' + NB_TOURS + '.'} data-tuto="date">
        <div className="date-mois">{dateDuTour(tour)}</div>
        <div className="date-progression"><i style={{ width: ((tour + 1) / NB_TOURS) * 100 + '%' }} /></div>
      </div>

      <div className="jauges" data-tuto="jauges">
        <Jauge lib="Opinion" val={R.opinion} delta={d('opinion')} inverse tuto="jauge-opinion"
          tip={'Soutien de l’opinion (0-100). Pèse sur les votes ' + procedure(s).institution + ' (' + procedure(s).nom + ').\nDéfaite sous 10.'} />
        <Jauge lib="Capital politique" val={R.capital} delta={d('capital')} inverse tuto="jauge-capital"
          tip={'Capital politique (0-100). Fixe le nombre d’actions par mois (' + PARAMS.actionsBase + ' + 1 par tranche de ' + PARAMS.actionsParCapital + ').\nDéfaite s’il tombe à 0.'} />
        <Jauge lib="Menace intérieure" val={R.menaceInt} delta={d('menaceInt')} tuto="jauge-menace"
          alerte={s.menaceInt100 ? ' ' + s.menaceInt100 + '/3' : undefined}
          tip={'Menace sur le territoire (0-100). Alimentée par les réseaux en métropole, les cyberattaques et les menaces extérieures fortes.\nRéduite par la protection du territoire et les unités d’intervention.\nDéfaite si elle reste à 100 pendant 3 mois.'} />
        <Jauge lib="Crédibilité" val={R.credibilite} delta={d('credibilite')} inverse
          tip={'Crédibilité internationale (0-100). Conditionne les réponses des alliés.'} />
      </div>

      <div className="budget" data-tuto="budget" data-tip={'Solde : crédits disponibles.\nChaque mois : + enveloppe (' + R.enveloppe + ' ' + devise(s) + ') − coûts des unités engagées (' + couts.toFixed(1) + ' ' + devise(s) + ').\nUn solde négatif devient du surcoût opérationnel et coûte du capital politique.' + (R.surcout ? '\nSurcoût cumulé : ' + R.surcout.toFixed(0) + ' ' + devise(s) + '.' : '')}>
        <div className="budget-ligne"><span className="jauge-lib">Solde</span><span className={'chiffres budget-val' + (R.budget < 20 ? ' c-rouge' : '')}>{R.budget.toFixed(0)} {devise(s)}</span></div>
        <div className="budget-ligne discret"><span>Fin de mois</span><span className={'chiffres' + (prevu < 0 ? ' c-rouge' : '')}>{prevu >= 0 ? '+' : ''}{(prevu - R.budget).toFixed(0)} → {prevu.toFixed(0)}</span></div>
      </div>

      <div className="actions-bloc" data-tuto="actions" data-tip={'Actions restantes ce mois-ci : déployer, rapatrier, mener une opération, arbitrer le budget, solliciter un allié.\nRéaffecter des capteurs de renseignement est gratuit.'}>
        <span className="jauge-lib">Actions</span>
        <div className="pips">{Array.from({ length: max }, (_, i) => <i key={i} className={i < s.actionsRestantes ? 'plein' : ''} />)}</div>
      </div>

      <div className="barre-haute-fin">
        {s.doctrine && <span className="pastille contour" data-tip={DOC[s.doctrine].texte + '\n+ ' + DOC[s.doctrine].bonus + '\n− ' + DOC[s.doctrine].malus}>{DOC[s.doctrine].nom}</span>}
        <button className="btn fantome carre" data-tip="Aide (H)" onClick={() => majUi({ aide: true })}>?</button>
        <MenuJeu />
        <button className="btn principal grand bouton-fin" disabled={s.phase !== 'jeu'} onClick={terminerTour} data-tuto="fin-tour"
          data-tip="Clôturer le mois : coûts, évolution des menaces, renseignement, événements. (Entrée)">
          Fin du mois <span className="touche">↵</span>
        </button>
      </div>
    </header>
  );
}


function MenuJeu() {
  const { etat, majUi, ui, quitter, charger, notifier } = usePartie();
  const [ouvert, setOuvert] = useState(false);
  const item = (texte: string, f: () => void) => <button className="menu-item" onClick={() => { setOuvert(false); f(); }}>{texte}</button>;
  return (
    <div className="menu" onMouseLeave={() => setOuvert(false)}>
      <button className="btn fantome carre" onClick={() => setOuvert(o => !o)} data-tip="Menu">≡</button>
      {ouvert && (
        <div className="menu-liste">
          {item('Catalogue des forces et matériels', () => majUi({ catalogue: true }))}
          {item(reglageSon().actif ? 'Son : activé (couper)' : 'Son : coupé (activer)', () => { regler({ actif: !reglageSon().actif }); if (reglageSon().actif) jouerSon('clic'); })}
          {item('Taille de l’interface : ' + Math.round(echelleInterface() * 100) + ' % (changer)', () => { const e = echelleInterface(); regler_echelle(e < 1.05 ? 1.15 : e < 1.25 ? 1.3 : 1); })}
          {reglageSon().actif && item('Volume : ' + Math.round(reglageSon().volume * 100) + ' % (changer)', () => { const v = reglageSon().volume; regler({ volume: v < 0.3 ? 0.35 : v < 0.6 ? 0.7 : 0.15 }); jouerSon('ordre'); })}
          {item('Exporter la partie', () => exporter(etat))}
          {item('Importer une partie', () => importerFichier(charger, m => notifier('Import impossible', m, 'alerte')))}
          {item(ui.debug ? 'Masquer le débogage' : 'Débogage', () => majUi({ debug: !ui.debug }))}
          {item('Quitter vers l’accueil', quitter)}
        </div>
      )}
    </div>
  );
}
