// Règles de validation du formulaire module (zod).
import { z } from "zod";

export const moduleSchema = z.object({
  name: z.string().trim().min(1, "Donnez un nom au module."),
  description: z.string().trim(),
  // Une couleur au format « #E8308C » (# puis 6 chiffres hexadécimaux).
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Choisissez une couleur."),
});
export type ModuleValues = z.infer<typeof moduleSchema>;

// Couleurs proposées dans le formulaire : celles du design system.
export const MODULE_COLORS = [
  { value: "#E8308C", label: "Rose fuchsia" },
  { value: "#7B5CFA", label: "Violet électrique" },
  { value: "#FFC93C", label: "Jaune soleil" },
  { value: "#2EC4B6", label: "Turquoise" },
  { value: "#6CB8FF", label: "Bleu ciel" },
  { value: "#F2545B", label: "Rouge cerise" },
  { value: "#1E1B2E", label: "Noir doux" },
];
