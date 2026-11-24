import { Logo } from "@/components/logo";

// Layout des écrans Connexion et Créer mon compte : sans menu du haut,
// une carte blanche centrée au milieu de l'écran.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8">
      <div className="w-full max-w-[460px] rounded-carte bg-blanc p-carte shadow-carte">
        <Logo href="/connexion" className="mb-6" />
        {children}
      </div>
    </main>
  );
}
