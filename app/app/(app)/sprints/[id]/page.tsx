import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Calendar, Pencil } from "lucide-react";
import { FeatureList } from "@/components/feature-list";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { SprintStatusBadge } from "@/components/sprint-status-badge";
import { buttonClasses } from "@/lib/button-styles";
import { getFeatureRows } from "@/lib/data/features";
import { getSprint } from "@/lib/data/sprints";
import { formatDate } from "@/lib/format";
import { parseId } from "@/lib/params";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Fiche sprint · Roadmap",
};

// Écran Fiche sprint : ses informations et la liste de ses features.
export default function SprintPage({ params }: PageProps<"/sprints/[id]">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement du sprint…" />}>
        <SprintDetail params={params} />
      </Suspense>
    </main>
  );
}

async function SprintDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const sprint = id === null ? null : await getSprint(id);
  if (!sprint) {
    notFound();
  }
  const features = await getFeatureRows({ sprintId: sprint.id });
  const isActive = sprint.status === "active";

  return (
    <>
      <PageHeader
        backHref="/sprints"
        backLabel="Tous les sprints"
        action={
          <Link href={`/sprints/${sprint.id}/modifier`} className={buttonClasses("secondaire")}>
            <Pencil aria-hidden="true" />
            Modifier
          </Link>
        }
      />

      {/* Le sprint actif est en carte noire, comme sur le Dashboard. */}
      <section
        className={cn(
          "mb-entre-sections rounded-carte p-carte shadow-carte",
          isActive ? "bg-noir-doux text-blanc" : "bg-blanc",
        )}
      >
        <p className={cn("text-libelle", !isActive && "text-gris-texte")}>Sprint</p>
        <h1 className="mt-2 mb-3 text-titre-page">{sprint.goal ?? "Sprint sans objectif"}</h1>
        <div className="mb-4">
          <SprintStatusBadge status={sprint.status} />
        </div>
        <p className="flex items-center gap-1">
          <Calendar aria-hidden="true" className="size-4" />
          Du <strong>{formatDate(sprint.start_date)}</strong> au <strong>{formatDate(sprint.end_date)}</strong>
        </p>
        <p className={cn("mt-2 text-petit", !isActive && "text-gris-texte")}>
          Créé le {formatDate(sprint.created_at)}
        </p>
      </section>

      <section aria-labelledby="sprint-features-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 id="sprint-features-title" className="text-titre-section">Features du sprint</h2>
          <span className="text-petit text-gris-texte">
            {features.length} feature{features.length > 1 ? "s" : ""}
          </span>
        </div>
        <FeatureList features={features} columns={["module", "assignee", "status", "priority"]} />
      </section>
    </>
  );
}
