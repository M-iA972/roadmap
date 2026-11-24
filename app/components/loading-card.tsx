// Texte affiché pendant qu'une partie de page charge ses données (fallback d'un <Suspense>).
export function LoadingCard({ label }: { label: string }) {
  return <p className="rounded-carte bg-blanc p-carte text-petit text-gris-texte">{label}</p>;
}
