// Formate une date de la base (« 2026-11-09 ») en français : « 9 novembre 2026 ».
// timeZone "UTC" : la date est lue telle quelle, sans décalage d'un jour selon le fuseau horaire.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`));
}
