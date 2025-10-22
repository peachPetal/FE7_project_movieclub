import type { UserProfile } from "../../hooks/useUserProfile";
import CommentItemSkeleton from "../skeleton/CommentItemSkeleton";
import CommentItem from "./CommentItem";

export default function CommentList({
  profile,
  comments,
  handleCommentCountAdd,
}: {
  profile: UserProfile | undefined | null;
  comments: ReviewComment[] | undefined;
  handleCommentCountAdd: () => void;
}) {
  if (!comments) return <CommentItemSkeleton />;
  else {
    return (
      <>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            profile={profile}
            comment={comment}
            handleCommentCountAdd={handleCommentCountAdd}
          />
        ))}
      </>
    );
  }
}
