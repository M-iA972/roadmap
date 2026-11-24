import Link from "next/link";
import { NavLink } from "@/components/nav-link";

// Les liens du menu, dans l'ordre de docs/ecrans.md.
const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/sprints", label: "Sprints" },
  { href: "/modules", label: "Modules" },
  { href: "/equipe", label: "Équipe" },
];

// Menu du haut : logo « Roadmap » à gauche, puis les liens.
// L'avatar de la personne connectée viendra à droite quand la connexion existera.
export function TopNav() {
  return (
    <div className="px-page-mobile pt-6 md:px-page">
      <header className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 rounded-carte bg-blanc py-2 pr-2 pl-6 shadow-carte md:flex-nowrap md:rounded-pilule">
        <Link href="/" className="flex items-center gap-2 text-titre-section">
          {/* Logo : rond en 4 quarts aux couleurs du design system */}
          <span
            aria-hidden="true"
            className="size-6 rounded-full bg-[conic-gradient(var(--color-rose-fuchsia)_0_25%,var(--color-violet-electrique)_0_50%,var(--color-jaune-soleil)_0_75%,var(--color-turquoise)_0)]"
          />
          Roadmap
        </Link>

        <nav aria-label="Menu principal" className="flex basis-full gap-1 overflow-x-auto md:basis-auto">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </div>
  );
}
