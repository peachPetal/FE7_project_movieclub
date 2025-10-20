import MovieItem from "./MovieItem";

export default function MoviesRendering({
  data,
  variant = "page",
  isLoading,
}: {
  data: Movie[];
  variant: "page" | "home";
  isLoading: boolean;
}) {
  const list: (Movie | undefined)[] = isLoading
    ? Array.from({ length: 5 }).map(() => undefined)
    : data;

  return (
    <div
      className={
        variant === "home"
          ? "flex gap-[30px] flex-wrap" // ✅ 오타 수정
          : "flex flex-wrap gap-5"
      }
    >
      {list.map((movie, idx) => (
        <MovieItem
          key={(movie && movie.id) ?? `skeleton-${idx}`} // 안전키
          movie={movie}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
