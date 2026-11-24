import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses } from "@/lib/button-styles";

type PaginationProps = {
  page: number; // page actuelle, à partir de 1
  totalPages: number;
  hrefForPage: (page: number) => string; // adresse d'une page (avec les filtres actuels)
};

// Liens « Précédent » et « Suivant » sous un tableau découpé en pages.
// Ce sont de simples liens : le serveur renvoie la page demandée.
export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} scroll={false} className={buttonClasses("secondaire", "petit")}>
          <ChevronLeft aria-hidden="true" />
          Précédent
        </Link>
      ) : (
        // Pas de page avant la première : bouton grisé.
        <span aria-disabled="true" className={`${buttonClasses("secondaire", "petit")} opacity-40`}>
          <ChevronLeft aria-hidden="true" />
          Précédent
        </span>
      )}

      <span className="text-petit text-gris-texte" aria-current="page">
        Page {page} sur {totalPages}
      </span>

      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} scroll={false} className={buttonClasses("secondaire", "petit")}>
          Suivant
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${buttonClasses("secondaire", "petit")} opacity-40`}>
          Suivant
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
