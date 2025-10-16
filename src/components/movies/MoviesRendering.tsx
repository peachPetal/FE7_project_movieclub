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
    ? // 로딩 상태에서 스켈레톤(placeholder) 카드를 몇 개 보여줄지를 결정하는 부분
      Array.from({ length: 5 }).map(() => undefined)
    : data;

  return (
    <div
      className={
        variant === "home"
          ? "flex gap-[30px] flex-wrap"
          : "flex flex-wrap gap-5"
      }
    >
      {list.map((movie, idx) => (
        <MovieItem
          key={(movie && movie.id) ?? `skeleton-${idx}`}
          movie={movie}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
