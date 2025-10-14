import FilterDropdown from "../components/common/buttons/FilterDropdown";
import MoviesList from "../components/movies/MoviesList";

export default function MoviesPage() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-start">
        <FilterDropdown type="Movies" />
        <div className="mt-[25px]">
          <MoviesList variant="page" />
        </div>
      </div>
    </>
  );
}
