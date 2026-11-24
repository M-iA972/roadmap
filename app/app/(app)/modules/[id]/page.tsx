import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pencil } from "lucide-react";
import { FeatureList } from "@/components/feature-list";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { buttonClasses } from "@/lib/button-styles";
import { getFeatureRows } from "@/lib/data/features";
import { getModule } from "@/lib/data/modules";
import { formatDate } from "@/lib/format";
import { parseId } from "@/lib/params";

export const metadata: Metadata = {
  title: "Fiche module · Roadmap",
};

// Écran Fiche module : ses informations et la liste de ses features.
export default function ModulePage({ params }: PageProps<"/modules/[id]">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement du module…" />}>
        <ModuleDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ModuleDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const moduleData = id === null ? null : await getModule(id);
  if (!moduleData) {
    notFound();
  }
  const features = await getFeatureRows({ moduleId: moduleData.id });

  return (
    <>
      <PageHeader
        backHref="/modules"
        backLabel="Tous les modules"
        action={
          <Link href={`/modules/${moduleData.id}/modifier`} className={buttonClasses("secondaire")}>
            <Pencil aria-hidden="true" />
            Modifier
          </Link>
        }
      />

      <section className="mb-entre-sections rounded-carte bg-blanc p-carte shadow-carte">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          {/* Grande pastille de la couleur du module */}
          <span
            aria-hidden="true"
            className="size-12 shrink-0 rounded-full"
            style={{ backgroundColor: moduleData.color }}
          />
          <div>
            <h1 className="mb-2 text-titre-page">{moduleData.name}</h1>
            <p className="text-petit text-gris-texte">Créé le {formatDate(moduleData.created_at)}</p>
          </div>
        </div>
        {moduleData.description && <p className="mt-4 max-w-[760px]">{moduleData.description}</p>}
      </section>

      <section aria-labelledby="module-features-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 id="module-features-title" className="text-titre-section">Features du module</h2>
          <span className="text-petit text-gris-texte">
            {features.length} feature{features.length > 1 ? "s" : ""}
          </span>
        </div>
        <FeatureList features={features} columns={["sprint", "status", "priority"]} />
      </section>
    </>
  );
}
