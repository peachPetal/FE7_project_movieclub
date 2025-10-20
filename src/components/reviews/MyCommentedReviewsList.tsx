import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "page" | "home";
};

export default function MyCommentedReviewsList({
  authorId,
  variant = "page",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommentedReviews = async () => {
      if (!authorId) {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // 1단계에서 만든 RPC 호출
        const { data, error } = await supabase
          .rpc("get_reviews_commented_by_user", {
            p_author_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;
        if (data && Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (e) {
        console.error("내가 댓글 단 리뷰 로딩 실패:", e);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommentedReviews();
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant}
      isLoading={isLoading}
    />
  );
}