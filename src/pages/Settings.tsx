// src/pages/Settings.tsx

import { useState } from "react";
import { toggleTheme } from "../lib/theme";

export default function Settings() {
  // 다크모드 상태를 localStorage에서 초기화
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // 다크모드 토글 함수
  const handleToggle = () => {
    toggleTheme();             // 실제 테마 변경
    setIsDark((prev) => !prev); // 상태 업데이트
  };

  return (
    <div className="relative min-h-screen font-pretendard flex flex-col items-start px-10 py-10 bg-background-main text-text-main">
      {/* -------------------------------
          페이지 제목
      ------------------------------- */}
      <h1 className="text-[32px] font-bold mb-6">설정</h1>

      {/* -------------------------------
          다크모드 토글 영역
      ------------------------------- */}
      <div className="w-[300px] rounded-[10px] bg-background-sub card-shadow p-6 flex items-center justify-between">
        <span className="text-[20px] font-medium">다크모드</span>

        {/* 토글 버튼 */}
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
          {/* 토글 썸(동그라미) */}
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
