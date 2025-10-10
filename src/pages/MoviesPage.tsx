import MoviesList from "../components/movies/MoviesList";

export default function MoviesPage() {
  return (
    <>
      <div className="w-3/4 p-4 overflow-y-auto">
        <MoviesList variant="page" />
      </div>
    </>
  );
}
