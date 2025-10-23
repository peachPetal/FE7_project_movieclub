import { useState, useEffect, useCallback } from "react";
import {
  isDarkMode as isDarkModeUtil,
  toggleTheme as toggleThemeUtil,
  type Theme,
} from "../lib/theme";

const getSystemColorScheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getInitialTheme = (): Theme => {
    if (isDarkModeUtil()) {
        return "dark";
    }

    return getSystemColorScheme();
};


export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = useCallback(() => {
    toggleThemeUtil();
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-preference-key')) {
         setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQueryList.addEventListener('change', handleSystemChange);
    return () => mediaQueryList.removeEventListener('change', handleSystemChange);
  }, []);

  useEffect(() => {
    const syncThemeAcrossTabs = () => {
      setTheme(isDarkModeUtil() ? "dark" : "light");
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