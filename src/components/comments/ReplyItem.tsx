import { useState } from "react";

export default function ReplyItem() {
  const [liked, setLiked] = useState(false);
  const [likeCounter, setLikeCounter] = useState(0);

  const onLikedBtnClick = () => {
    if (liked) {
      setLikeCounter((prev) => prev - 1);
    } else {
      setLikeCounter((prev) => prev + 1);
    }
    setLiked((prev) => !prev);
  };

  return (
    <>
      <div className="reply-item flex">
        {/* 댓글 단 유저 프로필 이미지 */}
        <svg
          width="35"
          height="35"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_2248_859)">
            <path
              d="M34.375 18.75C34.375 21.2364 33.3873 23.621 31.6291 25.3791C29.871 27.1373 27.4864 28.125 25 28.125C22.5136 28.125 20.129 27.1373 18.3709 25.3791C16.6127 23.621 15.625 21.2364 15.625 18.75C15.625 16.2636 16.6127 13.879 18.3709 12.1209C20.129 10.3627 22.5136 9.375 25 9.375C27.4864 9.375 29.871 10.3627 31.6291 12.1209C33.3873 13.879 34.375 16.2636 34.375 18.75Z"
              fill="#6E6E6E"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 25C0 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25C50 31.6304 47.3661 37.9893 42.6777 42.6777C37.9893 47.3661 31.6304 50 25 50C18.3696 50 12.0107 47.3661 7.32233 42.6777C2.63392 37.9893 0 31.6304 0 25ZM25 3.125C20.8806 3.12522 16.8449 4.28863 13.3575 6.48134C9.87012 8.67404 7.07276 11.8069 5.28739 15.5194C3.50202 19.2318 2.80121 23.3729 3.26562 27.4661C3.73003 31.5593 5.34079 35.4382 7.9125 38.6562C10.1313 35.0812 15.0156 31.25 25 31.25C34.9844 31.25 39.8656 35.0781 42.0875 38.6562C44.6592 35.4382 46.27 31.5593 46.7344 27.4661C47.1988 23.3729 46.498 19.2318 44.7126 15.5194C42.9272 11.8069 40.1299 8.67404 36.6425 6.48134C33.1551 4.28863 29.1194 3.12522 25 3.125Z"
              fill="#6E6E6E"
            />
          </g>
          <defs>
            <clipPath id="clip0_2248_859">
              <rect width="50" height="50" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div className="reply-item-content ml-2.5 w-full">
          <div className="reply-item-content_user flex items-center mb-1.5">
            <span className="font-bold text-[16px] mr-2">userName12</span>
            <span className="text-[15px] text-text-sub">4시간 전</span>
          </div>
          <p className="reply-item-content_text mb-2">
            맞아요 영화 너무 좋았어요
          </p>
          <div className="reply-btn-like flex items-center mr-2.5">
            <button
              className="cursor-pointer flex justify-center items-center hover:bg-main-20 rounded-[50%] p-1"
              onClick={onLikedBtnClick}
            >
              {liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-heart-fill text-main"
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
                  className="bi bi-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              )}
            </button>
            <span className="-translate-y-0.5 ml-1">{likeCounter}</span>
          </div>
        </div>
      </div>
    </>
  );
}
