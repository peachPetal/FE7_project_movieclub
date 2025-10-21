// src/components/reviews/MyPostedReviewsList.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "profile";
};

const MIN_LOADING_TIME = 1000; // 최소 로딩 시간 1초

export default function MyPostedReviewsList({
  authorId,
  variant = "profile",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPostedReviews = async () => {
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
          .rpc("get_reviews_by_user", {
            p_author_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;

        // 최소 로딩 시간 1초 보장
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remaining));

        if (!mounted) return;

        setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("내가 작성한 리뷰 로딩 실패:", e);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchPostedReviews();

    return () => {
      mounted = false;
    };
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant} // profile이면 스켈레톤 4개 렌더링
      isLoading={isLoading}
    />
  );
}
