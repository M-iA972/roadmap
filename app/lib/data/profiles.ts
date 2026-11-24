// Lecture des membres de l'équipe (table profiles). Côté serveur uniquement.
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Member = Pick<
  Tables<"profiles">,
  "id" | "firstname" | "lastname" | "email" | "avatar_url"
>;

// Tous les membres, triés par prénom (pour les listes « Personne assignée »).
export async function getMembers(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, avatar_url")
    .order("firstname");

  if (error) {
    throw new Error(`Impossible de lire l'équipe : ${error.message}`);
  }
  return data;
}
