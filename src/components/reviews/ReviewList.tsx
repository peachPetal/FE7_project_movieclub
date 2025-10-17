import { useEffect, useState } from "react";
import ReviewsRendering from "./ReviewsRendering";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset, ReviewsListProps } from "../../types/review";

export default function ReviewList({ variant = "page" }: ReviewsListProps) {
  const [data, setData] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const limit = variant === "home" ? 5 : 20;
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        const { data: reviews, error } = await supabase
          .from("reviews")
          .select(
            `
            id,
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

        if (error) throw error;

        setData(reviews);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPosts();
  }, [variant]);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
  );
}
