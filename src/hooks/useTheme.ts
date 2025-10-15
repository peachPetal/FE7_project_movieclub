import { useState, useEffect, useCallback } from "react";
import { isDarkMode, toggleTheme as toggleThemeUtil, type Theme } from "../lib/theme";

/**
 * React 컴포넌트에서 테마 상태를 반응형으로 사용하고,
 * 테마를 토글할 수 있는 기능을 제공하는 커스텀 훅.
 * lib/theme.ts의 유틸리티를 활용합니다.
 */
export const useTheme = () => {
  // 1. React의 state를 사용. 초기값은 유틸리티 함수로 가져옴.
  const [theme, setTheme] = useState<Theme>(isDarkMode() ? "dark" : "light");

  // 2. 테마를 토글하는 함수 (메모이제이션)
  const toggleTheme = useCallback(() => {
    // 유틸리티 함수로 실제 테마 변경 로직 실행
    toggleThemeUtil();
    // React state도 함께 변경하여 리렌더링 유발
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  // 3. 다른 탭이나 창에서 테마가 변경될 때 상태를 동기화
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(isDarkMode() ? "dark" : "light");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { 
    theme, 
    isDark: theme === 'dark', 
    toggleTheme 
  };
};