import Comment from "../comments/Comment";
import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import { isDarkMode } from "../../lib/theme"; // 다크모드 감지 유틸

export default function MovieDetailSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div className="max-w-7xl">
      <section className="movie p-4 flex h-[500px]">
        <Skeleton
          width={340}
          height={500}
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
        <div className="movie-detail-area w-full h-full flex flex-col justify-around ml-9">
          <div className="movie-info flex items-end">
            <Skeleton
              width={200}
              height={60}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <Skeleton
              width={360}
              height={32}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
              className="ml-3"
            />
          </div>
          <p className="movie-credits leading-relaxed whitespace-pre-line">
            <Skeleton
              width={300}
              height={60}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </p>
          <div className="mt-2">
            <Skeleton
              width={600}
              height={150}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </div>
          <div className="flex items-center gap-6 mt-4">
            <Skeleton
              width={170}
              height={57}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <div className="flex items-center gap-1.5">
              <Skeleton
                width={170}
                height={57}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <div className="flex items-baseline gap-2 justify-between mb-4">
          <div className="review-section_title flex ">
            <Skeleton
              width={185}
              height={43}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
