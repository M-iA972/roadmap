// Server Actions des features : créer, modifier, supprimer, assigner.
// Chaque action vérifie d'abord la connexion et les données reçues :
// une Server Action peut être appelée directement, sans passer par le formulaire.
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth";
import { withMessage } from "@/lib/messages";
import { assignSchema, featureEditSchema, featureSchema } from "@/lib/schemas/feature";
import { createClient } from "@/lib/supabase/server";

// "" (aucun choix) → null ; "12" → 12.
function toNumberOrNull(value: string): number | null {
  return value === "" ? null : Number(value);
}

// Après une modification, on demande à Next.js de relire les données de toutes les pages
// (Dashboard, fiches…) pour qu'elles affichent la nouvelle version.
function refreshAllPages() {
  revalidatePath("/", "layout");
}

// Création d'une feature (formulaire Nouvelle feature).
export async function createFeature(values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = featureSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const feature = parsed.data;
  const sprintId = toNumberOrNull(feature.sprintId);

  const supabase = await createClient();
  const { error } = await supabase.from("features").insert({
    title: feature.title,
    description: feature.description || null,
    priority: feature.priority,
    effort: feature.effort || null,
    impact: feature.impact,
    module_id: Number(feature.moduleId),
    assigned_to: feature.assignedTo || null,
    sprint_id: sprintId,
    // Sans sprint, la feature part dans le backlog ; avec un sprint, elle est « À faire ».
    status: sprintId === null ? "backlog" : "todo",
  });

  if (error) {
    return { error: "La feature n'a pas pu être enregistrée. Réessayez." };
  }

  refreshAllPages();
  redirect(withMessage("/", "Feature ajoutée"));
}

// Modification d'une feature : tous les champs, dont le statut.
export async function updateFeature(id: number, values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = featureEditSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const feature = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("features")
    .update({
      title: feature.title,
      description: feature.description || null,
      priority: feature.priority,
      effort: feature.effort || null,
      impact: feature.impact,
      module_id: Number(feature.moduleId),
      assigned_to: feature.assignedTo || null,
      sprint_id: toNumberOrNull(feature.sprintId),
      status: feature.status,
    })
    .eq("id", id);

  if (error) {
    return { error: "La feature n'a pas pu être modifiée. Réessayez." };
  }

  refreshAllPages();
  redirect(withMessage(`/features/${id}`, "Feature modifiée"));
}

// Suppression d'une feature et de ses commentaires.
// backToDashboard : depuis la fiche feature, on retourne au Dashboard (la fiche n'existe plus).
export async function deleteFeature(id: number, backToDashboard = false): Promise<ActionResult> {
  await getCurrentUser();
  const supabase = await createClient();

  // La base refuse de supprimer une feature qui a encore des commentaires
  // (clé étrangère comments.feature_id) : on supprime d'abord ses commentaires.
  const { error: commentsError } = await supabase.from("comments").delete().eq("feature_id", id);
  if (commentsError) {
    return { error: "Les commentaires de la feature n'ont pas pu être supprimés." };
  }

  const { data, error } = await supabase.from("features").delete().eq("id", id).select("id");
  if (error) {
    return { error: "La feature n'a pas pu être supprimée. Réessayez." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }

  refreshAllPages();
  if (backToDashboard) {
    redirect(withMessage("/", "Feature supprimée"));
  }
}

// Fenêtre « Assigner » du Dashboard : une personne et un sprint.
// La feature quitte le backlog et passe « À faire » dans le sprint choisi.
export async function assignFeature(id: number, values: unknown): Promise<ActionResult> {
  await getCurrentUser();
  const parsed = assignSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Choisissez une personne et un sprint." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("features")
    .update({
      assigned_to: parsed.data.assignedTo,
      sprint_id: Number(parsed.data.sprintId),
      status: "todo",
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: "La feature n'a pas pu être assignée. Réessayez." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }
  refreshAllPages();
}

// Fiche feature : changer la personne assignée (null = non assignée).
export async function changeFeatureAssignee(
  id: number,
  assignedTo: string | null,
): Promise<ActionResult> {
  await getCurrentUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("features")
    .update({ assigned_to: assignedTo })
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: "La personne assignée n'a pas pu être changée." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }
  refreshAllPages();
}

// Fiche feature : changer le sprint (null = remettre dans le backlog).
export async function changeFeatureSprint(
  id: number,
  sprintId: number | null,
): Promise<ActionResult> {
  await getCurrentUser();
  const supabase = await createClient();

  // Le nouveau statut dépend du statut actuel : on le lit d'abord.
  const { data: feature } = await supabase
    .from("features")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  if (!feature) {
    return { error: "Cette feature n'existe plus." };
  }

  let status = feature.status;
  // Remise dans le backlog : statut « Backlog », sauf si elle est terminée ou annulée.
  if (sprintId === null && status !== "done" && status !== "cancelled") {
    status = "backlog";
  }
  // Sortie du backlog : statut « À faire ».
  if (sprintId !== null && status === "backlog") {
    status = "todo";
  }

  const { data, error } = await supabase
    .from("features")
    .update({ sprint_id: sprintId, status })
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: "Le sprint n'a pas pu être changé." };
  }
  // RLS : si la base refuse l'action, elle ne renvoie pas d'erreur mais touche 0 ligne.
  if (!data || data.length === 0) {
    return { error: "Vous n'avez pas le droit de faire cette action." };
  }
  refreshAllPages();
}
