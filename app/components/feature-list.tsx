import Link from "next/link";
import { Avatar, getFullName } from "@/components/avatar";
import { FeatureRowActions } from "@/components/features/feature-row-actions";
import { FeatureStatusBadge } from "@/components/feature-status-badge";
import { ModuleBadge } from "@/components/module-badge";
import { PriorityBadge } from "@/components/priority-badge";
import type { CurrentUser } from "@/lib/auth";
import type { FeatureRow } from "@/lib/data/features";
import { canEditFeature } from "@/lib/permissions";
import { rowControl, stretchedLink } from "@/lib/row-link";
import { cn } from "@/lib/utils";

// Les colonnes possibles, en plus du titre.
type Column = "sprint" | "module" | "assignee" | "status" | "priority";

// Pour chaque colonne : son en-tête, sa largeur dans la grille, et son contenu.
const COLUMNS: Record<Column, { header: string; width: string; cell: (feature: FeatureRow) => React.ReactNode }> = {
  sprint: {
    header: "Sprint",
    width: "minmax(0,1.2fr)",
    cell: (feature) =>
      feature.sprint ? (
        <Link href={`/sprints/${feature.sprint.id}`} className={cn(rowControl, "text-violet-electrique hover:underline")}>
          {feature.sprint.goal ?? "Sprint sans objectif"}
        </Link>
      ) : (
        <span className="font-semibold text-gris-texte">Backlog</span>
      ),
  },
  module: {
    header: "Module",
    width: "minmax(0,1fr)",
    cell: (feature) => <ModuleBadge module={feature.module} link className={rowControl} />,
  },
  assignee: {
    header: "Assignée",
    width: "minmax(0,1.2fr)",
    cell: (feature) =>
      feature.assignee ? (
        <Link
          href={`/equipe/${feature.assignee.id}`}
          className={cn(rowControl, "inline-flex items-center gap-2 font-semibold hover:text-violet-electrique")}
        >
          <Avatar person={feature.assignee} />
          {getFullName(feature.assignee)}
        </Link>
      ) : (
        <span className="text-petit text-gris-texte">Non assignée</span>
      ),
  },
  status: {
    header: "Statut",
    width: "130px",
    cell: (feature) => <FeatureStatusBadge status={feature.status} />,
  },
  priority: {
    header: "Priorité",
    width: "130px",
    cell: (feature) => <PriorityBadge priority={feature.priority} />,
  },
};

type FeatureListProps = {
  features: FeatureRow[];
  columns: Column[]; // ex. ["module", "assignee", "status", "priority"]
  // Si on le donne, chaque ligne ajoute « Modifier » et « Supprimer » (selon canEditFeature).
  currentUser?: Pick<CurrentUser, "id" | "role">;
};

// Liste de features des fiches sprint, module et profil.
// Chaque ligne est une carte blanche ; un clic sur la ligne ouvre la fiche feature.
export function FeatureList({ features, columns, currentUser }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
        Aucune feature pour le moment.
      </p>
    );
  }

  // La grille : le titre (2 parts) puis les colonnes choisies.
  // La largeur dépend des colonnes : style en ligne (variable CSS --cols).
  // Avec currentUser, une dernière colonne de 232 px accueille les boutons.
  const widths = ["minmax(0,2fr)", ...columns.map((column) => COLUMNS[column].width)];
  if (currentUser) widths.push("232px");
  const grid = widths.join(" ");
  // React ne connaît pas les variables CSS : on ajoute « --cols » au type des styles.
  const gridStyle: React.CSSProperties & { "--cols": string } = { "--cols": grid };
  const rowClasses =
    "grid grid-cols-1 gap-2 md:grid-cols-(--cols) md:items-center md:gap-4";

  return (
    <div role="table" aria-label="Features" className="flex flex-col gap-entre-lignes" style={gridStyle}>
      <div role="row" className={cn(rowClasses, "hidden px-6 md:grid")}>
        <span role="columnheader" className="text-libelle text-gris-texte">Feature</span>
        {columns.map((column) => (
          <span key={column} role="columnheader" className="text-libelle text-gris-texte">
            {COLUMNS[column].header}
          </span>
        ))}
        {currentUser && <span role="columnheader" className="sr-only">Actions</span>}
      </div>

      {features.map((feature) => (
        <div
          key={feature.id}
          role="row"
          className={cn(
            rowClasses,
            "relative rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
          )}
        >
          <span role="cell">
            <Link href={`/features/${feature.id}`} className={stretchedLink}>
              {feature.title}
            </Link>
          </span>
          {columns.map((column) => (
            <span key={column} role="cell">
              {COLUMNS[column].cell(feature)}
            </span>
          ))}
          {currentUser && (
            <span role="cell" className="flex gap-1 md:justify-end">
              {canEditFeature(currentUser, feature.assignee?.id ?? null) && (
                <FeatureRowActions featureId={feature.id} featureTitle={feature.title} />
              )}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
