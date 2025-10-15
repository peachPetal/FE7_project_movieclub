import type { Database } from "./database";

type ReviewsListProps = {
  variant?: "home" | "page";
};

type Review = Database["public"]["Tables"]["reviews"]["Row"];

type ReviewSubset = Pick<
  Review,
  "id" | "title" | "content" | "thumbnail" | "movie_id" | "created_at"
>;

type ReviewWithDetail = ReviewSubset & {
  likes?: { count: number }[];
  comments?: { count: number }[];
  users?: { name: string };
};

interface ReviewRenderProps {
  data: ReviewSubset[];
  variant: "home" | "page";
  isLoading: boolean;
}
