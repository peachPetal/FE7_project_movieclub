import Comment from "../comments/Comment";
import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import { isDarkMode } from "../../lib/theme"; // 다크모드 감지 유틸

export default function ReviewsDetailSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <div className="w-[1116px] mr-15">
      {/* 제목 */}
      <Skeleton
        width={370}
        height={40}
        className="mb-2.5"
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />
      {/* 부제목 */}
      <Skeleton
        width={250}
        height={24}
        className="mb-10"
        baseColor={skeletonBaseColor}
        highlightColor={skeletonHighlightColor}
      />

      {/* 이미지 및 텍스트 */}
      <div className="flex mb-10">
        <Skeleton
          width={550}
          height={325}
          className="mr-8"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />

        {/* 텍스트 9줄 스켈레톤 */}
        <div className="mr-12 w-[500px] space-y-2">
          <br />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <br />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <br />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width="100%"
            height={20}
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        </div>
      </div>

      {/* 좋아요 버튼 */}
      <div className="flex justify-center">
        <Skeleton
          width={110}
          height={62}
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />
      </div>

      <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>

      {/* 댓글 */}
      <div>
        <Comment comment={1} />
      </div>
    </div>
  );
}
