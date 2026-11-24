import { labelOf, SPRINT_STATUSES } from "@/lib/labels";
import { cn } from "@/lib/utils";

// Les couleurs de chaque statut de sprint (docs/design-system.md).
// Les libellés viennent de lib/labels.ts.
const SPRINT_STATUS_STYLES: Record<string, string> = {
  planned: "bg-sprint-planification text-sprint-planification-texte",
  active: "bg-sprint-actif text-sprint-actif-texte",
  completed: "bg-sprint-termine text-sprint-termine-texte",
};

type SprintStatusBadgeProps = {
  status: string; // valeur de la colonne sprints.status
};

// Badge de statut de sprint : pilule colorée, petit point puis libellé.
export function SprintStatusBadge({ status }: SprintStatusBadgeProps) {
  // Valeur inattendue : couleurs du statut « Backlog ».
  const className = SPRINT_STATUS_STYLES[status] ?? "bg-statut-backlog text-statut-backlog-texte";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pilule px-3 py-1 text-libelle",
        className,
      )}
    >
      {/* Point de la couleur du texte (bg-current) */}
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {labelOf(SPRINT_STATUSES, status)}
    </span>
  );
}
