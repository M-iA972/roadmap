import { Search } from "lucide-react";
import Link from "next/link";
import type { DashboardFilters } from "@/lib/dashboard-filters";
import { buttonClasses } from "@/lib/button-styles";

type SearchFormProps = {
  filters: DashboardFilters;
  clearHref: string; // adresse du Dashboard sans la recherche
};

// Barre de recherche par titre. C'est un simple formulaire GET : envoyer le formulaire
// recharge le Dashboard avec « ?q=… » dans l'adresse, et le serveur filtre en base.
// Les autres filtres sont renvoyés dans des champs cachés pour ne pas être perdus.
// Pas de champ « page » : une nouvelle recherche repart de la page 1.
export function SearchForm({ filters, clearHref }: SearchFormProps) {
  return (
    <form action="/" role="search" className="mb-4 flex flex-wrap items-center gap-2">
      {filters.scope !== "all" && <input type="hidden" name="filter" value={filters.scope} />}
      {filters.moduleId !== null && <input type="hidden" name="module" value={filters.moduleId} />}
      {filters.sprintId !== null && <input type="hidden" name="sprint" value={filters.sprintId} />}
      {filters.status !== null && <input type="hidden" name="status" value={filters.status} />}

      <div className="relative min-w-[240px] flex-1 md:max-w-[420px]">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gris-texte"
        />
        {/* key : le champ se remplit à nouveau si la recherche change (ex. après « Effacer ») */}
        <input
          key={filters.search}
          type="search"
          name="q"
          defaultValue={filters.search}
          maxLength={100}
          placeholder="Rechercher une feature par titre…"
          aria-label="Rechercher une feature par titre"
          className="w-full rounded-pilule border-2 border-gris-bordure bg-blanc py-3 pr-4 pl-10 outline-none focus:border-rose-fuchsia"
        />
      </div>
      <button type="submit" className={buttonClasses("secondaire", "petit")}>
        Rechercher
      </button>
      {filters.search !== "" && (
        <Link href={clearHref} scroll={false} className={buttonClasses("discret", "petit")}>
          Effacer
        </Link>
      )}
    </form>
  );
}
