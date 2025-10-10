import Header from "../components/Header";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <>
      <div className="w-full flex flex-col">
        {" "}
        <Header />{" "}
        <div className="flex ml-[50px]">
          <Sidebar />
          <div className="flex justify-center items-center min-h-[80vh] w-full">
            <Home />
          </div>
        </div>
      </div>
    </>
  );
}
