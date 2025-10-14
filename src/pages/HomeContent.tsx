import { useState, useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { isDarkMode } from "../lib/theme";
import ReviewsRendering from "../components/reviews/ReviewsRendering";
import { useReviewStore } from "../stores/reviewStore";
import MoviesList from "../components/movies/MoviesList";

export default function HomeContent() {
  const [isDark, setIsDark] = useState(isDarkMode());
  const { isLoading, setIsLoading, reviewsData } = useReviewStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(!isLoading);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  return (
    <div>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#영화</span>
        </h2>

        <div className="flex gap-[30px] overflow-x-auto pb-4">
          <MoviesList variant="home" />
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#리뷰</span>
        </h2>
        <div className="flex gap-[30px] flex-wrap">
          <ReviewsRendering
            data={reviewsData}
            variant="home"
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}
