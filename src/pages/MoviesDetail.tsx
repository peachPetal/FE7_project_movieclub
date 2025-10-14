import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { isDarkMode } from "../lib/theme";
import { useMovieStore } from "../stores/movieStore";
import { useReviewStore } from "../stores/reviewStore";

import TrailerBtn from "../components/common/buttons/TrailerBtn";
import LikeBtn from "../components/common/buttons/LikeBtn";

function MetaRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | string[];
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-2 text-sm text-[var(--color-text-sub)]">
      <span className="min-w-[72px]">{label}</span>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => (
            <span
              key={String(v)}
              className="px-2 py-0.5 rounded-full bg-[var(--color-main-10)] text-[var(--color-main)] text-xs"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[var(--color-text-main)]">{value}</span>
      )}
    </div>
  );
}

export default function MoviesDetail() {
  const { id } = useParams();
  const movieId = useMemo(
    () => (id ? (Number.isNaN(Number(id)) ? id : Number(id)) : undefined),
    [id]
  );

  const { movies, isLoading, fetchMovies } = useMovieStore();
  const { reviewsData } = useReviewStore();

  // 상세 전용 API가 없다고 가정: 목록이 비면 한 번 채워둠
  useEffect(() => {
    if (!movies || movies.length === 0) {
      fetchMovies();
    }
  }, [movies, fetchMovies]);

  const movie = useMemo(() => {
    if (!movies || movies.length === 0 || movieId === undefined)
      return undefined;
    return movies.find((m) => String(m.id) === String(movieId));
  }, [movies, movieId]);

  // 해당 영화의 리뷰만 필터링 (reviewStore: review.movie = 영화제목 문자열)
  const matchedReviews = useMemo(() => {
    // reviewStore는 초기값이 배열이므로 null 체크 대신 배열 보장
    if (!Array.isArray(reviewsData)) return null;

    // 영화 데이터가 준비되지 않았으면 로딩 상태 유지
    if (!movie) return null;

    const norm = (s: unknown) =>
      String(s ?? "")
        .trim()
        .toLowerCase();

    const movieTitleNorm = norm(movie.title);

    const filtered = (reviewsData as any[]).filter((r: any) => {
      const reviewTitleNorm = norm(r.movie);
      return reviewTitleNorm === movieTitleNorm;
    });

    return filtered as Review[];
  }, [reviewsData, movie]);

  // const reviewsCount = Array.isArray(matchedReviews)
  //   ? matchedReviews.length
  //   : 0;

  // --- 스켈레톤 UI를 위한 테마 관리 로직 ---
  const [isDark, setIsDark] = useState(isDarkMode());
  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";
  // ---

  return (
    <div className="w-3/4 p-4 overflow-y-auto">
      {/* 상단: 포스터 + 정보 (flex 레이아웃) */}
      <div className="flex gap-8">
        {/* 포스터 */}
        <div className="w-[250px] flex-shrink-0">
          {isLoading || !movie ? (
            <Skeleton
              height={358}
              className="rounded-lg"
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          ) : (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-[250px] h-[358px] object-cover rounded-lg card-shadow"
            />
          )}
        </div>

        {/* 정보 영역 */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold text-[var(--color-text-main)]">
            {isLoading || !movie ? (
              <Skeleton
                width={280}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            ) : (
              movie.title
            )}
          </h1>

          {/* CTA 버튼 영역 */}
          <div className="flex items-center gap-4 mt-1">
            <TrailerBtn src="" />
            <LikeBtn like={movie?.likeCount ?? 0} isLiked={false} />
          </div>

          <div className="flex flex-col gap-2">
            {isLoading || !movie ? (
              <>
                <Skeleton
                  width={220}
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                />
                <Skeleton
                  width={260}
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                />
                <Skeleton
                  count={2}
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                />
              </>
            ) : (
              <>
                <MetaRow label="개봉/연도" value={movie.year} />
                <MetaRow label="러닝타임" value={movie.runtime} />
                <MetaRow label="평점" value={movie.rating} />
                <MetaRow label="장르" value={movie.genre} />
                <MetaRow label="감독" value={movie.director} />
                <MetaRow label="출연" value={movie.actors} />
              </>
            )}
          </div>

          {/* 시놉시스/설명 */}
          <div className="mt-2">
            {isLoading || !movie ? (
              <Skeleton
                count={4}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            ) : (
              <p className="text-[var(--color-text-main)] leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* 리뷰 섹션: 기존 컴포넌트 재사용 */
}
// <section className="mt-10">
//   <div className="flex items-baseline gap-2 justify-start mb-4">
//     <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
//       Reviews
//     </h2>
//     <span className="text-2xl text-[var(--color-main)] font-bold">
//       {reviewsCount}
//     </span>
//   </div>
//   {matchedReviews !== null ? (
//     <div className="flex flex-col gap-4">
//       {Array.isArray(matchedReviews) && matchedReviews.length > 0 ? (
//         <div className="flex flex-wrap gap-[30px]">
//           <ReviewsRendering data={matchedReviews} hasImage={false} />
//         </div>
//       ) : (
//         <div className="text-[var(--color-text-sub)] text-sm">
//           이 영화의 리뷰가 아직 없습니다.
//         </div>
//       )}
//     </div>
//   ) : (
//     <div className="flex gap-[30px] flex-wrap">
//       {/* 5개의 스켈레톤 카드를 생성 */}
//       {Array.from({ length: 5 }).map((_, idx) => (
//         <div
//           key={idx}
//           // 카드 배경: 테마에 따라 자동 변경 (bg-background-sub)
//           // 그림자: 공통 스타일 적용 (card-shadow)
//           className="relative w-[320px] h-[250px] bg-[var(--color-background-sub)] rounded-[10px] card-shadow"
//         >
//           <div className="absolute left-[22px] top-[21.34px] w-[277px]">
//             <Skeleton
//               count={2}
//               baseColor={skeletonBaseColor}
//               highlightColor={skeletonHighlightColor}
//             />
//           </div>
//           <Skeleton
//             className="absolute left-[22px] top-[80.28px]"
//             width={277}
//             count={3}
//             baseColor={skeletonBaseColor}
//             highlightColor={skeletonHighlightColor}
//           />
//           <Skeleton
//             className="absolute left-[22px] top-[172.76px]"
//             width={180}
//             height={16}
//             baseColor={skeletonBaseColor}
//             highlightColor={skeletonHighlightColor}
//           />
//           <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
//             <div className="grid grid-cols-3 items-center w-full">
//               <Skeleton
//                 width={40}
//                 height={20}
//                 baseColor={skeletonBaseColor}
//                 highlightColor={skeletonHighlightColor}
//               />
//               <Skeleton
//                 width={40}
//                 height={20}
//                 className="mx-auto"
//                 baseColor={skeletonBaseColor}
//                 highlightColor={skeletonHighlightColor}
//               />
//               <Skeleton
//                 circle
//                 width={24}
//                 height={24}
//                 className="ml-auto"
//                 baseColor={skeletonBaseColor}
//                 highlightColor={skeletonHighlightColor}
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )}
// </section>
