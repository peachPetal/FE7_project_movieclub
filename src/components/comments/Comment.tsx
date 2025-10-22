import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import FilterDropdown from "../common/buttons/FilterDropdown";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useUserProfile } from "../../hooks/useUserProfile";
import { FILTER_OPTIONS, type FilterOption } from "../../types/Filter";
import CommentItemSkeleton from "../skeleton/CommentItemSkeleton";

export default function Comment({ review_id }: { review_id: string }) {
  const { profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState<ReviewComment[]>();
  const [filter, setFilter] = useState<FilterOption>(
    FILTER_OPTIONS.Comments[0]
  );
  const handleChangeFilter = (filter: FilterOption) => {
    setFilter(filter);
    if (filter.value === "인기순") {
      setComment(comment?.sort((a, b) => b.likes - a.likes));
    } else if (filter.value === "최신순") {
      setComment(
        comment?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    }
  };

  const getComments = async () => {
    setIsLoading(true);
    if (review_id) {
      const { data, error } = await supabase
        .from("comment_detail")
        .select("*")
        .eq("review_id", Number(review_id))
        .eq("depth", 0)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setComment(data);

      const { data: commentData, error: commentDataError } = await supabase
        .from("comment_detail")
        .select("*")
        .eq("review_id", Number(review_id));

      if (commentDataError) throw commentDataError;

      setCommentCount(commentData?.length ?? 0);
    }
    setIsLoading(false);
  };

  const handleCommentCountAdd = () => {
    setCommentCount((prev) => prev + 1);
  };

  useEffect(() => {
    getComments();
  }, []);

  if (isLoading) <CommentItemSkeleton />;
  else {
    return (
      <>
        <div className="comment-area text-text-main">
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
          <CommentInput profile={profile} getComments={getComments} />
          {comment?.length ? (
            <CommentList
              profile={profile}
              comments={comment}
              handleCommentCountAdd={handleCommentCountAdd}
            />
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
