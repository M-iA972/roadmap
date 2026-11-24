import { ArrowDown, ArrowRight, ArrowUp, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { labelOf, PRIORITIES } from "@/lib/labels";
import { cn } from "@/lib/utils";

// L'icône et les couleurs de chaque priorité (docs/design-system.md).
// Les libellés viennent de lib/labels.ts.
const PRIORITY_STYLES: Record<string, { icon: LucideIcon; className: string }> = {
  critical: { icon: Zap, className: "bg-priorite-critique text-priorite-critique-texte" },
  high: { icon: ArrowUp, className: "bg-priorite-haute text-priorite-haute-texte" },
  medium: { icon: ArrowRight, className: "bg-priorite-moyenne text-priorite-moyenne-texte" },
  low: { icon: ArrowDown, className: "bg-priorite-basse text-priorite-basse-texte" },
  nice_to_have: { icon: Sparkles, className: "bg-priorite-bonus text-priorite-bonus-texte" },
};

type PriorityBadgeProps = {
  priority: string; // valeur de la colonne features.priority
};

// Badge de priorité : pilule colorée, petite icône puis libellé.
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_STYLES[priority];

  // Valeur inattendue : on l'affiche telle quelle plutôt que de planter.
  if (!config) {
    return <span className="text-libelle text-gris-texte">{priority}</span>;
  }

  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-pilule px-3 py-1 text-libelle",
        config.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3" strokeWidth={2.5} />
      {labelOf(PRIORITIES, priority)}
    </span>
  );
}
