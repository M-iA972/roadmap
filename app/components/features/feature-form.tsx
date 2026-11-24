// Composant client : react-hook-form suit la saisie et affiche les erreurs
// sous les champs, ce qui demande du state dans le navigateur.
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Info } from "lucide-react";
import { createFeature, updateFeature } from "@/app/(app)/features/actions";
import { getFullName } from "@/components/avatar";
import { FormField, fieldMessageId } from "@/components/form-field";
import { buttonClasses } from "@/lib/button-styles";
import type { Member } from "@/lib/data/profiles";
import type { SprintOption } from "@/lib/data/sprints";
import { inputClasses, selectClasses, textareaClasses } from "@/lib/form-styles";
import {
  EFFORTS,
  FEATURE_STATUSES,
  IMPACTS,
  PRIORITIES,
  SPRINT_STATUSES,
  labelOf,
} from "@/lib/labels";
import { withMessage } from "@/lib/messages";
import { featureEditSchema, type FeatureEditValues } from "@/lib/schemas/feature";
import type { Tables } from "@/lib/supabase/database.types";

type FeatureFormProps = {
  // Feature à modifier (avec son id), ou absente pour une nouvelle feature.
  featureId?: number;
  defaultValues: FeatureEditValues;
  modules: Pick<Tables<"modules">, "id" | "name">[];
  members: Member[];
  sprints: SprintOption[];
};

// Formulaire unique : « Nouvelle feature » ou, avec featureId, « Modifier la feature ».
export function FeatureForm({ featureId, defaultValues, modules, members, sprints }: FeatureFormProps) {
  const isEdit = featureId !== undefined;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeatureEditValues>({
    // En création, le statut n'est pas affiché : la Server Action le calcule.
    resolver: zodResolver(featureEditSchema),
    defaultValues,
  });

  async function onSubmit(values: FeatureEditValues) {
    // Les Server Actions redirigent vers le Dashboard si tout va bien.
    const result = isEdit ? await updateFeature(featureId, values) : await createFeature(values);
    if (result?.error) {
      setError("root", { message: result.error });
    }
  }

  // Les deux listes « Personne assignée » et « Sprint » : dans les options avancées
  // en création, directement dans le formulaire en modification.
  const assigneeField = (
    <FormField id="assignedTo" label="Personne assignée">
      <select id="assignedTo" className={selectClasses()} {...register("assignedTo")}>
        <option value="">Non assignée</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {getFullName(member)}
          </option>
        ))}
      </select>
    </FormField>
  );

  const sprintField = (
    <FormField
      id="sprintId"
      label="Sprint"
      help={isEdit ? "Laissez vide pour garder la feature dans le backlog." : undefined}
      className={isEdit ? "md:col-span-2" : undefined}
    >
      <select
        id="sprintId"
        aria-describedby={fieldMessageId("sprintId")}
        className={selectClasses()}
        {...register("sprintId")}
      >
        <option value="">Aucun — la feature reste dans le backlog</option>
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.goal ?? "Sprint sans objectif"} — {labelOf(SPRINT_STATUSES, sprint.status)}
          </option>
        ))}
      </select>
    </FormField>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-[760px] rounded-carte bg-blanc p-carte shadow-carte"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        <FormField id="title" label="Titre" error={errors.title?.message} className="md:col-span-2">
          <input
            id="title"
            autoFocus
            placeholder="Ex. : Export des données en CSV"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={fieldMessageId("title")}
            className={inputClasses(Boolean(errors.title))}
            {...register("title")}
          />
        </FormField>

        <FormField id="description" label="Description" className="md:col-span-2">
          <textarea
            id="description"
            placeholder="Le besoin, pour qui, et ce qu'on veut obtenir."
            className={textareaClasses()}
            {...register("description")}
          />
        </FormField>

        <FormField id="priority" label="Priorité">
          <select id="priority" className={selectClasses()} {...register("priority")}>
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="effort" label="Effort">
          <select id="effort" className={selectClasses()} {...register("effort")}>
            <option value="">Non estimé</option>
            {EFFORTS.map((effort) => (
              <option key={effort.value} value={effort.value}>
                {effort.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="impact" label="Utilisateurs impactés">
          <select id="impact" className={selectClasses()} {...register("impact")}>
            {IMPACTS.map((impact) => (
              <option key={impact.value} value={impact.value}>
                {impact.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="moduleId" label="Module" error={errors.moduleId?.message}>
          <select
            id="moduleId"
            aria-invalid={errors.moduleId ? true : undefined}
            aria-describedby={fieldMessageId("moduleId")}
            className={selectClasses(Boolean(errors.moduleId))}
            {...register("moduleId")}
          >
            <option value="">Choisir un module</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </FormField>

        {isEdit ? (
          <>
            {assigneeField}
            <FormField id="status" label="Statut">
              <select id="status" className={selectClasses()} {...register("status")}>
                {FEATURE_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </FormField>
            {sprintField}
          </>
        ) : (
          <>
            {/* Bloc repliable « Options avancées » : <details> s'ouvre et se ferme tout seul,
                sans JavaScript. « group » permet de tourner la flèche quand il est ouvert. */}
            <details className="group rounded-carte border-2 border-gris-bordure bg-blanc open:border-rose-clair md:col-span-2">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[26px] px-4 py-3 font-semibold transition-colors hover:bg-rose-clair [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-rose-fuchsia transition-transform group-open:rotate-90"
                />
                Options avancées
                <span className="ml-auto text-petit font-medium text-gris-texte">
                  Personne assignée et sprint
                </span>
              </summary>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-4 pt-2 pb-4 md:grid-cols-2">
                {assigneeField}
                {sprintField}
              </div>
            </details>

            <p className="flex items-start gap-2 rounded-carte bg-fond px-4 py-3 text-petit text-gris-texte md:col-span-2">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-violet-electrique" />
              <span>
                Sans options avancées, la feature est créée avec le statut{" "}
                <strong>Backlog</strong>, sans personne assignée ni sprint. Si vous choisissez un
                sprint, elle passe au statut <strong>À faire</strong>.
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
          href={withMessage("/", isEdit ? "Modification annulée" : "Ajout annulé")}
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
