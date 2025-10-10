import Header from "../components/Header";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import HomeContent from "../pages/HomeContent";


export default function DefaultLayout() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex w-full mt-[50px]">
        {/* 사이드바 */}
        <Sidebar />

        <div className="flex-1 ml-[46px]">
          <HomeContent />
        </div>
      </div>
    </div>
  );
}