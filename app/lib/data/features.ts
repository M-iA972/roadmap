// Lecture des features pour le tableau du Dashboard.
// Ce fichier tourne uniquement côté serveur (il utilise le client serveur).
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

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

export async function getDashboardFeatures(): Promise<DashboardFeature[]> {
  const supabase = await createClient();

  // On lance les deux requêtes en même temps avec Promise.all.
  const [featuresResult, sprintsResult] = await Promise.all([
    // 1. Les features, avec leur module et la personne assignée.
    //    « modules(...) » et « profiles(...) » demandent à Supabase de faire
    //    la jointure en base, grâce aux clés étrangères module_id et assigned_to.
    supabase
      .from("features")
      .select(
        `id, title, sprint_id,
         modules ( id, name, color ),
         profiles ( id, firstname, lastname, email, avatar_url )`,
      )
      .order("created_at", { ascending: false }),

    // 2. Les sprints. La colonne features.sprint_id n'a pas de clé étrangère
    //    vers sprints : Supabase ne peut donc pas faire cette jointure.
    //    On lit les sprints à part et on les relie ci-dessous.
    supabase.from("sprints").select("id, goal"),
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
