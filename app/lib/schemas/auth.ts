// Règles de validation des formulaires Connexion et Créer mon compte (zod).
// Le même schéma sert deux fois : dans le navigateur (react-hook-form, pour afficher
// les erreurs sous les champs) et dans la Server Action (on ne fait jamais confiance au navigateur).
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Saisissez une adresse email valide.")),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstname: z.string().trim().min(1, "Saisissez votre prénom."),
  lastname: z.string().trim().min(1, "Saisissez votre nom."),
  email: z.string().trim().pipe(z.email("Saisissez une adresse email valide.")),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
});
export type SignupValues = z.infer<typeof signupSchema>;
