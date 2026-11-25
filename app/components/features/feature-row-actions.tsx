import Link from "next/link";
import { Pencil } from "lucide-react";
import { DeleteFeatureButton } from "@/components/features/delete-feature-button";
import { buttonClasses } from "@/lib/button-styles";
import { rowControl } from "@/lib/row-link";
import { cn } from "@/lib/utils";

type FeatureRowActionsProps = {
  featureId: number;
  featureTitle: string;
};

// Les boutons « Modifier » et « Supprimer » en bout de ligne d'un tableau de features.
// Le parent décide s'il faut les afficher (voir canEditFeature dans lib/permissions.ts).
export function FeatureRowActions({ featureId, featureTitle }: FeatureRowActionsProps) {
  return (
    <>
      <Link
        href={`/features/${featureId}/modifier`}
        className={cn(rowControl, buttonClasses("secondaire", "petit"))}
      >
        <Pencil aria-hidden="true" />
        Modifier
      </Link>
      <DeleteFeatureButton featureId={featureId} featureTitle={featureTitle} className={rowControl} />
    </>
  );
}
