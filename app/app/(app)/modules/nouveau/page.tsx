import type { Metadata } from "next";
import { ModuleForm } from "@/components/modules/module-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Nouveau module · Roadmap",
};

// Écran Nouveau module. Aucune donnée à lire : la page est entièrement statique.
export default function NewModulePage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <PageHeader
        backHref="/modules"
        backLabel="Modules"
        title="Nouveau module"
        subtitle="Un module regroupe les features d'une même zone de l'app."
      />
      <ModuleForm defaultValues={{ name: "", description: "", color: "#E8308C" }} />
    </main>
  );
}
