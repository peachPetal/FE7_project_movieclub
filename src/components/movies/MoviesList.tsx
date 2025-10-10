import { useEffect } from "react";
import { useMovieStore } from "../../stores/movieStore";
import MoviesRendering from "../movies/MoviesRendering";

interface Props {
  variant?: "home" | "page"; // Home 페이지용 or Movies 페이지용
  limit?: number; // variant가 "home"일 때만 적용
}

export default function MoviesList({ variant = "page", limit }: Props) {
  const { movies, isLoading, fetchMovies } = useMovieStore();

  useEffect(() => {
    fetchMovies(variant === "home" ? limit : undefined);
  }, [fetchMovies, limit, variant]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 card-shadow h-40" />
        ))}
      </div>
    );
  }

  return <MoviesRendering data={movies} variant={variant} />;
}
