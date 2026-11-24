// Composant client : pour savoir quel lien est actif, il lit l'adresse de la page
// avec usePathname(), un hook qui ne fonctionne que dans le navigateur.
"use client";

import { usePathname } from "next/navigation";
import { NavLinks } from "@/components/nav-link";

// Les liens du menu, avec le lien de la page actuelle mis en avant.
export function CurrentNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}
