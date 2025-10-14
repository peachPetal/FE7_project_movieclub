import { useEffect, useState } from "react";
import { useReviewStore } from "../../stores/reviewStore";
import ReviewsRendering from "./ReviewsRendering";

type ReviewsListProps = {
  variant?: "home" | "page";
};

export default function ReviewList({ variant = "page" }: ReviewsListProps) {
  const { isLoading, setIsLoading, reviewsData } = useReviewStore();
  const [data, setData] = useState<Review[]>([]);

  useEffect(() => {
    const limit = variant === "home" ? 5 : 20;
    setData(reviewsData.slice(0, limit + 1));
  }, [reviewsData, variant]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(!isLoading);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReviewsRendering data={data} variant={variant} isLoading={isLoading} />
  );
}
