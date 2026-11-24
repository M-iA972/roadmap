import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus } from "lucide-react";
import { LoadingCard } from "@/components/loading-card";
import { SprintStatusBadge } from "@/components/sprint-status-badge";
import { DeleteSprintButton } from "@/components/sprints/delete-sprint-button";
import { SprintFiltersBar } from "@/components/sprints/sprint-filters";
import { buttonClasses } from "@/lib/button-styles";
import { getSprints } from "@/lib/data/sprints";
import { formatDate } from "@/lib/format";
import { rowControl, stretchedLink } from "@/lib/row-link";
import { parseSprintFilters } from "@/lib/sprints-filters";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sprints · Roadmap",
};

// Écran Sprints : filtres, tri et liste de tous les sprints.
export default function SprintsPage({ searchParams }: PageProps<"/sprints">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <header className="mb-entre-sections flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-titre-page">Sprints</h1>
          <p className="mt-1 text-petit text-gris-texte">
            Tous les sprints, passés, en cours et à venir.
          </p>
        </div>
        <Link href="/sprints/nouveau" className={buttonClasses("principal")}>
          <Plus aria-hidden="true" />
          Nouveau sprint
        </Link>
      </header>

      {/* Les filtres sont dans l'URL : connue seulement à la requête, d'où le <Suspense>. */}
      <Suspense fallback={<LoadingCard label="Chargement des sprints…" />}>
        <SprintsList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// Colonnes du tableau : objectif, début, fin, statut, nombre de features, actions.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,2fr)_150px_150px_140px_100px_232px] md:items-center md:gap-4";

async function SprintsList({ searchParams }: { searchParams: PageProps<"/sprints">["searchParams"] }) {
  const filters = parseSprintFilters(await searchParams);
  const sprints = await getSprints(filters);

  return (
    <>
      <SprintFiltersBar filters={filters} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-titre-section">Liste des sprints</h2>
        <div className="flex items-center gap-2">
          <span className="text-petit text-gris-texte">
            {sprints.length} sprint{sprints.length > 1 ? "s" : ""}
          </span>
          <Link href="/sprints" scroll={false} className={buttonClasses("discret", "petit")}>
            Réinitialiser les filtres
          </Link>
        </div>
      </div>

      {sprints.length === 0 ? (
        <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
          Aucun sprint ne correspond à ces filtres.
        </p>
      ) : (
        <div role="table" aria-label="Sprints" className="flex flex-col gap-entre-lignes">
          <div role="row" className={cn(columns, "hidden px-6 md:grid")}>
            <span role="columnheader" className="text-libelle text-gris-texte">Objectif</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Début</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Fin</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Statut</span>
            <span role="columnheader" className="text-libelle text-gris-texte">Features</span>
            <span role="columnheader" className="sr-only">Actions</span>
          </div>

          {sprints.map((sprint) => {
            const goal = sprint.goal ?? "Sprint sans objectif";
            return (
              <div
                key={sprint.id}
                role="row"
                className={cn(
                  columns,
                  "relative rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
                )}
              >
                <span role="cell">
                  {/* Un clic n'importe où sur la ligne ouvre la fiche sprint. */}
                  <Link href={`/sprints/${sprint.id}`} className={stretchedLink}>
                    {goal}
                  </Link>
                </span>
                <span role="cell" className="text-petit text-gris-texte">{formatDate(sprint.start_date)}</span>
                <span role="cell" className="text-petit text-gris-texte">{formatDate(sprint.end_date)}</span>
                <span role="cell"><SprintStatusBadge status={sprint.status} /></span>
                <span role="cell" className="text-petit text-gris-texte">
                  {sprint.featureCount} feature{sprint.featureCount > 1 ? "s" : ""}
                </span>
                <span role="cell" className="flex gap-1 md:justify-end">
                  <Link
                    href={`/sprints/${sprint.id}/modifier`}
                    className={cn(rowControl, buttonClasses("secondaire", "petit"))}
                  >
                    <Pencil aria-hidden="true" />
                    Modifier
                  </Link>
                  <DeleteSprintButton
                    sprintId={sprint.id}
                    sprintGoal={goal}
                    featureCount={sprint.featureCount}
                    className={rowControl}
                  />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
