type FormFieldProps = {
  id: string; // id du champ, relié au libellé (htmlFor) et au message d'erreur
  label: React.ReactNode;
  error?: string; // message d'erreur, affiché en rouge sous le champ
  help?: string; // petite aide grise sous le champ (masquée quand il y a une erreur)
  className?: string;
  children: React.ReactNode; // le champ lui-même (<input>, <select>, <textarea>)
};

// Un champ de formulaire : libellé au-dessus, champ, puis aide ou erreur en dessous.
// Pour l'accessibilité, le champ doit avoir aria-describedby={fieldMessageId(id)}
// et aria-invalid quand il y a une erreur : le lecteur d'écran lit alors le message.
export function FormField({ id, label, error, help, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-libelle">
        {label}
      </label>
      {children}
      {error ? (
        <p id={fieldMessageId(id)} role="alert" className="mt-1 pl-4 text-petit text-rouge-cerise">
          {error}
        </p>
      ) : (
        help && (
          <p id={fieldMessageId(id)} className="mt-1 pl-4 text-petit text-gris-texte">
            {help}
          </p>
        )
      )}
    </div>
  );
}

// Identifiant du message (aide ou erreur) d'un champ.
export function fieldMessageId(id: string): string {
  return `${id}-message`;
}
