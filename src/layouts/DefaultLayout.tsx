import Header from "../components/Header";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <>
      <div className="w-full flex flex-col">
        {" "}
        <Header />{" "}
        <div className="flex justify-between h-[80vh]">
          <Sidebar />
          <Home />
        </div>
      </div>
    </>
  );
}
