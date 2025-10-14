import Skeleton from "react-loading-skeleton";
import { twMerge } from "tailwind-merge";
import { isDarkMode } from "../../lib/theme"; // 테마 상태 확인 함수 import

export default function ReviewItemSkeleton({
  hasImage,
}: {
  hasImage: boolean;
}) {

  // --- 스켈레톤 UI를 위한 테마 관리 로직 ---
  const isDark = isDarkMode();
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";
  // ---

  return (
    <>
      <div
        className={twMerge(
          "review-item w-80 h-[410px] rounded-lg overflow-hidden card-shadow flex flex-col bg-[var(--color-background-sub)] flex-shrink-0",
          !hasImage && "h-[230px]"
        )}
      >
        {hasImage ? (
          <Skeleton height={185} className="reivew-thumbnail" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        ) : null}
        <div className="review-data p-5 h-[227px] flex flex-col justify-between">
          <div className="review-post">
            <Skeleton width={280} height={27} className="review-title mb-3" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}/>
            <Skeleton width={280} height={60} className="review-content mb-3" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}/>
            <Skeleton
              width={280}
              height={16}
              className="review-created-info mb-4"
              baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}
            />
          </div>
          <div className="review-social-buttons flex justify-around align-middle">
            <Skeleton width={39} height={26} className="like" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}/>
            <Skeleton width={39} height={26} className="comment" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}/>
            <Skeleton width={22} height={26} className="share" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}/>
          </div>
        </div>
      </div>
    </>
  );
}
