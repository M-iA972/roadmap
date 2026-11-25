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

export type MemberWithCount = Member & { featureCount: number };

// Les membres de l'écran Équipe, avec leur nombre de features assignées.
export async function getMembersWithFeatureCount(): Promise<MemberWithCount[]> {
  const supabase = await createClient();

  // « features(count) » : la base compte les features de chaque personne
  // grâce à la clé étrangère features.assigned_to, sans les télécharger.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, avatar_url, features(count)")
    .order("firstname");

  if (error) {
    throw new Error(`Impossible de lire l'équipe : ${error.message}`);
  }

  return data.map(({ features, ...member }) => ({
    ...member,
    featureCount: features[0]?.count ?? 0,
  }));
}

// Un membre avec son rôle (« admin » ou « user »), pour la fiche profil.
export type MemberDetail = Member & Pick<Tables<"profiles">, "role">;

// Un membre par son id, ou null s'il n'existe pas.
export async function getMember(id: string): Promise<MemberDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, firstname, lastname, email, avatar_url, role")
    .eq("id", id)
    .maybeSingle();

  // Un id qui n'a pas la forme d'un uuid fait une erreur « 22P02 » : on le traite comme introuvable.
  if (error?.code === "22P02") {
    return null;
  }
  if (error) {
    throw new Error(`Impossible de lire le profil : ${error.message}`);
  }
  return data;
}
