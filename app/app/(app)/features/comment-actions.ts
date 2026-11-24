// Server Actions des commentaires : envoyer, modifier, supprimer.
// On ne peut modifier ou supprimer que ses propres commentaires :
// c'est vérifié ici, sur le serveur, et pas seulement en cachant les boutons.
"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import { commentSchema } from "@/lib/schemas/comment";
import { createClient } from "@/lib/supabase/server";

// Envoyer un commentaire sur une feature. L'auteur est la personne connectée.
export async function addComment(featureId: number, values: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Écrivez un commentaire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    feature_id: featureId,
    author_id: user.id,
    content: parsed.data.content,
  });

  if (error) {
    return { error: "Le commentaire n'a pas pu être envoyé. Réessayez." };
  }
  revalidatePath(`/features/${featureId}`);
}

// Vérifie que le commentaire existe et appartient à la personne connectée.
// Renvoie l'id de sa feature (pour rafraîchir la bonne page), ou null.
async function getOwnCommentFeatureId(commentId: number, userId: string): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("feature_id, author_id")
    .eq("id", commentId)
    .maybeSingle();

  if (!data || data.author_id !== userId) {
    return null;
  }
  return data.feature_id;
}

// Modifier le texte d'un de ses commentaires.
export async function updateComment(commentId: number, values: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Écrivez un commentaire." };
  }

  const featureId = await getOwnCommentFeatureId(commentId, user.id);
  if (featureId === null) {
    return { error: "Vous ne pouvez modifier que vos propres commentaires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .update({ content: parsed.data.content })
    .eq("id", commentId)
    .eq("author_id", user.id); // double sécurité : seulement si on en est l'auteur

  if (error) {
    return { error: "Le commentaire n'a pas pu être modifié. Réessayez." };
  }
  revalidatePath(`/features/${featureId}`);
}

// Supprimer un de ses commentaires.
export async function deleteComment(commentId: number): Promise<ActionResult> {
  const user = await getCurrentUser();

  const featureId = await getOwnCommentFeatureId(commentId, user.id);
  if (featureId === null) {
    return { error: "Vous ne pouvez supprimer que vos propres commentaires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) {
    return { error: "Le commentaire n'a pas pu être supprimé. Réessayez." };
  }
  revalidatePath(`/features/${featureId}`);
}
