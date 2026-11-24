import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Fiche profil · Roadmap",
};

// Écran pas encore construit : page provisoire (la fiche profil arrive avec l'écran Équipe).
export default function ProfilePage() {
  return <ComingSoon title="Fiche profil" />;
}
