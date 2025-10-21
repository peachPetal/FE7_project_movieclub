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
  const skeletonCount = variant === "home" ? 5 : 20;

  const list: (Movie | undefined)[] = isLoading
    ? Array.from({ length: skeletonCount }).map(() => undefined)
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
