// src/components/reviews/ReviewItem.tsx
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { isDarkMode } from "../../lib/theme";
import TimeAgo from "../common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../../types/Review";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import { twMerge } from "tailwind-merge";
import useLoginRequiredAlert from "../alert/useLoginRequiredAlert";

interface ReviewItemProps {
  review?: ReviewWithDetail;
  hasImage: boolean;
  isLoading: boolean;
}

export default function ReviewItem({
  review,
  hasImage,
  isLoading,
}: ReviewItemProps) {
  const navigate = useNavigate();
  const { user } = useAuthSession(); // <-- useAuthSession 사용
  const userId = useAuthStore((state) => state.user?.id);

  const isDark = isDarkMode();
  const skeletonBaseColor = isDark
    ? "var(--color-background-sub)"
    : "var(--color-background-sub)";
  const skeletonHighlightColor = isDark
    ? "var(--color-text-light)"
    : "var(--color-background-sub)";

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const loginRequiredAlert = useLoginRequiredAlert();

  const fetchLiked = async () => {
    try {
      if (userId && review?.id) {
        const { data, error } = await supabase
          .from("review_likes")
          .select("*")
          .eq("user_id", userId)
          .eq("review_id", review?.id)
          .maybeSingle();

        if (error) throw error;

        if (data) setIsLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiked();
    if (review) {
      setLikeCount(review.likes ?? 0);
      setCommentCount(review.comments ?? 0);
      setDataIsLoading(false);
    }
  }, []);

  // =========================
  // 좋아요 버튼 클릭
  // =========================
  const handlLike = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault(); // Link 이동 방지

    if (!user) {
      loginRequiredAlert();
      return;
    }
    // 실제 좋아요 로직 수행
    const { data: hasLiked, error } = await supabase
      .from("review_likes")
      .select("*")
      .eq("user_id", userId)
      .eq("review_id", review?.id)
      .maybeSingle();

    if (error) throw error;

    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);

      const { error: deleteError } = await supabase
        .from("review_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("review_id", review?.id);

      if (deleteError) throw deleteError;
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);

      const { error: insertError } = await supabase
        .from("review_likes")
        .insert([{ user_id: user.id, review_id: review?.id }])
        .select()
        .single();

      if (insertError) throw insertError;
    }
  };

  // =========================
  // 내부 태그 클릭: 영화 / 작성자 이동 (부모 Link 차단)
  // =========================
  const handleMovieTagClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (review?.movie_id) {
      navigate(`/movies/${review.movie_id}`);
    }
  };

  const handleAuthorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (review?.author_id) {
      // Users 페이지로 이동하면서 해당 작성자를 선택 상태로 전달
      navigate("/users", {
        state: { selectedUserId: review.author_id },
      });
    }
  };

  if (isLoading || dataIsLoading || !review) {
    return (
      <div
        className={`review-item w-80 rounded-lg overflow-hidden card-shadow flex flex-col flex-shrink-0 bg-[var(--color-background-sub)] ${
          hasImage ? "h-[410px]" : "h-[230px]"
        }`}
      >
        {hasImage && (
          <Skeleton
            height={185}
            className="review-thumbnail"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
        )}
        <div className="review-data p-5 flex flex-col justify-between h-[227px]">
          <Skeleton
            width={280}
            height={27}
            className="review-title mb-3"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={280}
            height={60}
            className="review-content mb-3"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <Skeleton
            width={280}
            height={16}
            className="review-created-info"
            baseColor={skeletonBaseColor}
            highlightColor={skeletonHighlightColor}
          />
          <div className="review-social-buttons flex justify-around mt-4">
            <Skeleton
              width={39}
              height={26}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <Skeleton
              width={39}
              height={26}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
            <Skeleton
              width={22}
              height={26}
              baseColor={skeletonBaseColor}
              highlightColor={skeletonHighlightColor}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Link
        to={`/reviews/${review?.id}`}
        aria-label={`리뷰 상세로 이동: ${review.title}`}
        state={{ review }}
      >
        <div
          className={`review-item relative w-80 rounded-lg card-shadow flex flex-col bg-[var(--color-background-sub)] ${
            hasImage ? "h-[410px]" : "h-[230px]"
          } duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg box-border `}
        >
          {hasImage && (
            <img
              className="review-thumbnail w-full h-[350px] max-h-[180px] object-cover object-center rounded-t-lg "
              src={
                review?.thumbnail ||
                "https://mrwvwylqxypdithozmgm.supabase.co/storage/v1/object/public/img/movie_no_image.jpg"
              }
              alt={review?.movie_name}
            />
          )}

          <div className="review-data flex flex-col h-full justify-between  p-5">
            <div>
              <h1 className="review-title font-bold mb-3 text-[18px] truncate text-[var(--color-text-main)]">
                {review?.title}
              </h1>{" "}
              <p className="review-content text-xs mb-3 line-clamp-3 leading-relaxed text-text-main">
                {review?.content}
              </p>
            </div>
            <div>
              <p className="review-movie text-main text-xs mb-2">
                <span
                  role="link"
                  tabIndex={0}
                  onClick={handleMovieTagClick}
                  className="cursor-pointer hover:underline"
                  aria-label={`${review?.movie_name} 영화 페이지로 이동`}
                >
                  #{review?.movie_name}
                </span>
              </p>
              <p className="review-created-info text-xs text-text-sub mb-3">
                <span className="text-[var(--color-text-sub)]">
                  <TimeAgo dateString={review?.created_at} />
                </span>{" "}
                by{" "}
                <span
                  role="link"
                  tabIndex={0}
                  onClick={handleAuthorClick}
                  className="review-created-user text-main cursor-pointer hover:underline"
                  aria-label={`${review?.author_name} 사용자 페이지로 이동`}
                >
                  {review.author_name}
                </span>
              </p>
              <div className="review-social-buttons flex justify-around items-center text-text-sub">
                <div
                  className="like flex items-center group"
                  onClick={handlLike}
                >
                  <button className="like-btn cursor-pointer">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 17"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.89816 1.53033C13.7875 -3.1765 26.0119 5.05993 8.89816 15.6508C-8.21557 5.06096 4.00884 -3.1765 8.89816 1.53033Z"
                        fill="#00000061"
                        className={twMerge(
                          "group-hover:fill-main-50",
                          isLiked && "fill-main"
                        )}
                      />
                    </svg>
                  </button>
                  <span className="comment-count text-sm ml-2">
                    {likeCount}
                  </span>
                </div>
                <div className="comment flex items-center group">
                  <button className="comment-btn cursor-pointer">
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
                  </button>
                  <span className="comment-count text-sm ml-2">
                    {commentCount}
                  </span>
                </div>
                <div
                  className="share group"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = `${window.location.origin}/reviews/${review.id}`;
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
                    <div className="absolute z-10 -bottom-4.5 right-3">
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
        </div>
      </Link>
    );
  }
}
