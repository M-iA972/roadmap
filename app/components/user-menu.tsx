// Composant client : le menu de l'avatar s'ouvre et se ferme au clic,
// ce qui demande un state et des événements dans le navigateur.
"use client";

import Link from "next/link";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Avatar, getFullName } from "@/components/avatar";
import type { CurrentUser } from "@/lib/auth";
import { useDropdown } from "@/lib/use-dropdown";
import { cn } from "@/lib/utils";

// Classes d'une option du menu (pilule, survol rose clair).
const itemClasses =
  "flex w-full items-center gap-2 rounded-pilule px-3 py-2 text-left font-semibold transition-colors hover:bg-rose-clair focus-visible:bg-rose-clair focus-visible:outline-none [&_svg]:size-4";

// Menu en haut à droite : avatar et prénom de la personne connectée.
// Au clic : nom et email en tête, puis « Mon profil » et « Se déconnecter ».
export function UserMenu({ user }: { user: CurrentUser }) {
  const { isOpen, containerRef, onKeyDown, toggle, close } = useDropdown();

  return (
    <div ref={containerRef} onKeyDown={onKeyDown} className="relative ml-auto">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center gap-2 rounded-pilule py-1 pr-3 pl-1 transition-colors hover:bg-rose-clair",
          isOpen && "bg-rose-clair",
        )}
      >
        <Avatar person={user} />
        <span className="text-petit">{user.firstname ?? user.email}</span>
        <ChevronDown aria-hidden="true" className="size-3.5 text-gris-texte" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-[calc(100%+8px)] right-0 z-30 w-[260px] rounded-carte border border-gris-bordure bg-blanc p-3 shadow-carte"
        >
          <div className="mb-2 flex flex-col border-b border-gris-bordure px-3 pt-2 pb-3">
            <strong className="font-semibold">{getFullName(user)}</strong>
            <span className="truncate text-petit text-gris-texte">{user.email}</span>
          </div>

          <Link
            href={`/equipe/${user.id}`}
            role="menuitem"
            onClick={close}
            className={itemClasses}
          >
            <User aria-hidden="true" />
            Mon profil
          </Link>

          {/* La déconnexion passe par une Server Action : un simple formulaire suffit. */}
          <form action={logout}>
            <button type="submit" role="menuitem" className={cn(itemClasses, "text-rouge-cerise")}>
              <LogOut aria-hidden="true" />
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
