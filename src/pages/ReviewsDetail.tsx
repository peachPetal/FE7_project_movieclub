import { useLocation } from "react-router-dom";
import LikeBtn from "../components/common/buttons/LikeBtn";
import Comment from "../components/comments/Comment";
import TimeAgo from "../components/common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../types/review";

export default function ReviewsDetail() {
  const location = useLocation();
  const review: ReviewWithDetail = location.state?.review;

  const { content, created_at, movie_name, thumbnail, title } = review;
  const like = review.likes?.[0]?.count ?? 0;
  const author = review.users?.name ?? "author";
  const comments = review.comments?.[0]?.count ?? 0;

  return (
    <div className="mr-15">
      {/* -------------------------------
          리뷰 제목 + 영화 이름
      ------------------------------- */}
      <h1 className="text-4xl font-semibold mb-2.5 text-text-main dark:text-text-main-dark">
        {title}
        <span className="text-main dark:text-main-dark"> #{movie_name}</span>
      </h1>

      {/* -------------------------------
          작성일 + 작성자 정보
      ------------------------------- */}
      <p className="mb-10 text-text-sub">
        <span className="text-[var(--color-text-sub)]">
          <TimeAgo dateString={created_at} />
        </span>
        {" by "}
        <span className="review-created-user text-main">{author}</span>
      </p>

      {/* -------------------------------
          썸네일 이미지 + 리뷰 내용
      ------------------------------- */}
      <div className="flex mb-10">
        <img
          className="min-w-[550px] max-h-[325px] object-cover mr-7"
          src={
            thumbnail
              ? thumbnail
              : "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={`${movie_name} thumbnail`}
        />
        <p className="mr-12 min-w-[340px] whitespace-pre-line leading-relaxed text-text-main dark:text-text-main-dark">
          {content}
        </p>
      </div>

      {/* -------------------------------
          좋아요 버튼
      ------------------------------- */}
      <div className="flex justify-center">
        <LikeBtn like={like} isLiked={false} />
      </div>

      {/* -------------------------------
          구분선
      ------------------------------- */}
      <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>

      {/* -------------------------------
          댓글 컴포넌트
      ------------------------------- */}
      <div>
        <Comment comment={comments} />
      </div>
    </div>
  );
}
