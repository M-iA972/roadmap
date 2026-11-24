import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SprintStatusBadge } from "@/components/sprint-status-badge";
import { buttonClasses } from "@/lib/button-styles";
import { getActiveSprint } from "@/lib/data/sprints";
import { formatDate } from "@/lib/format";

// Section 2 du Dashboard : carte noire du sprint en cours.
// Composant serveur asynchrone : il lit lui-même le sprint actif dans la base.
export async function SprintNowCard() {
  const sprint = await getActiveSprint();

  return (
    <section
      aria-labelledby="sprint-now-title"
      className="flex flex-col rounded-carte bg-noir-doux p-carte text-blanc shadow-carte"
    >
      <p className="text-libelle">Sprint en cours</p>

      {sprint ? (
        <>
          <h2 id="sprint-now-title" className="mt-3 mb-2 text-titre-section">
            {/* Un clic sur le sprint en cours ouvre sa fiche. */}
            <Link href={`/sprints/${sprint.id}`} className="hover:underline">
              {sprint.goal ?? "Sprint sans objectif"}
            </Link>
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <SprintStatusBadge status={sprint.status} />
            <span className="inline-flex items-center gap-1 text-petit">
              <Calendar aria-hidden="true" className="size-4" />
              Du {formatDate(sprint.start_date)} au {formatDate(sprint.end_date)}
            </span>
          </div>
        </>
      ) : (
        <h2 id="sprint-now-title" className="mt-3 mb-4 text-titre-section">
          Aucun sprint actif pour le moment
        </h2>
      )}

      <div className="mt-auto flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {sprint && <SprintProgress done={sprint.doneCount} total={sprint.featureCount} />}
        <Link href="/sprints" className={buttonClasses("secondaire")}>
          Tous les sprints
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

// Barre de progression : part des features terminées dans le sprint.
function SprintProgress({ done, total }: { done: number; total: number }) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex-1 md:max-w-[360px]">
      <p className="text-petit">
        {done} / {total} features terminées
      </p>
      <div
        role="progressbar"
        aria-label="Progression du sprint"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2 overflow-hidden rounded-pilule bg-gris-texte"
      >
        {/* La largeur dépend des données : style en ligne */}
        <div className="h-full rounded-pilule bg-turquoise" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
