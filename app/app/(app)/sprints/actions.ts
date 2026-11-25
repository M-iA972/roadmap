// Server Actions des sprints : créer, modifier, supprimer.
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import { withMessage } from "@/lib/messages";
import { sprintSchema } from "@/lib/schemas/sprint";
import { createClient } from "@/lib/supabase/server";

// Création d'un sprint. Il part toujours au statut « Planification ».
// Les features du backlog cochées sont mises dans le sprint, au statut « À faire ».
export async function createSprint(values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = sprintSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const sprint = parsed.data;
  const supabase = await createClient();

  // .select("id").single() : la base renvoie l'id du sprint qu'elle vient de créer.
  const { data: created, error } = await supabase
    .from("sprints")
    .insert({
      goal: sprint.goal,
      start_date: sprint.startDate,
      end_date: sprint.endDate,
      status: "planned",
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Le sprint n'a pas pu être enregistré. Réessayez." };
  }

  const featureIds = sprint.featureIds.map(Number);
  let addedCount = 0;
  if (featureIds.length > 0) {
    const { data: moved, error: featuresError } = await supabase
      .from("features")
      .update({ sprint_id: created.id, status: "todo" })
      .in("id", featureIds)
      .is("sprint_id", null) // sécurité : seulement des features encore dans le backlog
      .select("id");

    if (featuresError) {
      return { error: "Le sprint est créé, mais les features n'ont pas pu y être ajoutées." };
    }
    addedCount = moved.length;
  }

  revalidatePath("/", "layout");
  const message =
    addedCount > 0
      ? `Sprint ajouté avec ${addedCount} feature${addedCount > 1 ? "s" : ""}`
      : "Sprint ajouté";
  redirect(withMessage("/sprints", message));
}

// Modification d'un sprint : objectif, dates et statut.
export async function updateSprint(id: number, values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = sprintSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const sprint = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("sprints")
    .update({
      goal: sprint.goal,
      start_date: sprint.startDate,
      end_date: sprint.endDate,
      status: sprint.status,
    })
    .eq("id", id);

  if (error) {
    return { error: "Le sprint n'a pas pu être modifié. Réessayez." };
  }

  revalidatePath("/", "layout");
  redirect(withMessage("/sprints", "Sprint modifié"));
}

// Suppression d'un sprint. Ses features repartent dans le backlog.
export async function deleteSprint(id: number): Promise<ActionResult> {
  await getCurrentUser();
  const supabase = await createClient();

  // 1. Les features du sprint qui ne sont ni terminées ni annulées repassent « Backlog ».
  const { error: statusError } = await supabase
    .from("features")
    .update({ status: "backlog" })
    .eq("sprint_id", id)
    .not("status", "in", "(done,cancelled)");

  // 2. Toutes les features du sprint quittent le sprint.
  const { error: sprintError } = await supabase
    .from("features")
    .update({ sprint_id: null })
    .eq("sprint_id", id);

  if (statusError || sprintError) {
    return { error: "Les features du sprint n'ont pas pu être remises dans le backlog." };
  }

  // 3. Le sprint lui-même.
  const { data, error } = await supabase.from("sprints").delete().eq("id", id).select("id");
  if (error) {
    return { error: "Le sprint n'a pas pu être supprimé. Réessayez." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }

  revalidatePath("/", "layout");
}
