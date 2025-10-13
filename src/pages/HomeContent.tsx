import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/comment.svg";
import shareIcon from "../assets/share.svg";
import ReviewsRendering from "../components/reviews/ReviewsRendering";
import { useReviewStore } from "../stores/reviewStore";
import { useMovieStore } from "../stores/movieStore";

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  }
  if (interval === 1) {
    return "1 year ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  if (interval === 1) {
    return "1 month ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  if (interval === 1) {
    return "1 day ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  if (interval === 1) {
    return "1 hour ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  if (interval === 1) {
    return "1 minute ago";
  }
  return "just now";
};

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
    <div className="grid grid-cols-3 items-center w-full text-sm text-gray-600">
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

  // 파생 UI용 영화 목록: 로딩 중이면 null 유지, 데이터 있을 때만 배열 + 안전 기본값 보정
  const moviesForUI =
    !isLoading && Array.isArray(movies) && movies.length
      ? movies.map((m) => ({
          ...m,
          id: Number(m.id),
          likeCount: m.likeCount ?? 0,
          commentCount: m.commentCount ?? 0,
        }))
      : null;

  return (
    <div>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8">
          이번 주 인기 <span className="text-[#9858f3]">#영화</span>
        </h2>

        <div className="flex gap-[30px] overflow-x-auto pb-4">
          {moviesForUI
            ? moviesForUI.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  aria-label={`영화 상세로 이동: ${movie.title}`}
                  className="block"
                >
                  <div
                    className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-white flex-shrink-0
                               transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                  >
                    <div className="w-full h-[358px] overflow-hidden">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="w-full h-[92px] p-4 flex flex-col justify-between">
                      <h3 className="font-bold text-lg truncate text-center">
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
            : Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="w-[250px] h-[450px] flex-shrink-0">
                  <Skeleton height={358} className="rounded-t-lg" />
                  <div className="p-4 bg-white rounded-b-lg">
                    <Skeleton width="75%" height={20} className="mx-auto" />
                    <div className="grid grid-cols-3 items-center mt-3">
                      <Skeleton width={40} height={20} />
                      <Skeleton width={40} height={20} className="mx-auto" />
                      <Skeleton
                        circle
                        width={24}
                        height={24}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold mb-8">
          이번 주 인기 <span className="text-[#9858f3]">#리뷰</span>
        </h2>
        <div className="flex gap-[30px] flex-wrap">
          {reviews ? (
            <ReviewsRendering data={reviews} hasImage={false} />
          ) : (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="relative w-[320px] h-[250px] bg-white rounded-[10px] shadow-md"
              >
                <div className="absolute left-[22px] top-[21.34px] w-[277px]">
                  <Skeleton count={2} />
                </div>
                <Skeleton
                  className="absolute left-[22px] top-[80.28px]"
                  width={277}
                  count={3}
                />
                <Skeleton
                  className="absolute left-[22px] top-[172.76px]"
                  width={180}
                  height={16}
                />
                <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
                  <div className="grid grid-cols-3 items-center w-full">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={40} height={20} className="mx-auto" />
                    <Skeleton
                      circle
                      width={24}
                      height={24}
                      className="ml-auto"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
