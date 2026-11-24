import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Sprints · Roadmap",
};

// Écran pas encore construit : page provisoire.
export default function SprintsPage() {
  return <ComingSoon title="Sprints" />;
}
