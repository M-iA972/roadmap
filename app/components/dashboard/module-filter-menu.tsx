// Composant client : le menu s'ouvre et se ferme, et la recherche filtre la liste
// pendant la frappe. Il faut donc un state et des événements, disponibles seulement dans le navigateur.
// Le filtrage des features, lui, reste fait par le serveur : chaque option est un lien vers une URL.
"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Search } from "lucide-react";
import { dashboardHref, type DashboardFilters } from "@/lib/dashboard-filters";
import type { ModuleWithCount } from "@/lib/data/modules";
import { cn } from "@/lib/utils";

type ModuleFilterMenuProps = {
  modules: ModuleWithCount[];
  filters: DashboardFilters; // filtres actuels, pour garder la portée en changeant de module
};

// Retire les accents et les majuscules : « Équipe » → « equipe ».
function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// Menu déroulant avec recherche pour filtrer les features par module.
export function ModuleFilterMenu({ modules, filters }: ModuleFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const selectedModule = modules.find((module) => module.id === filters.moduleId);
  const visibleModules = modules.filter((module) =>
    normalize(module.name).includes(normalize(query.trim())),
  );

  // Ferme le menu au clic à l'extérieur.
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    // Nettoyage : on retire l'écouteur quand le menu se ferme.
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setQuery("");
  }

  // Une option du menu : un lien vers le Dashboard filtré sur ce module.
  function renderOption(
    moduleId: number | null,
    label: string,
    color: string | null,
    count: number | null,
  ) {
    const isSelected = filters.moduleId === moduleId;
    return (
      <li key={moduleId ?? "all"}>
        <Link
          href={dashboardHref({ ...filters, moduleId })}
          scroll={false}
          onClick={close}
          aria-current={isSelected ? "true" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-pilule px-3 py-2 font-semibold transition-colors hover:bg-rose-clair focus-visible:bg-rose-clair focus-visible:outline-none",
            isSelected && "bg-rose-clair text-rose-fuchsia",
          )}
        >
          {color && (
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
          {label}
          {count !== null && (
            <span className="ml-auto text-petit font-medium text-gris-texte">{count}</span>
          )}
          {isSelected && (
            <Check aria-hidden="true" className={cn("size-4 text-rose-fuchsia", count === null && "ml-auto")} />
          )}
        </Link>
      </li>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      // Échap ferme le menu et rend le focus au bouton.
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          close();
          containerRef.current?.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className={cn(
          "inline-flex items-center gap-2 rounded-pilule border-2 px-4 py-2 text-libelle transition-colors",
          selectedModule
            ? "border-rose-fuchsia bg-rose-fuchsia text-blanc"
            : "border-gris-bordure bg-blanc text-noir-doux hover:bg-rose-clair",
        )}
      >
        {selectedModule && (
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: selectedModule.color }}
          />
        )}
        {selectedModule ? selectedModule.name : "Tous les modules"}
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute top-[calc(100%+8px)] left-0 z-20 w-[280px] rounded-carte border border-gris-bordure bg-blanc p-3 shadow-carte"
        >
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
              placeholder="Rechercher un module…"
              aria-label="Rechercher un module"
              className="w-full rounded-pilule border-2 border-gris-bordure bg-blanc py-3 pr-4 pl-10 outline-none focus:border-rose-fuchsia"
            />
          </div>

          <ul className="flex max-h-[260px] flex-col gap-1 overflow-y-auto">
            {/* « Tous les modules » est masqué pendant une recherche */}
            {query.trim() === "" && renderOption(null, "Tous les modules", null, null)}
            {visibleModules.map((module) =>
              renderOption(module.id, module.name, module.color, module.featureCount),
            )}
          </ul>
          {visibleModules.length === 0 && (
            <p className="px-3 py-2 text-petit text-gris-texte">Aucun module trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}
