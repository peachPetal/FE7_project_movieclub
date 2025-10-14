import FilterDropdown from "../components/common/buttons/FilterDropdown";
import ReviewList from "../components/reviews/ReviewList";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";

export default function ReviewsPage() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-start">
        <FilterDropdown type="Reviews" />
        <div className="reviews flex flex-wrap gap-5 mt-[25px]">
          <ReviewList variant="page" />
        </div>
      </div>
      <ReviewPostBtn />
    </>
  );
}
