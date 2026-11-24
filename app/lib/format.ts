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

// Formate une date et heure de la base en français, à l'heure de Paris :
// « 2026-11-09T13:05:00+00:00 » → « 9 novembre 2026 à 14 h 05 ».
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function formatDateTime(isoDateTime: string): string {
  // formatToParts découpe la date en morceaux (jour, mois, heure…) pour les remettre en forme.
  const parts = dateTimeFormatter.formatToParts(new Date(isoDateTime));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("day")} ${part("month")} ${part("year")} à ${part("hour")} h ${part("minute")}`;
}
