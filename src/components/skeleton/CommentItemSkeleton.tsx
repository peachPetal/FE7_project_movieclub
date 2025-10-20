import { useEffect, useState } from "react";
import { isDarkMode } from "../../lib/theme";
import Skeleton from "react-loading-skeleton";

export default function CommentItemSkeleton() {
  const [isDark, setIsDark] = useState(isDarkMode());

  useEffect(() => {
    const handleThemeChange = () => setIsDark(isDarkMode());
    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";

  return (
    <>
      <div className="comment-item flex mb-3">
        <Skeleton
          width={50}
          height={50}
          baseColor={skeletonBaseColor}
          highlightColor={skeletonHighlightColor}
        />

        <div className="comment-item-content ml-2.5 w-full">
          <div className="comment-item-content_user mb-2">
            <Skeleton
              width={230}
              height={30}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </div>
          <p className="comment-item-content_text mb-2.5 w-full">
            <Skeleton
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </p>
          <div className="comment-item-content_btns flex items-center">
            <div className="comment-item-content_btns-like flex items-center mr-2.5">
              <Skeleton
                width={41}
                height={20}
                baseColor={skeletonBaseColor}
                highlightColor={skeletonHighlightColor}
              />
            </div>
            <Skeleton
              width={20}
              height={20}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </div>
        </div>
      </div>
    </>
  );
}
