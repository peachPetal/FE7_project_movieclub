import MoviesList from "../components/movies/MoviesList";
import ReviewList from "../components/reviews/ReviewList";

export default function HomeContent() {
  return (
    <div>
      {/* 인기 영화 섹션 */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#영화</span>
        </h2>
        <div className="flex gap-[30px] overflow-x-auto pb-4">
          <MoviesList variant="home" />
        </div>
      </section>

      {/* 인기 리뷰 섹션 */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#리뷰</span>
        </h2>
        <div className="flex gap-[30px] flex-wrap">
          <ReviewList variant="home" />
        </div>
      </section>
    </div>
  );
}
