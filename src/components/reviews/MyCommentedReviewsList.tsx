import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "profile";
};

export default function MyCommentedReviewsList({
  authorId,
  variant = "profile",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchCommentedReviews = async () => {
      if (!authorId) {
        if (mounted) {
          setReviews([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const startTime = Date.now();

      try {
        const { data, error } = await supabase
          .rpc("get_reviews_commented_by_user", {
            p_author_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;

        // 최소 로딩 시간 1초 보장
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remaining));

        if (!mounted) return;

        if (data && Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (e) {
        console.error("내가 댓글 단 리뷰 로딩 실패:", e);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchCommentedReviews();

    return () => {
      mounted = false;
    };
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant}
      isLoading={isLoading}
    />
  );
}
