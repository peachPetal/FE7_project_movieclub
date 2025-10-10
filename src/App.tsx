import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />} />
        <Route path="/loginPage" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}