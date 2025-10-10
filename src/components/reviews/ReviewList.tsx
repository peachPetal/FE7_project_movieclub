import { useReviewStore } from "../../stores/reviewStore";
import ReviewsRendering from "./ReviewsRendering";

export default function ReviewList() {
  const { reviewsData } = useReviewStore();
  return (
    <>
      <ReviewsRendering data={reviewsData} hasImage={true} />
    </>
  );
}
