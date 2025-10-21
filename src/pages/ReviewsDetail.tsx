import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LikeBtn from "../components/common/buttons/LikeBtn";
import Comment from "../components/comments/Comment";
import { useEffect, useState } from "react";
import TimeAgo from "../components/common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../types/Review";
import { supabase } from "../utils/supabase";
import ReviewsDetailSkeleton from "../components/skeleton/ReviewsDetailSkeleton";
import { useAuthSession } from "../hooks/useAuthSession"; // <-- 추가
import { useAuthStore } from "../stores/authStore";
import DefaultBtn from "../components/common/buttons/DefaultBtn";

export default function ReviewsDetail() {
  const { user } = useAuthSession(); // <-- 로그인 상태
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
      try {
        const [_likedData, reviewData] = await Promise.all([
          fetchLiked(),
          fetchReview(),
        ]);

        if (userId === reviewData?.author_id) setIsEditable(true);
      } catch (err) {
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLike = async () => {
    if (!user) {
      navigate("/login"); // <-- 로그인 체크 후 이동
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
        if (confirm("정말로 삭제하시겠습니까?")) {
          const { error: reviewLikesDeleteError } = await supabase
            .from("review_likes")
            .delete()
            .eq("review_id", id);

          if (reviewLikesDeleteError) {
            alert("삭제할 수 없습니다.");
            throw reviewLikesDeleteError;
          }

          const { data: comments, error: commentDeleteError } = await supabase
            .from("review_comments")
            .select("*")
            .eq("review_id", id);

          if (commentDeleteError) {
            alert("삭제할 수 없습니다.");
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
            alert("삭제할 수 없습니다.");
            throw reviewCommentsDeleteError;
          }

          const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id);

          if (error) {
            alert("삭제할 수 없습니다.");
            throw error;
          }

          alert("삭제되었습니다.");
          navigate("/reviews");
          return;
        }
      }
    } else {
      alert("삭제할 수 없습니다.");
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
              <span className="text-main dark:text-main-dark">
                {" "}
                #{review?.movie_name}
              </span>
            </Link>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]">
              <TimeAgo dateString={review?.created_at ?? ""} />
            </span>
            {" by "}
            <span className="review-created-user text-main">
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
