// src/lib/theme.ts

type Theme = "light" | "dark";

// 테마를 즉시 적용하는 함수
export const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement; // <html> 요소
  root.classList.remove("light", "dark"); // 기존 클래스 제거
  root.classList.add(theme); // 새 테마 클래스 추가
};

// 페이지 로드 시 초기 테마를 결정하고 적용하는 함수
export const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  
  // 1. 저장된 테마가 있으면 그것을 사용
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }
  
  // 2. 저장된 테마는 없지만, 사용자 시스템이 다크 모드를 선호하면 다크 모드 적용
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme("dark");
    localStorage.setItem("theme", "dark");
    return;
  }

  // 3. 기본값은 라이트 모드
  applyTheme("light");
  localStorage.setItem("theme", "light");
};

// 테마를 토글하는 함수
export const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme") as Theme;
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};

// ⭐️ 추가된 부분
// 현재 테마가 다크 모드인지 확인하여 true/false를 반환하는 헬퍼 함수
export const isDarkMode = () => {
  return localStorage.getItem("theme") === "dark";
};