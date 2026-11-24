import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus } from "lucide-react";
import { LoadingCard } from "@/components/loading-card";
import { DeleteModuleButton } from "@/components/modules/delete-module-button";
import { buttonClasses } from "@/lib/button-styles";
import { getModulesWithFeatureCount } from "@/lib/data/modules";
import { rowControl, stretchedLink } from "@/lib/row-link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Modules · Roadmap",
};

// Écran Modules : la liste des modules.
export default function ModulesPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <header className="mb-entre-sections flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-titre-page">Modules</h1>
          <p className="mt-1 text-petit text-gris-texte">Les grandes zones fonctionnelles de l&apos;app.</p>
        </div>
        <Link href="/modules/nouveau" className={buttonClasses("principal")}>
          <Plus aria-hidden="true" />
          Nouveau module
        </Link>
      </header>

      <Suspense fallback={<LoadingCard label="Chargement des modules…" />}>
        <ModulesList />
      </Suspense>
    </main>
  );
}

// Colonnes : couleur, nom, description, nombre de features, actions.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[48px_minmax(0,1fr)_minmax(0,2.2fr)_110px_232px] md:items-center md:gap-4";

async function ModulesList() {
  const modules = await getModulesWithFeatureCount();

  if (modules.length === 0) {
    return (
      <p className="rounded-carte bg-blanc p-carte text-center text-gris-texte">
        Aucun module pour le moment.
      </p>
    );
  }

  return (
    <div role="table" aria-label="Modules" className="flex flex-col gap-entre-lignes">
      <div role="row" className={cn(columns, "hidden px-6 md:grid")}>
        <span role="columnheader" className="text-libelle text-gris-texte">Couleur</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Nom</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Description</span>
        <span role="columnheader" className="text-libelle text-gris-texte">Features</span>
        <span role="columnheader" className="sr-only">Actions</span>
      </div>

      {modules.map((module) => (
        <div
          key={module.id}
          role="row"
          className={cn(
            columns,
            "relative rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
          )}
        >
          <span role="cell">
            <span
              aria-hidden="true"
              className="block size-5 rounded-full"
              style={{ backgroundColor: module.color }}
            />
          </span>
          <span role="cell">
            {/* Un clic n'importe où sur la ligne ouvre la fiche module. */}
            <Link href={`/modules/${module.id}`} className={stretchedLink}>
              {module.name}
            </Link>
          </span>
          <span role="cell" className="text-petit text-gris-texte">
            {module.description ?? "—"}
          </span>
          <span role="cell" className="text-petit text-gris-texte">
            {module.featureCount} feature{module.featureCount > 1 ? "s" : ""}
          </span>
          <span role="cell" className="flex gap-1 md:justify-end">
            <Link
              href={`/modules/${module.id}/modifier`}
              className={cn(rowControl, buttonClasses("secondaire", "petit"))}
            >
              <Pencil aria-hidden="true" />
              Modifier
            </Link>
            <DeleteModuleButton
              moduleId={module.id}
              moduleName={module.name}
              featureCount={module.featureCount}
              className={rowControl}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
