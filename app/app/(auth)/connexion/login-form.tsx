// Composant client : react-hook-form suit la saisie et affiche les erreurs
// sous les champs pendant que l'on tape, ce qui demande du state dans le navigateur.
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, fieldMessageId } from "@/components/form-field";
import { buttonClasses } from "@/lib/button-styles";
import { inputClasses } from "@/lib/form-styles";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import { login } from "../actions";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema), // les règles de lib/schemas/auth.ts
    defaultValues: { email: "", password: "" },
  });

  // Appelée seulement si les champs sont valides.
  async function onSubmit(values: LoginValues) {
    const result = await login(values); // Server Action : redirige vers le Dashboard si tout va bien
    if (result?.error) {
      // « root » : une erreur qui concerne tout le formulaire, pas un seul champ.
      setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
      <FormField id="email" label="Email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="username"
          autoFocus
          placeholder="prenom.nom@roadmap.app"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={fieldMessageId("email")}
          className={inputClasses(Boolean(errors.email))}
          {...register("email")}
        />
      </FormField>

      <FormField id="password" label="Mot de passe" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
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
        {isSubmitting ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
