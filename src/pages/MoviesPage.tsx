import MoviesList from "../components/movies/MoviesList";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <>
      <div className="w-full flex flex-col">
        {" "}
        <Header />{" "}
        <div className="flex justify-between h-[80vh]">
          <Sidebar />
          <div className="w-3/4 p-4 overflow-y-auto">
            <MoviesList variant="page" />
          </div>
        </div>
      </div>
    </>
  );
}
