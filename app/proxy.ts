// Proxy Next.js (l'ancien « middleware ») : il s'exécute avant chaque page.
// Ici, il sert uniquement à la connexion : voir lib/supabase/proxy.ts.
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Le proxy ne tourne pas pour les fichiers statiques (images, CSS, favicon…).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
