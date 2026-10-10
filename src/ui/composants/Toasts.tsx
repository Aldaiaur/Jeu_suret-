import { useJeu } from '../contexte';

export function Toasts() {
  const { toasts, fermerToast } = useJeu();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={'toast ' + t.genre} onClick={() => fermerToast(t.id)}>
          <div className="toast-titre">{t.titre}</div>
          <div className="toast-texte">{t.texte}</div>
        </div>
      ))}
    </div>
  );
}
