// src/components/skeleton/ReviewItemSkeleton.tsx
import Skeleton from "react-loading-skeleton";
import { isDarkMode } from "../../lib/theme";

interface ReviewItemSkeletonProps {
  hasImage: boolean;
}

export default function ReviewItemSkeleton({ hasImage }: ReviewItemSkeletonProps) {
  const isDark = isDarkMode(); // 현재 테마 확인
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

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
        <div className="review-post space-y-3">
          <Skeleton
            width={280}
            height={27}
            className="review-title"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={280}
            height={60}
            className="review-content"
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
        </div>

        <div className="review-social-buttons flex justify-around mt-4">
          <Skeleton
            width={39}
            height={26}
            className="like"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={39}
            height={26}
            className="comment"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={22}
            height={26}
            className="share"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        </div>
      </div>
    </div>
  );
}
