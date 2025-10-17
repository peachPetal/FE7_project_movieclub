import { useLocation, useNavigate, useParams } from "react-router-dom";
import LikeBtn from "../components/common/buttons/LikeBtn";
import Comment from "../components/comments/Comment";

import { useEffect, useState } from "react";

import TimeAgo from "../components/common/time-ago/TimeAgo";
import type { ReviewWithDetail } from "../types/review";
import { supabase } from "../utils/supabase";
import ReviewsDetailSkeleton from "../components/skeleton/ReviewsDetailSkeleton";
import { useAuthSession } from "../hooks/useAuthSession"; // <-- 추가

export default function ReviewsDetail() {
  const { user } = useAuthSession(); // <-- 로그인 상태
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

  const fetchLiked = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from("review_likes")
          .select("*")
          .eq("user_id", user.id)
          .eq("review_id", id)
          .maybeSingle();

        if (error) {
          console.error(error);
          return;
        }

        if (data) setIsLiked(true);
      }
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
        .eq("id", id)
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
    if (reviewState) setReview(reviewState);

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchLiked(), fetchReview()]);
      } catch (err) {
        console.error(err);
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

    try {
      if (!isLiked) {
        setLikeCount((prev) => prev + 1);

        const { error } = await supabase
          .from("review_likes")
          .insert([{ user_id: user.id, review_id: id }])
          .select()
          .single();

        if (error) throw error;

        setIsLiked(true);
      } else {
        const { error } = await supabase
          .from("review_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("review_id", id);

        if (error) throw error;

        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      }
    } catch (err) {
      console.error("Like 처리 오류: ", err);
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
            <span className="text-main dark:text-main-dark">
              {" "}
              #{review?.movie_name}
            </span>
          </h1>
          <p className="mb-10 text-text-sub">
            <span className="text-[var(--color-text-sub)]">
              <TimeAgo dateString={review?.created_at ?? ""} />
            </span>
            {" by "}
            <span className="review-created-user text-main">
              {review?.users?.name}
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
          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-12 mb-12"></div>
          <div>
            <Comment comment={0} />
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
