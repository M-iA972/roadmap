// Composant client : le champ du commentaire est suivi par react-hook-form
// et vidé après l'envoi, ce qui demande du state dans le navigateur.
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { addComment } from "@/app/(app)/features/comment-actions";
import { Avatar } from "@/components/avatar";
import { fieldMessageId } from "@/components/form-field";
import { useToast } from "@/components/toast";
import type { CurrentUser } from "@/lib/auth";
import { buttonClasses } from "@/lib/button-styles";
import { textareaClasses } from "@/lib/form-styles";
import { commentSchema, type CommentValues } from "@/lib/schemas/comment";

// Zone d'écriture d'un nouveau commentaire, avec l'avatar de la personne connectée.
export function CommentComposer({ featureId, user }: { featureId: number; user: CurrentUser }) {
  const showToast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(values: CommentValues) {
    const result = await addComment(featureId, values);
    if (result?.error) {
      setError("content", { message: result.error });
      return;
    }
    reset(); // vide le champ
    showToast("Commentaire envoyé");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex items-start gap-3">
      <Avatar person={user} />
      <div className="flex-1">
        <label htmlFor="new-comment" className="sr-only">
          Écrire un commentaire
        </label>
        <textarea
          id="new-comment"
          placeholder="Écrire un commentaire…"
          aria-invalid={errors.content ? true : undefined}
          aria-describedby={fieldMessageId("new-comment")}
          className={textareaClasses(Boolean(errors.content))}
          {...register("content")}
        />
        {errors.content && (
          <p id={fieldMessageId("new-comment")} role="alert" className="mt-1 pl-4 text-petit text-rouge-cerise">
            {errors.content.message}
          </p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} className={buttonClasses("principal")}>
        <Send aria-hidden="true" />
        {isSubmitting ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
