// Composant client : la fenêtre de confirmation s'ouvre au clic et attend la réponse
// de la Server Action, ce qui demande du state dans le navigateur.
"use client";

import { useState, useTransition } from "react";
import { Dialog } from "@/components/dialog";
import { useToast } from "@/components/toast";
import { buttonClasses } from "@/lib/button-styles";
import type { ActionResult } from "@/lib/action-result";

type ConfirmDialogProps = {
  title: string; // ex. « Supprimer cette feature ? »
  text: React.ReactNode; // explication sous le titre
  confirmLabel?: string; // texte du bouton rouge, « Supprimer » par défaut
  successMessage: string; // message affiché après la suppression
  onConfirm: () => Promise<ActionResult>; // la Server Action à lancer
  // Le bouton qui ouvre la fenêtre. Il reçoit la fonction à appeler au clic.
  trigger: (open: () => void) => React.ReactNode;
};

// Fenêtre de confirmation avant une action définitive (suppression).
// « Annuler » ferme sans rien faire ; le bouton rouge lance l'action.
export function ConfirmDialog({
  title,
  text,
  confirmLabel = "Supprimer",
  successMessage,
  onConfirm,
  trigger,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // isPending est vrai pendant que la Server Action tourne.
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  function open() {
    setError(null);
    setIsOpen(true);
  }

  function confirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (result?.error) {
        setError(result.error);
        return;
      }
      setIsOpen(false);
      showToast(successMessage);
    });
  }

  return (
    <>
      {trigger(open)}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="text-gris-texte">{text}</p>
        {error && (
          <p role="alert" className="mt-4 text-petit text-rouge-cerise">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => setIsOpen(false)} className={buttonClasses("discret")}>
            Annuler
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={isPending}
            autoFocus
            className={buttonClasses("danger")}
          >
            {isPending ? "Suppression…" : confirmLabel}
          </button>
        </div>
      </Dialog>
    </>
  );
}
