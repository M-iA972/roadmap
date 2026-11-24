import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pencil } from "lucide-react";
import { CommentsSection } from "@/components/comments/comments-section";
import { FeatureStatusBadge } from "@/components/feature-status-badge";
import { AssigneePicker, SprintPicker } from "@/components/features/feature-pickers";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { PriorityBadge } from "@/components/priority-badge";
import { buttonClasses } from "@/lib/button-styles";
import { getFeature } from "@/lib/data/features";
import { getMembers } from "@/lib/data/profiles";
import { getSprintOptions } from "@/lib/data/sprints";
import { EFFORTS, IMPACTS, labelOf } from "@/lib/labels";
import { parseId } from "@/lib/params";

export const metadata: Metadata = {
  title: "Fiche feature · Roadmap",
};

// Écran Fiche feature : toutes les informations d'une feature.
export default function FeaturePage({ params }: PageProps<"/features/[id]">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement de la feature…" />}>
        <FeatureDetail params={params} />
      </Suspense>
    </main>
  );
}

async function FeatureDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const feature = id === null ? null : await getFeature(id);
  if (!feature) {
    notFound();
  }

  // Les listes des deux cases cliquables.
  const [members, sprints] = await Promise.all([getMembers(), getSprintOptions(feature.sprint_id)]);

  return (
    <>
      <PageHeader
        backHref="/"
        backLabel="Dashboard"
        action={
          <Link href={`/features/${feature.id}/modifier`} className={buttonClasses("secondaire")}>
            <Pencil aria-hidden="true" />
            Modifier
          </Link>
        }
      />

      <section className="mb-entre-sections rounded-carte bg-blanc p-carte shadow-carte">
        <p className="text-libelle text-gris-texte">Feature</p>
        <h1 className="mt-2 text-titre-page">{feature.title}</h1>
        {feature.description ? (
          <p className="mt-4 max-w-[760px] whitespace-pre-line">{feature.description}</p>
        ) : (
          <p className="mt-4 text-petit text-gris-texte">Pas de description.</p>
        )}
      </section>

      {/* Les informations, en petites cartes. Sprint et Personne assignée sont cliquables. */}
      <section
        aria-label="Informations de la feature"
        className="mb-entre-sections grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-entre-cartes"
      >
        <Fact label="Priorité">
          <PriorityBadge priority={feature.priority} />
        </Fact>
        <Fact label="Statut">
          <FeatureStatusBadge status={feature.status} />
        </Fact>
        <Fact label="Effort">
          <span className="text-titre-section">{labelOf(EFFORTS, feature.effort)}</span>
        </Fact>
        <Fact label="Utilisateurs impactés">{labelOf(IMPACTS, feature.impact)}</Fact>
        <Fact label="Module">
          <span
            aria-hidden="true"
            className="size-5 shrink-0 rounded-full"
            style={{ backgroundColor: feature.module.color }}
          />
          <Link href={`/modules/${feature.module.id}`} className="text-violet-electrique hover:underline">
            {feature.module.name}
          </Link>
        </Fact>
        <SprintPicker featureId={feature.id} sprint={feature.sprint} sprints={sprints} />
        <AssigneePicker featureId={feature.id} assignee={feature.assignee} members={members} />
      </section>

      {/* Les commentaires chargent à part : la fiche s'affiche sans les attendre. */}
      <Suspense fallback={<LoadingCard label="Chargement des commentaires…" />}>
        <CommentsSection featureId={feature.id} />
      </Suspense>
    </>
  );
}

// Une petite carte d'information : libellé gris, puis la valeur.
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-carte bg-blanc p-4 shadow-carte">
      <p className="mb-2 text-libelle text-gris-texte">{label}</p>
      <div className="flex items-center gap-2 font-semibold">{children}</div>
    </div>
  );
}
