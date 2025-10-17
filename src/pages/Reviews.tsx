import FilterDropdown from "../components/common/buttons/FilterDropdown";
import ReviewList from "../components/reviews/ReviewList";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";

export default function ReviewsPage() {
  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* -------------------------------
          리뷰 필터 드롭다운
      ------------------------------- */}
      <FilterDropdown type="Reviews" />

      {/* -------------------------------
          리뷰 목록
          - flex-wrap으로 여러 개 리뷰 카드 배치
          - gap으로 카드 간 간격 지정
      ------------------------------- */}
      <div className="reviews flex flex-wrap gap-5 mt-[25px]">
        <ReviewList variant="page" />
      </div>

      {/* -------------------------------
          리뷰 작성 버튼
          - 페이지 하단 고정 버튼
      ------------------------------- */}
      <ReviewPostBtn />
    </div>
  );
}
