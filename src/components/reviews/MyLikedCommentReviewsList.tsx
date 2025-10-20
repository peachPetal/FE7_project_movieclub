// src/components/reviews/MyLikedCommentReviewsList.tsx (새 파일)

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review"; // (타입 경로 확인)
import ReviewsRendering from "./ReviewsRendering";

type Props = {
  authorId: string | null | undefined;
  variant?: "page" | "home";
};

export default function MyLikedCommentReviewsList({
  authorId,
  variant = "page",
}: Props) {
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      if (!authorId) {
        setReviews([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // ✅ 1. 'get_reviews_with_liked_comments' RPC 호출
        const { data, error } = await supabase
          .rpc("get_reviews_with_liked_comments", {
            p_user_id: authorId,
          })
          .returns<ReviewSubset[]>();

        if (error) throw error;
        if (data && Array.isArray(data)) {
          setReviews(data);
        } else {
          if (data) { 
            console.error("Supabase RPC type mismatch error:", (data as any).Error);
          }
          setReviews([]);
        }
      } catch (e) {
        console.error("좋아요 한 댓글의 리뷰 로딩 실패:", e);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, [authorId]);

  return (
    <ReviewsRendering
      data={reviews}
      variant={variant}
      isLoading={isLoading}
    />
  );
}