// Lecture des features pour le Dashboard.
// Ce fichier tourne uniquement côté serveur (il utilise le client serveur).
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { PAGE_SIZE, type DashboardFilters } from "@/lib/dashboard-filters";

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

// Une page du tableau principal : ses features, et le nombre total de features filtrées.
export type DashboardFeaturesPage = {
  features: DashboardFeature[];
  total: number;
};

// Features du tableau principal, filtrées et découpées en pages par la base.
export async function getDashboardFeatures(
  filters: DashboardFilters,
): Promise<DashboardFeaturesPage> {
  const supabase = await createClient();

  // 1. Les features, avec leur module et la personne assignée.
  //    « modules(...) » et « profiles(...) » demandent à Supabase de faire
  //    la jointure en base, grâce aux clés étrangères module_id et assigned_to.
  //    count: "exact" demande aussi le nombre total de lignes (pour la pagination).
  let featuresQuery = supabase
    .from("features")
    .select(
      `id, title, sprint_id,
       modules ( id, name, color ),
       profiles ( id, firstname, lastname, email, avatar_url )`,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false }); // départage deux features créées au même moment

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
  if (filters.sprintId !== null) {
    featuresQuery = featuresQuery.eq("sprint_id", filters.sprintId);
  }
  if (filters.status !== null) {
    featuresQuery = featuresQuery.eq("status", filters.status);
  }

  // Pagination : seulement les lignes de la page demandée.
  // Page 1 → lignes 0 à 9, page 2 → lignes 10 à 19… (range inclut les deux bornes).
  const from = (filters.page - 1) * PAGE_SIZE;
  featuresQuery = featuresQuery.range(from, from + PAGE_SIZE - 1);

  // 2. Les sprints. La colonne features.sprint_id n'a pas de clé étrangère
  //    vers sprints : Supabase ne peut donc pas faire cette jointure.
  //    On lit les sprints à part et on les relie ci-dessous.
  const sprintsQuery = supabase.from("sprints").select("id, goal");

  // On lance les deux requêtes en même temps avec Promise.all.
  const [featuresResult, sprintsResult] = await Promise.all([
    featuresQuery,
    sprintsQuery,
  ]);

  // Une page au-delà de la dernière renvoie l'erreur « PGRST103 » : on affiche alors une page vide.
  if (featuresResult.error?.code === "PGRST103") {
    return { features: [], total: 0 };
  }
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
  const features = featuresResult.data.map((feature) => ({
    id: feature.id,
    title: feature.title,
    module: feature.modules,
    assignee: feature.profiles,
    sprint: sprints.find((sprint) => sprint.id === feature.sprint_id) ?? null,
  }));

  return { features, total: featuresResult.count ?? 0 };
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

// Une feature avec toutes ses informations, pour la fiche et le formulaire de modification.
export type FeatureDetail = Tables<"features"> & {
  module: Pick<Tables<"modules">, "id" | "name" | "color">;
  assignee: Pick<
    Tables<"profiles">,
    "id" | "firstname" | "lastname" | "email" | "avatar_url"
  > | null;
  sprint: Pick<Tables<"sprints">, "id" | "goal" | "status"> | null;
};

// Une feature par son id, ou null si elle n'existe pas.
export async function getFeature(id: number): Promise<FeatureDetail | null> {
  const supabase = await createClient();

  // « * » : toutes les colonnes de la feature, puis son module et la personne assignée.
  const { data: feature, error } = await supabase
    .from("features")
    .select(
      `*,
       modules ( id, name, color ),
       profiles ( id, firstname, lastname, email, avatar_url )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de lire la feature : ${error.message}`);
  }
  if (!feature) {
    return null;
  }

  // Pas de clé étrangère entre features.sprint_id et sprints : on lit le sprint à part.
  let sprint: FeatureDetail["sprint"] = null;
  if (feature.sprint_id !== null) {
    const { data } = await supabase
      .from("sprints")
      .select("id, goal, status")
      .eq("id", feature.sprint_id)
      .maybeSingle();
    sprint = data;
  }

  // On retire les objets bruts « modules » et « profiles » pour garder des noms clairs.
  const { modules, profiles, ...columns } = feature;
  return { ...columns, module: modules, assignee: profiles, sprint };
}
