// Fiche de l'élément sélectionné : informations et décisions possibles.
import type { ReactNode } from 'react';
import { AL, ALLIES, CATEGORIES, ETATS_UNITE, IDENTITES, MAT, MT, OP, PARAMS, POIDS_CAPTEUR, POSTURES, SERVICES, SV, TH, THEATRES, TYPES_CAPTEURS, UN, UNITES } from '../../data';
import {
  appuiDef, capteursLibres, coutMult, dateDuTour, delaiProjection, evaluerAppui, fiabilite, menaceParId,
  facteursVote, libelleMission, pressionMenace, probaVote, saisonDu, type Action, type AllieDef, type AppuiDef
} from '../../sim';
import { COULEUR_SAISON, IconeSaison, decrireSaison } from '../composants/Saison';
import { PanneauOrdres } from './VueRegionale';
import { FicheMateriel } from './Catalogue';
import { Insigne } from '../composants/Insigne';
import { SymboleHtml } from '../composants/SymboleOtan';
import { usePartie } from '../contexte';
import { COULEURS_CATEGORIE, couleurNiveau, decrireAppui, pct } from '../format';

export function Fiche() {
  const { etat: s, ui, majUi } = usePartie();
  const sel = ui.selection;
  if (!sel) return null;
  if (ui.ficheRepliee) return (
    <button className="fiche-onglet" onClick={() => majUi({ ficheRepliee: false })} data-tip="Déplier la fiche">
      <span>{sel.kind === 'theatre' ? TH[sel.id].nom : sel.kind === 'unite' ? UN[sel.id].nom : sel.kind === 'service' ? SV[sel.id].nom : AL[sel.id].nom}</span>
    </button>
  );
  return (
    <div className="fiche" key={sel.kind + sel.id}>
      <button className="btn fantome carre fiche-fermer" onClick={() => majUi({ selection: null })} aria-label="Fermer" data-tip="Fermer (Échap)">✕</button>
      <button className="btn fantome carre fiche-replier" onClick={() => majUi({ ficheRepliee: true })} aria-label="Replier la fiche" data-tip="Replier la fiche pour dégager la carte">›</button>
      {sel.kind === 'theatre' && (ui.uniteRegion && s.unites[ui.uniteRegion]?.theatre === sel.id ? <PanneauOrdres uniteId={ui.uniteRegion} theatre={sel.id} /> : <FicheTheatre id={sel.id} />)}
      {sel.kind === 'unite' && <FicheUnite id={sel.id} />}
      {sel.kind === 'service' && <FicheService id={sel.id} />}
      {sel.kind === 'allie' && <FicheAllie id={sel.id} />}
    </div>
  );
}

function Section({ titre, children, tuto }: { titre: string; children: ReactNode; tuto?: string }) {
  return <section className="fiche-section" data-tuto={tuto}><h3 className="titre-section">{titre}</h3>{children}</section>;
}

function LigneAction({ titre, meta, tip, bouton, action, ton, onClick, tuto, ordres }: {
  titre: ReactNode; meta?: ReactNode; tip?: string; bouton: string; action?: Action; ton?: 'principal' | 'danger'; onClick?: () => void; tuto?: string; ordres?: () => void
}) {
  const { estPossible, jouer } = usePartie();
  const ok = action ? estPossible(action) : true;
  return (
    <div className="ligne-action" data-tip={tip}>
      <div className="ligne-action-texte"><div>{titre}</div>{meta && <div className="ligne-action-meta">{meta}</div>}</div>
      {ordres && <button className="btn petit" onClick={ordres} data-tip="Ordres tactiques sur la carte régionale">Ordres</button>}
      <button className={'btn petit' + (ton ? ' ' + ton : '')} disabled={!ok} data-tuto={tuto}
        onClick={() => (onClick ? onClick() : action && jouer(action))}>{bouton}</button>
    </div>
  );
}

function Capteurs({ service, theatre }: { service: string; theatre: string }) {
  const { etat: s, estPossible, jouer } = usePartie();
  const st = s.services[service], a = st.affectations[theatre];
  return (
    <div className="capteurs-ligne">
      <span className="capteurs-service" data-tip={SV[service].libelle}>{service}</span>
      {TYPES_CAPTEURS.map(ty => {
        if (st.capteurs[ty] <= 0) return <span key={ty} className="stepper vide">—</span>;
        const plus: Action = { type: 'CAPTEUR', service, theatre, capteur: ty, delta: 1 };
        const moins: Action = { type: 'CAPTEUR', service, theatre, capteur: ty, delta: -1 };
        const n = a?.[ty] || 0;
        return (
          <span key={ty} className="stepper" data-tuto={'capteur-' + service + '-' + ty}
            data-tip={ty + ' : ' + n + ' affecté(s) ici, ' + capteursLibres(s, service, ty) + ' libre(s)\nApport : poids ' + POIDS_CAPTEUR[ty] + ' × efficacité ' + SV[service].efficacite[ty] + '\nGratuit : ne consomme pas d’action.'}>
            <span className="stepper-lib">{ty.slice(0, 3)}</span>
            <button disabled={!estPossible(moins)} onClick={() => jouer(moins)} aria-label={'Retirer un capteur ' + ty}>−</button>
            <span className={'stepper-val chiffres' + (n ? ' actif' : '')}>{n}</span>
            <button disabled={!estPossible(plus)} onClick={() => jouer(plus)} aria-label={'Ajouter un capteur ' + ty}>+</button>
            <span className="stepper-libres">{capteursLibres(s, service, ty)}</span>
          </span>
        );
      })}
    </div>
  );
}

function FicheTheatre({ id }: { id: string }) {
  const { etat: s, possibles, majUi, estPossible, jouer } = usePartie();
  const T = TH[id], th = s.theatres[id];
  const ms = s.menaces.filter(m => m.theatre === id && m.detectee);
  const sur = UNITES.filter(u => s.unites[u.id].theatre === id);
  const engager = possibles.filter((a): a is Extract<Action, { type: 'DEPLOYER' }> => a.type === 'DEPLOYER' && a.theatre === id);
  const ops = possibles.filter((a): a is Extract<Action, { type: 'OPERATION' }> => a.type === 'OPERATION' && a.theatre === id);
  const offres: [AllieDef, AppuiDef][] = [];
  for (const A of ALLIES) for (const ap of A.appuis) if (ap.theatres.includes(id) && !th.appuis.some(x => x.allie === A.id && x.appui === ap.id)) offres.push([A, ap]);
  const sansAction = s.actionsRestantes <= 0;
  const voteDans = T.exterieur && !T.basePermanente && !th.voteFait && th.toursIntervention > 0 ? Math.max(1, PARAMS.dureeAvantVote + 1 - th.toursIntervention) : null;

  return (
    <>
      <div className="fiche-entete">
        <div className="fiche-type">Théâtre</div>
        <h2 className="fiche-titre">{T.nom}</h2>
        <div className="fiche-indicateurs">
          <span className="pastille turquoise" data-tip={'Niveau de renseignement. Fiabilité ' + fiabilite(th.rens) + ' (A très sûre, E douteuse).'}>Renseignement {th.rens} · {fiabilite(th.rens)}</span>
          {th.partenaire > 0 && <span className="pastille" data-tip="Capacité des forces partenaires locales, formées ou soutenues.">Partenaire {th.partenaire}</span>}
          {T.exterieur && T.basePermanente && <span className="pastille contour" data-tip="Forces prépositionnées : pas de vote du Parlement.">Base permanente</span>}
          {th.voteFait && <span className="pastille vert">Intervention autorisée</span>}
          {th.crise && <span className="pastille rouge pulse">Crise</span>}
          {(() => { const sa = saisonDu(id, s.tour), ef = decrireSaison(sa.effets); return (
            <span className="pastille contour" style={{ color: COULEUR_SAISON[sa.visuel] }} data-tuto="fiche-saison"
              data-tip={sa.description + (ef.length ? '\n' + ef.join('\n') : '\nPas d’effet sur les règles.')}><IconeSaison visuel={sa.visuel} />{sa.nom}</span>); })()}
        </div>
        {voteDans !== null && (
          <div className="encart ambre" data-tuto="article35">
            <span data-tip={'Facteurs du vote\n' + facteursVote(s, id).map(f => f.lib + ' : ' + (f.val >= 0 ? '+' : '−') + Math.round(Math.abs(f.val) * 100) + ' %').join('\n') + '\nUn refus impose le retrait des forces du théâtre.'}>
              <b>Article 35</b> — intervention depuis {th.toursIntervention} mois. Vote du Parlement dans {voteDans} mois, adoption estimée <b>{pct(probaVote(s, id))}</b>.
            </span>
            {!th.debat ? (
              <div className="encart-action">
                <button className="btn petit" disabled={!estPossible({ type: 'DEBAT', theatre: id })} onClick={() => jouer({ type: 'DEBAT', theatre: id })}
                  data-tip={'Exposer les objectifs de l’intervention devant les assemblées.\nVote +' + Math.round(PARAMS.bonusDebat * 100) + ' % · capital −' + PARAMS.capitalDebat + ' · 1 action'}>Organiser un débat au Parlement</button>
              </div>
            ) : <div className="petit c-vert">Débat organisé : adoption facilitée.</div>}
          </div>
        )}
      </div>

      <Section titre="Menaces identifiées" tuto="fiche-menaces">
        {!ms.length && <p className="discret">Aucune menace identifiée. Le brouillard peut masquer une activité : renforcez le renseignement.</p>}
        {ms.map(m => {
          const pr = pressionMenace(s, m), q = pr >= 25 ? ['forte', 'vert'] : pr >= 12 ? ['moyenne', 'ambre'] : ['faible', 'rouge'];
          return (
            <div key={m.id} className="menace">
              <div className="menace-haut">
                <span className="menace-nom">{MT[m.type].nom}</span>
                <span className="chiffres menace-niveau" style={{ color: couleurNiveau(m.estimation) }}>{m.estimation}<span className="discret"> ± {m.marge}</span></span>
              </div>
              <div className="menace-jauge">
                <i className="menace-marge" style={{ left: Math.max(0, m.estimation! - m.marge) + '%', width: Math.min(100, m.estimation! + m.marge) - Math.max(0, m.estimation! - m.marge) + '%', background: couleurNiveau(m.estimation) }} />
                <i className="menace-point" style={{ left: m.estimation + '%', background: couleurNiveau(m.estimation) }} />
              </div>
              <div className={'menace-pression c-' + q[1]} data-tip="Pression exercée par vos forces, capteurs, partenaires et alliés. Sous faible pression, une menace continue de croître.">Pression {q[0]}</div>
            </div>
          );
        })}
      </Section>

      <Section titre="Capteurs de renseignement" tuto="fiche-capteurs">
        <div className="capteurs-entete"><span /><span>HUMINT</span><span>SIGINT</span><span>IMINT</span></div>
        {SERVICES.filter(x => x.theatres.includes(id)).map(sv => <Capteurs key={sv.id} service={sv.id} theatre={id} />)}
        <p className="discret petit">Le chiffre grisé indique les capteurs encore libres. Réaffecter est gratuit.</p>
      </Section>

      <Section titre={'Forces sur le théâtre (' + sur.length + ')'}>
        {!sur.length && <p className="discret">Aucune.</p>}
        {sur.map(u => {
          const e = s.unites[u.id];
          return (
            <LigneAction key={u.id} titre={<><i className="point" style={{ background: COULEURS_CATEGORIE[u.categorie] }} />{u.nom}</>}
              meta={<><span className={'etat etat-' + e.etat}>{ETATS_UNITE[e.etat]}{e.etat === 'projection' ? ' · ' + e.compteur + ' m' : ''}</span> · {POSTURES[e.posture].nom.toLowerCase()} · fatigue {Math.round(e.fatigue)}{e.mission ? <><br />{libelleMission(id, e.mission)}</> : null}</>}
              bouton="Rapatrier" action={{ type: 'RAPATRIER', unite: u.id }} ordres={e.etat === 'deployee' ? () => majUi({ uniteRegion: u.id }) : undefined} />
          );
        })}
      </Section>

      <Section titre="Engager des forces" tuto="fiche-engager">
        {!engager.length && <p className="discret">{sansAction ? 'Plus d’action disponible ce mois-ci.' : 'Aucune unité disponible pour ce théâtre.'}</p>}
        {engager.map(a => {
          const u = UN[a.unite], dl = delaiProjection(s, u.id, id), cm = coutMult(s);
          return (
            <LigneAction key={a.unite} titre={<><i className="point" style={{ background: COULEURS_CATEGORIE[u.categorie] }} />{u.nom}</>}
              meta={<>{dl ? 'arrivée sous ' + dl + ' mois' : 'immédiat'} · {(u.coutDeploiement * cm).toFixed(1)} M€ puis {(u.coutMensuel * cm).toFixed(1)} M€/mois</>}
              tip={u.type + '\nAssaut ' + u.cap.assaut + ' · Rens. ' + u.cap.renseignement + ' · Frappe ' + u.cap.frappe + ' · Discrétion ' + u.cap.discretion + ' · Endurance ' + u.cap.endurance}
              bouton="Engager" action={a} tuto={'engager-' + u.id} />
          );
        })}
      </Section>

      <Section titre="Opérations" tuto="fiche-operations">
        {!ops.length && <p className="discret">{sansAction ? 'Plus d’action disponible ce mois-ci.' : 'Aucune opération possible : il faut des moyens adaptés sur place.'}</p>}
        {ops.map(a => {
          const m = a.cible ? menaceParId(s, a.cible) : null;
          return <LigneAction key={a.op + (a.cible || '')} titre={OP[a.op].nom} meta={m ? 'Cible : ' + MT[m.type].nom : OP[a.op].description} tip={OP[a.op].description}
            bouton="Évaluer" ton="principal" onClick={() => majUi({ apercu: a })} />;
        })}
      </Section>

      {(th.appuis.length > 0 || offres.length > 0) && (
        <Section titre="Appuis alliés">
          {th.appuis.map(a => <div key={a.allie + a.appui} className="appui-actif"><span>{AL[a.allie].nom} : {appuiDef(a.allie, a.appui).nom}</span><span className="pastille violet">{a.tours} m</span></div>)}
          {offres.map(([A, ap]) => <LigneAppui key={A.id + ap.id} allie={A} appui={ap} theatre={id} avecNom />)}
        </Section>
      )}
    </>
  );
}

function LigneAppui({ allie: A, appui: ap, theatre, avecNom }: { allie: AllieDef; appui: AppuiDef; theatre: string; avecNom: boolean }) {
  const { etat: s } = usePartie();
  const ev = evaluerAppui(s, A.id, ap.id, theatre);
  return (
    <LigneAction titre={avecNom ? A.nom + ' : ' + ap.nom : TH[theatre].nom}
      meta={<><span className="c-turquoise">{pct(ev.pSucces)} d’accord</span> · {decrireAppui(ap)}{ap.duree > 1 ? ' · ' + ap.duree + ' mois' : ''}</>}
      tip={ap.nom + '\nCoût : ' + ap.capital + ' de capital, relation −' + ap.relation + ' si accordé.\nProbabilité selon la relation, votre crédibilité et l’intérêt du pays pour ce théâtre.'}
      bouton="Demander" action={{ type: 'ALLIE', allie: A.id, appui: ap.id, theatre }} />
  );
}

function FicheUnite({ id }: { id: string }) {
  const { etat: s, possibles } = usePartie();
  const u = UN[id], e = s.unites[id];
  const dep = possibles.filter((a): a is Extract<Action, { type: 'DEPLOYER' }> => a.type === 'DEPLOYER' && a.unite === id);
  const rap: Action = { type: 'RAPATRIER', unite: id };
  const caps = [['Assaut', u.cap.assaut], ['Renseignement', u.cap.renseignement], ['Frappe', u.cap.frappe], ['Discrétion', u.cap.discretion], ['Endurance', u.cap.endurance]] as const;
  return (
    <>
      <div className="fiche-entete">
        <div className="fiche-identite">
          <Insigne unite={id} taille={74} avecDevise />
          <div>
            <div className="fiche-type"><i className="point" style={{ background: COULEURS_CATEGORIE[u.categorie] }} />{CATEGORIES[u.categorie]}</div>
            <h2 className="fiche-titre">{u.nom}</h2>
            <div className="second">{u.type} · effectif {u.effectif.toLocaleString('fr-FR')}</div>
            <div className="symbole-ligne" data-tip={'Symbole militaire OTAN (APP-6)\nCode ' + IDENTITES[id].sidc}><SymboleHtml unite={id} taille={22} /><span className="discret petit">{IDENTITES[id].sigle}</span></div>
          </div>
        </div>
        <div className="fiche-indicateurs">
          <span className={'etat etat-' + e.etat}>{ETATS_UNITE[e.etat]}</span>
          {e.theatre && <span className="pastille">{TH[e.theatre].nom}</span>}
          <span className="pastille" style={{ color: couleurNiveau(e.fatigue) }}>Fatigue {Math.round(e.fatigue)}</span>
        </div>
      </div>
      {IDENTITES[id].materiels.length > 0 && (
        <Section titre="Matériels">
          {IDENTITES[id].materiels.map(m => <div key={m} data-tip={MAT[m].caracteristiques.map(c => c.lib + ' : ' + c.val + ' (' + c.source + ')').join('\n')}><FicheMateriel id={m} compacte /></div>)}
        </Section>
      )}
      <Section titre="Capacités">
        {caps.map(([nom, v]) => (
          <div key={nom} className="capacite"><span>{nom}</span><span className="barre"><i style={{ width: v * 10 + '%', background: 'var(--texte-2)' }} /></span><span className="chiffres">{v}</span></div>
        ))}
        <p className="discret petit">Projection : {u.delai} mois · mise en place {u.coutDeploiement} M€ · {u.coutMensuel} M€/mois</p>
        {u.indisponibilites && <p className="c-ambre petit">Arrêts techniques programmés : {u.indisponibilites.map(p => dateDuTour(p.debut) + ' à ' + dateDuTour(p.fin)).join(' ; ')}</p>}
      </Section>
      <Section titre="Ordres">
        {possibles.some(a => a.type === 'RAPATRIER' && a.unite === id) && <LigneAction titre="Rapatrier" meta="Retour puis régénération" bouton="Rapatrier" action={rap} />}
        {dep.map(a => <LigneAction key={a.theatre} titre={TH[a.theatre].nom} meta={(delaiProjection(s, id, a.theatre) || 'immédiat') + (delaiProjection(s, id, a.theatre) ? ' mois' : '')} bouton="Engager" action={a} />)}
        {!dep.length && !possibles.some(a => a.type === 'RAPATRIER' && a.unite === id) && <p className="discret">Aucun ordre possible (état de l’unité ou actions épuisées).</p>}
      </Section>
    </>
  );
}

function FicheService({ id }: { id: string }) {
  const { etat: s } = usePartie();
  const sv = SV[id];
  return (
    <>
      <div className="fiche-entete">
        <div className="fiche-type">Service de renseignement · {sv.domaine}</div>
        <h2 className="fiche-titre">{sv.nom}</h2>
        <div className="second">{sv.libelle}</div>
      </div>
      <Section titre="Affectation des capteurs">
        <p className="discret petit">Chaque capteur relève le niveau de renseignement du théâtre, et parfois la connaissance d’une menace précise. Réaffecter est gratuit.</p>
        <div className="capteurs-entete"><span /><span>HUMINT</span><span>SIGINT</span><span>IMINT</span></div>
        {sv.theatres.map(t => (
          <div key={t} className="capteurs-theatre">
            <div className="capteurs-theatre-nom"><span>{TH[t].nom}</span><span className="chiffres c-turquoise">{s.theatres[t].rens}</span></div>
            <Capteurs service={id} theatre={t} />
          </div>
        ))}
      </Section>
    </>
  );
}

function FicheAllie({ id }: { id: string }) {
  const { etat: s } = usePartie();
  const A = AL[id], st = s.allies[id];
  const actifs: string[] = [];
  for (const T of THEATRES) for (const a of s.theatres[T.id].appuis) if (a.allie === id) actifs.push(appuiDef(id, a.appui).nom + ' — ' + T.nom + ' (' + a.tours + ' mois)');
  return (
    <>
      <div className="fiche-entete">
        <div className="fiche-type">Allié</div>
        <h2 className="fiche-titre">{A.nom}</h2>
        <p className="second">{A.description}</p>
        <div className="fiche-indicateurs">
          <span className="pastille" style={{ color: couleurNiveau(st.relation, true) }}>Relation {Math.round(st.relation)}/100</span>
          {st.cooldown > 0 && <span className="pastille ambre">Nouvelle demande dans {st.cooldown} mois</span>}
        </div>
        <p className="discret petit">La relation remonte vers sa référence ({A.relation}), progresse quand vous êtes engagé sur les théâtres d’intérêt ({A.interets.map(t => TH[t].court).join(', ')}) et avec votre crédibilité. Chaque appui accordé la consomme.</p>
      </div>
      {actifs.length > 0 && <Section titre="Appuis en cours">{actifs.map(x => <div key={x} className="appui-actif"><span>{x}</span></div>)}</Section>}
      <Section titre="Appuis possibles">
        {A.appuis.map(ap => (
          <div key={ap.id} className="appui-def">
            <div className="appui-def-nom"><b>{ap.nom}</b><span className="discret"> · {decrireAppui(ap)} · capital {ap.capital}</span></div>
            {ap.theatres.map(t => s.theatres[t].appuis.some(x => x.allie === id && x.appui === ap.id)
              ? <div key={t} className="appui-actif"><span>{TH[t].nom}</span><span className="pastille violet">en cours</span></div>
              : <LigneAppui key={t} allie={A} appui={ap} theatre={t} avecNom={false} />)}
          </div>
        ))}
      </Section>
    </>
  );
}
