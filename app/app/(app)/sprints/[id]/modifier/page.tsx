import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { SprintForm } from "@/components/sprints/sprint-form";
import { getSprint } from "@/lib/data/sprints";
import { parseId } from "@/lib/params";
import { sprintSchema } from "@/lib/schemas/sprint";

export const metadata: Metadata = {
  title: "Modifier le sprint · Roadmap",
};

// Écran Modifier le sprint : le même formulaire, déjà rempli, avec le statut en plus.
export default function EditSprintPage({ params }: PageProps<"/sprints/[id]/modifier">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement du sprint…" />}>
        <EditSprint params={params} />
      </Suspense>
    </main>
  );
}

async function EditSprint({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const sprint = id === null ? null : await getSprint(id);
  if (!sprint) {
    notFound();
  }

  return (
    <>
      <PageHeader
        backHref={`/sprints/${sprint.id}`}
        backLabel="Fiche sprint"
        title="Modifier le sprint"
        subtitle={sprint.goal ?? undefined}
      />
      <SprintForm
        sprintId={sprint.id}
        backlog={[]}
        defaultValues={{
          goal: sprint.goal ?? "",
          startDate: sprint.start_date,
          endDate: sprint.end_date,
          // parse() vérifie que le statut de la base est une valeur autorisée.
          status: sprintSchema.shape.status.parse(sprint.status),
          featureIds: [],
        }}
      />
    </>
  );
}
