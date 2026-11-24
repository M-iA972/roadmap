import Link from "next/link";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type ModuleBadgeProps = {
  module: Pick<Tables<"modules">, "id" | "name" | "color">;
  // Avec link, le badge est un lien vers la fiche module.
  link?: boolean;
  className?: string;
};

// Badge de module : pastille ronde de la couleur du module, puis son nom.
export function ModuleBadge({ module, link = false, className }: ModuleBadgeProps) {
  const classes = cn(
    "inline-flex items-center gap-2 whitespace-nowrap rounded-pilule bg-fond px-3 py-1 text-libelle text-noir-doux",
    link && "transition-colors hover:bg-rose-clair",
    className,
  );
  const content = (
    <>
      {/* La couleur vient de la base : elle ne peut pas être une classe Tailwind
          écrite à l'avance, d'où le style en ligne. */}
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: module.color }}
      />
      {module.name}
    </>
  );

  if (link) {
    return (
      <Link href={`/modules/${module.id}`} className={classes}>
        {content}
      </Link>
    );
  }
  return <span className={classes}>{content}</span>;
}
