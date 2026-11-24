import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider, UrlToast } from "@/components/toast";

// Police du design system. next/font la télécharge au moment de la compilation
// et la sert depuis l'app : aucun appel à Google quand un utilisateur ouvre une page.
// « variable » crée la variable CSS --font-urbanist, utilisée dans globals.css.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Organiser le développement du produit : features, modules et sprints.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* ToastProvider permet à toute l'app d'afficher un message de confirmation. */}
        <ToastProvider>
          {/* UrlToast lit l'URL (?message=…) : il doit être dans un <Suspense>. */}
          <Suspense fallback={null}>
            <UrlToast />
          </Suspense>
          {/* Le menu du haut est ajouté par app/(app)/layout.tsx, pas sur les écrans de connexion. */}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
