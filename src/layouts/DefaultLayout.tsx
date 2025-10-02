import Header from "../components/Header";
import HomeContent from "../components/homeContent";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <>
      <div className="relative w-full mx-auto h-[1080px] bg-white">
        <Header />
        <HomeContent />
      </div>
    </>
  );
}
