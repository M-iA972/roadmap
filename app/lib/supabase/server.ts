// Client Supabase côté serveur : Server Components, Server Actions, Route Handlers.
// Il lit les cookies de la requête, ce qui lui permettra plus tard de savoir
// quelle personne est connectée.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

export async function createClient() {
  // cookies() est asynchrone dans cette version de Next.js : on l'attend.
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Supabase lit tous les cookies de la requête.
        getAll() {
          return cookieStore.getAll();
        },
        // Supabase écrit des cookies quand la session change (connexion, rafraîchissement).
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Un Server Component n'a pas le droit d'écrire des cookies :
            // l'erreur est attendue ici et peut être ignorée.
            // L'écriture se fera dans une Server Action.
          }
        },
      },
    },
  );
}
