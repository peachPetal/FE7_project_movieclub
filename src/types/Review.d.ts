import type { Database } from "./database";

type ReviewsListProps = {
  variant?: "home" | "page";
  filter: FilterOption;
  movie_id?: number;
};

type Review = Database["public"]["Tables"]["reviews"]["Row"];

type ReviewSubset = Pick<
  Review,
  | "id"
  | "title"
  | "content"
  | "thumbnail"
  | "movie_id"
  | "movie_name"
  | "created_at"
>;

type ReviewWithDetail = ReviewSubset & {
  likes?: number;
  comments?: number;
  users?: { name: string }[];
  user?: { name: string };
  like_users?: { user_id: string }[];
};

interface ReviewRenderProps {
  data: Review[] | ReviewSubset[];
  variant?: "home" | "page";
  isLoading: boolean;
}
