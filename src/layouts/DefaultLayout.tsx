import Header from "../components/Header";
import HomeContent from "../components/homeContent";

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
