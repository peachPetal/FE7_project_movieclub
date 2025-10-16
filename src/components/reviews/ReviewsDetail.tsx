import { useLocation, useNavigate } from "react-router-dom";
import LikeBtn from "../common/buttons/LikeBtn";
import Comment from "../comments/Comment";
import TimeAgo from "./TimeAgo";
import type { ReviewWithDetail } from "../../types/Review";
import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../utils/supabase";
import { useEffect, useState } from "react";
import ReviewsDetailSkeleton from "../loading/ReviewsDetailSkeleton";

export default function ReviewsDetail() {
  const userId = useAuthStore((state) => state.user?.id);
  const navigate = useNavigate();

  const location = useLocation();
  const reviewState: ReviewWithDetail = location.state?.review;

  const [review, setReview] = useState(reviewState);

  const like = review.likes?.[0]?.count;
  // const author = reviewState.users?.name ?? "author";
  const comment = reviewState.comments?.[0]?.count ?? 0;

  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(like ? like : 0);
  const [isLiked, setIsLiked] = useState(false);

  const fetchLiked = async () => {
    try {
      if (userId) {
        const { data, error } = await supabase
          .from("review_likes")
          .select("*")
          .eq("user_id", userId)
          .eq("review_id", review.id)
          .maybeSingle();

        if (error) {
          console.error(error);
          return;
        }

        if (data) setIsLiked(true);
      } else return;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReview = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
            id,
            title,
            content,
            thumbnail,
            movie_id,
            movie_name,
            created_at,
            users:users!inner(
              name
            ),
            comments:review_comments(count),
            likes:review_likes(count)`
        )
        .eq("id", review.id)
        .single();

      if (error) throw error;

      if (data) {
        setReview({
          ...data,
          users: Array.isArray(data.users) ? data.users[0] : data.users,
        });
        setLikeCount(data.likes?.[0]?.count);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchLiked();
    fetchReview();
    setIsLoading(false);
  }, []);

  const handleLike = async () => {
    if (userId) {
      try {
        if (!isLiked) {
          try {
            setLikeCount((prev) => prev + 1);

            const { error } = await supabase
              .from("review_likes")
              .insert([{ user_id: userId, review_id: review.id }])
              .select()
              .single();

            if (error) throw error;

            setIsLiked(true);
          } catch (err) {
            console.error("review insert error: ");
            console.error(err);
          }
        } else {
          try {
            const { error } = await supabase
              .from("review_likes")
              .delete()
              .eq("user_id", userId)
              .eq("review_id", review.id);

            if (error) throw error;

            setLikeCount((prev) => prev - 1);
            setIsLiked(false);
          } catch (err) {
            console.error("review delete error: ");
            console.error(err);
          }
        }
      } catch (err) {
        console.error(`reviews detail handle Like error: `);
        console.error(err);
      }
    } else {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
    }
  };

  return (
    <>
      {" "}
      {isLoading ? (
        <ReviewsDetailSkeleton />
      ) : (
        <div className="mr-15">
          {" "}
          <h1 className="text-4xl font-semibold mb-2.5 text-text-main dark:text-text-main-dark">
            {review.title}
            <span className="text-main dark:text-main-dark">
              {" "}
              #{review.movie_name}
            </span>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]">
              <TimeAgo dateString={review.created_at} />
            </span>
            {" by "}
            <span className="review-created-user text-main">
              {review.users?.name}
            </span>
          </p>
          <div className="flex mb-10">
            <img
              className="min-w-[550px] max-h-[325px] object-cover mr-7"
              src={
                review.thumbnail
                  ? review.thumbnail
                  : "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            />
            <p className="mr-12 min-w-[340px] whitespace-pre-line leading-relaxed text-text-main dark:text-text-main-dark">
              {review.content}
            </p>
          </div>
          <div className="flex justify-center">
            <LikeBtn like={likeCount!} isLiked={isLiked} onClick={handleLike} />
          </div>
          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>
          <div>
            <Comment comment={comment} />
          </div>
        </div>
      )}
    </>
  );
}

/*
          <h1 className="text-4xl font-semibold mb-2.5 text-text-main dark:text-text-main-dark">
            {title}
            <span className="text-main dark:text-main-dark">
              {" "}
              #{movie_name}
            </span>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]">
              <TimeAgo dateString={created_at} />
            </span>
            {" by "}
            <span className="review-created-user text-main">{author}</span>
          </p>
          <div className="flex mb-10">
            <img
              className="min-w-[550px] max-h-[325px] object-cover mr-7"
              src={
                thumbnail
                  ? thumbnail
                  : "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
            />
            <p className="mr-12 min-w-[340px] whitespace-pre-line leading-relaxed text-text-main dark:text-text-main-dark">
              {content}
            </p>
          </div>
          <div className="flex justify-center">
            <LikeBtn like={like} isLiked={isLiked} onClick={handleLike} />
          </div>
          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>
          <div>
            <Comment comment={comments} />
          </div>

          */
