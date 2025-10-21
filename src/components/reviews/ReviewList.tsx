import { useEffect, useState } from "react";
import ReviewsRendering from "./ReviewsRendering";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
import type { FilterOption } from "../../types/Filter";

type Props = {
  variant?: "page" | "home";
  filter?: FilterOption;
  movie_id?: number | null; // movie_id 타입 에러 수정
  authorId?: string | null;
};

const DEFAULT_FILTER: FilterOption = {
  value: "최신순",
};

const MIN_LOADING_TIME = 1000; // ✅ 최소 로딩시간 (1초)

export default function ReviewList({
  variant = "page",
  filter = DEFAULT_FILTER,
  movie_id,
  authorId,
}: Props) {
  const [data, setData] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true); // ✅ 실제 표시용 상태

  // ✅ 최소 로딩 시간 로직
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => setShowLoading(false), MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const fetchPosts = async (
    limit: number,
    author: string | null | undefined
  ) => {
    try {
      setIsLoading(true);
      let query = supabase.from("review_detail").select("*");

      if (author) {
        query = query.eq("author_id", author);
      }

      if (filter.value === "인기순") {
        if (movie_id) {
          query = query
            .eq("movie_id", movie_id)
            .order("likes", { ascending: false });
        } else {
          query = query.order("likes", { ascending: false });
        }
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data: reviews, error } = await query.range(0, limit - 1);

      if (error) throw error;
      setData(reviews || []);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const limit = variant === "home" ? 4 : 16;
    fetchPosts(limit, authorId);
  }, [filter, variant, authorId]);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={showLoading} />
  );
}

// import { useEffect, useState } from "react";
// import ReviewsRendering from "./ReviewsRendering";
// import { supabase } from "../../utils/supabase";
// import type { ReviewSubset, ReviewsListProps } from "../../types/Review";

// export default function ReviewList({
//   variant = "page",
//   filter,
// }: ReviewsListProps) {
//   const [data, setData] = useState<ReviewSubset[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchPosts = async (limit: number) => {
//     try {
//       setIsLoading(true);

//       if (filter.value === "최신순") {
//         const { data: reviews, error } = await supabase
//           .from("review_detail")
//           .select("*")
//           .order("created_at", { ascending: false })
//           .range(0, limit);

//         if (error) throw error;
//         setData(reviews);
//         setIsLoading(false);
//       } else if (filter.value === "인기순") {
//         const { data: reviews, error } = await supabase
//           .from("review_detail")
//           .select("*")
//           .order("likes", { ascending: false })
//           .range(0, limit);

//         if (error) throw error;
//         setData(reviews);
//         setIsLoading(false);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     const limit = variant === "home" ? 5 : 20;

//     fetchPosts(limit);
//   }, [filter]);

//   return (
//     <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
//   );
// }
