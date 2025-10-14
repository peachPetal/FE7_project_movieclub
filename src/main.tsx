import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { initializeTheme } from "./lib/theme.ts";
import AuthBootstrap from "./components/AuthBootstrap.tsx";

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthBootstrap />
      <App />
    </BrowserRouter>
  </StrictMode>
);
