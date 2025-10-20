import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "page" | "home";
};

export default function MyLikedReviewsList({
  authorId,
  variant = "page",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedReviews = async () => {
      if (!authorId) {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // 1단계에서 만든 RPC 호출
        const { data, error } = await supabase
          .rpc("get_liked_reviews", {
            p_user_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;
        if (data && Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (e) {
        console.error("좋아요 한 리뷰 로딩 실패:", e);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedReviews();
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant}
      isLoading={isLoading}
    />
  );
}