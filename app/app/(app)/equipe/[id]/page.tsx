import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, getFullName } from "@/components/avatar";
import { FeatureList } from "@/components/feature-list";
import { LoadingCard } from "@/components/loading-card";
import { PageHeader } from "@/components/page-header";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { getCurrentUser } from "@/lib/auth";
import { getFeatureRows } from "@/lib/data/features";
import { getMember } from "@/lib/data/profiles";

export const metadata: Metadata = {
  title: "Fiche profil · Roadmap",
};

// Écran Fiche profil : la personne et ses features assignées.
export default function ProfilePage({ params }: PageProps<"/equipe/[id]">) {
  return (
    <main className="mx-auto w-full max-w-[1200px] p-page-mobile md:p-page">
      <Suspense fallback={<LoadingCard label="Chargement du profil…" />}>
        <ProfileDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [member, currentUser] = await Promise.all([getMember(id), getCurrentUser()]);
  if (!member) {
    notFound();
  }

  // « Modifier » et « C'est vous » seulement sur son propre profil.
  const isMe = member.id === currentUser.id;
  const features = await getFeatureRows({ assignedTo: member.id });

  return (
    <>
      <PageHeader
        backHref="/equipe"
        backLabel="Équipe"
        action={isMe ? <EditProfileButton user={currentUser} /> : undefined}
      />

      <section className="mb-entre-sections rounded-carte bg-blanc p-carte shadow-carte">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Avatar person={member} size="grand" />
          <div>
            <h1 className="mb-2 text-titre-page">{getFullName(member)}</h1>
            <a href={`mailto:${member.email}`} className="text-violet-electrique hover:underline">
              {member.email}
            </a>
            {isMe && <p className="mt-1 text-petit text-gris-texte">C&apos;est vous</p>}
          </div>
        </div>
      </section>

      <section aria-labelledby="profile-features-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 id="profile-features-title" className="text-titre-section">Features assignées</h2>
          <span className="text-petit text-gris-texte">
            {features.length} feature{features.length > 1 ? "s" : ""}
          </span>
        </div>
        <FeatureList features={features} columns={["module", "sprint", "status", "priority"]} />
      </section>
    </>
  );
}
