import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { SprintForm } from "@/components/sprints/sprint-form";
import { getBacklogFeatures } from "@/lib/data/features";

export const metadata: Metadata = {
  title: "Nouveau sprint · Roadmap",
};

// Écran Nouveau sprint.
export default function NewSprintPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <PageHeader
        backHref="/sprints"
        backLabel="Sprints"
        title="Nouveau sprint"
        subtitle="Fixez un objectif clair et des dates."
      />
      <Suspense fallback={<LoadingCard label="Chargement du formulaire…" />}>
        <NewSprint />
      </Suspense>
    </main>
  );
}

// Lit les features du backlog (à cocher) puis affiche le formulaire vide.
async function NewSprint() {
  const backlog = await getBacklogFeatures();
  return (
    <SprintForm
      backlog={backlog}
      defaultValues={{ goal: "", startDate: "", endDate: "", status: "planned", featureIds: [] }}
    />
  );
}
