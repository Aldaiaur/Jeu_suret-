// Note de situation d'ouverture, puis choix de la doctrine.
import { useEffect, useState } from 'react';
import { PERS } from '../../data';
import { doctrinesDe, nation } from '../../sim';
import { usePartie } from '../contexte';

export function Briefing() {
  const { etat: s, jouer, majUi } = usePartie();
  const [etape, setEtape] = useState<'note' | 'doctrine'>('note');
  const B = nation(s).briefing, exp = PERS[B.expediteur];

  // Une fois la doctrine retenue, la simulation quitte la phase « doctrine » : on passe à la carte
  useEffect(() => { if (s.phase !== 'doctrine') majUi({ ecran: 'jeu' }); }, [s.phase, majUi]);
  const choisir = (id: string) => jouer({ type: 'DOCTRINE', id });
  if (s.phase !== 'doctrine') return null;

  return (
    <div className="briefing">
      {etape === 'note' ? (
        <article className="note">
          <div className="note-entete">
            <span className="tampon ton-rouge">{B.diffusion}</span>
            <span className="discret">{B.date}</span>
          </div>
          <h1 className="note-titre">Note de situation</h1>
          <div className="note-meta">
            <div><span className="discret">De</span> {exp.nom}, {exp.fonction.toLowerCase()}</div>
            <div><span className="discret">À</span> {B.destinataire}</div>
          </div>
          <p className="note-intro">{B.introduction}</p>
          <div className="note-paragraphes">
            {B.paragraphes.map((p, i) => (
              <section key={i} className="note-paragraphe" style={{ animationDelay: 80 + i * 60 + 'ms' }}>
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
              </section>
            ))}
          </div>
          <p className="note-conclusion">{B.conclusion}</p>
          <div className="note-signature">{exp.nom}</div>
          <div className="note-pied"><button className="btn principal grand" onClick={() => setEtape('doctrine')} >Arrêter la doctrine</button></div>
        </article>
      ) : (
        <div className="doctrines">
          <h1 className="note-titre">Quelle doctrine pour l’État ?</h1>
          <p className="second">Votre doctrine fixe les priorités de l’appareil de sécurité pour toute la partie. Elle ne pourra pas être changée.</p>
          <div className="doctrines-grille">
            {doctrinesDe(s).map((d, i) => (
              <button key={d.id} className="doctrine" onClick={() => choisir(d.id)} style={{ animationDelay: i * 70 + 'ms' }} data-tuto={'doctrine-' + d.id}>
                <span className="doctrine-num">0{i + 1}</span>
                <span className="doctrine-nom">{d.nom}</span>
                <span className="doctrine-texte">{d.texte}</span>
                <span className="doctrine-effet c-vert">+ {d.bonus}</span>
                <span className="doctrine-effet c-rouge">− {d.malus}</span>
                <span className="doctrine-choisir">Retenir cette doctrine →</span>
              </button>
            ))}
          </div>
          <button className="btn fantome" onClick={() => setEtape('note')}>← Relire la note de situation</button>
        </div>
      )}
    </div>
  );
}
