import { useState } from "react";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import ReviewList from "../components/reviews/ReviewList";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";
import { FILTER_OPTIONS, type FilterOption } from "../types/Filter";

export default function ReviewsPage() {
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.Reviews[0]);
  const handleChangeFilter = (filter: FilterOption) => {
    setFilter(filter);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start">
      <FilterDropdown
        type="Reviews"
        filter={filter}
        handleChangeFilter={handleChangeFilter}
      />
      <div className="reviews flex flex-wrap gap-5 mt-[25px]">
        <ReviewList variant="page" filter={filter} />
      </div>
      <ReviewPostBtn />
    </div>
  );
}
