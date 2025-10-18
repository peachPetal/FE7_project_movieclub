import { useEffect, useState } from "react";
import ReviewsRendering from "./ReviewsRendering";
import { supabase } from "../../utils/supabase";
import type {
  ReviewSubset,
  ReviewWithDetail,
  ReviewsListProps,
} from "../../types/Review";

export default function ReviewList({ variant = "page" }: ReviewsListProps) {
  const [data, setData] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async (limit: number) => {
    try {
      setIsLoading(true);

      const { data: reviews, error } = await supabase
        .from("reviews")
        .select(
          `
            id,
            author_id,
            title,
            content,
            thumbnail,
            movie_id,
            movie_name,
            created_at,
            users!inner(
              name
            ),
            comments:review_comments(count),
            likes:review_likes(count)`
        )
        .order("created_at", { ascending: false })
        .range(0, limit);

      const finalData: ReviewWithDetail[] = [];
      reviews?.map((review) =>
        finalData.push({
          ...review,
          comments: review.comments[0].count,
          likes: review.likes[0].count,
        })
      );
      if (error) throw error;
      setData(finalData);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const limit = variant === "home" ? 5 : 20;

    fetchPosts(limit);
  }, [variant]);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
  );
}
