import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    // [변경] 전체 레이아웃의 배경색을 CSS 변수로 지정
    <div className="w-full flex flex-col bg-[var(--color-background-main)]">
      {/* Header와 Sidebar는 내부적으로 이미 다크 모드가 적용됨 */}
      <Header />
      <div className="flex w-full mt-[50px]">
        <Sidebar />
        <div className="flex-1 ml-[46px] justify-center items-center min-h-[80vh] w-full">
          {/* Outlet을 통해 렌더링되는 페이지들도 각자 다크 모드 스타일을 가져야 함 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}