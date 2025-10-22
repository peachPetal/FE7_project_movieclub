import type { ReviewSubset, ReviewRenderProps } from "../../types/Review";
import ReviewItem from "./ReviewItem";

export default function ReviewsRendering({
  data,
  variant = "page",
  isLoading = false,
  skeletonCount,
}: ReviewRenderProps) {
  const effectiveSkeleton =
    typeof skeletonCount === "number"
      ? skeletonCount
      : variant === "home" || variant === "profile"
      ? 3
      : 15;

  const list: (ReviewSubset | undefined)[] = isLoading
    ? Array.from({ length: effectiveSkeleton }).map(() => undefined)
    : data;

  // profile은 home과 같이 이미지 포함
  const hasImage =
    variant === "page" ? true : variant === "profile" ? true : false;

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
