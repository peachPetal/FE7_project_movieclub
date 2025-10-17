// src/components/reviews/ReviewItem.tsx
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { isDarkMode } from "../../lib/theme";
import TimeAgo from "../common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../../types/review";

interface ReviewItemProps {
  review?: ReviewWithDetail;
  hasImage: boolean;
  isLoading: boolean;
}

export default function ReviewItem({ review, hasImage, isLoading }: ReviewItemProps) {
  const isDark = isDarkMode();
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  if (isLoading || !review) {
    // 로딩 상태일 때 Skeleton 사용
    return (
      <div
        className={`review-item w-80 rounded-lg overflow-hidden card-shadow flex flex-col flex-shrink-0 bg-[var(--color-background-sub)] ${
          hasImage ? "h-[410px]" : "h-[230px]"
        }`}
      >
        {hasImage && (
          <Skeleton
            height={185}
            className="review-thumbnail"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        )}
        <div className="review-data p-5 flex flex-col justify-between h-[227px]">
          <Skeleton
            width={280}
            height={27}
            className="review-title mb-3"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={280}
            height={60}
            className="review-content mb-3"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={280}
            height={16}
            className="review-created-info"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <div className="review-social-buttons flex justify-around mt-4">
            <Skeleton width={39} height={26} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
            <Skeleton width={39} height={26} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
            <Skeleton width={22} height={26} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
          </div>
        </div>
      </div>
    );
  }

  // 리뷰 데이터 존재 시
  const { id, content, created_at, movie_name, thumbnail, title, likes, comments, users } = review;
  const likeCount = likes?.[0]?.count ?? 0;
  const commentCount = comments?.[0]?.count ?? 0;
  const author = users?.name ?? "author";

  return (
    <Link to={`/reviews/${id}`} state={{ review }}>
      <div
        className={`review-item w-80 rounded-lg overflow-hidden card-shadow flex flex-col flex-shrink-0 bg-[var(--color-background-sub)] ${
          hasImage ? "h-[410px]" : "h-[230px]"
        }`}
      >
        {hasImage && (
          <img
            className="review-thumbnail h-[185px] w-full object-cover"
            src={thumbnail || "https://mrwvwylqxypdithozmgm.supabase.co/storage/v1/object/public/img/movie_no_image.jpg"}
            alt={movie_name}
          />
        )}

        <div className="review-data p-5 flex flex-col justify-between h-[227px]">
          <div className="review-post">
            <p className="review-title font-bold mb-3 text-[18px] truncate text-[var(--color-text-main)]">
              <span className="review-movie text-main">#{movie_name}</span> {title}
            </p>
            <p className="review-content text-xs mb-3 line-clamp-4 leading-relaxed text-text-main">{content}</p>
            <p className="review-created-info text-xs text-text-sub mb-4">
              <span className="text-[var(--color-text-sub)]"><TimeAgo dateString={created_at} /></span>
              {" by "}
              <span className="review-created-user text-main">{author}</span>
            </p>
          </div>

          <div className="review-social-buttons flex justify-around items-center text-text-sub">
            <div className="like flex items-center">
              <span>{likeCount}</span>
            </div>
            <div className="comment flex items-center">
              <span>{commentCount}</span>
            </div>
            <div className="share">
              <button className="share-btn">Share</button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
