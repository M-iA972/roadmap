import type { Metadata } from "next";
import { Suspense } from "react";
import { FeaturesTable } from "@/components/features-table";
import { getDashboardFeatures } from "@/lib/data/features";

export const metadata: Metadata = {
  title: "Dashboard · Roadmap",
};

// Partie qui lit la base. Elle est asynchrone et dépend de la requête (cookies),
// donc elle s'affiche dans un <Suspense> : le reste de la page s'affiche tout de suite.
async function DashboardFeatures() {
  const features = await getDashboardFeatures();

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-titre-section">Features</h2>
        <span className="text-petit text-gris-texte">
          {features.length} feature{features.length > 1 ? "s" : ""}
        </span>
      </div>
      <FeaturesTable features={features} />
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <header className="mb-entre-sections">
        <h1 className="text-titre-page">Dashboard</h1>
        <p className="mt-1 text-petit text-gris-texte">
          Toutes les features de la roadmap, en sprint ou dans le backlog.
        </p>
      </header>

      <section aria-label="Features">
        <Suspense
          fallback={<p className="text-petit text-gris-texte">Chargement des features…</p>}
        >
          <DashboardFeatures />
        </Suspense>
      </section>
    </main>
  );
}
