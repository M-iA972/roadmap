// Règles de validation du formulaire sprint (zod).
// Utilisées dans le navigateur (react-hook-form) ET dans les Server Actions.
// Le même schéma sert à la création et à la modification :
// - en création, le statut est ignoré (toujours « Planification ») ;
// - en modification, les features cochées sont ignorées (le bloc n'est pas affiché).
import { z } from "zod";

export const sprintSchema = z
  .object({
    goal: z.string().trim().min(1, "Donnez un objectif au sprint."),
    // Les dates viennent de <input type="date"> : du texte au format « 2026-12-21 ».
    startDate: z.string().min(1, "Choisissez une date de début."),
    endDate: z.string().min(1, "Choisissez une date de fin."),
    status: z.enum(["planned", "active", "completed"]),
    featureIds: z.array(z.string()), // id des features du backlog cochées (en texte)
  })
  // La date de fin doit être après la date de début.
  // Les dates « AAAA-MM-JJ » se comparent comme du texte : "2026-12-21" < "2027-01-08".
  .refine((values) => !values.startDate || !values.endDate || values.endDate > values.startDate, {
    message: "La date de fin doit être après la date de début.",
    path: ["endDate"], // l'erreur s'affiche sous le champ « Date de fin »
  });

export type SprintValues = z.infer<typeof sprintSchema>;
