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
};

// Petit bouton rouge « Supprimer » d'une ligne du Dashboard, avec confirmation.
export function DeleteFeatureButton({ featureId, featureTitle, className }: DeleteFeatureButtonProps) {
  return (
    <ConfirmDialog
      title="Supprimer cette feature ?"
      text={`« ${featureTitle} » et ses commentaires seront supprimés définitivement.`}
      successMessage="Feature supprimée"
      onConfirm={() => deleteFeature(featureId)}
      trigger={(open) => (
        <button type="button" onClick={open} className={cn(buttonClasses("danger", "petit"), className)}>
          <Trash2 aria-hidden="true" />
          Supprimer
        </button>
      )}
    />
  );
}
