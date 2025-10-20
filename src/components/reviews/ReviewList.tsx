import { useEffect, useState } from "react";
import ReviewsRendering from "./ReviewsRendering";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset, ReviewsListProps } from "../../types/Review";

export default function ReviewList({
  variant = "page",
  movie_id,
  filter,
}: ReviewsListProps) {
  const [data, setData] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async (limit: number) => {
    try {
      setIsLoading(true);

      if (filter.value === "최신순") {
        const { data: reviews, error } = await supabase
          .from("review_detail")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, limit);

        if (error) throw error;
        setData(reviews);
      } else if (filter.value === "인기순") {
        if (movie_id) {
          const { data: reviews, error } = await supabase
            .from("review_detail")
            .select("*")
            .eq("movie_id", movie_id)
            .order("likes", { ascending: false })
            .range(0, limit);

          if (error) throw error;

          setData(reviews);
        } else {
          const { data: reviews, error } = await supabase
            .from("review_detail")
            .select("*")
            .order("likes", { ascending: false })
            .range(0, limit);

          if (error) throw error;
          setData(reviews);
        }
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const limit = variant === "home" ? 4 : 19;

    fetchPosts(limit);
  }, [filter]);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
  );
}
