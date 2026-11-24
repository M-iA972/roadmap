import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingCard } from "@/components/loading-card";
import { ModuleForm } from "@/components/modules/module-form";
import { PageHeader } from "@/components/page-header";
import { getModule } from "@/lib/data/modules";
import { parseId } from "@/lib/params";

export const metadata: Metadata = {
  title: "Modifier le module · Roadmap",
};

// Écran Modifier le module : le même formulaire, déjà rempli.
export default function EditModulePage({ params }: PageProps<"/modules/[id]/modifier">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement du module…" />}>
        <EditModule params={params} />
      </Suspense>
    </main>
  );
}

async function EditModule({ params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  const moduleData = id === null ? null : await getModule(id);
  if (!moduleData) {
    notFound();
  }

  return (
    <>
      <PageHeader
        backHref={`/modules/${moduleData.id}`}
        backLabel="Fiche module"
        title="Modifier le module"
        subtitle={moduleData.name}
      />
      <ModuleForm
        moduleId={moduleData.id}
        defaultValues={{
          name: moduleData.name,
          description: moduleData.description ?? "",
          color: moduleData.color,
        }}
      />
    </>
  );
}
