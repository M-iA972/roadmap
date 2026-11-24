import type { Tables } from "@/lib/supabase/database.types";

type ModuleBadgeProps = {
  module: Pick<Tables<"modules">, "name" | "color">;
};

// Badge de module : pastille ronde de la couleur du module, puis son nom.
export function ModuleBadge({ module }: ModuleBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-pilule bg-fond px-3 py-1 text-libelle">
      {/* La couleur vient de la base : elle ne peut pas être une classe Tailwind
          écrite à l'avance, d'où le style en ligne. */}
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: module.color }}
      />
      {module.name}
    </span>
  );
}
