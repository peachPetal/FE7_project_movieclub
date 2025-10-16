import { useEffect, useState } from "react";

interface LikeBtn {
  like: number;
  isLiked: boolean;
  onClick: () => void;
}

export default function LikeBtn({ like, isLiked, onClick }: LikeBtn) {
  return (
    <>
      <div className="flex justify-center items-center font-bold text-[24px] duration-200 border bg-background-main text-main rounded-[20px] pt-3 pr-5 pb-3 pl-5">
        <button className="cursor-pointer" onClick={onClick}>
          {isLiked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-heart-fill mr-5"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-heart mr-5"
              viewBox="0 0 16 16"
            >
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
            </svg>
          )}
        </button>
        <span className="-translate-y-0.5">{like}</span>
      </div>
    </>
  );
}
