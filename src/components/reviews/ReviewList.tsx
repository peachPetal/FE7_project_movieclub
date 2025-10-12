import { useEffect, useState } from "react";
import { useReviewStore } from "../../stores/reviewStore";
import ReviewItem from "./ReviewItem";
import ReviewItemSkeleton from "../loading/ReviewItemSkeleton";

export default function ReviewList() {
  const { reviewsData } = useReviewStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return [...Array(4)].map(() => <ReviewItemSkeleton hasImage={true} />);
  } else {
    return (
      <>
        {reviewsData.map((review) => (
          <ReviewItem data={review} hasImage={true} />
        ))}
      </>
    );
  }
}
