// Construit une adresse avec un message de confirmation à afficher à l'arrivée
// (lu par le composant UrlToast, dans components/toast.tsx).
// Exemple : withMessage("/", "Feature ajoutée") → "/?message=Feature+ajout%C3%A9e"
// Utilisable côté serveur (redirect dans une Server Action) comme côté client (<Link>).
export function withMessage(path: string, message: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${new URLSearchParams({ message }).toString()}`;
}
