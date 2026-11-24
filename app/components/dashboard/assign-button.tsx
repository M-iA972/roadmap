// Composant client : le bouton « Assigner » ouvre une petite fenêtre avec un formulaire
// (react-hook-form), ce qui demande du state dans le navigateur.
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import { assignFeature } from "@/app/(app)/features/actions";
import { getFullName } from "@/components/avatar";
import { Dialog } from "@/components/dialog";
import { FormField, fieldMessageId } from "@/components/form-field";
import { useToast } from "@/components/toast";
import { buttonClasses } from "@/lib/button-styles";
import type { Member } from "@/lib/data/profiles";
import type { SprintOption } from "@/lib/data/sprints";
import { selectClasses } from "@/lib/form-styles";
import { labelOf, SPRINT_STATUSES } from "@/lib/labels";
import { assignSchema, type AssignValues } from "@/lib/schemas/feature";
import { cn } from "@/lib/utils";

type AssignButtonProps = {
  featureId: number;
  featureTitle: string;
  members: Member[];
  sprints: SprintOption[];
  className?: string;
};

// Bouton « Assigner » de la section « Action requise ».
// La fenêtre demande une personne et un sprint (les deux obligatoires).
export function AssignButton({ featureId, featureTitle, members, sprints, className }: AssignButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(buttonClasses("principal", "petit"), className)}
      >
        <Users aria-hidden="true" />
        Assigner
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Assigner la feature">
        <AssignForm
          featureId={featureId}
          featureTitle={featureTitle}
          members={members}
          sprints={sprints}
          onDone={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
}

// Le formulaire de la fenêtre. Il est recréé à chaque ouverture : les champs repartent vides.
function AssignForm({
  featureId,
  featureTitle,
  members,
  sprints,
  onDone,
}: Omit<AssignButtonProps, "className"> & { onDone: () => void }) {
  const showToast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AssignValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: { assignedTo: "", sprintId: "" },
  });

  async function onSubmit(values: AssignValues) {
    const result = await assignFeature(featureId, values);
    if (result?.error) {
      setError("root", { message: result.error });
      return;
    }
    onDone();
    showToast("Feature assignée");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-4 font-semibold">{featureTitle}</p>

      <div className="flex flex-col gap-4">
        <FormField id="assign-person" label="Personne" error={errors.assignedTo?.message}>
          <select
            id="assign-person"
            autoFocus
            aria-invalid={errors.assignedTo ? true : undefined}
            aria-describedby={fieldMessageId("assign-person")}
            className={selectClasses(Boolean(errors.assignedTo))}
            {...register("assignedTo")}
          >
            <option value="">Choisir une personne</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {getFullName(member)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="assign-sprint" label="Sprint" error={errors.sprintId?.message}>
          <select
            id="assign-sprint"
            aria-invalid={errors.sprintId ? true : undefined}
            aria-describedby={fieldMessageId("assign-sprint")}
            className={selectClasses(Boolean(errors.sprintId))}
            {...register("sprintId")}
          >
            <option value="">Choisir un sprint</option>
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.goal ?? "Sprint sans objectif"} — {labelOf(SPRINT_STATUSES, sprint.status)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {errors.root && (
        <p role="alert" className="mt-4 text-petit text-rouge-cerise">
          {errors.root.message}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onDone} className={buttonClasses("discret")}>
          Annuler
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClasses("principal")}>
          {isSubmitting ? "Enregistrement…" : "Assigner"}
        </button>
      </div>
    </form>
  );
}
