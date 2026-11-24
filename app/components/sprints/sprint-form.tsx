// Composant client : react-hook-form suit la saisie, affiche les erreurs
// et compte les cases cochées, ce qui demande du state dans le navigateur.
"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Info } from "lucide-react";
import { createSprint, updateSprint } from "@/app/(app)/sprints/actions";
import { FormField, fieldMessageId } from "@/components/form-field";
import { ModuleBadge } from "@/components/module-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { buttonClasses } from "@/lib/button-styles";
import type { ActionRequiredFeature } from "@/lib/data/features";
import { inputClasses, selectClasses } from "@/lib/form-styles";
import { SPRINT_STATUSES } from "@/lib/labels";
import { withMessage } from "@/lib/messages";
import { sprintSchema, type SprintValues } from "@/lib/schemas/sprint";

type SprintFormProps = {
  sprintId?: number; // sprint à modifier ; absent pour un nouveau sprint
  defaultValues: SprintValues;
  backlog: ActionRequiredFeature[]; // features à cocher (nouveau sprint seulement)
};

// Formulaire unique : « Nouveau sprint » ou, avec sprintId, « Modifier le sprint ».
export function SprintForm({ sprintId, defaultValues, backlog }: SprintFormProps) {
  const isEdit = sprintId !== undefined;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SprintValues>({
    resolver: zodResolver(sprintSchema),
    defaultValues,
  });

  // Les cases cochées, relues à chaque changement pour afficher leur nombre.
  const checkedIds = useWatch({ control, name: "featureIds" });

  async function onSubmit(values: SprintValues) {
    // Les Server Actions redirigent vers l'écran Sprints si tout va bien.
    const result = isEdit ? await updateSprint(sprintId, values) : await createSprint(values);
    if (result?.error) {
      setError("root", { message: result.error });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-[760px] rounded-carte bg-blanc p-carte shadow-carte"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <FormField id="goal" label="Objectif" error={errors.goal?.message} className="md:col-span-2">
          <input
            id="goal"
            autoFocus
            placeholder="Ex. : Intégrations prêtes pour la bêta"
            aria-invalid={errors.goal ? true : undefined}
            aria-describedby={fieldMessageId("goal")}
            className={inputClasses(Boolean(errors.goal))}
            {...register("goal")}
          />
        </FormField>

        <FormField id="startDate" label="Date de début" error={errors.startDate?.message}>
          <input
            id="startDate"
            type="date"
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={fieldMessageId("startDate")}
            className={inputClasses(Boolean(errors.startDate))}
            {...register("startDate")}
          />
        </FormField>

        <FormField id="endDate" label="Date de fin" error={errors.endDate?.message}>
          <input
            id="endDate"
            type="date"
            aria-invalid={errors.endDate ? true : undefined}
            aria-describedby={fieldMessageId("endDate")}
            className={inputClasses(Boolean(errors.endDate))}
            {...register("endDate")}
          />
        </FormField>

        {isEdit ? (
          // En modification seulement : le statut.
          <FormField id="status" label="Statut">
            <select id="status" className={selectClasses()} {...register("status")}>
              {SPRINT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </FormField>
        ) : (
          <>
            {/* Bloc repliable « Options avancées » (<details> : s'ouvre sans JavaScript) */}
            <details className="group rounded-carte border-2 border-gris-bordure bg-blanc open:border-rose-clair md:col-span-2">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[26px] px-4 py-3 font-semibold transition-colors hover:bg-rose-clair [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-rose-fuchsia transition-transform group-open:rotate-90"
                />
                Options avancées
                <span className="ml-auto text-petit font-medium text-gris-texte">
                  {checkedIds.length > 0
                    ? `${checkedIds.length} feature${checkedIds.length > 1 ? "s" : ""} cochée${checkedIds.length > 1 ? "s" : ""}`
                    : "Ajouter des features du backlog"}
                </span>
              </summary>

              <div className="px-4 pt-2 pb-4">
                <p className="text-petit text-gris-texte">
                  Cochez les features du backlog à mettre dans ce sprint. Elles passeront au statut
                  « À faire ».
                </p>
                {backlog.length === 0 ? (
                  <p className="mt-2 text-gris-texte">Le backlog est vide.</p>
                ) : (
                  <fieldset className="mt-2 flex flex-col gap-1">
                    <legend className="sr-only">Features du backlog</legend>
                    {backlog.map((feature) => (
                      // Toute la ligne est cliquable : c'est un <label> qui contient la case.
                      <label
                        key={feature.id}
                        className="grid cursor-pointer grid-cols-[24px_minmax(0,1fr)] items-center gap-3 rounded-pilule px-4 py-3 transition-colors hover:bg-rose-clair md:grid-cols-[24px_minmax(0,1fr)_auto_auto]"
                      >
                        {/* La vraie case est invisible (sr-only) mais reste utilisable au clavier.
                            « peer » permet au carré dessiné juste après de changer quand elle est cochée. */}
                        <input
                          type="checkbox"
                          value={String(feature.id)}
                          className="peer sr-only"
                          {...register("featureIds")}
                        />
                        <span
                          aria-hidden="true"
                          className="inline-flex size-[22px] items-center justify-center rounded-case border-2 border-gris-bordure bg-blanc text-blanc peer-checked:border-rose-fuchsia peer-checked:bg-rose-fuchsia peer-focus-visible:border-rose-fuchsia [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                        >
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        <span className="font-semibold">{feature.title}</span>
                        <span className="col-start-2 md:col-start-auto">
                          <ModuleBadge module={feature.module} />
                        </span>
                        <span className="col-start-2 md:col-start-auto">
                          <PriorityBadge priority={feature.priority} />
                        </span>
                      </label>
                    ))}
                  </fieldset>
                )}
              </div>
            </details>

            <p className="flex items-start gap-2 rounded-carte bg-fond px-4 py-3 text-petit text-gris-texte md:col-span-2">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-violet-electrique" />
              <span>
                Le sprint sera créé avec le statut <strong>Planification</strong>. Vous pourrez le
                passer en « Actif » puis « Terminé » avec « Modifier ».
              </span>
            </p>
          </>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="mt-4 text-petit text-rouge-cerise">
          {errors.root.message}
        </p>
      )}

      <div className="mt-8 flex justify-end gap-2 border-t border-gris-bordure pt-6">
        <Link
          href={withMessage("/sprints", isEdit ? "Modification annulée" : "Ajout annulé")}
          className={buttonClasses("discret")}
        >
          Annuler
        </Link>
        <button type="submit" disabled={isSubmitting} className={buttonClasses("principal")}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
