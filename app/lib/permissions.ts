// Règles de visibilité des boutons selon le rôle de la personne connectée.
// Ce n'est que du confort : la vraie sécurité est dans la base (RLS).
import type { CurrentUser } from "@/lib/auth";

// Le rôle est « user » ou « admin » (colonne profiles.role).
export function isAdmin(user: Pick<CurrentUser, "role">): boolean {
  return user.role === "admin";
}

// Modifier ou supprimer une feature : un admin, ou la personne à qui elle est assignée.
// assignedTo = features.assigned_to (null si la feature n'est assignée à personne).
export function canEditFeature(user: Pick<CurrentUser, "id" | "role">, assignedTo: string | null): boolean {
  return isAdmin(user) || assignedTo === user.id;
}
