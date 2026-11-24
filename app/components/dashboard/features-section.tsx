import Link from "next/link";
import { FeaturesTable } from "@/components/features-table";
import { FilterMenu } from "@/components/filter-menu";
import { Pagination } from "@/components/pagination";
import {
  PAGE_SIZE,
  changeFilter,
  dashboardHref,
  parseDashboardFilters,
  type DashboardScope,
} from "@/lib/dashboard-filters";
import { getDashboardFeatures } from "@/lib/data/features";
import { getModulesWithFeatureCount } from "@/lib/data/modules";
import { getAllSprintOptions } from "@/lib/data/sprints";
import { FEATURE_STATUSES, SPRINT_STATUSES, labelOf } from "@/lib/labels";
import { cn } from "@/lib/utils";

const SCOPES: { value: DashboardScope; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "sprint", label: "En sprint" },
  { value: "backlog", label: "Backlog" },
];

type FeaturesSectionProps = {
  // Paramètres de l'URL, transmis par la page (une promesse dans cette version de Next.js).
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Section 1 du Dashboard : filtres + tableau des features, page par page.
// Les filtres sont lus dans l'URL, puis appliqués dans la requête à la base.
export async function FeaturesSection({ searchParams }: FeaturesSectionProps) {
  const filters = parseDashboardFilters(await searchParams);

  const [{ features, total }, modules, sprints] = await Promise.all([
    getDashboardFeatures(filters),
    getModulesWithFeatureCount(),
    // Tous les sprints, même terminés : on peut vouloir revoir ce qu'ils contenaient.
    getAllSprintOptions(),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section aria-labelledby="features-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 id="features-title" className="text-titre-section">Features</h2>
        <span className="text-petit text-gris-texte">
          {total} feature{total > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filtres : de simples liens. Un clic change l'URL, et le serveur renvoie la liste filtrée. */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {SCOPES.map((scope) => {
          const isActive = filters.scope === scope.value;
          return (
            <Link
              key={scope.value}
              // « Backlog » = sans sprint : on retire le filtre de sprint.
              href={changeFilter(filters, {
                scope: scope.value,
                sprintId: scope.value === "backlog" ? null : filters.sprintId,
              })}
              scroll={false}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "rounded-pilule border-2 px-4 py-2 text-libelle transition-colors",
                isActive
                  ? "border-rose-fuchsia bg-rose-fuchsia text-blanc"
                  : "border-gris-bordure bg-blanc text-noir-doux hover:bg-rose-clair",
              )}
            >
              {scope.label}
            </Link>
          );
        })}

        {/* Trait vertical entre deux groupes de filtres */}
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-gris-bordure" />

        {/* Module : liste qui peut s'allonger, donc avec une recherche */}
        <FilterMenu
          allLabel="Tous les modules"
          allHref={changeFilter(filters, { moduleId: null })}
          searchLabel="Rechercher un module"
          emptyLabel="Aucun module trouvé."
          options={modules.map((module) => ({
            key: String(module.id),
            label: module.name,
            color: module.color,
            count: module.featureCount,
            href: changeFilter(filters, { moduleId: module.id }),
            isSelected: filters.moduleId === module.id,
          }))}
        />

        {/* Sprint : choisir un sprint quitte le filtre « Backlog » */}
        <FilterMenu
          allLabel="Tous les sprints"
          allHref={changeFilter(filters, { sprintId: null })}
          options={sprints.map((sprint) => ({
            key: String(sprint.id),
            label: `${sprint.goal ?? "Sprint sans objectif"} · ${labelOf(SPRINT_STATUSES, sprint.status)}`,
            href: changeFilter(filters, {
              sprintId: sprint.id,
              scope: filters.scope === "backlog" ? "all" : filters.scope,
            }),
            isSelected: filters.sprintId === sprint.id,
          }))}
        />

        {/* Statut : liste courte et fixe, sans recherche */}
        <FilterMenu
          allLabel="Tous les statuts"
          allHref={changeFilter(filters, { status: null })}
          options={FEATURE_STATUSES.map((status) => ({
            key: status.value,
            label: status.label,
            href: changeFilter(filters, { status: status.value }),
            isSelected: filters.status === status.value,
          }))}
        />
      </div>

      {/* Une page au-delà de la dernière (ex. après une suppression) */}
      {features.length === 0 && filters.page > 1 ? (
        <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
          Cette page n&apos;existe pas.{" "}
          <Link href={changeFilter(filters, {})} className="font-semibold text-violet-electrique hover:underline">
            Revenir à la première page
          </Link>
        </p>
      ) : (
        <FeaturesTable
          features={features}
          backlogHref={changeFilter(filters, { scope: "backlog", sprintId: null })}
        />
      )}

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        hrefForPage={(page) => dashboardHref({ ...filters, page })}
      />
    </section>
  );
}
