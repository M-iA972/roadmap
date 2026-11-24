// Composant client : la petite liste s'ouvre au clic et se ferme avec Échap
// ou au clic à l'extérieur, ce qui demande un state et des événements.
"use client";

import { Check, ChevronDown } from "lucide-react";
import { useDropdown } from "@/lib/use-dropdown";
import { cn } from "@/lib/utils";

export type PickerOption = {
  value: string; // "" = aucun (« Backlog », « Non assignée »)
  label: string;
  lead?: React.ReactNode; // avant le libellé (avatar)
  hint?: string; // petit texte gris après le libellé (statut du sprint)
};

type FactPickerProps = {
  label: string; // « Sprint », « Personne assignée »
  display: React.ReactNode; // ce que la case affiche
  options: PickerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean; // pendant l'enregistrement
};

// Case cliquable de la fiche feature : un clic ouvre une petite liste,
// un clic sur une option la choisit tout de suite.
export function FactPicker({ label, display, options, selectedValue, onSelect, disabled }: FactPickerProps) {
  const { isOpen, containerRef, onKeyDown, toggle, close } = useDropdown();

  return (
    <div ref={containerRef} onKeyDown={onKeyDown} className="relative rounded-carte bg-blanc shadow-carte">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Cliquer pour changer"
        className={cn(
          "block size-full rounded-carte border-2 border-transparent p-4 text-left transition hover:-translate-y-0.5 hover:border-rose-clair disabled:opacity-60",
          isOpen && "-translate-y-0.5 border-rose-clair",
        )}
      >
        <span className="mb-2 block text-libelle text-gris-texte">{label}</span>
        <span className="flex items-center justify-between gap-2 font-semibold">
          <span className="inline-flex min-w-0 items-center gap-2">{display}</span>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-gris-texte" />
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+8px)] left-0 z-20 flex max-h-[300px] w-[280px] flex-col gap-1 overflow-y-auto rounded-carte border border-gris-bordure bg-blanc p-3 shadow-carte"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <li key={option.value || "aucun"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    if (!isSelected) onSelect(option.value);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-pilule px-3 py-2 text-left font-semibold transition-colors hover:bg-rose-clair focus-visible:bg-rose-clair focus-visible:outline-none",
                    isSelected && "bg-rose-clair text-rose-fuchsia",
                  )}
                >
                  {option.lead}
                  <span className="min-w-0 truncate">{option.label}</span>
                  {option.hint && (
                    <span className="text-petit font-medium text-gris-texte">{option.hint}</span>
                  )}
                  {isSelected && <Check aria-hidden="true" className="ml-auto size-4 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
