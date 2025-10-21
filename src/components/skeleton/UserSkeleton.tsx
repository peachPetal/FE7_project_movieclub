import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import { isDarkMode } from "../../lib/theme"; // 다크모드 감지 유틸

export default function UserSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-background-sub)] card-shadow">
      {/* 프로필 이미지 */}
      <Skeleton
        circle
        width={40}
        height={40}
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />

      {/* 사용자 이름 + 부가 정보 */}
      <div className="flex-1 space-y-2">
        <Skeleton
          height={14}
          width="70%"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
        <Skeleton
          height={12}
          width="50%"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
      </div>
    </div>
  );
}
