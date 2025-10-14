import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isDarkMode } from "../lib/theme";

import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/comment.svg";
import shareIcon from "../assets/share.svg";
import ReviewsRendering from "../components/reviews/ReviewsRendering";
import { useReviewStore } from "../stores/reviewStore";
import { useMovieStore } from "../stores/movieStore";
import MovieSkeleton from "../components/loading/MovieSkeleton";
import ReviewcardSkeleton from "../components/loading/ReviewcardSkeleton";

interface ActionButtonsProps {
  itemId: number;
  itemType: "movie" | "review";
  likeCount: number;
  commentCount: number;
}

const ActionButtons = ({
  itemId,
  itemType,
  likeCount,
  commentCount,
}: ActionButtonsProps) => {
  const handleLikeClick = () => console.log(`Liked ${itemType} #${itemId}`);
  const handleCommentClick = () =>
    console.log(`Commented on ${itemType} #${itemId}`);
  const handleShareClick = () => console.log(`Shared ${itemType} #${itemId}`);
  return (
    <div className="grid grid-cols-3 items-center w-full text-sm text-[var(--color-text-sub)]">
      <button
        onClick={handleLikeClick}
        className="flex items-center gap-1 justify-start transition-opacity hover:opacity-70"
        aria-label="Like this item"
      >
        <img src={heartIcon} alt="Likes" className="w-5 h-5" />
        <span>{likeCount}</span>
      </button>
      <button
        onClick={handleCommentClick}
        className="flex items-center gap-1 justify-center transition-opacity hover:opacity-70"
        aria-label="Comment on this item"
      >
        <img src={commentIcon} alt="Comments" className="w-5 h-5" />
        <span>{commentCount}</span>
      </button>
      <button
        onClick={handleShareClick}
        className="flex justify-end transition-opacity hover:opacity-70"
        aria-label="Share this item"
      >
        <img src={shareIcon} alt="Share" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default function HomeContent() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const { reviewsData } = useReviewStore();

  const { movies, isLoading, fetchMovies } = useMovieStore();

  useEffect(() => {
    // 홈 섹션은 캐러셀이니 6개만 가져오기
    fetchMovies(6);
  }, [fetchMovies]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReviews(reviewsData);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const moviesForUI =
    !isLoading && Array.isArray(movies) && movies.length
      ? movies.map((m) => ({
          ...m,
          id: Number(m.id),
          likeCount: m.likeCount ?? 0,
          commentCount: m.commentCount ?? 0,
        }))
      : null;

  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#영화</span>
        </h2>

        <div className="flex gap-[30px] overflow-x-auto pb-4">
          {moviesForUI && moviesForUI.length > 0 ? (
            moviesForUI.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                aria-label={`영화 상세로 이동: ${movie.title}`}
                className="block"
              >
                <div className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-[var(--color-background-sub)] flex-shrink-0 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                  <div className="w-full h-[358px] overflow-hidden">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="w-full h-[92px] p-4 flex flex-col justify-between">
                    <h3 className="font-bold text-lg truncate text-center text-[var(--color-text-main)]">
                      {movie.title}
                    </h3>
                    <ActionButtons
                      itemId={movie.id}
                      itemType="movie"
                      likeCount={movie.likeCount}
                      commentCount={movie.commentCount}
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <>
              <MovieSkeleton />
              <MovieSkeleton />
              <MovieSkeleton />
              <MovieSkeleton />
              <MovieSkeleton />
            </>
          )}
        </div>
      </section>


      <section>
        <h2 className="text-4xl font-bold mb-8 text-[var(--color-text-main)]">
          이번 주 인기 <span className="text-[var(--color-main)]">#리뷰</span>
        </h2>
        <div className="flex gap-[30px] flex-wrap">
          {reviews ? (
            <ReviewsRendering data={reviews} hasImage={false} />
          ) : (
            <>
            <ReviewcardSkeleton />
            <ReviewcardSkeleton />
            <ReviewcardSkeleton />
            <ReviewcardSkeleton />
            <ReviewcardSkeleton />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
