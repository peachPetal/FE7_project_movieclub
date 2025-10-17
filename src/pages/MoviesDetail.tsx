import { useLocation } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";

import TrailerBtn from "../components/common/buttons/TrailerBtn";

export default function MoviesDetail() {
  // location.state에서 영화 데이터 가져오기
  const location = useLocation();
  const movie: Movie = location.state?.movie;

  if (!movie) return <p className="text-center mt-10">영화 정보를 불러올 수 없습니다.</p>;

  const {
    title,
    overview,
    cerfication,
    year,
    runtime,
    genres,
    country,
    rating,
    poster,
    director,
    actors,
    trailer,
  } = movie;

  // 구분자 컴포넌트
  const Separator = () => <span className="mx-1.5">{`|`}</span>;

  // 런타임 포맷팅 (분 → "h m" 형식)
  const formatRunTime = (runtime: string) => {
    const h = Math.floor(Number(runtime) / 60);
    const m = Number(runtime) - h * 60;
    return `${h}h ${m}m`;
  };

  // 장르 배열 → 문자열
  const formatGenres = (genres: Genre[]) => genres?.map((g) => g.name).join(", ") ?? "";

  // 배우 배열 → 문자열
  const formatActors = (actors: Genre[]) => actors?.map((a) => a.name).join(", ") ?? "";

  return (
    <div>
      {/* 영화 기본 정보 섹션 */}
      <section className="movie p-4 flex h-[500px] text-[var(--color-text-main)]">
        {/* 포스터 */}
        <img
          src={poster}
          alt={`${title} poster`}
          className="max-w-[340px] max-h-[500px] object-cover rounded-lg"
        />

        {/* 영화 상세 정보 */}
        <div className="movie-detail-area h-full flex flex-col justify-around ml-9">
          {/* 타이틀, 인증, 연도, 런타임, 장르, 국가 */}
          <div className="movie-info flex items-baseline">
            <h1 className="text-5xl font-bold mr-4">{title}</h1>
            {cerfication && (
              <div className="px-[4px] border border-main text-main mr-2">
                <span>{cerfication}</span>
              </div>
            )}
            <span>{year}</span>
            <Separator />
            <span>{formatRunTime(runtime)}</span>
            <Separator />
            <span>{formatGenres(genres)}</span>
            <Separator />
            <span>{country}</span>
          </div>

          {/* 감독 & 배우 */}
          <p className="movie-credits leading-relaxed whitespace-pre-line">
            <span className="font-bold">감독 | </span> {director} <br />
            <span className="font-bold">출연 | </span> {formatActors(actors)}
          </p>

          {/* 개요 */}
          <div className="mt-2">
            <p className="max-w-[900px] leading-relaxed whitespace-pre-line">{overview}</p>
          </div>

          {/* 트레일러 & 평점 */}
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

      {/* 리뷰 섹션 */}
      <section className="mt-10">
        <div className="flex items-baseline gap-2 justify-start mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Reviews</h2>
          <span className="text-2xl text-[var(--color-main)] font-bold">reviewsCount</span>
        </div>
      </section>
    </div>
  );
}

/*
주석 설명:

1. useLocation
   - 라우터에서 state로 전달된 영화 데이터를 가져옴
   - 만약 movie가 없으면 오류 메시지 렌더링

2. formatRunTime
   - 런타임(분)을 "h m" 형식으로 변환

3. formatGenres, formatActors
   - 배열 데이터를 문자열로 변환하여 표시

4. JSX 구조
   - 최상위 div
   - 영화 섹션: 포스터 + 상세 정보 flex 배치
   - movie-detail-area: 영화 제목, 인증, 연도, 런타임, 장르, 국가, 감독, 배우, 개요
   - 트레일러 버튼 + 평점 표시
   - 리뷰 섹션: Reviews 헤더 + 리뷰 개수

5. 스타일
   - TailwindCSS 기반
   - CSS 변수(`--color-text-main`, `--color-main`) 사용
*/
