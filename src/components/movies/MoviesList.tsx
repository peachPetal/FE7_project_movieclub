import MoviesRendering from "./MoviesRendering";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  getMoviesWithFilters,
  type MoviesQuery,
  getMovieGenres,
} from "../../api/tmdb/tmdbUtils";
import type { FilterOption } from "../../types/Filter";
import { ClipLoader } from "react-spinners";

type MoviesListProps = {
  variant?: "home" | "page";
  filter?: FilterOption;
};

const pickGenreKey = (meta: any) => {
  if (!meta) return undefined;
  if (meta.genreId != null) return meta.genreId;
  if (meta.genreName != null) return meta.genreName;
  if (meta.id != null) return meta.id;
  if (meta.name != null) return meta.name;
  if (meta.genre != null) return meta.genre;
  if (Array.isArray(meta.genres) && meta.genres.length) {
    return meta.genres
      .map((g: any) => (typeof g === "object" ? g.id ?? g.name : g))
      .join(",");
  }
  return undefined;
};

const MIN_LOADING_TIME = 1000; // ✅ 최소 로딩 시간 (1초)

export default function MoviesList({
  variant = "page",
  filter,
}: MoviesListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showInitialLoading, setShowInitialLoading] = useState(true); // ✅ 표시용 로딩 상태
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const MAX_TMDB_PAGES = 500;

  // ✅ 최소 로딩시간 로직
  useEffect(() => {
    if (isInitialLoading) {
      setShowInitialLoading(true);
    } else {
      const timer = setTimeout(
        () => setShowInitialLoading(false),
        MIN_LOADING_TIME
      );
      return () => clearTimeout(timer);
    }
  }, [isInitialLoading]);

  // 장르 캐시 웜업
  useEffect(() => {
    getMovieGenres("ko-KR").catch(() => void 0);
  }, []);

  /** FilterOption → TMDB 파라미터 매핑 */
  const queryFromFilter: MoviesQuery = useMemo(() => {
    const base: MoviesQuery = {
      sortBy: "primary_release_date.desc",
      voteAverageGte: 7,
      voteCountGte: 1000,
    };
    if (!filter) return base;

    const v = (filter.value ?? "").toString();
    const meta: any = (filter as any).meta ?? {};

    const sortMap: Record<string, string> = {
      최신순: "primary_release_date.desc",
      인기순: "popularity.desc",
      평점순: "vote_average.desc",
      release_date: "primary_release_date.desc",
      popularity: "popularity.desc",
      rating: "vote_average.desc",
    };

    if (v in sortMap) {
      return { ...base, sortBy: sortMap[v] };
    }

    if (meta.type === "genre") {
      const genreKey = pickGenreKey(meta);
      return { ...base, withGenres: genreKey ? String(genreKey) : undefined };
    }

    if (v === "개봉연도" || v.toLowerCase() === "year") {
      const yr = typeof meta.year === "number" ? meta.year : Number(meta.year);
      return {
        ...base,
        primaryReleaseYear: Number.isFinite(yr) ? yr : undefined,
      };
    }

    return base;
  }, [filter?.value, JSON.stringify((filter as any)?.meta || {})]);

  /** 한 페이지 로드 */
  const fetchPage = useCallback(
    async (targetPage: number, { replace }: { replace?: boolean } = {}) => {
      if (variant === "home") return;
      if (targetPage === 1) setIsInitialLoading(true);
      else setIsFetchingMore(true);

      try {
        const items = await getMoviesWithFilters({
          ...queryFromFilter,
          page: targetPage,
        });
        setMovies((prev) => (replace ? items : [...prev, ...items]));
        setPage(targetPage);

        const reachedEnd = items.length === 0 || targetPage >= MAX_TMDB_PAGES;
        setHasMore(!reachedEnd);
      } catch (e) {
        console.error("[MoviesList] fetchPage error", e);
        setHasMore(false);
      } finally {
        if (targetPage === 1) setIsInitialLoading(false);
        else setIsFetchingMore(false);
      }
    },
    [variant, queryFromFilter]
  );

  /** 초기 & 필터 변경 시 1페이지부터 다시 로드 */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (variant === "home") {
        setIsInitialLoading(true);
        try {
          const first = await getMoviesWithFilters({
            ...queryFromFilter,
            page: 1,
          });
          const limited = first.slice(0, 5);
          if (!mounted) return;
          setMovies(limited);
        } catch (e) {
          console.error("[MoviesList] home init error", e);
        } finally {
          if (mounted) setIsInitialLoading(false);
        }
        return;
      }

      setMovies([]);
      setPage(1);
      setHasMore(true);
      await fetchPage(1, { replace: true });
    };

    init();
    return () => {
      mounted = false;
    };
  }, [variant, fetchPage, queryFromFilter]);

  /** IntersectionObserver: 끝에 닿으면 다음 페이지 로드 */
  useEffect(() => {
    if (variant === "home") return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasMore) return;
        if (isInitialLoading || isFetchingMore) return;
        fetchPage(page + 1);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [variant, page, hasMore, isInitialLoading, isFetchingMore, fetchPage]);

  return (
    <div className="w-full">
      <MoviesRendering
        key={JSON.stringify(queryFromFilter)} // 필터 바뀌면 강제 remount
        data={movies}
        variant={variant}
        isLoading={showInitialLoading} // ✅ 최소 1초 유지된 로딩 상태 전달
      />

      {variant === "page" && (
        <div className="w-full flex flex-col items-center mt-6">
          <div ref={sentinelRef} className="h-6 w-6" aria-hidden />
          {isFetchingMore && (
            <div className="mt-4 flex justify-center">
              <ClipLoader color="var(--color-main)" size={30} />
            </div>
          )}
          {!isInitialLoading && !isFetchingMore && !hasMore && (
            <div className="mt-2 text-sm text-text-sub">
              모든 영화를 불러왔습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
