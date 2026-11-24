// Composant client : le bouton ouvre une fenêtre de confirmation,
// ce qui demande un state dans le navigateur.
"use client";

import { Trash2 } from "lucide-react";
import { deleteSprint } from "@/app/(app)/sprints/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { buttonClasses } from "@/lib/button-styles";
import { cn } from "@/lib/utils";

type DeleteSprintButtonProps = {
  sprintId: number;
  sprintGoal: string;
  featureCount: number; // pour prévenir que les features repartent dans le backlog
  className?: string;
};

// Petit bouton rouge « Supprimer » d'une ligne de l'écran Sprints, avec confirmation.
export function DeleteSprintButton({ sprintId, sprintGoal, featureCount, className }: DeleteSprintButtonProps) {
  const text =
    featureCount > 0
      ? `Le sprint « ${sprintGoal} » sera supprimé. Ses ${featureCount} feature${featureCount > 1 ? "s" : ""} repartiront dans le backlog.`
      : `Le sprint « ${sprintGoal} » ne contient aucune feature. Il sera supprimé définitivement.`;

  return (
    <ConfirmDialog
      title="Supprimer ce sprint ?"
      text={text}
      successMessage="Sprint supprimé"
      onConfirm={() => deleteSprint(sprintId)}
      trigger={(open) => (
        <button type="button" onClick={open} className={cn(buttonClasses("danger", "petit"), className)}>
          <Trash2 aria-hidden="true" />
          Supprimer
        </button>
      )}
    />
  );
}
