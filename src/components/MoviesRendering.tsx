// import React from "react";
import { useEffect } from "react";
import { useMovieStore } from "../stores/movieStore";

interface Props {
  variant?: "home" | "page"; // Home 페이지용 or Movies 페이지용
  limit?: number; // variant가 "home"일 때만 적용, 표시할 영화 개수 제한
}

function MoviesRendering({ variant = "page", limit }: Props) {
  const { movies, isLoading, fetchMovies } = useMovieStore();

  // 컴포넌트가 마운트될 때 영화 데이터를 가져옴
  useEffect(() => {
    fetchMovies(variant === "home" ? limit : undefined);
  }, [fetchMovies, limit]);

  // 로딩동안 빈 카드 틀 표시
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 card-shadow h-40" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        variant === "home"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      }
    >
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="rounded-lg border border-gray-200 card-shadow hover:shadow-md transition p-3"
        >
          <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center text-gray-400">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              "No Poster"
            )}
          </div>
          <div className="mt-2">
            <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
            <p className="text-xs text-gray-500">{movie.year}</p>
            {movie.rating && (
              <span className="inline-block mt-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                ★ {movie.rating}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoviesRendering;
