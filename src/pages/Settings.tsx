// import React, { useState } from "react";

// export default function Settings() {
//   const [isDark, setIsDark] = useState(false);

//   return (
//     <div className="relative min-h-screen font-pretendard flex flex-col items-start px-10 py-10">
//       <h1 className="text-[32px] font-bold text-[#373737] mb-6">설정</h1>
//       <div className="w-[300px] rounded-[10px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] p-6 flex items-center justify-between">
//         <span className="text-[20px] font-medium text-[#373737]">
//           다크모드
//         </span>

//         {/* 스위치 버튼 */}
//         <button
//           onClick={() => setIsDark(!isDark)}
//           className="relative w-[70px] h-[31.5px] rounded-full transition-all duration-300"
//           style={{
//             background: isDark ? "#9858F3" : "#DEDEDE",
//             boxShadow: isDark
//               ? "inset 0px 6px 8px 3px rgba(0, 0, 0, 0.1)"
//               : "none",
//           }}
//         >
//           <div
//             className={`absolute top-[3.5px] w-[24.5px] h-[24.5px] rounded-full bg-white shadow-md transition-all duration-300 ${
//               isDark ? "left-[42px]" : "left-[3.5px]"
//             }`}
//           ></div>
//         </button>
//       </div>
//     </div>
//   );
// }

// src/pages/Settings.tsx
import React, { useState, useEffect } from "react";
import { toggleTheme } from "../lib/theme"; // 1. 토글 함수 import

export default function Settings() {
  // 2. 컴포넌트의 UI 상태는 localStorage를 기반으로 초기화
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const handleToggle = () => {
    // 3. 전역 토글 함수 호출
    toggleTheme();
    // 4. 컴포넌트 내부 UI 상태 업데이트
    setIsDark((prev) => !prev);
  };

  return (
    // CSS 변수를 사용하도록 배경/글자색 적용
    <div className="relative min-h-screen font-pretendard flex flex-col items-start px-10 py-10 bg-background-main text-text-main">
      <h1 className="text-[32px] font-bold mb-6">설정</h1>
      
      <div className="w-[300px] rounded-[10px] bg-background-sub card-shadow p-6 flex items-center justify-between">
        <span className="text-[20px] font-medium">다크모드</span>

        {/* 스위치 버튼 */}
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
