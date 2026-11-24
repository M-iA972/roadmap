// Règle de validation d'un commentaire (zod) : un texte non vide.
import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Écrivez un commentaire."),
});
export type CommentValues = z.infer<typeof commentSchema>;
