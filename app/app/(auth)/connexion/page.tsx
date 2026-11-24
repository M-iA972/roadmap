import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion · Roadmap",
};

// Écran Connexion : email et mot de passe. Sans menu du haut (voir app/(auth)/layout.tsx).
export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-titre-page">Connexion</h1>
      <p className="text-petit text-gris-texte">Content de vous revoir !</p>

      <LoginForm />

      <p className="mt-6 text-center text-petit text-gris-texte">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-violet-electrique hover:underline">
          Créer mon compte
        </Link>
      </p>
    </>
  );
}
