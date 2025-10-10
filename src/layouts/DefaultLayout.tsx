import Header from "../components/Header";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import HomeContent from "../pages/HomeContent";


export default function DefaultLayout() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex w-full">
        {/* 사이드바 */}
        <Sidebar />

        {/* HomeContent: 사이드바 옆에 배치 */}
        <div className="flex-1 ml-[46px]"> 
          <HomeContent />
        </div>
      </div>
    </div>
  );
}