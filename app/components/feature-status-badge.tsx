import { FEATURE_STATUSES, labelOf } from "@/lib/labels";
import { cn } from "@/lib/utils";

// Les couleurs de chaque statut de feature (docs/design-system.md).
// Les libellés viennent de lib/labels.ts.
const STATUS_STYLES: Record<string, string> = {
  backlog: "bg-statut-backlog text-statut-backlog-texte",
  todo: "bg-statut-a-faire text-statut-a-faire-texte",
  in_progress: "bg-statut-en-cours text-statut-en-cours-texte",
  done: "bg-statut-termine text-statut-termine-texte",
  cancelled: "bg-statut-annule text-statut-annule-texte line-through", // texte barré
};

type FeatureStatusBadgeProps = {
  status: string; // valeur de la colonne features.status
};

// Badge de statut de feature : pilule colorée, petit point puis libellé.
export function FeatureStatusBadge({ status }: FeatureStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-pilule px-3 py-1 text-libelle",
        STATUS_STYLES[status] ?? STATUS_STYLES.backlog,
      )}
    >
      {/* Point de la couleur du texte (bg-current) */}
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {labelOf(FEATURE_STATUSES, status)}
    </span>
  );
}
