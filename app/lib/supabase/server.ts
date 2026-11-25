// Client Supabase côté serveur : Server Components, Server Actions, Route Handlers.
// Il lit les cookies de la requête, ce qui lui permettra plus tard de savoir
// quelle personne est connectée.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "./database.types";

export async function createClient() {
  // Toute lecture ou écriture Supabase (session comprise) passe par ici, et Supabase utilise
  // l'heure (Date.now) pour vérifier la session. Next.js ne peut pas la calculer à l'avance :
  // on attend donc la vraie requête avant de commencer. Un seul endroit pour toute l'app.
  await connection();

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
