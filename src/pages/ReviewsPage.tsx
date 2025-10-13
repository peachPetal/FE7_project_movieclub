import FilterDropdown from "../components/common/buttons/FilterDropdown";
import ReviewList from "../components/reviews/ReviewList";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";

export default function ReviewsPage() {
  return (
    <>
      <div className="w-full h-full ml-[50px]flex flex-col justify-between">
        <FilterDropdown type="Reviews" />
        <div className="reviews flex flex-wrap gap-5 mt-[25px]">
          <ReviewList />
        </div>
      </div>
      <ReviewPostBtn />
    </>
  );
}
