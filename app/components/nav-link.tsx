import Link from "next/link";
import { cn } from "@/lib/utils";

// Les liens du menu, dans l'ordre de docs/ecrans.md.
const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/sprints", label: "Sprints" },
  { href: "/modules", label: "Modules" },
  { href: "/equipe", label: "Équipe" },
];

// Un lien est actif sur sa page et sur les pages qui en dépendent :
// « Sprints » reste actif sur /sprints/3. Les fiches et formulaires de features
// (/features/…) font partie du Dashboard.
function isActiveLink(href: string, pathname: string | null): boolean {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/" || pathname.startsWith("/features");
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Les liens du menu du haut. Lien actif : pilule rose fuchsia, texte blanc.
// pathname = adresse de la page actuelle, ou null quand elle n'est pas encore connue
// (aucun lien n'est alors mis en avant).
export function NavLinks({ pathname }: { pathname: string | null }) {
  return LINKS.map((link) => {
    const isActive = isActiveLink(link.href, pathname);
    return (
      <Link
        key={link.href}
        href={link.href}
        // aria-current indique aux lecteurs d'écran la page en cours.
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "whitespace-nowrap rounded-pilule px-4 py-2 font-semibold transition-colors",
          isActive ? "bg-rose-fuchsia text-blanc" : "text-noir-doux hover:bg-rose-clair",
        )}
      >
        {link.label}
      </Link>
    );
  });
}
