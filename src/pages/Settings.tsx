import React, { useState, useEffect } from "react";
import { toggleTheme } from "../lib/theme";

export default function Settings() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const handleToggle = () => {
    toggleTheme();
    setIsDark((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen font-pretendard flex flex-col items-start px-10 py-10 bg-background-main text-text-main">
      <h1 className="text-[32px] font-bold mb-6">설정</h1>
      
      <div className="w-[300px] rounded-[10px] bg-background-sub card-shadow p-6 flex items-center justify-between">
        <span className="text-[20px] font-medium">다크모드</span>
        <button
          onClick={handleToggle}
          className="relative w-[70px] h-[31.5px] rounded-full transition-all duration-300"
          style={{
            background: isDark ? "var(--color-main)" : "#DEDEDE",
            boxShadow: isDark
              ? "inset 0px 6px 8px 3px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
        >
          <div
            className={`absolute top-[3.5px] w-[24.5px] h-[24.5px] rounded-full bg-white shadow-md transition-all duration-300 ${
              isDark ? "left-[42px]" : "left-[3.5px]"
            }`}
          ></div>
        </button>
      </div>
    </div>
  );
}
