// Contrôles et envoi de la photo de profil, côté navigateur (client Supabase public).
// Utilisé par le formulaire « Modifier mon profil » et par l'avatar cliquable.
import { AVATAR_MAX_SIZE } from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/client";

// Types d'image acceptés, avec l'extension du fichier rangé dans le bucket.
const AVATAR_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Valeur de l'attribut accept de l'input fichier : « image/jpeg,image/png,image/webp ».
export const AVATAR_ACCEPT = Object.keys(AVATAR_TYPES).join(",");

// Renvoie un message d'erreur en français, ou null si le fichier est valable.
export function checkAvatarFile(file: File): string | null {
  if (!AVATAR_TYPES[file.type]) return "Choisissez une image JPG, PNG ou WebP.";
  if (file.size > AVATAR_MAX_SIZE) return "La photo doit faire 2 Mo au plus.";
  return null;
}

// Envoie la photo dans avatars/<id>/profile.<extension> et renvoie son adresse publique.
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string } | { error: string }> {
  const problem = checkAvatarFile(file);
  if (problem) return { error: problem };

  const path = `${userId}/profile.${AVATAR_TYPES[file.type]}`;
  const supabase = createClient();

  // upsert: true : si profile.<extension> existe déjà, il est remplacé au lieu de provoquer une erreur.
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) return { error: "La photo n'a pas pu être envoyée. Réessayez." };

  // Le bucket est public : la photo a une adresse lisible par tous.
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Le chemin est le même à chaque envoi : « ?t=<date> » force le navigateur à recharger la nouvelle image.
  return { url: `${data.publicUrl}?t=${Date.now()}` };
}
