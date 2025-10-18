import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
}: {
  comments: Comment[] | undefined;
}) {
  if (!comments) return <p>로딩중...</p>;
  else {
    return (
      <>
        {comments.map((comment) => (
          <CommentItem comment={comment} />
        ))}
      </>
    );
  }
}
