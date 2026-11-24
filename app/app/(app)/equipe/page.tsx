import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Avatar } from "@/components/avatar";
import { LoadingCard } from "@/components/loading-card";
import { getMembersWithFeatureCount } from "@/lib/data/profiles";
import { stretchedLink } from "@/lib/row-link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Équipe · Roadmap",
};

// Écran Équipe : le tableau des membres.
export default function TeamPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement de l'équipe…" />}>
        <TeamList />
      </Suspense>
    </main>
  );
}

// Colonnes : photo, prénom, nom, email, nombre de features assignées.
const columns =
  "grid grid-cols-1 gap-2 md:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.6fr)_160px] md:items-center md:gap-4";

async function TeamList() {
  const members = await getMembersWithFeatureCount();

  return (
    <>
      <header className="mb-entre-sections">
        <h1 className="text-titre-page">Équipe</h1>
        <p className="mt-1 text-petit text-gris-texte">
          {members.length} membre{members.length > 1 ? "s" : ""}
        </p>
      </header>

      <div role="table" aria-label="Membres de l'équipe" className="flex flex-col gap-entre-lignes">
        <div role="row" className={cn(columns, "hidden px-6 md:grid")}>
          <span role="columnheader" className="text-libelle text-gris-texte">Photo</span>
          <span role="columnheader" className="text-libelle text-gris-texte">Prénom</span>
          <span role="columnheader" className="text-libelle text-gris-texte">Nom</span>
          <span role="columnheader" className="text-libelle text-gris-texte">Email</span>
          <span role="columnheader" className="text-libelle text-gris-texte">Features assignées</span>
        </div>

        {members.map((member) => (
          <div
            key={member.id}
            role="row"
            className={cn(
              columns,
              "relative rounded-carte bg-blanc px-6 py-4 shadow-carte transition-colors hover:bg-rose-clair",
            )}
          >
            <span role="cell">
              <Avatar person={member} />
            </span>
            <span role="cell">
              {/* Un clic n'importe où sur la ligne ouvre la fiche profil. */}
              <Link href={`/equipe/${member.id}`} className={stretchedLink}>
                {member.firstname ?? "—"}
              </Link>
            </span>
            <span role="cell" className="font-semibold">{member.lastname ?? "—"}</span>
            <span role="cell" className="truncate text-petit text-gris-texte">{member.email}</span>
            <span role="cell" className="text-petit text-gris-texte">
              {member.featureCount} feature{member.featureCount > 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
