import { useReviewStore } from "../../stores/reviewStore";
import ReviewsRendering from "./ReviewsRendering";

export default function ReviewList() {
  const { reviews } = useReviewStore();
  return (
    <>
      <ReviewsRendering data={reviews} />
    </>
  );
}
