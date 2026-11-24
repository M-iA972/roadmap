// Server Action du profil : « Modifier mon profil ».
// On ne peut modifier que son propre profil : l'id vient de la session, jamais du navigateur.
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/server";

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
  const avatarFolder = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`;
  if (avatarUrl !== null && !avatarUrl.startsWith(avatarFolder)) {
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

  const { error } = await supabase
    .from("profiles")
    .update({
      firstname,
      lastname,
      email,
      // Sans nouvelle photo, on ne touche pas à la colonne avatar_url.
      ...(avatarUrl !== null && { avatar_url: avatarUrl }),
    })
    .eq("id", user.id);

  // 23505 : la colonne profiles.email est unique.
  if (error?.code === "23505") {
    return { error: "Cet email est déjà utilisé par un autre membre." };
  }
  if (error) {
    return { error: "Le profil n'a pas pu être modifié. Réessayez." };
  }

  // Le nom et la photo apparaissent partout (menu, tableaux…) : on rafraîchit toutes les pages.
  revalidatePath("/", "layout");
  return {
    message: emailChanged
      ? "Profil modifié : confirmez le nouvel email avec le lien reçu"
      : "Profil modifié",
  };
}
