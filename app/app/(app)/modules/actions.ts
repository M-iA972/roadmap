// Server Actions des modules : créer, modifier, supprimer.
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import { withMessage } from "@/lib/messages";
import { moduleSchema } from "@/lib/schemas/module";
import { createClient } from "@/lib/supabase/server";

// Code d'erreur de PostgreSQL quand une valeur « unique » existe déjà
// (ici : la colonne modules.name, deux modules ne peuvent pas avoir le même nom).
const UNIQUE_VIOLATION = "23505";

// Création d'un module.
export async function createModule(values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = moduleSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("modules").insert({
    name: parsed.data.name,
    description: parsed.data.description || null,
    color: parsed.data.color,
  });

  if (error?.code === UNIQUE_VIOLATION) {
    return { error: "Un module porte déjà ce nom." };
  }
  if (error) {
    return { error: "Le module n'a pas pu être enregistré. Réessayez." };
  }

  revalidatePath("/", "layout");
  redirect(withMessage("/modules", "Module ajouté"));
}

// Modification d'un module.
export async function updateModule(id: number, values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = moduleSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("modules")
    .update({
      name: parsed.data.name,
      description: parsed.data.description || null,
      color: parsed.data.color,
    })
    .eq("id", id);

  if (error?.code === UNIQUE_VIOLATION) {
    return { error: "Un module porte déjà ce nom." };
  }
  if (error) {
    return { error: "Le module n'a pas pu être modifié. Réessayez." };
  }

  revalidatePath("/", "layout");
  redirect(withMessage("/modules", "Module modifié"));
}

// Suppression d'un module : seulement s'il n'a plus aucune feature.
export async function deleteModule(id: number): Promise<ActionResult> {
  await getCurrentUser();
  const supabase = await createClient();

  // On revérifie ici, même si le bouton l'a déjà fait : une feature a pu être ajoutée entre-temps.
  // head: true → la base renvoie seulement le nombre, pas les lignes.
  const { count, error: countError } = await supabase
    .from("features")
    .select("id", { count: "exact", head: true })
    .eq("module_id", id);

  if (countError) {
    return { error: "Impossible de vérifier les features du module." };
  }
  if (count && count > 0) {
    return { error: "Ce module contient encore des features : déplacez-les ou supprimez-les d'abord." };
  }

  const { data, error } = await supabase.from("modules").delete().eq("id", id).select("id");
  if (error) {
    return { error: "Le module n'a pas pu être supprimé. Réessayez." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }

  revalidatePath("/", "layout");
}
