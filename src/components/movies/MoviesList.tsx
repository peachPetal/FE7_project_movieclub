import { getMovies } from "../../api/tmdb/tmdbUtils";
import MoviesRendering from "./MoviesRendering";
import { useEffect, useState, useRef, useCallback } from "react";

type MoviesListProps = {
  variant?: "home" | "page";
};

export default function MoviesList({ variant = "page" }: MoviesListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const MAX_TMDB_PAGES = 500; // TMDB의 공식 최대 페이지

  /**
   * 한 페이지를 가져와 movies에 append
   */
  const fetchPage = useCallback(
    async (targetPage: number, { replace }: { replace?: boolean } = {}) => {
      if (variant === "home") return; // home에서는 무한스크롤 비활성화

      // 초기 로딩 vs 추가 로딩 상태 분리
      if (targetPage === 1) setIsInitialLoading(true);
      else setIsFetchingMore(true);

      try {
        const items = await getMovies(targetPage);

        setMovies((prev) => (replace ? items : [...prev, ...items]));
        setPage(targetPage);

        // hasMore 판정: TMDB는 최대 500페이지, 또는 응답이 비었으면 종료
        const reachedEnd = items.length === 0 || targetPage >= MAX_TMDB_PAGES;
        setHasMore(!reachedEnd);
      } catch (e) {
        console.error("[MoviesList] fetchPage error", e);
        // 오류가 나면 더 이상 무한 스크롤 시도하지 않도록 막아둠
        setHasMore(false);
      } finally {
        if (targetPage === 1) setIsInitialLoading(false);
        else setIsFetchingMore(false);
      }
    },
    [variant]
  );

  /**
   * 초기 로드
   */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (variant === "home") {
        // 홈에서는 첫 페이지에서 5개만 노출
        setIsInitialLoading(true);
        try {
          const first = await getMovies(1);
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

      // page 변형: 상태 초기화 후 1페이지부터 시작
      setMovies([]);
      setPage(1);
      setHasMore(true);
      await fetchPage(1, { replace: true });
    };

    init();

    return () => {
      mounted = false;
    };
  }, [variant, fetchPage]);

  /**
   * IntersectionObserver 설정 (무한 스크롤)
   */
  useEffect(() => {
    if (variant === "home") return; // home에서는 옵저버 사용하지 않음
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (!hasMore) return;
        if (isInitialLoading || isFetchingMore) return; // 중복 호출 방지

        fetchPage(page + 1);
      },
      { root: null, rootMargin: "0px", threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [variant, page, hasMore, isInitialLoading, isFetchingMore, fetchPage]);

  return (
    <div className="w-full">
      <MoviesRendering
        data={movies}
        variant={variant}
        isLoading={isInitialLoading}
      />

      {/* 무한 스크롤 하단 센티넬 & 상태 표시 (page 전용) */}
      {variant === "page" && (
        <div className="w-full flex flex-col items-center mt-6">
          {/* sentinel: 뷰포트에 들어오면 다음 페이지 요청 */}
          <div ref={sentinelRef} className="h-6 w-6" aria-hidden />

          {/* 추가 로딩 스피너 */}
          {isFetchingMore && (
            <div className="mt-2 text-sm text-text-sub">불러오는 중...</div>
          )}

          {/* 더 없음 표시 */}
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
