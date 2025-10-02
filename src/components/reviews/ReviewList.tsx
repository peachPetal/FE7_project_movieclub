import { useReviewStore } from "../../stores/reviewStore";
import ReviewsRendering from "./ReviewsRendering";

export default function ReviewList() {
  const { reviews } = useReviewStore();
  return (
    <>
      <div className="reviews flex">
        <ReviewsRendering data={reviews} />
      </div>
    </>
  );
}
