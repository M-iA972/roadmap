// Filtres du tableau des features du Dashboard.
// Ils sont rangés dans l'URL : /?filter=backlog&module=3
// Avantage : le serveur les lit pour filtrer en base, et on peut partager le lien.

// « all » = toutes, « sprint » = en sprint, « backlog » = sans sprint.
export type DashboardScope = "all" | "sprint" | "backlog";

export type DashboardFilters = {
  scope: DashboardScope;
  moduleId: number | null; // null = tous les modules
};

// Les paramètres d'URL tels que Next.js les donne à une page.
type SearchParams = { [key: string]: string | string[] | undefined };

// Lit les filtres dans l'URL. Une valeur inconnue revient au filtre par défaut.
export function parseDashboardFilters(searchParams: SearchParams): DashboardFilters {
  const filter = searchParams.filter;
  const scope: DashboardScope =
    filter === "sprint" || filter === "backlog" ? filter : "all";

  const moduleParam = Number(searchParams.module);
  // Number("abc") donne NaN : on vérifie qu'on a bien un entier positif.
  const moduleId =
    Number.isInteger(moduleParam) && moduleParam > 0 ? moduleParam : null;

  return { scope, moduleId };
}

// Construit l'adresse du Dashboard pour un jeu de filtres.
// Les filtres par défaut ne sont pas écrits dans l'URL, pour qu'elle reste courte.
export function dashboardHref(filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.scope !== "all") params.set("filter", filters.scope);
  if (filters.moduleId !== null) params.set("module", String(filters.moduleId));

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
