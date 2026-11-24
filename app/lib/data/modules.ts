// Lecture des modules. Côté serveur uniquement.
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type ModuleWithCount = Pick<Tables<"modules">, "id" | "name" | "color"> & {
  featureCount: number;
};

// Tous les modules, triés par nom, avec leur nombre de features.
export async function getModulesWithFeatureCount(): Promise<ModuleWithCount[]> {
  const supabase = await createClient();

  // « features(count) » demande à la base de compter les features de chaque module
  // (grâce à la clé étrangère features.module_id), sans les télécharger.
  const { data, error } = await supabase
    .from("modules")
    .select("id, name, color, features(count)")
    .order("name");

  if (error) {
    throw new Error(`Impossible de lire les modules : ${error.message}`);
  }

  // Supabase renvoie le comptage sous la forme features: [{ count: 6 }].
  return data.map((module) => ({
    id: module.id,
    name: module.name,
    color: module.color,
    featureCount: module.features[0]?.count ?? 0,
  }));
}
