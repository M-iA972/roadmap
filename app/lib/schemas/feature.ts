// Règles de validation du formulaire feature et de la fenêtre « Assigner » (zod).
// Utilisées dans le navigateur (react-hook-form) ET dans les Server Actions.
//
// Les listes déroulantes renvoient toujours du texte : les identifiants (module, sprint,
// personne) restent donc des chaînes ici, et "" veut dire « aucun ».
// La Server Action les convertit ensuite en nombres ou en null.
import { z } from "zod";

// Valeurs autorisées par la base (contraintes CHECK), voir aussi lib/labels.ts.
const priority = z.enum(["critical", "high", "medium", "low", "nice_to_have"]);
const effort = z.enum(["", "xs", "s", "m", "l", "xl"]); // "" = effort non estimé
const impact = z.enum(["low", "medium", "high"]);
const status = z.enum(["backlog", "todo", "in_progress", "done", "cancelled"]);

// Champs communs à la création et à la modification.
export const featureSchema = z.object({
  title: z.string().trim().min(1, "Donnez un titre à la feature."),
  description: z.string().trim(),
  priority,
  effort,
  impact,
  moduleId: z.string().min(1, "Choisissez un module."),
  assignedTo: z.string(), // "" = non assignée
  sprintId: z.string(), // "" = aucun sprint : la feature reste dans le backlog
});
export type FeatureValues = z.infer<typeof featureSchema>;

// En modification, on peut aussi changer le statut.
export const featureEditSchema = featureSchema.extend({ status });
export type FeatureEditValues = z.infer<typeof featureEditSchema>;

// Fenêtre « Assigner » du Dashboard : la personne et le sprint sont obligatoires.
export const assignSchema = z.object({
  assignedTo: z.string().min(1, "Choisissez une personne."),
  sprintId: z.string().min(1, "Choisissez un sprint."),
});
export type AssignValues = z.infer<typeof assignSchema>;
