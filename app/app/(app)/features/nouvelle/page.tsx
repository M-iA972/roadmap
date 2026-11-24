import type { Metadata } from "next";
import { Suspense } from "react";
import { FeatureForm } from "@/components/features/feature-form";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { getModulesWithFeatureCount } from "@/lib/data/modules";
import { getMembers } from "@/lib/data/profiles";
import { getSprintOptions } from "@/lib/data/sprints";

export const metadata: Metadata = {
  title: "Nouvelle feature · Roadmap",
};

// Écran Nouvelle feature.
export default function NewFeaturePage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <PageHeader
        backHref="/"
        backLabel="Dashboard"
        title="Nouvelle feature"
        subtitle="Décrivez l'idée : elle partira dans le backlog."
      />
      <Suspense fallback={<LoadingCard label="Chargement du formulaire…" />}>
        <NewFeatureForm />
      </Suspense>
    </main>
  );
}

// Lit les listes (modules, membres, sprints) puis affiche le formulaire vide.
async function NewFeatureForm() {
  const [modules, members, sprints] = await Promise.all([
    getModulesWithFeatureCount(),
    getMembers(),
    getSprintOptions(),
  ]);

  return (
    <FeatureForm
      modules={modules}
      members={members}
      sprints={sprints}
      defaultValues={{
        title: "",
        description: "",
        priority: "medium",
        effort: "",
        impact: "medium",
        moduleId: "",
        assignedTo: "",
        sprintId: "",
        status: "backlog",
      }}
    />
  );
}
