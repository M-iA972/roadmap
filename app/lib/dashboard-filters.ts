// Filtres et page du tableau des features du Dashboard.
// Ils sont rangés dans l'URL : /?filter=backlog&module=3&status=todo&page=2
// Avantage : le serveur les lit pour filtrer en base, et on peut partager le lien.

// « all » = toutes, « sprint » = en sprint, « backlog » = sans sprint.
export type DashboardScope = "all" | "sprint" | "backlog";

export type DashboardFilters = {
  scope: DashboardScope;
  moduleId: number | null; // null = tous les modules
  sprintId: number | null; // null = tous les sprints
  status: string | null; // valeur de features.status, null = tous les statuts
  page: number; // numéro de page, à partir de 1
};

// Nombre de features par page.
export const PAGE_SIZE = 10;

// Statuts acceptés dans l'URL (contrainte CHECK de features.status).
const STATUS_VALUES = ["backlog", "todo", "in_progress", "done", "cancelled"];

// Les paramètres d'URL tels que Next.js les donne à une page.
type SearchParams = { [key: string]: string | string[] | undefined };

// Un entier positif lu dans l'URL, ou null (Number("abc") donne NaN).
function positiveInteger(value: string | string[] | undefined): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

// Lit les filtres dans l'URL. Une valeur inconnue revient au filtre par défaut.
export function parseDashboardFilters(searchParams: SearchParams): DashboardFilters {
  const filter = searchParams.filter;
  const scope: DashboardScope =
    filter === "sprint" || filter === "backlog" ? filter : "all";

  const status = searchParams.status;

  return {
    scope,
    moduleId: positiveInteger(searchParams.module),
    sprintId: positiveInteger(searchParams.sprint),
    status: typeof status === "string" && STATUS_VALUES.includes(status) ? status : null,
    page: positiveInteger(searchParams.page) ?? 1,
  };
}

// Construit l'adresse du Dashboard pour un jeu de filtres.
// Les valeurs par défaut ne sont pas écrites dans l'URL, pour qu'elle reste courte.
export function dashboardHref(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.scope !== "all") params.set("filter", filters.scope);
  if (filters.moduleId !== null) params.set("module", String(filters.moduleId));
  if (filters.sprintId !== null) params.set("sprint", String(filters.sprintId));
  if (filters.status !== null) params.set("status", filters.status);
  if (filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

// Adresse du Dashboard après le changement d'un filtre.
// On revient toujours à la page 1 : l'ancienne page n'existe peut-être plus.
export function changeFilter(filters: DashboardFilters, change: Partial<DashboardFilters>): string {
  return dashboardHref({ ...filters, ...change, page: 1 });
}
