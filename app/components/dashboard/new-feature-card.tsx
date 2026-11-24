import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClasses } from "@/lib/button-styles";
import { cn } from "@/lib/utils";

// Section 3 du Dashboard : bloc « Nouvelle feature ».
export function NewFeatureCard() {
  return (
    <section
      aria-labelledby="new-feature-title"
      className="flex flex-col justify-center rounded-carte bg-rose-clair p-carte text-center shadow-carte"
    >
      <h2 id="new-feature-title" className="text-titre-carte">
        Une nouvelle idée ?
      </h2>
      <p className="mt-2 mb-4 text-petit text-gris-texte">
        Elle part dans le backlog, vous l&apos;assignerez ensuite.
      </p>
      <Link href="/features/nouvelle" className={cn(buttonClasses("principal"), "w-full")}>
        <Plus aria-hidden="true" />
        Nouvelle feature
      </Link>
    </section>
  );
}
