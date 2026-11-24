// Client Supabase utilisé par le proxy (proxy.ts, à la racine de l'app).
// Le proxy s'exécute avant chaque page : il rafraîchit la session de connexion
// (stockée dans des cookies) et renvoie vers /connexion les personnes non connectées.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

// Pages accessibles sans être connecté.
const PUBLIC_PATHS = ["/connexion", "/inscription", "/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function updateSession(request: NextRequest) {
  // La réponse par défaut : laisser passer la requête.
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // Quand Supabase rafraîchit la session, il faut écrire les nouveaux cookies
        // à la fois dans la requête (pour la page qui va s'afficher)
        // et dans la réponse (pour le navigateur).
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Important : ne rien mettre entre createServerClient et getClaims().
  // getClaims() vérifie le jeton de connexion et le rafraîchit si besoin.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  // Pas connecté et page privée → écran Connexion.
  if (!isLoggedIn && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Déjà connecté et sur Connexion ou Créer mon compte → Dashboard.
  if (isLoggedIn && (pathname === "/connexion" || pathname === "/inscription")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
