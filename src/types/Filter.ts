export type FilterType = "Movies" | "Reviews" | string;

// 공통 필터 옵션 포맷: value(라벨) + 선택적 meta
export type FilterOption = {
  value: string;
  // TMDB discover/movie 파라미터로 바로 쓰일 값들
  meta?: {
    type?: "genre" | "year" | "sort"; // 필터 종류 구분용
    genreId?: number; // TMDB 장르 ID
    genreName?: string; // TMDB 장르 영문명 (선택)
    year?: number; // primary_release_year
    [key: string]: any; // 필요시 확장
  };
};

// 페이지별 프리셋 옵션
export const FILTER_OPTIONS: Record<FilterType, FilterOption[]> = {
  Movies: [
    // 정렬
    { value: "최신순", meta: { type: "sort" } },
    { value: "인기순", meta: { type: "sort" } },
    { value: "평점순", meta: { type: "sort" } },

    // 장르 (TMDB v3 기준)
    {
      value: "액션",
      meta: { type: "genre", genreId: 28, genreName: "Action" },
    },
    {
      value: "모험",
      meta: { type: "genre", genreId: 12, genreName: "Adventure" },
    },
    {
      value: "애니메이션",
      meta: { type: "genre", genreId: 16, genreName: "Animation" },
    },
    {
      value: "코미디",
      meta: { type: "genre", genreId: 35, genreName: "Comedy" },
    },
    { value: "범죄", meta: { type: "genre", genreId: 80, genreName: "Crime" } },
    {
      value: "다큐멘터리",
      meta: { type: "genre", genreId: 99, genreName: "Documentary" },
    },
    {
      value: "드라마",
      meta: { type: "genre", genreId: 18, genreName: "Drama" },
    },
    {
      value: "가족",
      meta: { type: "genre", genreId: 10751, genreName: "Family" },
    },
    {
      value: "판타지",
      meta: { type: "genre", genreId: 14, genreName: "Fantasy" },
    },
    {
      value: "역사",
      meta: { type: "genre", genreId: 36, genreName: "History" },
    },
    {
      value: "공포",
      meta: { type: "genre", genreId: 27, genreName: "Horror" },
    },
    {
      value: "음악",
      meta: { type: "genre", genreId: 10402, genreName: "Music" },
    },
    {
      value: "미스터리",
      meta: { type: "genre", genreId: 9648, genreName: "Mystery" },
    },
    {
      value: "로맨스",
      meta: { type: "genre", genreId: 10749, genreName: "Romance" },
    },
    {
      value: "SF",
      meta: { type: "genre", genreId: 878, genreName: "Science Fiction" },
    },
    {
      value: "TV 영화",
      meta: { type: "genre", genreId: 10770, genreName: "TV Movie" },
    },
    {
      value: "스릴러",
      meta: { type: "genre", genreId: 53, genreName: "Thriller" },
    },
    {
      value: "전쟁",
      meta: { type: "genre", genreId: 10752, genreName: "War" },
    },
    {
      value: "서부",
      meta: { type: "genre", genreId: 37, genreName: "Western" },
    },

    // 연도 (예시)
    { value: "2025", meta: { type: "year", year: 2025 } },
    { value: "2024", meta: { type: "year", year: 2024 } },
    { value: "2023", meta: { type: "year", year: 2023 } },
    { value: "2022", meta: { type: "year", year: 2022 } },
  ],

  // 다른 페이지용 예시
  Reviews: [{ value: "최신순" }, { value: "인기순" }],
  Comments: [{ value: "최신순" }, { value: "인기순" }],
  Users: [{ value: "모든 유저" }, { value: "친구" }],
  MyPosts: [{ value: "리뷰" }, { value: "댓글" }],
  Likes: [{ value: "리뷰" }, { value: "댓글" }],
};
