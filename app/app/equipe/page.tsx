import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Équipe · Roadmap",
};

// Écran pas encore construit : page provisoire.
export default function EquipePage() {
  return <ComingSoon title="Équipe" />;
}
