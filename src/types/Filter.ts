export type FilterType =
  | "Movies"
  | "Reviews"
  | "Comments"
  | "Users"
  | "MyPosts"
  | "Likes";

export type FilterOption = {
  value: string;
};

export const FILTER_OPTIONS: Record<FilterType, FilterOption[]> = {
  Movies: [{ value: "전체 보기" }, { value: "로맨스" }, { value: "액션" }],
  Reviews: [{ value: "최신순" }, { value: "인기순" }],
  Comments: [{ value: "최신순" }, { value: "인기순" }],
  Users: [{ value: "모든 유저" }, { value: "친구" }],
  MyPosts: [{ value: "리뷰" }, { value: "댓글" }],
  Likes: [{ value: "영화" }, { value: "리뷰" }],
};
