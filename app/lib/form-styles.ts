import { cn } from "@/lib/utils";

// Classes des champs de formulaire du design system (docs/design-system.md, « Champ de formulaire »).
// Fond blanc, bordure 2 px gris, pilule, 12 px × 16 px. Focus : bordure rose. Erreur : bordure rouge.
const fieldBase =
  "w-full border-2 bg-blanc px-4 py-3 text-noir-doux outline-none transition-colors placeholder:text-gris-texte/70 focus:border-rose-fuchsia disabled:opacity-60";

// Champ texte, email, mot de passe, date…
export function inputClasses(hasError = false): string {
  return cn(fieldBase, "rounded-pilule", hasError ? "border-rouge-cerise" : "border-gris-bordure");
}

// Liste déroulante : même style, avec une flèche grise dessinée à droite.
export function selectClasses(hasError = false): string {
  return cn(
    inputClasses(hasError),
    "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%236E6A80%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-size-[16px] bg-position-[right_16px_center] bg-no-repeat pr-10",
  );
}

// Zone de texte (description, commentaire) : même style, arrondi 20 px.
export function textareaClasses(hasError = false): string {
  return cn(
    fieldBase,
    "min-h-[110px] resize-y rounded-zone-texte",
    hasError ? "border-rouge-cerise" : "border-gris-bordure",
  );
}
