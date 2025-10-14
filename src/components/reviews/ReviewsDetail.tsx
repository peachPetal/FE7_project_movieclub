import { useParams } from "react-router-dom";
import { useReviewStore } from "../../stores/reviewStore";
import LikeBtn from "../common/buttons/LikeBtn";
import Comment from "../comments/Comment";
import { useEffect, useState } from "react";
import ReviewsDetailSkeleton from "../loading/ReviewsDetailSkeleton";
import TimeAgo from "../TimeAgo";

export default function ReviewsDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // supabase 연결하면 수정
  const getReview = useReviewStore((state) => state.getReview);
  const {
    id: reviewId,
    title,
    movie,
    content,
    createdAt,
    author,
    like,
    comment,
    thumbnail,
  } = getReview(Number(id));

  if (isLoading) {
    return <ReviewsDetailSkeleton />;
  } else {
    return (
      <>
        <div className="mr-15">
          <h1 className="text-4xl font-semibold mb-2.5 text-text-main dark:text-text-main-dark">
            {title}
            <span className="text-main dark:text-main-dark"> #{movie}</span>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]"><TimeAgo dateString={createdAt} /></span>
            {" by "}
            <span className="review-created-user text-main">{author}</span>
          </p>
          <div className="flex mb-10">
            <img
              className="min-w-[550px] max-h-[325px] object-cover mr-7"
              src={
                thumbnail
                  ? thumbnail
                  : "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            />
            <p className="mr-12 whitespace-pre-line leading-relaxed text-text-main dark:text-text-main-dark">
              {content}
            </p>
          </div>
          <div className="flex justify-center">
            <LikeBtn like={like} isLiked={false} />
          </div>
          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>
          <div>
            <Comment comment={comment} />
          </div>
        </div>
      </>
    );
  }
}
