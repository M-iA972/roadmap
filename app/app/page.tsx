import type { Metadata } from "next";
import { Suspense } from "react";
import { ActionRequired } from "@/components/dashboard/action-required";
import { FeaturesSection } from "@/components/dashboard/features-section";
import { NewFeatureCard } from "@/components/dashboard/new-feature-card";
import { SprintNowCard } from "@/components/dashboard/sprint-now-card";

export const metadata: Metadata = {
  title: "Dashboard · Roadmap",
};

// Texte affiché pendant qu'une section charge ses données.
function Loading({ label }: { label: string }) {
  return <p className="rounded-carte bg-blanc p-carte text-petit text-gris-texte">{label}</p>;
}

// Page Dashboard. Chaque section qui lit la base est dans un <Suspense> :
// le titre et la carte « Nouvelle feature » s'affichent tout de suite,
// puis chaque section apparaît dès que ses données arrivent.
export default function DashboardPage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <header className="mb-entre-sections">
        <h1 className="text-titre-page">Dashboard</h1>
        <p className="mt-1 text-petit text-gris-texte">
          Toutes les features de la roadmap, en sprint ou dans le backlog.
        </p>
      </header>

      {/* Sections 2 et 3 : sprint en cours (2/3 de la largeur) et nouvelle feature (1/3) */}
      <div className="mb-entre-sections grid grid-cols-1 gap-entre-cartes md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Suspense fallback={<Loading label="Chargement du sprint en cours…" />}>
          <SprintNowCard />
        </Suspense>
        <NewFeatureCard />
      </div>

      {/* Section 4 : action requise */}
      <Suspense fallback={<Loading label="Chargement des features à traiter…" />}>
        <ActionRequired />
      </Suspense>

      {/* Section 1 : filtres et tableau des features */}
      <Suspense fallback={<Loading label="Chargement des features…" />}>
        <FeaturesSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
