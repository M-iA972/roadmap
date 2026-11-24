import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Créer mon compte · Roadmap",
};

// Écran Créer mon compte : prénom, nom, email, mot de passe.
export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 text-titre-page">Créer mon compte</h1>
      <p className="text-petit text-gris-texte">Rejoignez l&apos;équipe sur Roadmap.</p>

      <SignupForm />

      <p className="mt-6 text-center text-petit text-gris-texte">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-violet-electrique hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  );
}
