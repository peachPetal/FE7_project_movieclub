import { getMovies } from "../../api/tmdb/tmdbUtils";
import MoviesRendering from "./MoviesRendering";
import { useEffect, useState } from "react";

type MoviesListProps = {
  variant?: "home" | "page";
};

export default function MoviesList({ variant = "page" }: MoviesListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // variant에 따라 개수 다르게 불러오기
    const limit = variant === "home" ? 5 : 20; // 홈은 5개, Movies 페이지는 20개

    const fetchData = async () => {
      const data = await getMovies();
      setMovies(data.slice(0, limit));
      setIsLoading(false);
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <MoviesRendering data={movies} variant={variant} isLoading={isLoading} />
  );
}
