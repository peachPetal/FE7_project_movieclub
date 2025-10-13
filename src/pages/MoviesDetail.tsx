import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import ReviewsRendering from "../components/reviews/ReviewsRendering";
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
    <div className="flex gap-2 text-sm text-gray-600">
      <span className="min-w-[72px] text-gray-500">{label}</span>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => (
            <span
              key={String(v)}
              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-800">{value}</span>
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

  const reviewsCount = Array.isArray(matchedReviews)
    ? matchedReviews.length
    : 0;

  return (
    <div className="w-3/4 p-4 overflow-y-auto">
      {/* 상단: 포스터 + 정보 (flex 레이아웃) */}
      <div className="flex gap-8">
        {/* 포스터 */}
        <div className="w-[250px] flex-shrink-0">
          {isLoading || !movie ? (
            <Skeleton height={358} className="rounded-lg" />
          ) : (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-[250px] h-[358px] object-cover rounded-lg shadow-md"
            />
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold">
            {isLoading || !movie ? <Skeleton width={280} /> : movie.title}
          </h1>

          {/* CTA 버튼 영역 (트레일러 / 좋아요 카운트) */}
          <div className="flex items-center gap-4 mt-1">
            <TrailerBtn src="" /> {/* 트레일러 URL이 없으므로 빈 문자열 전달 */}
            <LikeBtn like={movie?.likeCount ?? 0} isLiked={false} />
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-col gap-2">
            {isLoading || !movie ? (
              <>
                <Skeleton width={220} />
                <Skeleton width={260} />
                <Skeleton count={2} />
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
              <Skeleton count={4} />
            ) : (
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 섹션: 기존 컴포넌트 재사용 */}
      <section className="mt-10">
        <div className="flex items-baseline gap-2 justify-start mb-4">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <span className="text-2xl text-[var(--color-main)] font-bold">
            {reviewsCount}
          </span>
        </div>
        {matchedReviews !== null ? (
          <div className="flex flex-col gap-4">
            {Array.isArray(matchedReviews) && matchedReviews.length > 0 ? (
              <div className="flex flex-wrap gap-[30px]">
                <ReviewsRendering data={matchedReviews} hasImage={false} />
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                이 영화의 리뷰가 아직 없습니다.
              </div>
            )}
          </div>
        ) : (
          // HomeContent의 스켈레톤 스타일 재사용 느낌
          <div className="flex gap-[30px] flex-wrap">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="relative w-[320px] h-[250px] bg-white rounded-[10px] shadow-md"
              >
                <div className="absolute left-[22px] top-[21.34px] w-[277px]">
                  <Skeleton count={2} />
                </div>
                <Skeleton
                  className="absolute left-[22px] top-[80.28px]"
                  width={277}
                  count={3}
                />
                <Skeleton
                  className="absolute left-[22px] top-[172.76px]"
                  width={180}
                  height={16}
                />
                <div className="absolute bottom-0 left-0 right-0 h-[60px] px-[22px] flex items-center">
                  <div className="grid grid-cols-3 items-center w-full">
                    <Skeleton width={40} height={20} />
                    <Skeleton width={40} height={20} className="mx-auto" />
                    <Skeleton
                      circle
                      width={24}
                      height={24}
                      className="ml-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
