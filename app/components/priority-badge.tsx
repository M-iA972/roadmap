import { ArrowDown, ArrowRight, ArrowUp, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Les 5 priorités autorisées par la base (contrainte CHECK de features.priority),
// avec leur libellé, leur icône et leurs couleurs (docs/design-system.md).
const PRIORITIES: Record<string, { label: string; icon: LucideIcon; className: string }> = {
  critical: { label: "Critique", icon: Zap, className: "bg-priorite-critique text-priorite-critique-texte" },
  high: { label: "Haute", icon: ArrowUp, className: "bg-priorite-haute text-priorite-haute-texte" },
  medium: { label: "Moyenne", icon: ArrowRight, className: "bg-priorite-moyenne text-priorite-moyenne-texte" },
  low: { label: "Basse", icon: ArrowDown, className: "bg-priorite-basse text-priorite-basse-texte" },
  nice_to_have: { label: "Bonus", icon: Sparkles, className: "bg-priorite-bonus text-priorite-bonus-texte" },
};

type PriorityBadgeProps = {
  priority: string; // valeur de la colonne features.priority
};

// Badge de priorité : pilule colorée, petite icône puis libellé.
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITIES[priority];

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
      {config.label}
    </span>
  );
}
