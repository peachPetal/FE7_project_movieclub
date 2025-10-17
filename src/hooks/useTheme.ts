// src/hooks/useTheme.ts
import { useState, useEffect, useCallback } from "react";
import {
  isDarkMode,
  toggleTheme as toggleThemeUtil,
  type Theme,
} from "../lib/theme";

/**
 * React 앱에서 다크/라이트 테마를 제어하고 동기화하는 커스텀 훅.
 * - 현재 테마 상태 제공
 * - 테마 토글 기능 제공
 * - 로컬스토리지 및 다른 탭과의 상태 동기화
 */
export const useTheme = () => {
  // 현재 테마 상태 (초기값은 실제 시스템/저장 상태 기반)
  const [theme, setTheme] = useState<Theme>(() =>
    isDarkMode() ? "dark" : "light"
  );

  // 테마 토글 (함수형 업데이트 + 유틸 호출)
  const toggleTheme = useCallback(() => {
    toggleThemeUtil();
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // 다른 탭(또는 창)에서 변경 시 테마 동기화
  useEffect(() => {
    const syncThemeAcrossTabs = () => {
      setTheme(isDarkMode() ? "dark" : "light");
    };

    window.addEventListener("storage", syncThemeAcrossTabs);
    return () => window.removeEventListener("storage", syncThemeAcrossTabs);
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
  };
};
