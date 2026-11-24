// Lit un identifiant numérique dans l'URL (ex. /features/12 → 12).
// Renvoie null si ce n'est pas un entier positif (ex. /features/abc).
export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
