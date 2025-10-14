import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { isDarkMode } from "../../lib/theme"; // 테마 상태 확인 함수 import

type MovieItemProps = {
  movie?: Movie; // 로딩/플레이스홀더 상황에서 undefined 허용
  isLoading?: boolean;
};

export default function MovieItem({ movie, isLoading }: MovieItemProps) {
  // --- 스켈레톤 UI를 위한 테마 관리 로직 ---
  const isDark = isDarkMode();
  const skeletonBaseColor = isDark ? "#3c3c3c" : "#ebebeb";
  const skeletonHighlightColor = isDark ? "#6b7280" : "#f5f5f5";
  // ---

  // 로딩 중이거나 movie가 아직 없는 경우: HomeContent 스타일의 스켈레톤 카드 반환
  if (isLoading || !movie) {
    return (
      // [변경 1] 스켈레톤 카드 배경 및 그림자
      <div className="w-[250px] h-[450px] rounded-lg overflow-hidden card-shadow flex flex-col bg-[var(--color-background-sub)] flex-shrink-0">
        <div className="w-full h-[358px] overflow-hidden">
          {/* [변경 2] 스켈레톤 색상 props 전달 */}
          <Skeleton height={358} className="rounded-t-lg" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
        </div>
        <div className="w-full h-[92px] p-4 flex flex-col justify-between">
          <h3 className="font-bold text-lg truncate text-center">
            <Skeleton width="75%" height={20} className="mx-auto" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
          </h3>
          <div className="grid grid-cols-3 items-center mt-3">
            <Skeleton width={40} height={20} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
            <Skeleton width={40} height={20} className="mx-auto" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
            <Skeleton circle width={24} height={24} className="ml-auto" baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
          </div>
        </div>
      </div>
    );
  }

  const { id, title, posterUrl } = movie;

  return (
    <Link to={`/movies/${id}`} aria-label={`영화 상세로 이동: ${title}`} className="block">
      {/* [변경 3] 영화 카드 배경 및 그림자 */}
      <div className="w-[250px] h-[450px] rounded-lg overflow-hidden card-shadow flex flex-col bg-[var(--color-background-sub)] flex-shrink-0 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer">
        <div className="w-full h-[358px] overflow-hidden">
          <img src={posterUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        </div>
        <div className="w-full h-[92px] p-4 flex flex-col justify-between">
          {/* [변경 4] 영화 제목 텍스트 색상 */}
          <h3 className="font-bold text-lg truncate text-center text-[var(--color-text-main)]">{title}</h3>
          {/* [변경 5] 좋아요/댓글 수 텍스트 색상 */}
          <div className="grid grid-cols-3 items-center mt-3 text-[var(--color-text-sub)]">
            <div className="flex items-center gap-1 justify-start">
              <img src="/src/assets/heart.svg" alt="Likes" className="w-5 h-5" />
              <span>{movie.likeCount ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <img src="/src/assets/comment.svg" alt="Comments" className="w-5 h-5" />
              <span>{movie.commentCount ?? 0}</span>
            </div>
            <div className="flex justify-end">
              <img src="/src/assets/share.svg" alt="Share" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}