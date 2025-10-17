// src/pages/SearchResultPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// --- API, 컴포넌트, 타입 import ---
import { tmdbSearch } from '../api/search/movieSearch';
import { searchReviews } from '../api/search/searchReviews';
import { searchUsers } from '../api/search/searchUsers';
import MoviesRendering from '../components/movies/MoviesRendering';
import ReviewsRendering from '../components/reviews/ReviewsRendering';
import UserList from '../components/users/UserList';
import type { ReviewSubset } from '../types/review';
import type { AppUser } from '../types/appUser';

const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();

  // --- 상태 관리 ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- 검색 데이터 fetch ---
  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setIsLoading(true);
      setMovies([]);
      setReviews([]);
      setUsers([]);

      if (query.startsWith('@')) {
        // --- 사용자 검색 ---
        const userProfiles = await searchUsers(query);
        const appUsers: AppUser[] = userProfiles.map(profile => ({
          ...profile,
          created_at: new Date().toISOString(), // 임시 데이터
        }));
        setUsers(appUsers);
      } else {
        // --- 영화 및 리뷰 검색 ---
        const [movieResults, reviewResults] = await Promise.all([
          tmdbSearch(query),
          searchReviews(query),
        ]);
        setMovies(movieResults);
        setReviews(reviewResults);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [query]);

  const isUserSearch = query?.startsWith('@') ?? false;

  return (
    <div className="bg-[var(--color-background-main)] text-[var(--color-text-main)] min-h-screen p-8">
      {/* -------------------------------
          검색 쿼리 제목
      ------------------------------- */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--color-main)]">{query}</span> 검색 결과
        </h1>

        {isUserSearch ? (
          <>
            {/* -------------------------------
                사용자 검색 결과
            ------------------------------- */}
            <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)] my-6">
              사용자
              <span className="text-[var(--color-main)]">
                {!isLoading ? users.length : '...'}
              </span>
              건
            </h2>

            <UserList
              users={users}
              isLoading={isLoading}
              selectedId={null} // 선택 기능 없음
              onSelectUser={() => {}} // 클릭해도 아무 동작 없음
              error={null}
            />
          </>
        ) : (
          <>
            {/* -------------------------------
                영화 검색 결과
            ------------------------------- */}
            <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] my-6">
              영화
              <span className="text-[var(--color-main)]">
                {!isLoading ? movies.length : '...'}
              </span>
              건
            </h2>
            <MoviesRendering data={movies} isLoading={isLoading} variant="page" />

            <br />

            {/* -------------------------------
                리뷰 검색 결과
            ------------------------------- */}
            <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] mb-6">
              리뷰
              <span className="text-[var(--color-main)]">
                {!isLoading ? reviews.length : '...'}
              </span>
              건
            </h2>
            <ReviewsRendering data={reviews} isLoading={isLoading} variant="page" />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
