import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
type MovieItemProps = {
  movie?: Movie; // 로딩/플레이스홀더 상황에서 undefined 허용
  isLoading?: boolean;
};

export default function MovieItem({ movie, isLoading }: MovieItemProps) {
  // 로딩 중이거나 movie가 아직 없는 경우: HomeContent 스타일의 스켈레톤 카드 반환
  if (isLoading || !movie) {
    return (
      <div className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-white flex-shrink-0">
        <div className="w-full h-[358px] overflow-hidden">
          <Skeleton height={358} className="rounded-t-lg" />
        </div>
        <div className="w-full h-[92px] p-4 flex flex-col justify-between">
          <h3 className="font-bold text-lg truncate text-center">
            <Skeleton width="75%" height={20} className="mx-auto" />
          </h3>
          <div className="grid grid-cols-3 items-center mt-3">
            <Skeleton width={40} height={20} />
            <Skeleton width={40} height={20} className="mx-auto" />
            <Skeleton circle width={24} height={24} className="ml-auto" />
          </div>
        </div>
      </div>
    );
  }

  const { id, title, posterUrl } = movie;

  return (
    <Link to={`/movies/${id}`} aria-label={`영화 상세로 이동: ${title}`} className="block">
      <div
        className="w-[250px] h-[450px] rounded-lg overflow-hidden shadow-md flex flex-col bg-white flex-shrink-0
                 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      >
        <div className="w-full h-[358px] overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="w-full h-[92px] p-4 flex flex-col justify-between">
          <h3 className="font-bold text-lg truncate text-center">{title}</h3>
          <div className="grid grid-cols-3 items-center mt-3">
            <div className="flex items-center gap-1 justify-start">
              <img src="/src/assets/heart.svg" alt="Likes" className="w-5 h-5" />
              <span>{movie.likeCount ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <img
                src="/src/assets/comment.svg"
                alt="Comments"
                className="w-5 h-5"
              />
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
