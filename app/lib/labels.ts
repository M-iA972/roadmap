// Valeurs autorisées par la base (contraintes CHECK des tables features et sprints)
// et leur libellé en français. Une seule source pour les listes déroulantes et les badges.
// Les mêmes valeurs sont listées dans les schémas zod (lib/schemas/) pour la validation.

// features.status
export const FEATURE_STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminé" },
  { value: "cancelled", label: "Annulé" },
] as const;

// features.priority
export const PRIORITIES = [
  { value: "critical", label: "Critique" },
  { value: "high", label: "Haute" },
  { value: "medium", label: "Moyenne" },
  { value: "low", label: "Basse" },
  { value: "nice_to_have", label: "Bonus" },
] as const;

// features.effort (peut être vide en base)
export const EFFORTS = [
  { value: "xs", label: "XS · très petit" },
  { value: "s", label: "S · petit" },
  { value: "m", label: "M · moyen" },
  { value: "l", label: "L · grand" },
  { value: "xl", label: "XL · très grand" },
] as const;

// features.impact : la part des utilisateurs touchés par la feature
export const IMPACTS = [
  { value: "low", label: "Peu d'utilisateurs" },
  { value: "medium", label: "Une partie des utilisateurs" },
  { value: "high", label: "Beaucoup d'utilisateurs" },
] as const;

// sprints.status
export const SPRINT_STATUSES = [
  { value: "planned", label: "Planification" },
  { value: "active", label: "Actif" },
  { value: "completed", label: "Terminé" },
] as const;

// profiles.role
export const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "Membre" },
] as const;

// Le libellé d'une valeur : labelOf(PRIORITIES, "high") → "Haute".
// Valeur inconnue ou vide : on renvoie la valeur telle quelle (ou « — »).
export function labelOf(list: readonly { value: string; label: string }[], value: string | null): string {
  if (!value) return "—";
  return list.find((item) => item.value === value)?.label ?? value;
}
