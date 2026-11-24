// Composant client : le message apparaît puis disparaît après 3 secondes.
// Il faut un state, un minuteur (setTimeout) et la lecture de l'URL dans le navigateur.
"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// « ok » : turquoise (Feature ajoutée…), « neutre » : gris (Ajout annulé…), « erreur » : rouge.
type ToastKind = "ok" | "neutre" | "erreur";
type Toast = { id: number; message: string; kind: ToastKind };

// Sans type précisé : gris pour une annulation ou une déconnexion, turquoise sinon.
function guessKind(message: string): ToastKind {
  return /annul|déconnect/i.test(message) ? "neutre" : "ok";
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

// Fonction à appeler depuis un composant client : const showToast = useToast();
export function useToast() {
  return useContext(ToastContext);
}

// À placer une seule fois, autour de toute l'app (app/layout.tsx).
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // useCallback garde la même fonction d'un rendu à l'autre,
  // pour qu'elle puisse servir sans souci dans un useEffect.
  const showToast = useCallback((message: string, kind?: ToastKind) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, kind: kind ?? guessKind(message) });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext value={showToast}>
      {children}
      {/* role="status" : le lecteur d'écran annonce le message sans interrompre. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <p
            key={toast.id}
            className={cn(
              "animate-toast-in rounded-pilule px-6 py-3 font-bold text-blanc shadow-carte",
              toast.kind === "ok" && "bg-turquoise",
              toast.kind === "neutre" && "bg-gris-texte",
              toast.kind === "erreur" && "bg-rouge-cerise",
            )}
          >
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext>
  );
}

// Affiche le message passé dans l'URL après une redirection (ex. /?message=Feature%20ajoutée),
// puis retire ?message de l'URL pour qu'il ne réapparaisse pas en rechargeant la page.
export function UrlToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const showToast = useToast();
  const message = searchParams.get("message");

  useEffect(() => {
    if (!message) return;
    showToast(message);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("message");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [message, searchParams, pathname, router, showToast]);

  return null;
}
