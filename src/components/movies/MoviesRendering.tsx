import MovieItem from "./MovieItem";

type Props = {
  data: Movie[];
  variant?: "home" | "page";
  isLoading?: boolean; // 로딩 상태 추가
};

export default function MoviesRendering({
  data,
  variant = "page",
  isLoading,
}: Props) {
  const list: (Movie | undefined)[] = isLoading
    ? // 로딩 상태에서 스켈레톤(placeholder) 카드를 몇 개 보여줄지를 결정하는 부분
      Array.from({ length: 5 }).map(() => undefined)
    : data;

  // MoviesRendering.tsx
  return (
    <div
      className={
        variant === "home"
          ? "flex gap-[30px] flex-wrap"
          : "flex flex-wrap gap-4"
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
