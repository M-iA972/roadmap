// Composant client : le bouton ouvre une fenêtre (confirmation ou explication),
// ce qui demande un state dans le navigateur.
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteModule } from "@/app/(app)/modules/actions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Dialog } from "@/components/dialog";
import { buttonClasses } from "@/lib/button-styles";
import { cn } from "@/lib/utils";

type DeleteModuleButtonProps = {
  moduleId: number;
  moduleName: string;
  featureCount: number;
  className?: string;
};

// Petit bouton rouge « Supprimer » d'une ligne de l'écran Modules.
// Un module qui a encore des features ne peut pas être supprimé : on l'explique.
export function DeleteModuleButton({ moduleId, moduleName, featureCount, className }: DeleteModuleButtonProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const buttonClassName = cn(buttonClasses("danger", "petit"), className);

  if (featureCount > 0) {
    return (
      <>
        <button type="button" onClick={() => setIsInfoOpen(true)} className={buttonClassName}>
          <Trash2 aria-hidden="true" />
          Supprimer
        </button>
        <Dialog open={isInfoOpen} onClose={() => setIsInfoOpen(false)} title="Suppression impossible">
          <p className="text-gris-texte">
            Le module « {moduleName} » contient encore {featureCount} feature
            {featureCount > 1 ? "s" : ""}. Déplacez-les ou supprimez-les d&apos;abord.
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              autoFocus
              onClick={() => setIsInfoOpen(false)}
              className={buttonClasses("secondaire")}
            >
              J&apos;ai compris
            </button>
          </div>
        </Dialog>
      </>
    );
  }

  return (
    <ConfirmDialog
      title="Supprimer ce module ?"
      text={`Le module « ${moduleName} » ne contient aucune feature. Il sera supprimé définitivement.`}
      successMessage="Module supprimé"
      onConfirm={() => deleteModule(moduleId)}
      trigger={(open) => (
        <button type="button" onClick={open} className={buttonClassName}>
          <Trash2 aria-hidden="true" />
          Supprimer
        </button>
      )}
    />
  );
}
