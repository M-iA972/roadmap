// Composant client : le menu s'ouvre et se ferme, et la recherche filtre la liste
// pendant la frappe. Il faut donc un state et des événements, disponibles seulement dans le navigateur.
// Le filtrage des données, lui, reste fait par le serveur : chaque option est un lien vers une URL.
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Search } from "lucide-react";
import { useDropdown } from "@/lib/use-dropdown";
import { cn } from "@/lib/utils";

export type FilterOption = {
  key: string; // identifiant unique de l'option
  label: string;
  href: string; // adresse de la page avec ce filtre (calculée par le serveur)
  isSelected: boolean;
  color?: string; // pastille de couleur (modules)
  count?: number; // nombre aligné à droite (features du module)
};

type FilterMenuProps = {
  allLabel: string; // ex. « Tous les modules » : bouton quand rien n'est choisi, et première option
  allHref: string; // adresse sans ce filtre
  options: FilterOption[];
  // Avec searchLabel, une barre de recherche s'affiche en haut (listes qui peuvent s'allonger).
  searchLabel?: string; // ex. « Rechercher un module »
  emptyLabel?: string; // ex. « Aucun module trouvé. »
};

// Retire les accents et les majuscules : « Équipe » → « equipe ».
function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// Menu déroulant de filtre (design system : « Menu déroulant avec recherche »).
export function FilterMenu({ allLabel, allHref, options, searchLabel, emptyLabel }: FilterMenuProps) {
  const { isOpen, containerRef, onKeyDown, toggle, close } = useDropdown();
  const [query, setQuery] = useState("");

  const selected = options.find((option) => option.isSelected);
  const visibleOptions = options.filter((option) =>
    normalize(option.label).includes(normalize(query.trim())),
  );

  function closeMenu() {
    close();
    setQuery("");
  }

  // Une option du menu : un lien vers la page filtrée.
  function renderOption(option: FilterOption) {
    return (
      <li key={option.key}>
        <Link
          href={option.href}
          scroll={false}
          onClick={closeMenu}
          aria-current={option.isSelected ? "true" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-pilule px-3 py-2 font-semibold transition-colors hover:bg-rose-clair focus-visible:bg-rose-clair focus-visible:outline-none",
            option.isSelected && "bg-rose-clair text-rose-fuchsia",
          )}
        >
          {option.color && (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: option.color }}
            />
          )}
          <span className="min-w-0 truncate">{option.label}</span>
          {option.count !== undefined && (
            <span className="ml-auto text-petit font-medium text-gris-texte">{option.count}</span>
          )}
          {option.isSelected && (
            <Check
              aria-hidden="true"
              className={cn("size-4 shrink-0 text-rose-fuchsia", option.count === undefined && "ml-auto")}
            />
          )}
        </Link>
      </li>
    );
  }

  return (
    <div ref={containerRef} onKeyDown={onKeyDown} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : toggle())}
        className={cn(
          "inline-flex items-center gap-2 rounded-pilule border-2 px-4 py-2 text-libelle transition-colors",
          selected
            ? "border-rose-fuchsia bg-rose-fuchsia text-blanc"
            : "border-gris-bordure bg-blanc text-noir-doux hover:bg-rose-clair",
        )}
      >
        {selected?.color && (
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: selected.color }}
          />
        )}
        {selected ? selected.label : allLabel}
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-20 w-[280px] rounded-carte border border-gris-bordure bg-blanc p-3 shadow-carte">
          {searchLabel && (
            <div className="relative mb-2">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gris-texte"
              />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`${searchLabel}…`}
                aria-label={searchLabel}
                className="w-full rounded-pilule border-2 border-gris-bordure bg-blanc py-3 pr-4 pl-10 outline-none focus:border-rose-fuchsia"
              />
            </div>
          )}

          <ul className="flex max-h-[260px] flex-col gap-1 overflow-y-auto">
            {/* L'option « Tous… » est masquée pendant une recherche */}
            {query.trim() === "" &&
              renderOption({ key: "all", label: allLabel, href: allHref, isSelected: !selected })}
            {visibleOptions.map(renderOption)}
          </ul>
          {visibleOptions.length === 0 && emptyLabel && (
            <p className="px-3 py-2 text-petit text-gris-texte">{emptyLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
