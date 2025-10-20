import type { UserProfile } from "../../hooks/useUserProfile";
import CommentItem from "./CommentItem";

export default function CommentList({
  profile,
  comments,
}: {
  profile: UserProfile | undefined | null;
  comments: ReviewComment[] | undefined;
}) {
  if (!comments) return <p>로딩중...</p>;
  else {
    return (
      <>
        {comments.map((comment) => (
          <CommentItem key={comment.id} profile={profile} comment={comment} />
        ))}
      </>
    );
  }
}
