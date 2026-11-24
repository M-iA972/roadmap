// Composant client : react-hook-form suit la saisie et affiche les erreurs
// sous les champs, ce qui demande du state dans le navigateur.
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createModule, updateModule } from "@/app/(app)/modules/actions";
import { FormField, fieldMessageId } from "@/components/form-field";
import { buttonClasses } from "@/lib/button-styles";
import { inputClasses, textareaClasses } from "@/lib/form-styles";
import { withMessage } from "@/lib/messages";
import { MODULE_COLORS, moduleSchema, type ModuleValues } from "@/lib/schemas/module";

type ModuleFormProps = {
  moduleId?: number; // module à modifier ; absent pour un nouveau module
  defaultValues: ModuleValues;
};

// Formulaire unique : « Nouveau module » ou, avec moduleId, « Modifier le module ».
export function ModuleForm({ moduleId, defaultValues }: ModuleFormProps) {
  const isEdit = moduleId !== undefined;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ModuleValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues,
  });

  async function onSubmit(values: ModuleValues) {
    // Les Server Actions redirigent vers l'écran Modules si tout va bien.
    const result = isEdit ? await updateModule(moduleId, values) : await createModule(values);
    if (result?.error) {
      setError("root", { message: result.error });
    }
  }

  // Les couleurs proposées. Si le module a déjà une autre couleur, on la garde en premier.
  const isCustomColor = !MODULE_COLORS.some(
    (color) => color.value.toLowerCase() === defaultValues.color.toLowerCase(),
  );
  const colors = isCustomColor
    ? [{ value: defaultValues.color, label: "Couleur actuelle" }, ...MODULE_COLORS]
    : MODULE_COLORS;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-[760px] rounded-carte bg-blanc p-carte shadow-carte"
    >
      <div className="flex flex-col gap-4">
        <FormField id="name" label="Nom" error={errors.name?.message}>
          <input
            id="name"
            autoFocus
            placeholder="Ex. : Intégrations"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={fieldMessageId("name")}
            className={inputClasses(Boolean(errors.name))}
            {...register("name")}
          />
        </FormField>

        <FormField id="description" label="Description">
          <textarea
            id="description"
            placeholder="Ce que couvre ce module."
            className={textareaClasses()}
            {...register("description")}
          />
        </FormField>

        {/* Couleur : des boutons radio, dessinés comme des pastilles rondes. */}
        <fieldset aria-describedby="color-help">
          <legend className="mb-2 text-libelle">Couleur</legend>
          <div className="flex flex-wrap gap-3 py-1">
            {colors.map((color) => (
              <label key={color.value} title={color.label} className="cursor-pointer">
                {/* Le vrai bouton radio est invisible mais reste utilisable au clavier (flèches). */}
                <input
                  type="radio"
                  value={color.value}
                  aria-label={color.label}
                  className="peer sr-only"
                  {...register("color")}
                />
                {/* La pastille : entourée de noir quand elle est choisie, de rose au clavier. */}
                <span
                  aria-hidden="true"
                  className="block size-9 rounded-full outline-2 outline-offset-4 outline-transparent peer-checked:outline-noir-doux peer-focus-visible:outline-rose-fuchsia"
                  style={{ backgroundColor: color.value }}
                />
              </label>
            ))}
          </div>
          {errors.color ? (
            <p id="color-help" role="alert" className="mt-1 pl-4 text-petit text-rouge-cerise">
              {errors.color.message}
            </p>
          ) : (
            <p id="color-help" className="mt-1 pl-4 text-petit text-gris-texte">
              La pastille s&apos;affiche devant le nom du module partout dans l&apos;app.
            </p>
          )}
        </fieldset>
      </div>

      {errors.root && (
        <p role="alert" className="mt-4 text-petit text-rouge-cerise">
          {errors.root.message}
        </p>
      )}

      <div className="mt-8 flex justify-end gap-2 border-t border-gris-bordure pt-6">
        <Link
          href={withMessage("/modules", isEdit ? "Modification annulée" : "Ajout annulé")}
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
