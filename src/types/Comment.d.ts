type ReviewComment = Database["public"]["Tables"]["review_comments"]["Row"] & {
  name?: string;
  avatar_url?: string;
};
