// Filtres et tri de l'écran Sprints, rangés dans l'URL :
// /sprints?status=active&from=2026-11-01&to=2026-12-31&sort=count_desc

export type SprintSort = "date_desc" | "date_asc" | "count_desc" | "count_asc";

export type SprintFilters = {
  status: string | null; // planned, active, completed ; null = tous
  from: string | null; // « Début à partir du » (AAAA-MM-JJ)
  to: string | null; // « Fin au plus tard le » (AAAA-MM-JJ)
  sort: SprintSort;
};

export const SPRINT_SORTS: { value: SprintSort; label: string }[] = [
  { value: "date_desc", label: "Date de début, plus récent" },
  { value: "date_asc", label: "Date de début, plus ancien" },
  { value: "count_desc", label: "Nombre de features, décroissant" },
  { value: "count_asc", label: "Nombre de features, croissant" },
];

// Par défaut : tous les statuts, sans dates, du plus récent au plus ancien.
export const DEFAULT_SPRINT_SORT: SprintSort = "date_desc";

type SearchParams = { [key: string]: string | string[] | undefined };

// Une date « AAAA-MM-JJ » valide, ou null.
function dateOrNull(value: string | string[] | undefined): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

// Lit les filtres dans l'URL. Une valeur inconnue revient à la valeur par défaut.
export function parseSprintFilters(searchParams: SearchParams): SprintFilters {
  const { status, sort } = searchParams;
  return {
    status:
      status === "planned" || status === "active" || status === "completed" ? status : null,
    from: dateOrNull(searchParams.from),
    to: dateOrNull(searchParams.to),
    sort: SPRINT_SORTS.find((option) => option.value === sort)?.value ?? DEFAULT_SPRINT_SORT,
  };
}

// Construit l'adresse de l'écran Sprints pour un jeu de filtres.
export function sprintsHref(filters: SprintFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.sort !== DEFAULT_SPRINT_SORT) params.set("sort", filters.sort);

  const query = params.toString();
  return query ? `/sprints?${query}` : "/sprints";
}
