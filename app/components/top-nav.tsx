import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { CurrentNavLinks } from "@/components/current-nav-links";
import { NavLinks } from "@/components/nav-link";
import { UserMenu } from "@/components/user-menu";
import { getCurrentUser } from "@/lib/auth";

// Menu du haut : logo « Roadmap » à gauche, puis les liens,
// et à droite l'avatar et le prénom de la personne connectée.
export function TopNav() {
  return (
    <div className="px-page-mobile pt-6 md:px-page">
      <header className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2 rounded-carte bg-blanc py-2 pr-2 pl-6 shadow-carte md:flex-nowrap md:rounded-pilule">
        <Logo href="/" />

        <nav
          aria-label="Menu principal"
          className="order-last flex basis-full gap-1 overflow-x-auto md:order-none md:basis-auto"
        >
          {/* L'adresse de la page n'est connue qu'au moment de la requête :
              en attendant, les liens s'affichent sans lien actif. */}
          <Suspense fallback={<NavLinks pathname={null} />}>
            <CurrentNavLinks />
          </Suspense>
        </nav>

        {/* La personne connectée est lue dans les cookies, à chaque requête :
            on attend sa réponse dans un <Suspense>, sans bloquer le reste du menu. */}
        <Suspense fallback={<span className="ml-auto size-10" aria-hidden="true" />}>
          <CurrentUserMenu />
        </Suspense>
      </header>
    </div>
  );
}

// Lit la personne connectée côté serveur, puis affiche le menu de l'avatar.
async function CurrentUserMenu() {
  const user = await getCurrentUser();
  return <UserMenu user={user} />;
}
