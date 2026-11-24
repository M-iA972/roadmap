// Composant client : changer une date ou le tri met à jour l'URL tout de suite
// (sans bouton « Valider »), ce qui demande des événements dans le navigateur.
// Le filtrage lui-même est fait par le serveur, qui relit l'URL.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/form-field";
import { inputClasses, selectClasses } from "@/lib/form-styles";
import { SPRINT_STATUSES } from "@/lib/labels";
import { SPRINT_SORTS, sprintsHref, type SprintFilters, type SprintSort } from "@/lib/sprints-filters";
import { cn } from "@/lib/utils";

// Barre de filtres et de tri de l'écran Sprints.
export function SprintFiltersBar({ filters }: { filters: SprintFilters }) {
  const router = useRouter();

  // Va à l'adresse de l'écran Sprints avec un filtre changé.
  function update(change: Partial<SprintFilters>) {
    router.push(sprintsHref({ ...filters, ...change }), { scroll: false });
  }

  const statusChips = [{ value: null, label: "Tous" }, ...SPRINT_STATUSES];

  return (
    <section
      aria-label="Filtres et tri"
      className="mb-entre-sections flex flex-wrap items-start gap-4 rounded-carte bg-blanc p-carte shadow-carte"
    >
      <div>
        <span className="mb-2 block text-libelle">Statut</span>
        <div className="flex min-h-12 items-center gap-2">
          {statusChips.map((chip) => {
            const isActive = filters.status === chip.value;
            return (
              <Link
                key={chip.label}
                href={sprintsHref({ ...filters, status: chip.value })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-pilule border-2 px-4 py-2 text-libelle transition-colors",
                  isActive
                    ? "border-rose-fuchsia bg-rose-fuchsia text-blanc"
                    : "border-gris-bordure bg-blanc text-noir-doux hover:bg-rose-clair",
                )}
              >
                {chip.label}
              </Link>
            );
          })}
        </div>
      </div>

      <FormField id="from" label="Début à partir du">
        <input
          id="from"
          type="date"
          // key : le champ est recréé quand l'URL change (ex. « Réinitialiser les filtres »).
          key={`from-${filters.from}`}
          defaultValue={filters.from ?? ""}
          onChange={(event) => update({ from: event.target.value || null })}
          className={cn(inputClasses(), "w-[170px]")}
        />
      </FormField>

      <FormField id="to" label="Fin au plus tard le">
        <input
          id="to"
          type="date"
          key={`to-${filters.to}`}
          defaultValue={filters.to ?? ""}
          onChange={(event) => update({ to: event.target.value || null })}
          className={cn(inputClasses(), "w-[170px]")}
        />
      </FormField>

      <FormField id="sort" label="Trier par">
        <select
          id="sort"
          value={filters.sort}
          onChange={(event) => {
            // On retrouve l'option choisie dans la liste, pour garder un type sûr.
            const sort: SprintSort | undefined = SPRINT_SORTS.find(
              (option) => option.value === event.target.value,
            )?.value;
            if (sort) update({ sort });
          }}
          className={selectClasses()}
        >
          {SPRINT_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    </section>
  );
}
