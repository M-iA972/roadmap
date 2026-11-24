import { CommentComposer } from "@/components/comments/comment-composer";
import { CommentItem } from "@/components/comments/comment-item";
import { getCurrentUser } from "@/lib/auth";
import { getComments } from "@/lib/data/comments";

// Section « Commentaires » de la fiche feature (composant serveur) :
// la liste, du plus ancien au plus récent, puis la zone d'écriture.
export async function CommentsSection({ featureId }: { featureId: number }) {
  const [comments, user] = await Promise.all([getComments(featureId), getCurrentUser()]);

  return (
    <section aria-labelledby="comments-title" className="rounded-carte bg-blanc p-carte shadow-carte">
      <h2 id="comments-title" className="mb-4 text-titre-section">
        Commentaires <span className="text-petit font-medium text-gris-texte">({comments.length})</span>
      </h2>

      <div className="mb-6 flex flex-col gap-4">
        {comments.length === 0 ? (
          <p className="text-petit text-gris-texte">Aucun commentaire pour l&apos;instant.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} isMine={comment.author.id === user.id} />
          ))
        )}
      </div>

      <CommentComposer featureId={featureId} user={user} />
    </section>
  );
}
