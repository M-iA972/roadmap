// Lecture des sprints. Côté serveur uniquement.
import { createClient } from "@/lib/supabase/server";
import type { SprintFilters } from "@/lib/sprints-filters";
import type { Tables } from "@/lib/supabase/database.types";

export type ActiveSprint = Pick<
  Tables<"sprints">,
  "id" | "goal" | "start_date" | "end_date" | "status"
> & {
  featureCount: number; // nombre de features du sprint
  doneCount: number; // dont terminées (statut « done »)
};

// Le sprint en cours (statut « active »), avec sa progression.
// Renvoie null s'il n'y a aucun sprint actif.
export async function getActiveSprint(): Promise<ActiveSprint | null> {
  const supabase = await createClient();

  // S'il y avait plusieurs sprints actifs, on prend celui qui a commencé le plus récemment.
  const { data: sprint, error } = await supabase
    .from("sprints")
    .select("id, goal, start_date, end_date, status")
    .eq("status", "active")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle(); // un seul objet, ou null si aucun résultat

  if (error) {
    throw new Error(`Impossible de lire le sprint en cours : ${error.message}`);
  }
  if (!sprint) {
    return null;
  }

  // Les statuts des features du sprint, pour calculer la progression.
  const { data: features, error: featuresError } = await supabase
    .from("features")
    .select("status")
    .eq("sprint_id", sprint.id);

  if (featuresError) {
    throw new Error(
      `Impossible de lire les features du sprint : ${featuresError.message}`,
    );
  }

  return {
    ...sprint,
    featureCount: features.length,
    doneCount: features.filter((feature) => feature.status === "done").length,
  };
}

export type SprintOption = Pick<Tables<"sprints">, "id" | "goal" | "status">;

// Sprints proposés dans les listes « Sprint » : ceux en planification ou actifs.
// includeId : un sprint à garder dans la liste même s'il est terminé
// (le sprint actuel d'une feature qu'on modifie).
export async function getSprintOptions(includeId: number | null = null): Promise<SprintOption[]> {
  const sprints = await getAllSprintOptions();
  return sprints.filter((sprint) => sprint.status !== "completed" || sprint.id === includeId);
}

// Tous les sprints, même terminés, du plus récent au plus ancien (filtre du Dashboard).
export async function getAllSprintOptions(): Promise<SprintOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sprints")
    .select("id, goal, status")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(`Impossible de lire les sprints : ${error.message}`);
  }
  return data;
}

// Une ligne de l'écran Sprints : le sprint et son nombre de features.
export type SprintListItem = Tables<"sprints"> & { featureCount: number };

// Les sprints de l'écran Sprints, filtrés et triés selon l'URL.
export async function getSprints(filters: SprintFilters): Promise<SprintListItem[]> {
  const supabase = await createClient();

  let sprintsQuery = supabase
    .from("sprints")
    .select("*")
    // Tri par date de début ; pour le tri par nombre de features, voir plus bas.
    .order("start_date", { ascending: filters.sort === "date_asc" });

  if (filters.status) {
    sprintsQuery = sprintsQuery.eq("status", filters.status);
  }
  if (filters.from) {
    sprintsQuery = sprintsQuery.gte("start_date", filters.from); // début à partir du…
  }
  if (filters.to) {
    sprintsQuery = sprintsQuery.lte("end_date", filters.to); // fin au plus tard le…
  }

  // Pas de clé étrangère entre features.sprint_id et sprints : la base ne peut pas
  // compter les features de chaque sprint dans la même requête. On lit à part
  // le sprint_id des features planifiées, et on compte ci-dessous.
  const featuresQuery = supabase.from("features").select("sprint_id").not("sprint_id", "is", null);

  const [sprintsResult, featuresResult] = await Promise.all([sprintsQuery, featuresQuery]);
  if (sprintsResult.error) {
    throw new Error(`Impossible de lire les sprints : ${sprintsResult.error.message}`);
  }
  if (featuresResult.error) {
    throw new Error(`Impossible de lire les features : ${featuresResult.error.message}`);
  }

  const sprints = sprintsResult.data.map((sprint) => ({
    ...sprint,
    featureCount: featuresResult.data.filter((feature) => feature.sprint_id === sprint.id).length,
  }));

  // Tri par nombre de features. À égalité, on garde l'ordre par date (plus récent d'abord).
  if (filters.sort === "count_desc") {
    sprints.sort((a, b) => b.featureCount - a.featureCount);
  }
  if (filters.sort === "count_asc") {
    sprints.sort((a, b) => a.featureCount - b.featureCount);
  }
  return sprints;
}

// Un sprint par son id, ou null s'il n'existe pas.
export async function getSprint(id: number): Promise<Tables<"sprints"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sprints").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Impossible de lire le sprint : ${error.message}`);
  }
  return data;
}
