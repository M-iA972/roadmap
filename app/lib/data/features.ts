// Lecture des features pour le Dashboard.
// Ce fichier tourne uniquement côté serveur (il utilise le client serveur).
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import type { DashboardFilters } from "@/lib/dashboard-filters";

// Une ligne du tableau du Dashboard, avec ses informations liées déjà rassemblées.
// Pick<…> reprend exactement les colonnes de la base : aucun champ inventé.
export type DashboardFeature = {
  id: Tables<"features">["id"];
  title: Tables<"features">["title"];
  module: Pick<Tables<"modules">, "id" | "name" | "color">;
  assignee: Pick<
    Tables<"profiles">,
    "id" | "firstname" | "lastname" | "email" | "avatar_url"
  > | null;
  // null = la feature n'a pas de sprint : elle est dans le backlog.
  sprint: Pick<Tables<"sprints">, "id" | "goal"> | null;
};

// Features du tableau principal, filtrées en base selon les filtres de l'URL.
export async function getDashboardFeatures(
  filters: DashboardFilters,
): Promise<DashboardFeature[]> {
  const supabase = await createClient();

  // 1. Les features, avec leur module et la personne assignée.
  //    « modules(...) » et « profiles(...) » demandent à Supabase de faire
  //    la jointure en base, grâce aux clés étrangères module_id et assigned_to.
  let featuresQuery = supabase
    .from("features")
    .select(
      `id, title, sprint_id,
       modules ( id, name, color ),
       profiles ( id, firstname, lastname, email, avatar_url )`,
    )
    .order("created_at", { ascending: false });

  // Les filtres sont ajoutés à la requête : c'est la base qui trie les lignes.
  if (filters.scope === "sprint") {
    featuresQuery = featuresQuery.not("sprint_id", "is", null); // a un sprint
  }
  if (filters.scope === "backlog") {
    featuresQuery = featuresQuery.is("sprint_id", null); // pas de sprint
  }
  if (filters.moduleId !== null) {
    featuresQuery = featuresQuery.eq("module_id", filters.moduleId);
  }

  // 2. Les sprints. La colonne features.sprint_id n'a pas de clé étrangère
  //    vers sprints : Supabase ne peut donc pas faire cette jointure.
  //    On lit les sprints à part et on les relie ci-dessous.
  const sprintsQuery = supabase.from("sprints").select("id, goal");

  // On lance les deux requêtes en même temps avec Promise.all.
  const [featuresResult, sprintsResult] = await Promise.all([
    featuresQuery,
    sprintsQuery,
  ]);

  if (featuresResult.error) {
    throw new Error(
      `Impossible de lire les features : ${featuresResult.error.message}`,
    );
  }
  if (sprintsResult.error) {
    throw new Error(
      `Impossible de lire les sprints : ${sprintsResult.error.message}`,
    );
  }

  const sprints = sprintsResult.data;

  // On transforme chaque ligne reçue en DashboardFeature.
  return featuresResult.data.map((feature) => ({
    id: feature.id,
    title: feature.title,
    module: feature.modules,
    assignee: feature.profiles,
    sprint: sprints.find((sprint) => sprint.id === feature.sprint_id) ?? null,
  }));
}

// Une ligne de la section « Action requise ».
export type ActionRequiredFeature = {
  id: Tables<"features">["id"];
  title: Tables<"features">["title"];
  priority: Tables<"features">["priority"];
  module: Pick<Tables<"modules">, "id" | "name" | "color">;
};

// Features à traiter : dans le backlog (sans sprint) ET sans personne assignée.
export async function getActionRequiredFeatures(): Promise<ActionRequiredFeature[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("features")
    .select("id, title, priority, modules ( id, name, color )")
    .is("sprint_id", null)
    .is("assigned_to", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossible de lire les features à traiter : ${error.message}`);
  }

  return data.map((feature) => ({
    id: feature.id,
    title: feature.title,
    priority: feature.priority,
    module: feature.modules,
  }));
}
