import Link from "next/link";
import { FeaturesTable } from "@/components/features-table";
import { ModuleFilterMenu } from "@/components/dashboard/module-filter-menu";
import {
  dashboardHref,
  parseDashboardFilters,
  type DashboardScope,
} from "@/lib/dashboard-filters";
import { getDashboardFeatures } from "@/lib/data/features";
import { getModulesWithFeatureCount } from "@/lib/data/modules";
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

// Section 1 du Dashboard : filtres + tableau de toutes les features.
// Les filtres sont lus dans l'URL, puis appliqués dans la requête à la base.
export async function FeaturesSection({ searchParams }: FeaturesSectionProps) {
  const filters = parseDashboardFilters(await searchParams);

  const [features, modules] = await Promise.all([
    getDashboardFeatures(filters),
    getModulesWithFeatureCount(),
  ]);

  return (
    <section aria-labelledby="features-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 id="features-title" className="text-titre-section">Features</h2>
        <span className="text-petit text-gris-texte">
          {features.length} feature{features.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filtres : de simples liens. Un clic change l'URL, et le serveur renvoie la liste filtrée. */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {SCOPES.map((scope) => {
          const isActive = filters.scope === scope.value;
          return (
            <Link
              key={scope.value}
              href={dashboardHref({ ...filters, scope: scope.value })}
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

        {/* Trait vertical entre les deux groupes de filtres */}
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-gris-bordure" />

        <ModuleFilterMenu modules={modules} filters={filters} />
      </div>

      <FeaturesTable
        features={features}
        backlogHref={dashboardHref({ ...filters, scope: "backlog" })}
      />
    </section>
  );
}
