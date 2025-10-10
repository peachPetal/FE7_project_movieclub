import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import Error from "./pages/Error";
import MoviesPage from "./pages/MoviesPage";
import HomeContent from "./pages/HomeContent";
import ReviewsPage from "./pages/ReviewsPage";
import MoviesDetail from "./pages/MoviesDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        {" "}
        <Route path="/" element={<HomeContent />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/error" element={<Error />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/:id" element={<MoviesDetail />} />
      </Routes>
    </Router>
  );
}
