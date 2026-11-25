// Server Action du profil : « Modifier mon profil ».
// On ne peut modifier que son propre profil : l'id vient de la session, jamais du navigateur.
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/server";

// L'adresse de la photo doit pointer vers le dossier de la personne connectée
// dans le bucket « avatars » : avatars/<son id>/profile.<extension>.
function isMyAvatarUrl(userId: string, avatarUrl: string): boolean {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userId}/profile.`;
  return avatarUrl.startsWith(prefix);
}

// Ce que renvoie l'action : une erreur, ou le message à afficher.
export type ProfileActionResult = { error: string } | { message: string };

// values : prénom, nom, email. avatarUrl : adresse de la nouvelle photo, déjà envoyée
// dans Supabase Storage par le navigateur (ou null si la photo ne change pas).
export async function updateMyProfile(
  values: unknown,
  avatarUrl: string | null,
): Promise<ProfileActionResult> {
  const user = await getCurrentUser();
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const { firstname, lastname, email } = parsed.data;

  // La photo doit être dans le dossier de la personne connectée, dans le bucket « avatars ».
  if (avatarUrl !== null && !isMyAvatarUrl(user.id, avatarUrl)) {
    return { error: "Photo invalide." };
  }

  const supabase = await createClient();
  const emailChanged = email !== user.email;

  // L'email sert aussi à se connecter : on le change dans Supabase Auth.
  // Supabase envoie un lien de confirmation à la nouvelle adresse.
  if (emailChanged) {
    const { error: authError } = await supabase.auth.updateUser({ email });
    if (authError) {
      if (authError.code === "email_exists") {
        return { error: "Cet email est déjà utilisé par un autre compte." };
      }
      return { error: "L'email n'a pas pu être changé. Réessayez." };
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      firstname,
      lastname,
      email,
      // Sans nouvelle photo, on ne touche pas à la colonne avatar_url.
      ...(avatarUrl !== null && { avatar_url: avatarUrl }),
    })
    .eq("id", user.id)
    .select("id");

  // 23505 : la colonne profiles.email est unique.
  if (error?.code === "23505") {
    return { error: "Cet email est déjà utilisé par un autre membre." };
  }
  if (error) {
    return { error: "Le profil n'a pas pu être modifié. Réessayez." };
  }
  // La RLS refuse sans erreur : la base touche alors 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de modifier ce profil." };
  }

  // Le nom et la photo apparaissent partout (menu, tableaux…) : on rafraîchit toutes les pages.
  revalidatePath("/", "layout");
  return {
    message: emailChanged
      ? "Profil modifié : confirmez le nouvel email avec le lien reçu"
      : "Profil modifié",
  };
}

// Changer seulement sa photo (clic sur l'avatar). La photo est déjà envoyée dans Storage
// par le navigateur : ici on enregistre son adresse dans profiles.avatar_url.
export async function updateMyAvatar(avatarUrl: string): Promise<ProfileActionResult> {
  const user = await getCurrentUser(); // l'id vient de la session, jamais du navigateur
  if (!isMyAvatarUrl(user.id, avatarUrl)) {
    return { error: "Photo invalide." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id)
    .select("id");

  if (error) {
    return { error: "La photo n'a pas pu être enregistrée. Réessayez." };
  }
  // La RLS refuse sans erreur : la base touche alors 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de modifier cette photo." };
  }

  revalidatePath("/", "layout");
  return { message: "Photo modifiée" };
}
