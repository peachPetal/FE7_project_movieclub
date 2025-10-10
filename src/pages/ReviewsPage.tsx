import FilterDropdown from "../components/common/buttons/FilterDropdown";
import ReviewList from "../components/reviews/ReviewList";

export default function ReviewsPage() {
  return (
    <>
      <div className="w-full h-full ml-[50px] mt-[70px] flex flex-col justify-between">
        <FilterDropdown type="Reviews" />
        <div className="reviews flex flex-wrap gap-4 mt-[25px] h-full">
          <ReviewList />
        </div>
      </div>
    </>
  );
}
