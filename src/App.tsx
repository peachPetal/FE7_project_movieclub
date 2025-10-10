import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import Error from "./pages/Error";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/error" element={<Error />}/>
      </Routes>
    </Router>
  );
}