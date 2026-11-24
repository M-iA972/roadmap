import { TopNav } from "@/components/top-nav";

// Layout des pages privées (groupe « (app) » : les parenthèses n'apparaissent pas dans l'URL).
// Le proxy (proxy.ts) a déjà renvoyé vers /connexion les personnes non connectées.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* Menu du haut, affiché sur toutes les pages privées */}
      <TopNav />
      {children}
    </>
  );
}
