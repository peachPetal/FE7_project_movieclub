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

  return <></>;
}

export default MoviesRendering;
