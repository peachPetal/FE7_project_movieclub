import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export default function DefaultLayout() {
  return (
    <div className="w-full flex flex-col bg-[var(--color-background-main)]">
      {/* 상단 헤더 */}
      <Header />

      <div className="flex w-full mt-[50px]">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 ml-[46px] justify-center items-center min-h-[80vh] w-full">
          {/* 라우팅된 페이지 컴포넌트가 렌더링되는 Outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/*
주석 설명:

1. 최상위 div
   - flex-col 레이아웃으로 헤더 + 본문 배치
   - 배경색: var(--color-background-main)

2. Header
   - 상단 공통 헤더 컴포넌트
   - 로고, 네비게이션, 알림 등 포함

3. 메인 영역 flex
   - Sidebar + 메인 콘텐츠를 가로 배치
   - mt-[50px]: 헤더 높이만큼 여백 확보

4. Sidebar
   - 좌측 메뉴, 친구 목록, 알림 모달 등

5. 메인 콘텐츠 div
   - Outlet을 통해 현재 Route 페이지 렌더링
   - flex-1, min-h-[80vh]로 콘텐츠 영역 확보
   - ml-[46px]: 사이드바와 간격
   - justify-center & items-center: 콘텐츠 중앙 정렬 (필요 시 조정)
*/
