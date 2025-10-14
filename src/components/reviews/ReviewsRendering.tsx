import ReviewItem from "./ReviewItem";

interface ReviewRenderProps {
  data: Review[];
  variant: "home" | "page";
  isLoading: boolean;
}

export default function ReviewsRendering({
  data,
  variant = "page",
  isLoading,
}: ReviewRenderProps) {
  const list: (Review | undefined)[] = isLoading
    ? Array.from({ length: 5 }).map(() => undefined)
    : data;
  const hasImage = variant === "page" ? true : false;

  return (
    <div
      className={
        variant === "home"
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
