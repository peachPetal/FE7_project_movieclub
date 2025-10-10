import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import heartIcon from "../assets/heart.svg";
import commentIcon from "../assets/comment.svg";
import shareIcon from "../assets/share.svg";
import ReviewsRendering from "../components/reviews/ReviewsRendering";
import { useReviewStore } from "../stores/reviewStore";

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  likeCount: number;
  commentCount: number;
}

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
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const { reviewsData } = useReviewStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies([
        {
          id: 1,
          title: "얼굴",
          posterUrl:
            "https://i.namu.wiki/i/KMUqfF9AtnJv69CFHKYjteoM3soZ4R3LMeIg1NdH5t-WtdqkfkEAGlU8iLstbrLG16oBcOR5Bdyg8yi3E55EDQ.webp",
          likeCount: 1352,
          commentCount: 214,
        },
        {
          id: 2,
          title: "극장판 귀멸의 칼날: 무한성 편",
          posterUrl:
            "https://i.namu.wiki/i/gwqbq98J0nv5hKDlCnnlu7KJ_zFDzvN9Cj8y5ss64uohGgY_3A5HzFKnxlCNWbxRfIepjW1aAr5q7Zf-QA5lYg.webp",
          likeCount: 1120,
          commentCount: 188,
        },
        {
          id: 3,
          title: "살인자 리포트",
          posterUrl:
            "https://i.namu.wiki/i/jTX-_f2sko_ixODrk94ndy0No4kKvC2jZQMoe1CPHpFQED2YdEGcbseKVmKExzGwO9OfEooygPXTn6aq_lTenA.webp",
          likeCount: 980,
          commentCount: 152,
        },
        {
          id: 4,
          title: "F1 더 무비",
          posterUrl:
            "https://upload.wikimedia.org/wikipedia/ko/thumb/9/93/F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg/250px-F1_%EB%8D%94_%EB%AC%B4%EB%B9%84_%ED%8F%AC%EC%8A%A4%ED%84%B0.jpg",
          likeCount: 850,
          commentCount: 121,
        },
        {
          id: 5,
          title: "홈캠",
          posterUrl:
            "https://i.namu.wiki/i/C4fiPlpmUh5pg8eZ6zyUmutFXMniQt2AZC9xfx5BiASuyokH4ybkowY_tZIqWehBfhENGe6XwY9vp1YQ_Nu2UA.webp",
          likeCount: 760,
          commentCount: 99,
        },
      ]);
      setReviews(reviewsData);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-8">
          이번 주 인기 <span className="text-[#9858f3]">#영화</span>
        </h2>
        <div className="flex gap-[30px] overflow-x-auto pb-4">
          {movies
            ? movies.map((movie) => (
                <div
                  key={movie.id}
                  className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-white flex-shrink-0
                             transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
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
            Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[320px] h-[250px] bg-white rounded-[10px] shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <Skeleton height={24} width="60%" />
                  <Skeleton height={16} width="40%" className="mt-2" />
                  <div className="mt-4">
                    <Skeleton count={3} />
                  </div>
                </div>
                <div className="pt-4">
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

