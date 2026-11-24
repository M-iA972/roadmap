// Lignes de tableau cliquables, sans JavaScript.
// Le lien du titre s'étire sur toute la ligne grâce à un pseudo-élément ::after
// posé par-dessus la ligne (la ligne doit avoir la classe « relative »).
// Les autres liens et boutons de la ligne passent au-dessus avec rowControl.
export const stretchedLink =
  "font-semibold text-noir-doux hover:text-violet-electrique after:absolute after:inset-0 after:rounded-carte after:content-['']";

// À mettre sur les liens et boutons d'une ligne qui a un stretchedLink.
export const rowControl = "relative z-10";
