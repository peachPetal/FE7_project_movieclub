import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import FilterDropdown from "../common/buttons/FilterDropdown";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useUserProfile } from "../../hooks/useUserProfile";
import { FILTER_OPTIONS, type FilterOption } from "../../types/Filter";

export default function Comment({ review_id }: { review_id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState<ReviewComment[]>();
  const { profile } = useUserProfile();

  const getComments = async () => {
    if (review_id) {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("review_comments")
        .select(
          "*, users!inner(name, avatar_url), likes:review_comment_likes(count)"
        )
        .eq("review_id", Number(review_id))
        .eq("depth", 0)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const commentData = data.map((d) => {
        return {
          id: d.id,
          created_at: d.created_at,
          author_id: d.author_id,
          content: d.content,
          depth: d.depth,
          parent_comment_id: d.parent_comment_id,
          name: d.users["name"],
          avatar_url: d.users["avatar_url"],
          likes: d.likes[0].count,
        };
      });

      setComment(commentData);

      const { data: commentCountData, error: commentCountError } =
        await supabase
          .from("review_comments")
          .select("*, users!inner(name, avatar_url)")
          .eq("review_id", Number(review_id))
          .order("created_at", { ascending: false });

      if (commentCountError) throw error;

      setCommentCount(commentCountData?.length ?? 0);

      setIsLoading(false);
    }
  };

  const [filter, setFilter] = useState<FilterOption>(
    FILTER_OPTIONS.Comments[0]
  );
  const handleChangeFilter = (filter: FilterOption) => {
    setFilter(filter);
  };

  useEffect(() => {
    getComments();
  }, []);

  if (isLoading && !profile) {
    // 스켈레톤으로 바꾸기
    return <p>로딩중...</p>;
  } else {
    return (
      <>
        <div className="comment-area text-text-main mr-40">
          <div className="comment-title flex mb-5">
            <h1 className="text-3xl font-bold mr-3.5">
              Comments <span className="text-main">{commentCount}</span>
            </h1>
            <FilterDropdown
              type="Comments"
              filter={filter}
              handleChangeFilter={handleChangeFilter}
            />
          </div>
          <CommentInput profile={profile} />
          {comment?.length ? (
            <CommentList profile={profile} comments={comment} />
          ) : (
            <p className="flex justify-center w-full my-10 text-text-sub">
              아직 등록된 댓글이 없습니다.
            </p>
          )}
        </div>
      </>
    );
  }
}
