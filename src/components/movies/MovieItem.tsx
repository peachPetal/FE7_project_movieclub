import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { isDarkMode } from "../../lib/theme"; // 테마 상태 확인 함수 import
import MovieSkeleton from "../loading/MovieSkeleton";

type MovieItemProps = {
  movie?: Movie; // 로딩/플레이스홀더 상황에서 undefined 허용
  isLoading?: boolean;
};

export default function MovieItem({ movie, isLoading }: MovieItemProps) {
  // 로딩 중이거나 movie가 아직 없는 경우: HomeContent 스타일의 스켈레톤 카드 반환
  if (isLoading || !movie) {
    return <MovieSkeleton />;
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