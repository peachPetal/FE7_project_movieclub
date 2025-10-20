import type { UserProfile } from "../../hooks/useUserProfile";
import ReplyItem from "./ReplyItem";

export default function ReplyList({
  profile,
  replys,
}: {
  profile: UserProfile | null | undefined;
  replys: ReviewComment[];
}) {
  return (
    <>
      <div className="reply-list space-y-3 mb-3">
        {replys.map((r) => (
          <ReplyItem profile={profile} reply={r} />
        ))}
      </div>
    </>
  );
}
