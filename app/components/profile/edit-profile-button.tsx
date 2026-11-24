// Composant client : la fenêtre, le formulaire (react-hook-form), l'aperçu de la photo
// et son envoi dans Supabase Storage se passent dans le navigateur.
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, User } from "lucide-react";
import { updateMyProfile } from "@/app/(app)/equipe/actions";
import { Avatar } from "@/components/avatar";
import { Dialog } from "@/components/dialog";
import { FormField, fieldMessageId } from "@/components/form-field";
import { useToast } from "@/components/toast";
import type { CurrentUser } from "@/lib/auth";
import { buttonClasses } from "@/lib/button-styles";
import { inputClasses } from "@/lib/form-styles";
import { AVATAR_MAX_SIZE, profileSchema, type ProfileValues } from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/client";

// Chemin de la photo dans le bucket : avatars/<id de la personne>/<date>.<extension>.
// La date rend le nom unique : une nouvelle photo ne remplace jamais l'ancienne en cache.
function avatarPath(userId: string, photo: File): string {
  const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
  return `${userId}/${Date.now()}.${extension}`;
}

// Bouton « Modifier » de sa propre fiche profil.
export function EditProfileButton({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClasses("secondaire")}>
        <Pencil aria-hidden="true" />
        Modifier
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Modifier mon profil">
        <EditProfileForm user={user} onDone={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
}

// Le formulaire de la fenêtre. Il est recréé à chaque ouverture.
function EditProfileForm({ user, onDone }: { user: CurrentUser; onDone: () => void }) {
  const showToast = useToast();
  const [photo, setPhoto] = useState<File | null>(null); // la nouvelle photo choisie
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // son aperçu
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      email: user.email,
    },
  });

  // L'aperçu est une adresse temporaire créée par le navigateur :
  // on la libère quand la photo change ou quand la fenêtre se ferme.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function choosePhoto(file: File | undefined) {
    setPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choisissez une image (JPG ou PNG).");
      return;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      setPhotoError("La photo doit faire 2 Mo au plus.");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: ProfileValues) {
    // 1. La photo part directement du navigateur vers Supabase Storage
    //    (une Server Action est limitée à 1 Mo, trop peu pour une photo).
    //    Elle est rangée dans le dossier de la personne : avatars/<son id>/<date>.jpg
    let avatarUrl: string | null = null;
    if (photo) {
      const supabase = createClient();
      const path = avatarPath(user.id, photo);

      const { error } = await supabase.storage.from("avatars").upload(path, photo);
      if (error) {
        setPhotoError("La photo n'a pas pu être envoyée. Réessayez.");
        return;
      }
      // Le bucket est public : la photo a une adresse fixe, lisible par tous.
      avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }

    // 2. Le prénom, le nom, l'email et l'adresse de la photo sont enregistrés par le serveur.
    const result = await updateMyProfile(values, avatarUrl);
    if ("error" in result) {
      setError("root", { message: result.error });
      return;
    }
    onDone();
    showToast(result.message);
  }

  // L'aperçu : la nouvelle photo choisie, sinon la photo actuelle, sinon une icône.
  const preview = photoPreview ? (
    <span
      aria-hidden="true"
      className="size-16 shrink-0 rounded-full border-2 border-blanc bg-cover bg-center"
      style={{ backgroundImage: `url("${photoPreview}")` }}
    />
  ) : user.avatar_url ? (
    <Avatar person={user} size="grand" />
  ) : (
    <span
      aria-hidden="true"
      className="inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-violet-clair text-violet-clair-texte"
    >
      <User className="size-6" />
    </span>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
      <div>
        <span className="mb-2 block text-libelle">Photo</span>
        <div className="flex flex-wrap items-center gap-4">
          {preview}
          <div className="flex flex-col items-start gap-2">
            {/* Le vrai champ fichier est caché : le <label> sert de bouton. */}
            <label className={`${buttonClasses("secondaire", "petit")} cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-rose-fuchsia`}>
              Choisir une photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => choosePhoto(event.target.files?.[0])}
              />
            </label>
            <span className={photoError ? "text-petit text-rouge-cerise" : "text-petit text-gris-texte"} role={photoError ? "alert" : undefined}>
              {photoError ?? photo?.name ?? "JPG ou PNG, carrée de préférence, 2 Mo au plus."}
            </span>
          </div>
        </div>
      </div>

      <FormField id="profile-firstname" label="Prénom" error={errors.firstname?.message}>
        <input
          id="profile-firstname"
          autoComplete="given-name"
          aria-invalid={errors.firstname ? true : undefined}
          aria-describedby={fieldMessageId("profile-firstname")}
          className={inputClasses(Boolean(errors.firstname))}
          {...register("firstname")}
        />
      </FormField>

      <FormField id="profile-lastname" label="Nom" error={errors.lastname?.message}>
        <input
          id="profile-lastname"
          autoComplete="family-name"
          aria-invalid={errors.lastname ? true : undefined}
          aria-describedby={fieldMessageId("profile-lastname")}
          className={inputClasses(Boolean(errors.lastname))}
          {...register("lastname")}
        />
      </FormField>

      <FormField id="profile-email" label="Email" error={errors.email?.message}>
        <input
          id="profile-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={fieldMessageId("profile-email")}
          className={inputClasses(Boolean(errors.email))}
          {...register("email")}
        />
      </FormField>

      {errors.root && (
        <p role="alert" className="text-petit text-rouge-cerise">
          {errors.root.message}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            onDone();
            showToast("Modification annulée");
          }}
          className={buttonClasses("discret")}
        >
          Annuler
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClasses("principal")}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
