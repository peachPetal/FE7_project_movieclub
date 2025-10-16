import { useLocation } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import TrailerBtn from "../components/common/buttons/TrailerBtn";
import LikeBtn from "../components/common/buttons/LikeBtn";

export default function MoviesDetail() {
  const location = useLocation();
  const movie: Movie = location.state?.movie;
  const {
    id,
    title,
    original_title,
    overview,
    cerfication,
    year,
    runtime,
    genres,
    country,
    rating,
    poster,
    backdrop,
    director,
    actors,
    trailer,
  } = movie;

  // const movie = useMemo(() => {
  //   if (!movies || movies.length === 0 || movieId === undefined)
  //     return undefined;
  //   return movies.find((m) => String(m.id) === String(movieId));
  // }, [movies, movieId]);

  // 해당 영화의 리뷰만 필터링 (reviewStore: review.movie = 영화제목 문자열)
  // const matchedReviews = useMemo(() => {
  //   // reviewStore는 초기값이 배열이므로 null 체크 대신 배열 보장
  //   if (!Array.isArray(reviewsData)) return null;

  const Separator = () => <span className="mx-1.5">{`|`}</span>;
  const formatRunTime = (runtime: string) => {
    const h = Math.floor(Number(runtime) / 60);
    const m = Number(runtime) - h * 60;
    return `${h}h ${m}m`;
  };
  const formatGenres = (genres: Genre[]) => {
    let result = "";

    if (genres) {
      const genreNames = genres.map((genre) => genre.name);
      result = genreNames.join(", ");
    }

    return result;
  };
  const formatActors = (actors: Genre[]) => {
    let result = "";

    if (genres) {
      const genreNames = actors.map((actor) => actor.name);
      result = genreNames.join(", ");
    }

    return result;
  };

  return (
    <div>
      {" "}
      <section className="movie p-4 flex h-[500px] text-[var(--color-text-main)]">
        <img
          src={poster}
          alt={`${title} poster`}
          className="max-w-[340px] max-h-[500px] object-cover rounded-lg"
        />
        <div className="movie-detail-area h-full flex flex-col justify-around ml-9">
          <div className="movie-info flex items-baseline">
            <h1 className="text-5xl font-bold mr-4">{title}</h1>{" "}
            {cerfication ? (
              <div className="px-[4px] border border-main text-main mr-2">
                <span>{cerfication}</span>
              </div>
            ) : null}
            <span>{year}</span>
            <Separator />
            <span>{formatRunTime(runtime)}</span>
            <Separator />
            <span>{formatGenres(genres)}</span>
            <Separator />
            <span>{country}</span>
          </div>
          <p className="movie-credits leading-relaxed whitespace-pre-line">
            <span className="font-bold">감독 | </span> {director} <br />
            <span className="font-bold">출연 | </span> {formatActors(actors)}
          </p>
          <div className="mt-2">
            <p className="max-w-[900px] leading-relaxed whitespace-pre-line">
              {overview}
            </p>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <TrailerBtn src={trailer} />
            
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
              <span className="text-4xl font-bold">{rating}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex items-baseline gap-2 justify-start mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
            Reviews
          </h2>
          <span className="text-2xl text-[var(--color-main)] font-bold">
            reviewsCount
          </span>
        </div>
      </section>
    </div>
  );
}

// {matchedReviews !== null ? (
//           <div className="flex flex-col gap-4">
//             {Array.isArray(matchedReviews) && matchedReviews.length > 0 ? (
//               <div className="flex flex-wrap gap-[30px]">
//                 <ReviewsRendering data={matchedReviews} hasImage={false} />
//               </div>
//             ) : (
//               <div className="text-[var(--color-text-sub)] text-sm">
//                 이 영화의 리뷰가 아직 없습니다.
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex gap-[30px] flex-wrap">
//             {/* 5개의 스켈레톤 카드를 생성 */}
//             {Array.from({ length: 5 }).map((_, idx) => (
//               <div
//                 key={idx}
//                 // 카드 배경: 테마에 따라 자동 변경 (bg-background-sub)
//                 // 그림자: 공통 스타일 적용 (card-shadow)
//                 className="relative w-[320px] h-[250px] bg-[var(--color-background-sub)] rounded-[10px] card-shadow"
//               >
//                 <div className="absolute left-[22px] top-[21.34px] w-[277px]">
//                   <Skeleton
//                     count={2}
//                     baseColor={skeletonBaseColor}
//                     highlightColor={skeletonHighlightColor}
//                   />
//                 </div>
//                 <Skeleton
//                   className="absolute left-[22px] top-[80.28px]"
//                   width={277}
//                   count={3}
//                   baseColor={skeletonBaseColor}
//                   highlightColor={skeletonHighlightColor}
//                 />
//                 <Skeleton
//                   className="absolute left-[22px] top-[172.76px]"
//                   width={180}
//                   height={16}
//                   baseColor={skeletonBaseColor}
//                   highlightColor={skeletonHighlightColor}
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
//                   <div className="grid grid-cols-3 items-center w-full">
//                     <Skeleton
//                       width={40}
//                       height={20}
//                       baseColor={skeletonBaseColor}
//                       highlightColor={skeletonHighlightColor}
//                     />
//                     <Skeleton
//                       width={40}
//                       height={20}
//                       className="mx-auto"
//                       baseColor={skeletonBaseColor}
//                       highlightColor={skeletonHighlightColor}
//                     />
//                     <Skeleton
//                       circle
//                       width={24}
//                       height={24}
//                       className="ml-auto"
//                       baseColor={skeletonBaseColor}
//                       highlightColor={skeletonHighlightColor}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
