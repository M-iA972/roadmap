import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Compose des classes Tailwind, y compris des classes conditionnelles.
// Exemple : cn("px-4", estActif && "bg-rose-fuchsia")
// twMerge garde la dernière classe quand deux classes se contredisent (ex. px-2 puis px-4).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
