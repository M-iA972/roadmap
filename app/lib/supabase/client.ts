// Client Supabase côté navigateur : à utiliser seulement dans un composant "use client".
// Il utilise la clé publishable, qui peut être publique : la base est protégée par les règles RLS.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
