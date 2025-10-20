import { useEffect, useState } from "react";
import ReviewsRendering from "./ReviewsRendering";
import { supabase } from "../../utils/supabase";
import type { ReviewSubset } from "../../types/Review";
// ✅ 1. FilterOption 타입을 가져옵니다 (경로가 다를 경우 수정하세요)
import type { FilterOption } from "../../types/Filter";

// ✅ 2. 'filter'를 선택적(optional) prop으로 변경합니다.
type Props = {
  variant?: "page" | "home";
  filter?: FilterOption; // 👈 'ReviewsListProps' 대신 'filter'를 직접 optional로 받음
  authorId?: string | null;
};

// ✅ 3. 'filter' prop이 전달되지 않을 경우 사용할 기본값
const DEFAULT_FILTER: FilterOption = {
  // (FILTER_OPTIONS.MyPosts[0]와 동일한 값을 사용하세요. 임시값입니다.)
  value: "최신순",
};

export default function ReviewList({
  variant = "page",
  filter = DEFAULT_FILTER, // ✅ 4. 'filter' prop에 기본값 할당
  movie_id,
  authorId,
}: Props) {
  const [data, setData] = useState<ReviewSubset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        if (movie_id)
          query = query
            .eq("movie_id", movie_id)
            .order("likes", { ascending: false });
        else {
          query = query.order("likes", { ascending: false });
        }
      } else {
        // "최신순" (기본값)
        query = query.order("created_at", { ascending: false });
      }

      const { data: reviews, error } = await query.range(0, limit);

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
    const limit = variant === "home" ? 5 : 20;

    fetchPosts(limit, authorId);
  }, [filter, variant, authorId]);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
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
