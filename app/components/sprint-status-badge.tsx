import { cn } from "@/lib/utils";

// Les 3 statuts autorisés par la base (contrainte CHECK de sprints.status),
// avec leur libellé en français et leurs couleurs (docs/design-system.md).
const SPRINT_STATUSES: Record<string, { label: string; className: string }> = {
  planned: { label: "Planification", className: "bg-sprint-planification text-sprint-planification-texte" },
  active: { label: "Actif", className: "bg-sprint-actif text-sprint-actif-texte" },
  completed: { label: "Terminé", className: "bg-sprint-termine text-sprint-termine-texte" },
};

type SprintStatusBadgeProps = {
  status: string; // valeur de la colonne sprints.status
};

// Badge de statut de sprint : pilule colorée, petit point puis libellé.
export function SprintStatusBadge({ status }: SprintStatusBadgeProps) {
  const config = SPRINT_STATUSES[status] ?? {
    label: status,
    className: "bg-statut-backlog text-statut-backlog-texte",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pilule px-3 py-1 text-libelle",
        config.className,
      )}
    >
      {/* Point de la couleur du texte (bg-current) */}
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
