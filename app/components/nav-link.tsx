// Composant client : pour savoir quel lien est actif, il lit l'adresse de la page
// avec usePathname(), un hook qui ne fonctionne que dans le navigateur.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

// Lien du menu du haut. Lien actif : pilule rose fuchsia, texte blanc.
export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      // aria-current indique aux lecteurs d'écran la page en cours.
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "whitespace-nowrap rounded-pilule px-4 py-2 font-semibold transition-colors",
        isActive ? "bg-rose-fuchsia text-blanc" : "text-noir-doux hover:bg-rose-clair",
      )}
    >
      {children}
    </Link>
  );
}
