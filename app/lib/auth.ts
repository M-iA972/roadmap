// La personne connectée. Côté serveur uniquement.
// À utiliser dans les Server Components et au début de chaque Server Action :
// une Server Action peut être appelée directement, il faut donc toujours
// revérifier la connexion côté serveur, même si le proxy l'a déjà fait.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type CurrentUser = Pick<
  Tables<"profiles">,
  "id" | "firstname" | "lastname" | "email" | "avatar_url"
>;

// Renvoie le profil de la personne connectée.
// Sans connexion valide, on part sur l'écran Connexion.
export async function getCurrentUser(): Promise<CurrentUser> {
  const supabase = await createClient();

  // getUser() demande au serveur Supabase si la session est valide :
  // on ne fait pas confiance aux seuls cookies du navigateur.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/connexion");
  }

  // Le profil est créé automatiquement à l'inscription par le trigger
  // on_auth_user_created de la base (table profiles, même id que auth.users).
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, avatar_url")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/connexion");
  }
  return profile;
}
