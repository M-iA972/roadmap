// Règles de validation du formulaire « Modifier mon profil » (zod).
// La photo n'est pas dans ce schéma : c'est un fichier, envoyé à part dans Supabase Storage.
import { z } from "zod";

export const profileSchema = z.object({
  firstname: z.string().trim().min(1, "Saisissez votre prénom."),
  lastname: z.string().trim().min(1, "Saisissez votre nom."),
  email: z.string().trim().pipe(z.email("Saisissez une adresse email valide.")),
});
export type ProfileValues = z.infer<typeof profileSchema>;

// Photo : une image de 2 Mo au plus.
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2 Mo, en octets
