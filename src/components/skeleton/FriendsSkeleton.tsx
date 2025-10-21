// src/components/sidebar/FriendSkeletonList.tsx
// (UserSkeleton.tsx와 동일한 패턴 적용)

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
// isDarkMode 유틸리티 경로를 확인하세요.
// UserSkeleton.tsx 기준으로 상대 경로를 추측했습니다.
import { isDarkMode } from "../../lib/theme";

/**
 * 친구 목록 아이템 하나에 대한 스켈레톤 UI
 * (UserSkeleton.tsx와 동일한 테마 로직 적용)
 */
export const FriendsSkeleton = () => {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    // 테마 변경 감지
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // UserSkeleton과 동일한 색상 로직
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    // 기존 FriendSkeleton의 레이아웃(flex, gap, padding) 유지
    <div className="flex items-center gap-3 px-4 py-2">
      {/* 아바타 스켈레톤 (w-10 h-10 -> 40px) */}
      <Skeleton
        circle
        width={40}
        height={40}
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />

      {/* 이름 스켈레톤 (flex-1, h-4 -> 16px, w-3/4 -> 75%) */}
      <div className="flex-1">
        <Skeleton
          height={16} // h-4는 1rem (16px)
          width="75%" // w-3/4
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
      </div>
    </div>
  );
};

