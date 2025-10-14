import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useEffect } from "react";
import { isDarkMode } from "../../lib/theme";

export default function ReviewcardSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div className="w-[320px] h-[250px] bg-[var(--color-background-sub)] rounded-[10px] card-shadow flex flex-col justify-between flex-shrink-0 p-4">
      {/* 상단 타이틀 */}
      <div className="mb-2">
        <Skeleton
          height={20}
          width="80%"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
      </div>
        <br/>
      {/* 중단 텍스트 영역 */}
      <div className="flex-1 space-y-2">
        <Skeleton width="100%" height={16} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        <Skeleton width="100%" height={16} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        <Skeleton width="100%" height={16} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        <br/>
        <Skeleton width="60%" height={16} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
      </div>

      {/* 하단 버튼/아이콘 영역 */}
      <div className="flex justify-around mt-2">
        <Skeleton width={40} height={20} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        <Skeleton width={40} height={20} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        <Skeleton circle width={24} height={24} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
      </div>
    </div>
  );
}
