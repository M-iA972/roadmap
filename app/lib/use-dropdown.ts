// Hook pour les menus déroulants (menu de l'avatar, filtres, choix sur la fiche feature).
// Il ne s'utilise que dans un composant "use client" (il utilise useState et useEffect).
//
// Exemple :
//   const { isOpen, containerRef, onKeyDown, toggle, close } = useDropdown();
//   <div ref={containerRef} onKeyDown={onKeyDown}>
//     <button onClick={toggle} aria-expanded={isOpen}>…</button>
//     {isOpen && <div>…le panneau…</div>}
//   </div>
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Échap ferme le menu et rend le focus au bouton d'ouverture.
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
      containerRef.current?.querySelector("button")?.focus();
    }
  }

  return {
    isOpen,
    containerRef,
    onKeyDown,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((wasOpen) => !wasOpen),
  };
}
