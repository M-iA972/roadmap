import Link from "next/link";
import { Pencil } from "lucide-react";
import { Avatar, getFullName } from "@/components/avatar";
import { DeleteFeatureButton } from "@/components/features/delete-feature-button";
import { ModuleBadge } from "@/components/module-badge";
import { buttonClasses } from "@/lib/button-styles";
import type { DashboardFeature } from "@/lib/data/features";
import { rowControl, stretchedLink } from "@/lib/row-link";
import { cn } from "@/lib/utils";

type FeaturesTableProps = {
  features: DashboardFeature[];
  backlogHref: string; // adresse du Dashboard avec le filtre « Backlog »
};

// Les 5 colonnes du tableau (la dernière : Modifier / Supprimer). La même grille sert à l'en-tête et aux lignes
// pour que les colonnes restent alignées. Sur mobile, tout passe sur une colonne.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1.3fr)_232px] md:items-center md:gap-4";

// Tableau des features (design system : chaque ligne est une carte blanche arrondie).
// On utilise des <div> pour la mise en page en grille, avec les rôles ARIA d'un tableau
// pour que les lecteurs d'écran le lisent comme un vrai tableau.
export function FeaturesTable({ features, backlogHref }: FeaturesTableProps) {
  if (features.length === 0) {
    return (
      <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
        Aucune feature ne correspond à ce filtre.
      </p>
    );
  }

  return (
    <div role="table" aria-label="Features" className="flex flex-col gap-entre-lignes">
      {/* En-têtes en petit texte gris, masqués sur mobile */}
      <div role="row" className={cn(columns, "hidden px-6 md:grid")}>
        <span role="columnheader" className="text-libelle text-gris-texte">Feature</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Sprint</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Module</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Assignée</span>
        <span role="columnheader" className="sr-only">Actions</span>
      </div>

      {features.map((feature) => (
        <div
          key={feature.id}
          role="row"
          className={cn(
            columns,
            // relative : le lien du titre s'étire sur toute la ligne (voir lib/row-link.ts).
            "relative rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
          )}
        >
          {/* Un clic n'importe où sur la ligne ouvre la fiche feature. */}
          <span role="cell">
            <Link href={`/features/${feature.id}`} className={stretchedLink}>
              {feature.title}
            </Link>
          </span>

          <span role="cell">
            {feature.sprint ? (
              feature.sprint.goal ?? "Sprint sans objectif"
            ) : (
              // Un clic sur « Backlog » applique le filtre Backlog.
              <Link
                href={backlogHref}
                scroll={false}
                className={cn(rowControl, "font-semibold text-gris-texte hover:underline")}
              >
                Backlog
              </Link>
            )}
          </span>

          <span role="cell">
            <ModuleBadge module={feature.module} />
          </span>

          <span role="cell">
            {feature.assignee ? (
              <span className="inline-flex items-center gap-2 font-semibold">
                <Avatar person={feature.assignee} />
                {getFullName(feature.assignee)}
              </span>
            ) : (
              <span className="text-petit text-gris-texte">Non assignée</span>
            )}
          </span>

          <span role="cell" className="flex gap-1 md:justify-end">
            <Link
              href={`/features/${feature.id}/modifier`}
              className={cn(rowControl, buttonClasses("secondaire", "petit"))}
            >
              <Pencil aria-hidden="true" />
              Modifier
            </Link>
            <DeleteFeatureButton
              featureId={feature.id}
              featureTitle={feature.title}
              className={rowControl}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
