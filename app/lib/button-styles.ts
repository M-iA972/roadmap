import { cn } from "@/lib/utils";

// Classes des boutons du design system, à appliquer à un <button> ou à un <Link>.
// Exemple : <Link className={buttonClasses("secondaire")} href="/sprints">…</Link>

const base =
  "inline-flex items-center justify-center gap-2 rounded-pilule border-2 font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-fuchsia";

const variants = {
  // Fond rose fuchsia, texte blanc. Survol : rose plus foncé.
  principal:
    "border-transparent bg-rose-fuchsia text-blanc hover:bg-rose-fuchsia-fonce",
  // Fond blanc, bordure et texte violets. Survol : fond violet très clair.
  secondaire:
    "border-violet-electrique bg-blanc text-violet-electrique hover:bg-violet-tres-clair",
  // Sans fond, texte gris, souligné au survol (Annuler, Retour).
  discret: "border-transparent bg-transparent text-gris-texte hover:underline",
};

const sizes = {
  normal: "px-6 py-3 [&_svg]:size-4",
  petit: "px-4 py-2 text-[13px] [&_svg]:size-4",
};

export function buttonClasses(
  variant: keyof typeof variants,
  size: keyof typeof sizes = "normal",
): string {
  return cn(base, variants[variant], sizes[size]);
}
