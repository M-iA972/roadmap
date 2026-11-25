// Composant client : le clic ouvre le choix de fichier, puis la photo est envoyée
// depuis le navigateur vers Supabase Storage. Il faut donc des événements, un state
// et le client Supabase du navigateur.
"use client";

import { useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { updateMyAvatar } from "@/app/(app)/equipe/actions";
import { Avatar } from "@/components/avatar";
import { useToast } from "@/components/toast";
import type { CurrentUser } from "@/lib/auth";
import { AVATAR_ACCEPT, uploadAvatar } from "@/lib/avatar-upload";

// Avatar de sa propre fiche profil : un clic ouvre le choix d'une nouvelle photo.
export function AvatarUploadButton({ user }: { user: CurrentUser }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  // isPending est vrai pendant l'envoi de la photo.
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();

  function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permet de rechoisir le même fichier ensuite
    if (!file) return;
    setError(null);

    startTransition(async () => {
      // 1. Contrôles + envoi dans Storage (avatars/<id>/profile.<extension>)
      const upload = await uploadAvatar(user.id, file);
      if ("error" in upload) {
        setError(upload.error);
        return;
      }
      // 2. Enregistrement de l'adresse dans profiles.avatar_url (Server Action)
      const saved = await updateMyAvatar(upload.url);
      if ("error" in saved) {
        setError(saved.error);
        return;
      }
      showToast(saved.message);
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        aria-label="Changer ma photo de profil"
        className="group relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-fuchsia disabled:opacity-60"
      >
        <Avatar person={user} size="tres-grand" />
        {/* Icône appareil photo, visible au survol ou au clavier */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-noir-doux/50 text-blanc opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Camera className="size-6" />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        onChange={choosePhoto}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      />
      {isPending && <span className="text-petit text-gris-texte">Envoi de la photo…</span>}
      {error && (
        <p role="alert" className="text-petit text-rouge-cerise">
          {error}
        </p>
      )}
    </div>
  );
}
