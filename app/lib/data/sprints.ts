// Lecture des sprints. Côté serveur uniquement.
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sprints")
    .select("id, goal, status")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(`Impossible de lire les sprints : ${error.message}`);
  }
  return data.filter((sprint) => sprint.status !== "completed" || sprint.id === includeId);
}
