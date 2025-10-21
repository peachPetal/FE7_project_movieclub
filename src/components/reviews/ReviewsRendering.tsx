import type { ReviewSubset, ReviewRenderProps } from "../../types/Review";
import ReviewItem from "./ReviewItem";

export default function ReviewsRendering({
  data,
  variant = "page",
  isLoading,
}: ReviewRenderProps) {
  // profile도 home처럼 4개 스켈레톤
  const skeletonCount = variant === "home" || variant === "profile" ? 4 : 16;

  const list: (ReviewSubset | undefined)[] = isLoading
    ? Array.from({ length: skeletonCount }).map(() => undefined)
    : data;

  // profile은 home과 같이 이미지 포함
  const hasImage = variant === "page" ? true : variant === "profile" ? true : false;

  return (
    <div
      className={
        variant === "home" || variant === "profile"
          ? "flex gap-[30px] flex-wrap"
          : "flex flex-wrap gap-4"
      }
    >
      {list.map((review, idx) => (
        <ReviewItem
          key={(review && review.id) ?? `skeleton-${idx}`}
          review={review}
          isLoading={isLoading}
          hasImage={hasImage}
        />
      ))}
    </div>
  );
}
