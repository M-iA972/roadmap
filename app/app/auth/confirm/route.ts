// Route Handler : adresse du lien de confirmation envoyé par email à l'inscription
// (seulement si la confirmation par email est activée dans Supabase).
// Il valide le lien, ouvre la session, puis envoie sur le Dashboard.
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { withMessage } from "@/lib/messages";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const supabase = await createClient();

  // Selon le modèle d'email choisi dans Supabase, le lien contient
  // soit un « code », soit un « token_hash » et un « type ».
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  }

  if (ok) {
    return NextResponse.redirect(`${origin}${withMessage("/", "Bienvenue dans l'équipe !")}`);
  }
  return NextResponse.redirect(
    `${origin}${withMessage("/connexion", "Lien invalide ou expiré : connectez-vous")}`,
  );
}
