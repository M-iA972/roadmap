// Composant client : le bouton ouvre une fenêtre de confirmation,
// ce qui demande un state dans le navigateur.
"use client";

import { Trash2 } from "lucide-react";
import { deleteFeature } from "@/app/(app)/features/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { buttonClasses } from "@/lib/button-styles";
import { cn } from "@/lib/utils";

type DeleteFeatureButtonProps = {
  featureId: number;
  featureTitle: string;
  className?: string;
  size?: "normal" | "petit"; // « normal » sur la fiche feature, « petit » dans les tableaux
  backToDashboard?: boolean; // sur la fiche : la feature n'existera plus, on retourne au Dashboard
};

// Bouton rouge « Supprimer » d'une feature, avec confirmation.
export function DeleteFeatureButton({
  featureId,
  featureTitle,
  className,
  size = "petit",
  backToDashboard = false,
}: DeleteFeatureButtonProps) {
  return (
    <ConfirmDialog
      title="Supprimer cette feature ?"
      text={`« ${featureTitle} » et ses commentaires seront supprimés définitivement.`}
      successMessage="Feature supprimée"
      onConfirm={() => deleteFeature(featureId, backToDashboard)}
      trigger={(open) => (
        <button type="button" onClick={open} className={cn(buttonClasses("danger", size), className)}>
          <Trash2 aria-hidden="true" />
          Supprimer
        </button>
      )}
    />
  );
}
