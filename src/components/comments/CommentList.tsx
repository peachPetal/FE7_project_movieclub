import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
}: {
  comments: ReviewComment[] | undefined;
}) {
  if (!comments) return <p>로딩중...</p>;
  else {
    return (
      <>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </>
    );
  }
}
