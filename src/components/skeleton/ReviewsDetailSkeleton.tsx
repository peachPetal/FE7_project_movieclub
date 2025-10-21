// 📄 ReviewsDetailSkeleton.tsx

// 1. Comment 컴포넌트 import 제거 (더 이상 사용하지 않음)
// import Comment from "../comments/Comment"; 
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
      {/* --- 상단 리뷰 상세 스켈레톤 (기존과 동일) --- */}
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
      <div className="flex mb-10 gap-8">
        {/* 이미지 스켈레톤 */}
        <Skeleton
          width={550}
          height={325} // 고정 높이
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />

        {/* 텍스트 스켈레톤 */}
        <div className="mr-12 space-y-2">
          <Skeleton
            width={800}
            height={325} // 이미지와 같은 높이
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

      {/* --- 2. 댓글 스켈레톤 영역 (수정된 부분) --- */}
      <div>
        {/* "댓글" 제목 스켈레톤 */}
        <Skeleton
          width={380}
          height={40}
          className="mb-6"
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />

        {/* 개별 댓글 스켈레톤 목록 */}
        <div className="space-y-6">
          {/* 댓글 1 */}
          <div className="flex gap-4">
            <Skeleton
              circle
              width={40}
              height={40}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <div className="flex-1">
              <Skeleton
                width={150}
                height={16}
                className="mb-1"
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
              <Skeleton
                count={2}
                height={16}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
          </div>

          {/* 댓글 2 */}
          <div className="flex gap-4">
            <Skeleton
              circle
              width={40}
              height={40}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <div className="flex-1">
              <Skeleton
                width={150}
                height={16}
                className="mb-1"
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
              <Skeleton
                count={3}
                height={16}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
          </div>

          {/* 댓글 3 */}
          <div className="flex gap-4">
            <Skeleton
              circle
              width={40}
              height={40}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <div className="flex-1">
              <Skeleton
                width={150}
                height={16}
                className="mb-1"
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
              <Skeleton
                count={3}
                height={16}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}