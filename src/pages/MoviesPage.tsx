import MoviesList from "../components/movies/MoviesList";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DefaultLayout() {
  return (
    <>
      <div className="w-full flex flex-col">
        {" "}
        <Header />{" "}
        <div className="flex ml-[50px]">
          <Sidebar />
          <div className="flex min-h-[80vh] w-full">
            <MoviesList variant="page" />
          </div>
        </div>
      </div>
    </>
  );
}
