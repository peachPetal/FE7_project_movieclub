import { useMovieStore } from "../../stores/movieStore";
import MoviesRendering from "./MoviesRendering";
import { useEffect } from "react";

type MoviesListProps = {
  variant?: "home" | "page";
};

export default function MoviesList({ variant = "page" }: MoviesListProps) {
  const { movies, isLoading, fetchMovies } = useMovieStore();

  useEffect(() => {
    // variant에 따라 개수 다르게 불러오기
    const limit = variant === "home" ? 5 : 20; // 홈은 5개, Movies 페이지는 20개
    fetchMovies(limit);
  }, [fetchMovies, variant]);

  return (
    <MoviesRendering data={movies} variant={variant} isLoading={isLoading} />
  );
}
