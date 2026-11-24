import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FeatureForm } from "@/components/features/feature-form";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { getFeature } from "@/lib/data/features";
import { getModulesWithFeatureCount } from "@/lib/data/modules";
import { getMembers } from "@/lib/data/profiles";
import { getSprintOptions } from "@/lib/data/sprints";
import { parseId } from "@/lib/params";
import { featureEditSchema, type FeatureEditValues } from "@/lib/schemas/feature";

export const metadata: Metadata = {
  title: "Modifier la feature · Roadmap",
};

// Écran Modifier la feature : le même formulaire, déjà rempli.
export default function EditFeaturePage({ params }: PageProps<"/features/[id]/modifier">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      {/* L'id est dans l'URL : il n'est connu qu'à la requête, d'où le <Suspense>. */}
      <Suspense fallback={<LoadingCard label="Chargement de la feature…" />}>
        <EditFeature params={params} />
      </Suspense>
    </main>
  );
}

async function EditFeature({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const feature = id === null ? null : await getFeature(id);
  if (!feature) {
    notFound(); // affiche la page 404
  }

  const [modules, members, sprints] = await Promise.all([
    getModulesWithFeatureCount(),
    getMembers(),
    getSprintOptions(feature.sprint_id), // garde le sprint actuel, même terminé
  ]);

  // Les valeurs de la base, converties dans le format du formulaire (texte, "" = aucun).
  // Pour les listes à valeurs fixes, shape.xxx.parse() vérifie que la valeur est autorisée
  // et lui donne le bon type (la base les garantit déjà avec ses contraintes CHECK).
  const { shape } = featureEditSchema;
  const defaultValues: FeatureEditValues = {
    title: feature.title,
    description: feature.description ?? "",
    priority: shape.priority.parse(feature.priority),
    effort: shape.effort.parse(feature.effort ?? ""),
    impact: shape.impact.parse(feature.impact),
    moduleId: String(feature.module_id),
    assignedTo: feature.assigned_to ?? "",
    sprintId: feature.sprint_id === null ? "" : String(feature.sprint_id),
    status: shape.status.parse(feature.status),
  };

  return (
    <>
      <PageHeader
        backHref={`/features/${feature.id}`}
        backLabel="Fiche feature"
        title="Modifier la feature"
        subtitle={feature.title}
      />
      <FeatureForm
        featureId={feature.id}
        defaultValues={defaultValues}
        modules={modules}
        members={members}
        sprints={sprints}
      />
    </>
  );
}
