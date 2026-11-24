// Server Actions de l'authentification : connexion, création de compte, déconnexion.
// Elles s'exécutent sur le serveur : le mot de passe n'est jamais traité dans le navigateur.
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { withMessage } from "@/lib/messages";
import { loginSchema, signupSchema } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/server";

// Ce que renvoie une action quand quelque chose ne va pas.
// En cas de succès, l'action redirige : elle ne renvoie rien.
export type ActionResult = { error: string } | undefined;

// Connexion avec email et mot de passe.
// values est typé unknown : les données viennent du navigateur, on les vérifie avec zod.
export async function login(values: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Messages de Supabase traduits pour l'utilisateur.
    if (error.code === "email_not_confirmed") {
      return { error: "Confirmez d'abord votre email avec le lien reçu." };
    }
    return { error: "Email ou mot de passe incorrect." };
  }

  // La session est enregistrée dans les cookies : on part sur le Dashboard.
  redirect("/");
}

// Création d'un compte : prénom, nom, email, mot de passe.
export async function signup(values: unknown): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Vérifiez les champs du formulaire." };
  }
  const { firstname, lastname, email, password } = parsed.data;

  // Adresse du site (ex. http://localhost:3000), pour le lien de confirmation par email.
  const origin = (await headers()).get("origin") ?? "";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Le prénom et le nom sont aussi gardés dans le compte Supabase Auth.
      data: { firstname, lastname },
      // Si la confirmation par email est activée, le lien ramène sur /auth/confirm.
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { error: "Un compte existe déjà avec cet email." };
    }
    if (error.code === "weak_password") {
      return { error: "Ce mot de passe est trop faible : choisissez-en un autre." };
    }
    return { error: "Impossible de créer le compte. Réessayez." };
  }

  // Quand la confirmation par email est activée et que l'email existe déjà,
  // Supabase ne renvoie pas d'erreur mais un compte sans « identité ».
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  // Le trigger on_auth_user_created de la base a créé le profil (id + email).
  // On complète le prénom et le nom, qu'il ne recopie pas.
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ firstname, lastname })
      .eq("id", data.user.id);

    if (profileError) {
      return { error: "Le compte est créé, mais le profil n'a pas pu être complété." };
    }
  }

  // Pas de session : Supabase attend la confirmation de l'email.
  if (!data.session) {
    redirect(
      withMessage("/connexion", "Compte créé : confirmez votre email, puis connectez-vous"),
    );
  }

  redirect(withMessage("/", "Bienvenue dans l'équipe !"));
}

// Déconnexion, depuis le menu de l'avatar.
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(withMessage("/connexion", "Vous êtes déconnecté"));
}
