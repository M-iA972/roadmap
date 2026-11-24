import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClasses } from "@/lib/button-styles";

type PageHeaderProps = {
  backHref: string; // page de retour (bouton rond avec la flèche)
  backLabel: string; // ex. « Dashboard », « Tous les sprints »
  title?: string; // titre de la page (formulaires) ; absent sur les fiches
  subtitle?: string;
  action?: React.ReactNode; // bouton à droite (ex. « Modifier »)
};

// En-tête des fiches et des formulaires : bouton retour à gauche, action à droite.
export function PageHeader({ backHref, backLabel, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-entre-sections flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Bouton icône : rond de 44 px, fond blanc, bordure grise */}
        <Link
          href={backHref}
          aria-label={`Retour : ${backLabel}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-gris-bordure bg-blanc transition-colors hover:bg-rose-clair"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        {title ? (
          <div>
            <h1 className="text-titre-page">{title}</h1>
            {subtitle && <p className="mt-1 text-petit text-gris-texte">{subtitle}</p>}
          </div>
        ) : (
          <Link href={backHref} className={buttonClasses("discret")}>
            {backLabel}
          </Link>
        )}
      </div>
      {action}
    </div>
  );
}
