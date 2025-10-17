import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./utils/queryClient";

import DefaultLayout from "./layouts/DefaultLayout";
import PublicOnlyRoute from "./components/routes/PublicOnlyRoute";

import HomeContent from "./pages/HomeContent";
import LoginPage from "./pages/Login";
import MoviesPage from "./pages/Movies";
import MoviesDetail from "./pages/MoviesDetail";
import ReviewsPage from "./pages/Reviews";
import ReviewsDetail from "./pages/ReviewsDetail";
import ReviewPostPage from "./pages/ReviewPost";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UsersPage from "./pages/UsersPage";
import SearchResultPage from "./pages/SearchResult";
import Error from "./pages/Error";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Layout 적용 영역 */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomeContent />} />

          {/* 로그인 페이지는 PublicOnlyRoute 적용 */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* 리뷰 관련 페이지 */}
          <Route path="/review/post" element={<ReviewPostPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewsDetail />} />

          {/* 영화 관련 페이지 */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviesDetail />} />

          {/* 사용자 관련 페이지 */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<UsersPage />} />

          {/* 기타 페이지 */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/search/:query" element={<SearchResultPage />} />
        </Route>

        {/* Layout 없이 독립 페이지 */}
        <Route path="/error" element={<Error />} />
      </Routes>
    </QueryClientProvider>
  );
}

/*
주석 설명:

1. QueryClientProvider
   - react-query 클라이언트를 전체 앱에 제공
   - 상태 캐싱, 쿼리 관리 등

2. DefaultLayout Route
   - 공통 레이아웃(Header, Sidebar 등)을 적용
   - 내부 Route들은 모두 DefaultLayout 안에서 렌더링됨

3. PublicOnlyRoute
   - 로그인하지 않은 사용자만 접근 가능
   - 로그인 페이지에 적용

4. 페이지 카테고리
   - 리뷰 관련: /review/post, /reviews, /reviews/:id
   - 영화 관련: /movies, /movies/:id
   - 사용자 관련: /profile, /users
   - 기타: /settings, /search/:query

5. 독립 페이지
   - /error : 레이아웃 없이 독립적으로 렌더링
*/
