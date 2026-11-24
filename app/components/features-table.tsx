import { Avatar, getFullName } from "@/components/avatar";
import { ModuleBadge } from "@/components/module-badge";
import type { DashboardFeature } from "@/lib/data/features";
import { cn } from "@/lib/utils";

type FeaturesTableProps = {
  features: DashboardFeature[];
};

// Les 4 colonnes du tableau. La même grille sert à l'en-tête et aux lignes
// pour que les colonnes restent alignées. Sur mobile, tout passe sur une colonne.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1.3fr)] md:items-center md:gap-4";

// Tableau des features (design system : chaque ligne est une carte blanche arrondie).
// On utilise des <div> pour la mise en page en grille, avec les rôles ARIA d'un tableau
// pour que les lecteurs d'écran le lisent comme un vrai tableau.
export function FeaturesTable({ features }: FeaturesTableProps) {
  if (features.length === 0) {
    return (
      <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
        Aucune feature pour le moment.
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
      </div>

      {features.map((feature) => (
        <div
          key={feature.id}
          role="row"
          className={cn(
            columns,
            "rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
          )}
        >
          <span role="cell" className="font-semibold">
            {feature.title}
          </span>

          <span role="cell">
            {feature.sprint ? (
              feature.sprint.goal ?? "Sprint sans objectif"
            ) : (
              <span className="font-semibold text-gris-texte">Backlog</span>
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
        </div>
      ))}
    </div>
  );
}
