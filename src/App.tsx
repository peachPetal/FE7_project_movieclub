import React from "react";
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import Error from "./pages/Error";
import MoviesPage from "./pages/MoviesPage";
import HomeContent from "./pages/HomeContent";
import ReviewsPage from "./pages/ReviewsPage";
import MoviesDetail from "./pages/MoviesDetail";
import ReviewsDetail from "./components/reviews/ReviewsDetail";
import ReviewPostPage from "./pages/ReviewPostPage";
// import MoviesDetail from "./pages/MoviesDetail";
import Settings from "./pages/Settings";
import Profile from "./pages/profilePage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  // ProfileImageUpload onUpload 콜백
  const handleProfileUpload = (file: File | null) => {
    if (file) {
      console.log("선택한 파일:", file.name);
      // 서버 업로드 가능 (FormData + fetch/axios)
    } else {
      console.log("이미지 삭제됨");
      // 삭제 처리 가능
    }
  };

  return (
    <Routes>
      {/* DefaultLayout 적용 영역 */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomeContent />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/review/post" element={<ReviewPostPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/reviews/:id" element={<ReviewsDetail />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MoviesDetail />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<UsersPage />} />
        <Route
          path="/profile"
          element={<Profile onUpload={handleProfileUpload} />}
        />
      </Route>
      <Route path="/error" element={<Error />} />
    </Routes>
  );
}
