import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LikeBtn from "../components/common/buttons/LikeBtn";
import Comment from "../components/comments/Comment";
import { useEffect, useState } from "react";
import TimeAgo from "../components/common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../types/Review";
import { supabase } from "../utils/supabase";
import ReviewsDetailSkeleton from "../components/skeleton/ReviewsDetailSkeleton";
import { useAuthSession } from "../hooks/useAuthSession";
import { useAuthStore } from "../stores/authStore";
import DefaultBtn from "../components/common/buttons/DefaultBtn";
import Swal from "sweetalert2";
import useLoginRequiredAlert from "../components/alert/useLoginRequiredAlert";
import { confirmAlert } from "../components/alert/confirmAlert";
import { alertError } from "../components/alert/alertError";

export default function ReviewsDetail() {
  const { user } = useAuthSession();
  const userId = useAuthStore((state) => state.user?.id);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const reviewState: ReviewWithDetail = location.state?.review;

  const [review, setReview] = useState<ReviewWithDetail | null>(
    reviewState ? reviewState : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const loginRequiredAlert = useLoginRequiredAlert();

  const fetchLiked = async () => {
    try {
      if (userId) {
        const { data, error } = await supabase
          .from("review_likes")
          .select("*")
          .eq("user_id", userId)
          .eq("review_id", id)
          .maybeSingle();

        if (error) {
          navigate("/error");
          return;
        }

        if (data) {
          setIsLiked(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReview = async () => {
    try {
      const { data, error } = await supabase
        .from("review_detail")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        navigate("/error");
        return;
      }

      if (data) {
        setReview(data);
        setLikeCount(data.likes);
      }

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (reviewState) setReview(reviewState);

    const fetchAll = async () => {
      setIsLoading(true);
      const startTime = Date.now(); // 시작 시간 기록

      try {
        const [_likedData, reviewData] = await Promise.all([
          fetchLiked(),
          fetchReview(),
        ]);

        if (userId === reviewData?.author_id) setIsEditable(true);
      } catch (err) {
        navigate("/error");
      } finally {
        const elapsed = Date.now() - startTime;
        const minLoadingTime = 1000; // 최소 1초
        if (elapsed < minLoadingTime) {
          setTimeout(() => setIsLoading(false), minLoadingTime - elapsed);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchAll();
  }, []);

  const handleLike = async () => {
    if (!user) {
      loginRequiredAlert();
      return;
    }

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

  const handleEditBtnClick = () => {
    navigate("/review/post", {
      state: {
        id: review?.movie_id,
        title: review?.movie_name,
        backdrop: review?.thumbnail,
        review_id: review?.id,
        review_title: review?.title,
        review_content: review?.content,
      },
    });
  };

  const handleDeleteBtnClick = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("author_id", userId)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        navigate("/error");
        return;
      }

      if (data) {
        const result = await confirmAlert({
          title: "정말로 삭제하시겠습니까?",
          text: "삭제한 데이터는 복구가 불가능합니다",
        });

        if (result.isConfirmed) {
          const { error: reviewLikesDeleteError } = await supabase
            .from("review_likes")
            .delete()
            .eq("review_id", id);

          if (reviewLikesDeleteError) {
            alertError("삭제할 수 없습니다");
            throw reviewLikesDeleteError;
          }

          const { data: comments, error: commentDeleteError } = await supabase
            .from("review_comments")
            .select("*")
            .eq("review_id", id);

          if (commentDeleteError) {
            alertError("삭제할 수 없습니다");
            throw commentDeleteError;
          }

          if (comments) {
            // 댓글 좋아요들 삭제
            comments?.map(async (comment) => {
              const { error: commentLikesDeleteError } = await supabase
                .from("review_comment_likes")
                .delete()
                .eq("comment_id", comment.id);

              if (commentLikesDeleteError) {
                throw commentLikesDeleteError;
              }
            });
          }

          const { error: reviewCommentsDeleteError } = await supabase
            .from("review_comments")
            .delete()
            .eq("review_id", id);

          if (reviewCommentsDeleteError) {
            alertError("삭제할 수 없습니다");
            throw reviewCommentsDeleteError;
          }

          const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id);

          if (error) {
            alertError("삭제할 수 없습니다");
            throw error;
          }

          Swal.fire({
            title: "리뷰가 삭제되었습니다.",
            icon: "success",
            iconColor: "#9858F3",
            showCancelButton: false,
            confirmButtonText: "확인",
            customClass: {
              popup: "rounded-xl shadow-lg !bg-background-main",
              title: "!font-semibold !text-text-main",
              htmlContainer: "!text-s !text-text-sub",
              confirmButton:
                "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
            },
            buttonsStyling: false,
          });
          navigate("/reviews");
          return;
        }
      }
    } else {
      alertError("삭제할 수 없습니다");
      return;
    }
  };

  return (
    <>
      {isLoading ? (
        <ReviewsDetailSkeleton />
      ) : (
        <div className="mr-15">
          <h1 className="text-4xl font-semibold mb-2.5 text-text-main dark:text-text-main-dark">
            {review?.title}
            <Link to={`/movies/${review?.movie_id}`}>
              <span className="text-text-sub dark:text-main-dark"> </span>
              <span className="text-main dark:text-main-dark cursor-pointer hover:underline">
                #{review?.movie_name}
              </span>
            </Link>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]">
              <TimeAgo dateString={review?.created_at ?? ""} />
            </span>
            {" by "}
            <span
              role="link"
              tabIndex={0}
              onClick={handleAuthorClick}
              className="review-created-user text-main cursor-pointer hover:underline"
              aria-label={`${review?.author_name} 사용자 페이지로 이동`}
            >
              {review?.author_name}
            </span>
          </p>
          <div className="flex mb-10">
            <img
              className="min-w-[550px] max-h-[325px] object-cover mr-7"
              src={
                review?.thumbnail
                  ? review.thumbnail
                  : "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            />
            <p className="mr-12 min-w-[340px] whitespace-pre-line leading-relaxed text-text-main dark:text-text-main-dark">
              {review?.content}
            </p>
          </div>
          <div className="flex justify-center">
            <LikeBtn like={likeCount!} isLiked={isLiked} onClick={handleLike} />
          </div>
          {isEditable && (
            <div className="review-edit-btns flex justify-end">
              {" "}
              <DefaultBtn
                type="reset"
                size="sm"
                text="편집"
                highlight={false}
                onClickFn={handleEditBtnClick}
              />
              <DefaultBtn
                type="submit"
                size="sm"
                text="삭제"
                highlight={true}
                onClickFn={handleDeleteBtnClick}
              />
            </div>
          )}

          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-10 mb-12"></div>
          <section id="comment-section">
            <Comment review_id={id ?? ""} />
          </section>
        </div>
      )}
    </>
  );
}
