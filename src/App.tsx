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

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppErrorBoundary } from './components/error/ErrorBoundary';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
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
          </Route>

          {/* 리뷰 관련 페이지 (로그인 필요 없음) */}
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewsDetail />} />

          {/* 영화 관련 페이지 */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MoviesDetail />} />

          {/* 사용자 관련 페이지 (ProtectedRoute로 이동) */}
          <Route path="/users" element={<UsersPage />} />

          {/* 기타 페이지 */}
          <Route path="/search/:query" element={<SearchResultPage />} />
        </Route>

        {/* Layout 없이 독립 페이지 */}
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Navigate to="/error" replace />} />
      </Routes>
      </AppErrorBoundary>

      {/* ToastContainer 컴포넌트 추가 */}
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </QueryClientProvider>
  );
}
