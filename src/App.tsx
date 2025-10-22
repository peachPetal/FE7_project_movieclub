import { Routes, Route, Navigate } from "react-router-dom";
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
import ReviewPostPage from "./pages/ReviewPostPage";
import Profile from "./pages/Profile";
import UsersPage from "./pages/UsersPage";
import SearchResultPage from "./pages/SearchResult";
import Error from "./pages/Error";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// ✅ 1. react-toastify 관련 임포트 추가
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

          {/* ProtectedRoute 적용: 로그인 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/review/post" element={<ReviewPostPage />} />
            {/* UsersPage도 ProtectedRoute 내부로 이동하는 것이 적절해 보입니다. */}
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* 리뷰 관련 페이지 (로그인 필요 없음) */}
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewsDetail />} />

          {/* 영화 관련 페이지 */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviesDetail />} />

          {/* 사용자 관련 페이지 (ProtectedRoute로 이동) */}
          {/* <Route path="/users" element={<UsersPage />} /> */}

          {/* 기타 페이지 */}
          <Route path="/search/:query" element={<SearchResultPage />} />
        </Route>

        {/* Layout 없이 독립 페이지 */}
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>

      {/* ✅ 2. ToastContainer 컴포넌트 추가 */}
      <ToastContainer
        position="bottom-right" // 우측 하단
        autoClose={3000} // 3초 후 자동 닫힘
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // 'light', 'dark', 'colored' 중 선택
      />
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

4. ProtectedRoute
   - 로그인한 사용자만 접근 가능
   - 프로필, 리뷰 작성, 사용자 페이지 등에 적용

5. ToastContainer
   - react-toastify 알림 메시지를 표시할 컨테이너
   - 앱 전체에서 사용 가능하도록 Provider 외부에 배치

6. 페이지 카테고리
   - 리뷰 관련: /review/post, /reviews, /reviews/:id
   - 영화 관련: /movies, /movies/:id
   - 사용자 관련: /profile, /users
   - 기타: /search/:query

7. 독립 페이지
   - /error : 레이아웃 없이 독립적으로 렌더링
*/