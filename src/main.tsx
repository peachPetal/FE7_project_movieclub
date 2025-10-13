import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initializeTheme } from "./lib/theme.ts"; // 추가

// React 앱이 마운트되기 전에 테마를 즉시 설정합니다.
initializeTheme(); // 추가

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {" "}
      <App />
    </BrowserRouter>
  </StrictMode>
);
