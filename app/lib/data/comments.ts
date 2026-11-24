// Lecture des commentaires d'une feature. Côté serveur uniquement.
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type FeatureComment = Pick<Tables<"comments">, "id" | "content" | "created_at"> & {
  author: Pick<Tables<"profiles">, "id" | "firstname" | "lastname" | "email" | "avatar_url">;
};

// Les commentaires d'une feature, du plus ancien au plus récent, avec leur auteur.
export async function getComments(featureId: number): Promise<FeatureComment[]> {
  const supabase = await createClient();

  // « profiles(...) » : l'auteur, grâce à la clé étrangère comments.author_id.
  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, profiles ( id, firstname, lastname, email, avatar_url )")
    .eq("feature_id", featureId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Impossible de lire les commentaires : ${error.message}`);
  }

  return data.map((comment) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    author: comment.profiles,
  }));
}
