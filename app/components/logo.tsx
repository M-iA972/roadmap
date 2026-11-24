import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href: string; // où mène un clic sur le logo
  className?: string;
};

// Logo « Roadmap » : un rond en 4 quarts aux couleurs du design system, puis le nom.
export function Logo({ href, className }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 text-titre-section", className)}>
      <span
        aria-hidden="true"
        className="size-6 rounded-full bg-[conic-gradient(var(--color-rose-fuchsia)_0_25%,var(--color-violet-electrique)_0_50%,var(--color-jaune-soleil)_0_75%,var(--color-turquoise)_0)]"
      />
      Roadmap
    </Link>
  );
}
