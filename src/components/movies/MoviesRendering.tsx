import MovieItem from "./MovieItem";

type Props = {
  data: Movie[];
  variant?: "home" | "page";
};

export default function MoviesRendering({ data, variant = "page" }: Props) {
  return (
    <div
      className={
        variant === "home"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      }
    >
      {data.map((movie) => (
        <MovieItem key={movie.id} data={movie} />
      ))}
    </div>
  );
}
