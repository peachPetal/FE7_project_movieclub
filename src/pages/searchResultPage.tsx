// src/pages/SearchResultPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// --- 필요한 함수, 컴포넌트, 타입 import ---
import { tmdbSearch } from '../api/tmdbSearch';
import { searchReviews } from '../api/searchReviews';
import { searchUsers } from '../api/searchUsers';
import MoviesRendering from '../components/movies/MoviesRendering';
import ReviewsRendering from '../components/reviews/ReviewsRendering';
import type { ReviewSubset } from '../types/Review';
import UserList from '../components/users/UserList';
import type { AppUser } from '../types/appUser';

const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          created_at: new Date().toISOString(),
        }));
        setUsers(appUsers);

        } else {
          // --- 영화 및 리뷰 검색 ---
          const [movieResults, reviewResults] = await Promise.all([
            tmdbSearch(query),
            searchReviews(query)
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
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--color-main)]">{query}</span> 검색 결과
        </h1>

        {isUserSearch ? (
          <>
            <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)] my-6">
              사용자<span className="text-[var(--color-main)]"> {!isLoading ? users.length : '...'}</span>건
            </h2>
            {/* 2. UserList 컴포넌트를 사용합니다. */}
            <UserList
              users={users}
              isLoading={isLoading}
              // SearchResultPage에는 선택 기능이 없으므로, 플레이스홀더 값을 전달합니다.
              selectedId={null}
              onSelectUser={() => {}} // 클릭해도 아무 일도 일어나지 않음
              error={null}
            />
          </>
        ) : (
          <>
        {/* --- 영화 섹션 --- */}
        <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] my-6">
          영화<span className="text-[var(--color-main)]"> {!isLoading ? movies.length : '...'}</span>건
        </h2>
        <MoviesRendering data={movies} isLoading={isLoading} variant="page" />
        <br />
        {/* --- 리뷰 섹션 --- */}
        <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] mb-6">
          리뷰<span className="text-[var(--color-main)]"> {!isLoading ? reviews.length : '...'}</span>건
        </h2>
        {/* ReviewList와 동일한 패턴으로 ReviewsRendering 컴포넌트 사용 */}
        <ReviewsRendering data={reviews} isLoading={isLoading} variant="page" />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;