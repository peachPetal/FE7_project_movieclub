import Sidebar from "./Sidebar";
import SocialBtn from "./buttons/SocialBtn";

export default function HomeContent() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="ml-[46px] mt-[30px] flex-shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-8">
        <div className="grid grid-rows-6 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">Content Card 1</div>
          <div className="bg-white p-4 rounded-lg shadow">Content Card 2</div>
          <div className="bg-white p-4 rounded-lg shadow">Content Card 3</div>
          <SocialBtn socialType="google" />
          <SocialBtn socialType="kakao" />
          <SocialBtn socialType="github" />
        </div>
      </main>
    </div>
  );
}
