// Ce que renvoie une Server Action quand quelque chose ne va pas : un message d'erreur
// à afficher. En cas de succès, elle ne renvoie rien (ou elle redirige vers une autre page).
export type ActionResult = { error: string } | undefined;
