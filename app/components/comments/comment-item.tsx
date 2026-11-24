// Composant client : le texte devient modifiable sur place au clic sur « Modifier »,
// ce qui demande un state (mode lecture ou modification) dans le navigateur.
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { deleteComment, updateComment } from "@/app/(app)/features/comment-actions";
import { Avatar, getFullName } from "@/components/avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/toast";
import { buttonClasses } from "@/lib/button-styles";
import type { FeatureComment } from "@/lib/data/comments";
import { formatDateTime } from "@/lib/format";
import { textareaClasses } from "@/lib/form-styles";
import { commentSchema, type CommentValues } from "@/lib/schemas/comment";
import { cn } from "@/lib/utils";

type CommentItemProps = {
  comment: FeatureComment;
  isMine: boolean; // vrai si la personne connectée en est l'autrice : boutons Modifier / Supprimer
};

// Un commentaire : avatar, auteur, date, texte.
export function CommentItem({ comment, isMine }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const authorName = getFullName(comment.author);

  return (
    <article className="flex gap-3">
      <Link href={`/equipe/${comment.author.id}`} aria-label={`Profil de ${authorName}`}>
        <Avatar person={comment.author} />
      </Link>

      <div className="flex-1 rounded-carte bg-fond px-4 py-3">
        <header className="mb-1 flex flex-wrap items-baseline gap-2">
          <strong className="font-semibold">{authorName}</strong>
          <time dateTime={comment.created_at} className="text-petit text-gris-texte">
            {formatDateTime(comment.created_at)}
          </time>

          {isMine && !isEditing && (
            <div className="ml-auto flex gap-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={buttonClasses("lien", "mini")}
              >
                <Pencil aria-hidden="true" />
                Modifier
              </button>
              <ConfirmDialog
                title="Supprimer ce commentaire ?"
                text="Votre commentaire sera supprimé définitivement."
                successMessage="Commentaire supprimé"
                onConfirm={() => deleteComment(comment.id)}
                trigger={(open) => (
                  <button
                    type="button"
                    onClick={open}
                    className={cn(buttonClasses("lien", "mini"), "text-rouge-cerise")}
                  >
                    <Trash2 aria-hidden="true" />
                    Supprimer
                  </button>
                )}
              />
            </div>
          )}
        </header>

        {isEditing ? (
          <EditCommentForm comment={comment} onDone={() => setIsEditing(false)} />
        ) : (
          <p className="whitespace-pre-line">{comment.content}</p>
        )}
      </div>
    </article>
  );
}

// Le texte du commentaire, modifiable sur place, avec « Annuler » et « Enregistrer ».
function EditCommentForm({ comment, onDone }: { comment: FeatureComment; onDone: () => void }) {
  const showToast = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: comment.content },
  });

  async function onSubmit(values: CommentValues) {
    const result = await updateComment(comment.id, values);
    if (result?.error) {
      setError("content", { message: result.error });
      return;
    }
    onDone();
    showToast("Commentaire modifié");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <textarea
        aria-label="Modifier le commentaire"
        autoFocus
        aria-invalid={errors.content ? true : undefined}
        className={cn(textareaClasses(Boolean(errors.content)), "mt-1 min-h-20")}
        {...register("content")}
      />
      {errors.content && (
        <p role="alert" className="mt-1 pl-4 text-petit text-rouge-cerise">
          {errors.content.message}
        </p>
      )}
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            onDone();
            showToast("Modification annulée");
          }}
          className={buttonClasses("discret", "petit")}
        >
          Annuler
        </button>
        <button type="submit" disabled={isSubmitting} className={buttonClasses("principal", "petit")}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
