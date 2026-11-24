import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClasses } from "@/lib/button-styles";

type ComingSoonProps = {
  title: string; // nom de l'écran, ex. « Sprints »
};

// Page provisoire pour les écrans qui ne sont pas encore codés.
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <h1 className="mb-entre-sections text-titre-page">{title}</h1>
      <div className="flex flex-col items-center gap-4 rounded-carte bg-blanc p-carte text-center shadow-carte">
        <p className="text-titre-carte">Bientôt disponible</p>
        <p className="text-petit text-gris-texte">
          Cet écran n&apos;est pas encore construit.
        </p>
        <Link href="/" className={buttonClasses("secondaire")}>
          <ArrowLeft aria-hidden="true" />
          Retour au Dashboard
        </Link>
      </div>
    </main>
  );
}
