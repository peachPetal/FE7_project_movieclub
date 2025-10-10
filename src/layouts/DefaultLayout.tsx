import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex w-full mt-[50px]">
        {/* 사이드바 */}
        <Sidebar />
        <div className="flex-1 ml-[46px] justify-center items-center min-h-[80vh] w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
