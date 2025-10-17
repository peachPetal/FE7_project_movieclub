import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import { isDarkMode } from "../../lib/theme"; // 다크모드 감지 유틸

export default function MovieSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div className="w-[250px] h-[450px] rounded-lg overflow-hidden card-shadow flex flex-col bg-[var(--color-background-sub)] flex-shrink-0">
      {/* 상단 이미지 영역 */}
      <div className="w-full h-[358px] overflow-hidden">
        <Skeleton
          height={358}
          className="rounded-t-lg"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
      </div>

      {/* 하단 카드 정보 영역 */}
      <div className="w-full h-[92px] p-4 flex flex-col justify-between">
        {/* 중앙 텍스트 */}
        <h3 className="font-bold text-lg truncate text-center">
          <Skeleton
            width={120}
            height={20}
            className="mx-auto"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        </h3>

        {/* 하단 버튼/아이콘 영역 */}
        <div className="flex justify-around">
          <Skeleton
            width={40}
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={40}
            height={20}
            className="mx-auto"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            circle
            width={24}
            height={24}
            className="ml-auto"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        </div>
      </div>
    </div>
  );
}
