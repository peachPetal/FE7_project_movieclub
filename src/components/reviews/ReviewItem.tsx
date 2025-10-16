import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import TimeAgo from "./TimeAgo";
import ReviewItemSkeleton from "../loading/ReviewItemSkeleton";
import type { ReviewWithDetail } from "../../types/Review";

export default function ReviewItem({
  review,
  hasImage,
  isLoading,
}: {
  review?: ReviewWithDetail;
  hasImage: boolean;
  isLoading: boolean;
}) {
  if (isLoading || !review) {
    return <ReviewItemSkeleton hasImage={hasImage} />;
  } else {
    const { id, content, created_at, movie_name, thumbnail, title } = review;

    const like = review.likes?.[0]?.count ?? 0;
    const author = review.users?.name ?? "author";
    const comments = review.comments?.[0]?.count ?? 0;

    return (
      <>
        <Link to={`/reviews/${id}`} state={{ review }}>
          <div
            key={id}
            className={twMerge(
              "review-item w-80 bg-background-sub card-shadow overflow-hidden h-[410px]",
              !hasImage && "h-[230px]"
            )}
          >
            {hasImage ? (
              <>
                {thumbnail ? (
                  <img
                    className="reivew-thumbnail h-[185px] w-full object-cover"
                    src={thumbnail}
                  />
                ) : (
                  // 첨부한 이미지 없을 경우 해당 리뷰 영화 포스터로
                  <img
                    className="reivew-thumbnail h-[185px] w-full object-cover"
                    src="https://mrwvwylqxypdithozmgm.supabase.co/storage/v1/object/public/img/movie_no_image.jpg"
                  />
                )}
              </>
            ) : null}

            <div className="review-data p-5 h-[227px] flex flex-col justify-between">
              <div className="review-post">
                <p className="review-title font-bold mb-3 text-[18px] truncate text-[var(--color-text-main)]">
                  <span className="review-movie text-main">#{movie_name}</span>{" "}
                  {title}
                </p>
                <p className="review-content text-xs mb-3 line-clamp-4 leading-relaxed text-text-main">
                  {content}
                </p>
                <p className="review-created-info text-xs text-text-sub mb-4">
                  <span className="text-[var(--color-text-sub)]">
                    <TimeAgo dateString={created_at} />
                  </span>
                  {" by "}
                  <span className="review-created-user text-main">
                    {author}
                  </span>
                </p>
              </div>
              <div className="review-social-buttons flex justify-around align-middle text-text-sub">
                <div className="like flex justify-center items-center">
                  <button className="like-btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.89816 1.53033C13.7875 -3.1765 26.0119 5.05993 8.89816 15.6508C-8.21557 5.06096 4.00884 -3.1765 8.89816 1.53033Z"
                        fill="black"
                        fillOpacity="0.38"
                      />
                    </svg>
                  </button>
                  <span className="like-count text-sm ml-2">{like}</span>
                </div>
                <div className="comment flex justify-center items-center">
                  <button className="comment-btn">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 18 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.7709 1.8256C17.7709 0.917662 16.9865 0.174805 16.017 0.174805H1.9153C0.945808 0.174805 0.152588 0.917662 0.152588 1.8256V11.7304C0.152588 12.6383 0.945808 13.3812 1.9153 13.3812H14.2543L17.7797 16.6827L17.7709 1.8256Z"
                        fill="black"
                        fillOpacity="0.38"
                      />
                    </svg>
                  </button>
                  <span className="comment-count text-sm ml-2">{comments}</span>
                </div>
                <div className="share">
                  <button className="share-btn">
                    <svg
                      width="22"
                      height="21"
                      viewBox="0 0 22 21"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="11.1357"
                        cy="10.7937"
                        rx="10.8475"
                        ry="10.1587"
                        fill="black"
                        fillOpacity="0.12"
                      />
                      <path
                        d="M14.7515 13.096C14.2935 13.096 13.8837 13.2654 13.5703 13.5306L9.2735 11.1885C9.30363 11.0587 9.32773 10.9288 9.32773 10.7934C9.32773 10.6579 9.30363 10.5281 9.2735 10.3983L13.5221 8.07876C13.8475 8.36095 14.2754 8.5359 14.7515 8.5359C15.7518 8.5359 16.5594 7.77964 16.5594 6.84278C16.5594 5.90592 15.7518 5.14966 14.7515 5.14966C13.7511 5.14966 12.9436 5.90592 12.9436 6.84278C12.9436 6.97823 12.9677 7.10804 12.9978 7.23784L8.7492 9.55742C8.42378 9.27523 7.99591 9.10028 7.51982 9.10028C6.51945 9.10028 5.71191 9.85654 5.71191 10.7934C5.71191 11.7303 6.51945 12.4865 7.51982 12.4865C7.99591 12.4865 8.42378 12.3116 8.7492 12.0294L13.04 14.3772C13.0098 14.4957 12.9918 14.6199 12.9918 14.744C12.9918 15.6527 13.7812 16.392 14.7515 16.392C15.7217 16.392 16.5112 15.6527 16.5112 14.744C16.5112 13.8354 15.7217 13.096 14.7515 13.096Z"
                        fill="black"
                        fillOpacity="0.38"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </>
    );
  }
}
