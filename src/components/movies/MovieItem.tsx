import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import MovieSkeleton from "../skeleton/MovieSkeleton";
import { useState } from "react";

type MovieItemProps = {
  movie?: Movie; // 로딩/플레이스홀더 상황에서 undefined 허용
  isLoading?: boolean;
};

export default function MovieItem({ movie, isLoading }: MovieItemProps) {
  // 로딩 중이거나 movie가 아직 없는 경우: HomeContent 스타일의 스켈레톤 카드 반환
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  if (isLoading || !movie) {
    return <MovieSkeleton />;
  } else {
    return (
      <Link
        to={`/movies/${movie.id}`}
        aria-label={`영화 상세로 이동: ${movie.title}`}
        className="block"
        state={{ movie }}
      >
        {/* [변경 3] 영화 카드 배경 및 그림자 */}
        <div className="w-[250px] h-[450px] relative rounded-lg card-shadow flex flex-col bg-[var(--color-background-sub)] flex-shrink-0 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg cursor-pointer">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-[350px] object-cover rounded-t-lg"
          />

          <div className="w-full h-[92px] p-3 flex flex-col justify-between">
            {/* [변경 4] 영화 제목 텍스트 색상 */}
            <h3 className="truncate font-bold text-lg  text-center text-[var(--color-text-main)]">
              {movie.title}
            </h3>
            {/* [변경 5] 좋아요/댓글 수 텍스트 색상 */}
            <div className="flex justify-around items-center text-text-sub">
              <div className="flex items-center gap-1.5 group">
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className=" text-yellow-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.116 3.986 1.24 5.383c.292 1.265-.956 2.23-2.052 1.612L12 18.226l-4.634 2.757c-1.096.618-2.344-.347-2.052-1.612l1.24-5.383L2.64 10.955c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-smm">{movie?.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 group">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.7709 1.8256C17.7709 0.917662 16.9865 0.174805 16.017 0.174805H1.9153C0.945808 0.174805 0.152588 0.917662 0.152588 1.8256V11.7304C0.152588 12.6383 0.945808 13.3812 1.9153 13.3812H14.2543L17.7797 16.6827L17.7709 1.8256Z"
                    fill="#00000061"
                  />
                </svg>
                <span className="text-sm">{movie.reviews?.length}</span>
              </div>
              <div
                className="share group flex"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `${window.location.origin}/movies/${movie.id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    setShowCopyPopup(true);
                    setTimeout(() => setShowCopyPopup(false), 1500);
                  });
                }}
              >
                <button className="share-btn cursor-pointer">
                  <svg
                    width="22"
                    height="21"
                    viewBox="0 0 22 21"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform group-hover:scale-120 transition-transform"
                  >
                    <ellipse
                      cx="11.1357"
                      cy="10.7937"
                      rx="10.8475"
                      ry="10.1587"
                      fill="#0000001f"
                      className="group-hover:fill-main-20"
                    />
                    <path
                      d="M14.7515 13.096C14.2935 13.096 13.8837 13.2654 13.5703 13.5306L9.2735 11.1885C9.30363 11.0587 9.32773 10.9288 9.32773 10.7934C9.32773 10.6579 9.30363 10.5281 9.2735 10.3983L13.5221 8.07876C13.8475 8.36095 14.2754 8.5359 14.7515 8.5359C15.7518 8.5359 16.5594 7.77964 16.5594 6.84278C16.5594 5.90592 15.7518 5.14966 14.7515 5.14966C13.7511 5.14966 12.9436 5.90592 12.9436 6.84278C12.9436 6.97823 12.9677 7.10804 12.9978 7.23784L8.7492 9.55742C8.42378 9.27523 7.99591 9.10028 7.51982 9.10028C6.51945 9.10028 5.71191 9.85654 5.71191 10.7934C5.71191 11.7303 6.51945 12.4865 7.51982 12.4865C7.99591 12.4865 8.42378 12.3116 8.7492 12.0294L13.04 14.3772C13.0098 14.4957 12.9918 14.6199 12.9918 14.744C12.9918 15.6527 13.7812 16.392 14.7515 16.392C15.7217 16.392 16.5112 15.6527 16.5112 14.744C16.5112 13.8354 15.7217 13.096 14.7515 13.096Z"
                      fill="#00000061"
                      className="group-hover:fill-main-50"
                    />
                  </svg>
                </button>
                {showCopyPopup && (
                  <div className="absolute z-10 -bottom-5 left-39">
                    <div
                      className="absolute -top-[7px] left-1/2 -translate-x-1/2 
              w-0 h-0 border-l-[7.5px] border-l-transparent 
              border-r-[7.5px] border-r-transparent 
              border-b-[7.5px] border-b-[var(--color-main)]"
                    />
                    <div
                      className="w-max h-max px-3 py-1.5 bg-[var(--color-main)] rounded-[30px] 
              flex items-center justify-center"
                    >
                      <p className="text-white text-xs font-normal font-pretendard">
                        링크 복사 완료!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
