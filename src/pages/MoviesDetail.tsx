import { useNavigate, useLocation, useParams } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import TrailerBtn from "../components/common/buttons/TrailerBtn";
import ReviewPostBtn from "../components/reviews/ReviewPostBtn";
import { useEffect, useState } from "react";
import { getMovieById } from "../api/tmdb/tmdbUtils";
import MovieDetailSkeleton from "../components/skeleton/MovieDetailSkeleton";
import { useAuthSession } from "../hooks/useAuthSession";
import ReviewList from "../components/reviews/ReviewList";

export default function MoviesDetail() {
  const { id: movie_id } = useParams();
  const location = useLocation();
  const movieState: Movie = location.state?.movie;

  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(
    movieState ? movieState : null
  );

  const { session, loading } = useAuthSession();
  const navigate = useNavigate();

  const fetchMovie = async (id: number) => {
    setIsLoading(true);
    try {
      const movieData = await getMovieById(Number(id));
      setMovie(movieData);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (movieState) {
      setMovie(movieState);
    }
    fetchMovie(Number(movie_id));
  }, [movieState, movie_id]);

  const Separator = () => <span className="mx-1.5">{`|`}</span>;

  const formatRunTime = (runtime: string) => {
    const h = Math.floor(Number(runtime) / 60);
    const m = Number(runtime) - h * 60;
    return `${h}h ${m}m`;
  };

  const formatGenres = (genres: Genre[]) =>
    genres?.map((g) => g.name).join(", ") ?? "";

  const formatActors = (actors: Genre[]) =>
    actors?.map((a) => a.name).join(", ") ?? "";

  const handleReviewClick = () => {
    if (loading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    // 실제 리뷰 작성 로직은 ReviewPostBtn 내부에서 실행됨
  };

  if (isLoading) {
    return <MovieDetailSkeleton />;
  } else {
    return (
      <div className="w-[90%]">
        {" "}
        <section className="box-content movie p-4 flex min-w-4xl h-[500px] mb-10 text-[var(--color-text-main)]">
          <img
            src={movie?.poster}
            alt={`${movie?.title} poster`}
            className="max-w-[340px] max-h-[500px] object-cover rounded-lg"
          />
          <div className="movie-detail-area w-full h-full flex flex-col justify-around ml-9">
            <div className="movie-info flex items-baseline">
              <h1 className="text-5xl font-bold mr-4">{movie?.title}</h1>{" "}
              {movie?.cerfication.length === 2 && (
                <div className="px-[4px] border border-main text-main mr-2">
                  <span>{movie?.cerfication}</span>
                </div>
              )}
              <span>{movie?.year}</span>
              <Separator />
              <span>{formatRunTime(movie?.runtime ? movie?.runtime : "")}</span>
              {movie?.genres ? (
                <>
                  <Separator />
                  <span>{formatGenres(movie?.genres)}</span>
                </>
              ) : null}
              <Separator />
              <span>{movie?.country}</span>
            </div>
            <p className="movie-credits leading-relaxed whitespace-pre-line">
              <span className="font-bold">감독</span>
              <Separator />
              <span>{movie?.director}</span>
              <br />
              {movie?.actors ? (
                <>
                  <span className="font-bold">출연</span>
                  <Separator />
                  <span>{formatActors(movie?.actors)}</span>
                </>
              ) : null}
            </p>
            <div className="mt-2">
              <p className="max-w-[900px] leading-relaxed whitespace-pre-line">
                {movie?.overview}
              </p>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <TrailerBtn src={String(movie?.trailer)} />
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-10 h-10 text-yellow-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.383c.292 1.265-.956 2.23-2.052 1.612L12 18.226l-4.634 2.757c-1.096.618-2.344-.347-2.052-1.612l1.24-5.383L2.64 10.955c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-4xl font-bold">{movie?.rating}</span>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-10">
          <div className="flex items-baseline gap-2 justify-between mb-4">
            <div className="review-section_title flex ">
              <h2 className="text-2xl font-bold text-[var(--color-text-main)] mr-2">
                Reviews
              </h2>
              <span className="text-2xl text-[var(--color-main)] font-bold">
                {movie?.reviews?.length}
              </span>
            </div>
            {/* 로그인 상태 체크 후 Review 버튼 클릭 */}
            <div onClick={handleReviewClick}>
              <ReviewPostBtn
                isFloating={false}
                state={{
                  id: movie_id,
                  title: movie?.title,
                  backdrop: movie?.backdrop,
                }}
              />
            </div>
          </div>
          {movie?.reviews?.length ? (
            <div>
              {" "}
              <ReviewList movie_id={movie?.id} />
            </div>
          ) : (
            <p className="flex justify-center w-full my-10 text-text-sub">
              아직 등록된 리뷰가 없습니다.
            </p>
          )}
        </section>
      </div>
    );
  }
}
