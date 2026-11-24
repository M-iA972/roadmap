import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type AvatarProps = {
  person: Pick<Tables<"profiles">, "firstname" | "lastname" | "email" | "avatar_url">;
  // « normal » : 32 px (tableaux, menu). « grand » : 64 px (fiche profil).
  size?: "normal" | "grand";
};

// Initiales affichées quand la personne n'a pas de photo (ex. « Léa Martin » → « LM »).
// firstname et lastname peuvent être vides en base : on se rabat sur l'email.
function getInitials(person: AvatarProps["person"]): string {
  const initials = `${person.firstname?.[0] ?? ""}${person.lastname?.[0] ?? ""}`;
  return (initials || person.email[0]).toUpperCase();
}

// Avatar rond avec un contour blanc.
// Il est décoratif (aria-hidden) : le nom de la personne est toujours écrit à côté.
export function Avatar({ person, size = "normal" }: AvatarProps) {
  const sizeClasses = size === "grand" ? "size-16 text-[20px]" : "size-8 text-[13px]";

  if (person.avatar_url) {
    return (
      <span
        aria-hidden="true"
        className={cn("shrink-0 rounded-full border-2 border-blanc bg-cover bg-center", sizeClasses)}
        style={{ backgroundImage: `url("${person.avatar_url}")` }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-blanc bg-violet-clair font-bold text-violet-clair-texte",
        sizeClasses,
      )}
    >
      {getInitials(person)}
    </span>
  );
}

// Nom affiché d'une personne : « Prénom Nom », ou l'email si le nom est vide.
export function getFullName(person: AvatarProps["person"]): string {
  const name = [person.firstname, person.lastname].filter(Boolean).join(" ");
  return name || person.email;
}
