// Composant client : la fenêtre s'ouvre et se ferme avec showModal() et close(),
// des méthodes de l'élément <dialog> qui n'existent que dans le navigateur.
"use client";

import { useEffect, useId, useRef } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void; // appelée quand on ferme (Échap, clic sur le fond, bouton Annuler)
  title: string;
  children: React.ReactNode;
};

// Fenêtre par-dessus la page (design system : carte blanche arrondie 28 px, fond grisé).
// On utilise l'élément HTML <dialog> : le navigateur gère lui-même le focus,
// la touche Échap et le fond grisé (voir dialog::backdrop dans globals.css).
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Ouvre ou ferme la fenêtre quand « open » change.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // onClose : la fenêtre a été fermée (touche Échap par exemple).
      onClose={onClose}
      // Un clic sur le fond grisé (en dehors de la carte) ferme la fenêtre.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-carte bg-blanc p-0 text-noir-doux shadow-carte"
    >
      {/* Seul l'élément ouvert est rendu : un formulaire repart de zéro à chaque ouverture. */}
      {open && (
        <div className="p-carte">
          <h2 id={titleId} className="mb-2 text-titre-section">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
