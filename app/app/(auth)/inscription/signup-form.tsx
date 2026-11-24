// Composant client : react-hook-form suit la saisie et affiche les erreurs
// sous les champs pendant que l'on tape, ce qui demande du state dans le navigateur.
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, fieldMessageId } from "@/components/form-field";
import { buttonClasses } from "@/lib/button-styles";
import { inputClasses } from "@/lib/form-styles";
import { signupSchema, type SignupValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { signup } from "../actions";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstname: "", lastname: "", email: "", password: "" },
  });

  async function onSubmit(values: SignupValues) {
    const result = await signup(values); // Server Action : redirige si tout va bien
    if (result?.error) {
      setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
      <FormField id="firstname" label="Prénom" error={errors.firstname?.message}>
        <input
          id="firstname"
          autoComplete="given-name"
          autoFocus
          placeholder="Camille"
          aria-invalid={errors.firstname ? true : undefined}
          aria-describedby={fieldMessageId("firstname")}
          className={inputClasses(Boolean(errors.firstname))}
          {...register("firstname")}
        />
      </FormField>

      <FormField id="lastname" label="Nom" error={errors.lastname?.message}>
        <input
          id="lastname"
          autoComplete="family-name"
          placeholder="Durand"
          aria-invalid={errors.lastname ? true : undefined}
          aria-describedby={fieldMessageId("lastname")}
          className={inputClasses(Boolean(errors.lastname))}
          {...register("lastname")}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="prenom.nom@roadmap.app"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={fieldMessageId("email")}
          className={inputClasses(Boolean(errors.email))}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="password"
        label="Mot de passe"
        help="8 caractères minimum."
        error={errors.password?.message}
      >
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={fieldMessageId("password")}
          className={inputClasses(Boolean(errors.password))}
          {...register("password")}
        />
      </FormField>

      {errors.root && (
        <p role="alert" className="text-petit text-rouge-cerise">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(buttonClasses("principal"), "mt-2 w-full")}
      >
        {isSubmitting ? "Création du compte…" : "Rejoindre l'équipe"}
      </button>
    </form>
  );
}
