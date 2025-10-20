import { useState } from "react";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import MoviesList from "../components/movies/MoviesList";
import { FILTER_OPTIONS, type FilterOption } from "../types/Filter";

export default function MoviesPage() {
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.Movies[0]);
  const handleChangeFilter = (filter: FilterOption) => {
    setFilter(filter);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* 필터 드롭다운 */}
      <FilterDropdown
        type="Movies"
        filter={filter}
        handleChangeFilter={handleChangeFilter}
      />

      {/* 영화 리스트 */}
      <div className="mt-[25px]">
        <MoviesList variant="page" />
      </div>
    </div>
  );
}

/*
주석 설명:

1. FilterDropdown
   - type="Movies"를 전달하여 영화 페이지 전용 필터 표시
   - 사용자가 카테고리/정렬 옵션 선택 가능

2. MoviesList
   - variant="page"를 전달하여 페이지용 레이아웃 적용
   - 영화 아이템들을 세로/가로 정렬에 맞게 렌더링

3. JSX 구조
   - 최상위 div: flex-col로 수직 배치
   - justify-start: 상단부터 콘텐츠 배치
   - FilterDropdown과 MoviesList 사이에 margin-top(25px)으로 간격 설정

4. 스타일
   - TailwindCSS 기반
   - w-full, h-full: 화면 전체 너비/높이 사용
*/
