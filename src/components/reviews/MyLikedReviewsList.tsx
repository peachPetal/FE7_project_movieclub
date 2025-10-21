import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "profile";
};

const MIN_LOADING_TIME = 1000; // 최소 로딩시간 1초

export default function MyLikedReviewsList({
  authorId,
  variant = "profile",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchLikedReviews = async () => {
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
          .rpc("get_liked_reviews", {
            p_user_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;

        // 최소 로딩시간 1초 보장
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remaining));

        if (!mounted) return;

        if (data && Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (e) {
        console.error("좋아요 한 리뷰 로딩 실패:", e);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchLikedReviews();

    return () => {
      mounted = false;
    };
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant}
      isLoading={isLoading} // 최소 1초 동안 true 유지
    />
  );
}
