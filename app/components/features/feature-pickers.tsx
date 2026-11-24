// Composants clients : un clic dans la liste lance une Server Action
// puis affiche un message, ce qui demande des événements et du state.
"use client";

import { useTransition } from "react";
import { changeFeatureAssignee, changeFeatureSprint } from "@/app/(app)/features/actions";
import { Avatar, getFullName } from "@/components/avatar";
import { FactPicker } from "@/components/features/fact-picker";
import { useToast } from "@/components/toast";
import type { Member } from "@/lib/data/profiles";
import type { SprintOption } from "@/lib/data/sprints";
import { labelOf, SPRINT_STATUSES } from "@/lib/labels";

// Case « Personne assignée » : « Non assignée » puis les membres.
export function AssigneePicker({
  featureId,
  assignee,
  members,
}: {
  featureId: number;
  assignee: Member | null;
  members: Member[];
}) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  function choose(value: string) {
    startTransition(async () => {
      const result = await changeFeatureAssignee(featureId, value || null);
      if (result?.error) {
        showToast(result.error, "erreur");
        return;
      }
      const member = members.find((m) => m.id === value);
      showToast(member ? `Assignée à ${getFullName(member)}` : "Feature non assignée");
    });
  }

  return (
    <FactPicker
      label="Personne assignée"
      disabled={isPending}
      display={
        assignee ? (
          <>
            <Avatar person={assignee} />
            <span className="truncate">{getFullName(assignee)}</span>
          </>
        ) : (
          <span className="text-gris-texte">Non assignée</span>
        )
      }
      selectedValue={assignee?.id ?? ""}
      onSelect={choose}
      options={[
        { value: "", label: "Non assignée" },
        ...members.map((member) => ({
          value: member.id,
          label: getFullName(member),
          lead: <Avatar person={member} />,
        })),
      ]}
    />
  );
}

// Case « Sprint » : « Backlog (aucun sprint) » puis les sprints en planification ou actifs.
export function SprintPicker({
  featureId,
  sprint,
  sprints,
}: {
  featureId: number;
  sprint: SprintOption | null;
  sprints: SprintOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  function choose(value: string) {
    startTransition(async () => {
      const result = await changeFeatureSprint(featureId, value === "" ? null : Number(value));
      if (result?.error) {
        showToast(result.error, "erreur");
        return;
      }
      const chosen = sprints.find((s) => String(s.id) === value);
      showToast(
        chosen
          ? `Déplacée dans « ${chosen.goal ?? "Sprint sans objectif"} »`
          : "Feature remise dans le backlog",
      );
    });
  }

  return (
    <FactPicker
      label="Sprint"
      disabled={isPending}
      display={
        sprint ? (
          <span className="truncate">{sprint.goal ?? "Sprint sans objectif"}</span>
        ) : (
          <span className="text-gris-texte">Backlog</span>
        )
      }
      selectedValue={sprint ? String(sprint.id) : ""}
      onSelect={choose}
      options={[
        { value: "", label: "Backlog (aucun sprint)" },
        ...sprints.map((s) => ({
          value: String(s.id),
          label: s.goal ?? "Sprint sans objectif",
          hint: labelOf(SPRINT_STATUSES, s.status),
        })),
      ]}
    />
  );
}
