import { useEffect, useState } from "react";
import ReplyList from "./ReplyList";
import ReplyInput from "./ReplyInput";
import TimeAgo from "../common/time-ago/TimeAgo";
import type { UserProfile } from "../../hooks/useUserProfile";
import useLoginRequiredAlert from "../alert/useLoginRequiredAlert";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function CommentItem({
  profile,
  comment,
}: {
  profile: UserProfile | undefined | null;
  comment: ReviewComment;
}) {
  const navigate = useNavigate();
  const loginRequiredAlert = useLoginRequiredAlert();

  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [replyData, setReplyData] = useState<ReviewComment[]>([]);
  const [replyClicked, setReplyClicked] = useState(false);
  const [replyListClicked, setReplyListClicked] = useState(false);

  const handleLike = async () => {
    if (!profile) {
      navigate("/login"); // <-- 로그인 체크 후 이동
      return;
    }

    const { data: hasLiked, error } = await supabase
      .from("review_comment_likes")
      .select("*")
      .eq("user_id", profile.id)
      .eq("comment_id", comment.id)
      .maybeSingle();

    if (error) throw error;

    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);

      const { error: deleteError } = await supabase
        .from("review_comment_likes")
        .delete()
        .eq("user_id", profile.id)
        .eq("comment_id", comment.id);

      if (deleteError) throw deleteError;
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);

      const { error: insertError } = await supabase
        .from("review_comment_likes")
        .insert([{ user_id: profile.id, comment_id: comment.id }])
        .select()
        .single();

      if (insertError) throw insertError;
    }
  };

  const fetchLiked = async () => {
    try {
      if (profile?.id) {
        const { data, error } = await supabase
          .from("review_comment_likes")
          .select("*")
          .eq("user_id", profile?.id)
          .eq("comment_id", comment.id)
          .maybeSingle();

        if (error) {
          navigate("/error");
          return;
        }

        if (data) setIsLiked(true);

        const { data: likeCountData, error: likeCountDataErr } = await supabase
          .from("review_comment_likes")
          .select("likes:review_comments(count)")
          .eq("comment_id", comment.id);

        if (likeCountDataErr) throw likeCountDataErr;

        setLikeCount(likeCountData.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getReplys = async () => {
    const { data, error } = await supabase
      .from("review_comments")
      .select("*, users!inner(name, avatar_url)")
      .eq("parent_comment_id", comment.id);

    if (error) throw error;

    setReplyData(data);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getReplys(), fetchLiked()]);
      } catch (err) {
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const onReplyBtnClick = () => {
    if (!profile) loginRequiredAlert();
    setReplyClicked((prev) => !prev);
  };

  const onReplyListClicked = () => {
    setReplyListClicked((prev) => !prev);
  };

  // 스켈레톤으로 바꿀 것
  if (isLoading) return <p>로딩중...</p>;
  else {
    return (
      <>
        <div className="comment-item flex">
          {comment.avatar_url ? (
            <img
              src={comment.avatar_url}
              alt="my profile image"
              className="w-[50px] h-[50px] rounded-4xl"
            />
          ) : (
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2248_859)">
                <path
                  d="M34.375 18.75C34.375 21.2364 33.3873 23.621 31.6291 25.3791C29.871 27.1373 27.4864 28.125 25 28.125C22.5136 28.125 20.129 27.1373 18.3709 25.3791C16.6127 23.621 15.625 21.2364 15.625 18.75C15.625 16.2636 16.6127 13.879 18.3709 12.1209C20.129 10.3627 22.5136 9.375 25 9.375C27.4864 9.375 29.871 10.3627 31.6291 12.1209C33.3873 13.879 34.375 16.2636 34.375 18.75Z"
                  fill="#6E6E6E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
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
          )}
          <div className="comment-item-content ml-2.5 w-full">
            <div className="comment-item-content_user flex items-center mb-2">
              <span className="font-bold text-[20px] mr-2">{comment.name}</span>
              <span className="text-[15px] text-text-sub">
                {" "}
                <TimeAgo dateString={comment.created_at} />
              </span>
            </div>
            <p className="comment-item-content_text mb-2.5">
              {comment.content}
            </p>
            <div className="comment-item-content_btns flex items-center">
              <div className="comment-item-content_btns-like flex items-center mr-2.5">
                <button
                  className="cursor-pointer flex justify-center items-center hover:bg-main-20 rounded-[50%] p-1"
                  onClick={handleLike}
                >
                  {isLiked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-heart-fill text-main"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
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
                <span className="-translate-y-0.5 ml-1">{likeCount}</span>
              </div>
              <button
                className="comment-item-content_btns-comment cursor-pointer flex justify-center items-center hover:bg-main-20 rounded-[50%] p-1"
                onClick={() => {
                  if (!profile) {
                    loginRequiredAlert();
                  } else onReplyBtnClick();
                }}
              >
                {replyClicked ? (
                  <svg
                    width="21"
                    height="16"
                    viewBox="0 0 22 17"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-main"
                  >
                    <path d="M8.32706 13.4296L0.596152 7.85294C0.414475 7.74451 0.263991 7.59047 0.159474 7.40596C0.0549566 7.22145 0 7.01281 0 6.80052C0 6.58822 0.0549566 6.37958 0.159474 6.19507C0.263991 6.01056 0.414475 5.85653 0.596152 5.7481L8.32706 0.168049C8.51135 0.0591541 8.72103 0.00118246 8.93484 1.78985e-05C9.14864 -0.00114667 9.35894 0.0545373 9.54439 0.161418C9.72984 0.268299 9.88385 0.42257 9.99077 0.608572C10.0977 0.794574 10.1537 1.00568 10.1532 1.22047V3.39842C12.6918 3.39842 20.3076 3.39842 22 17C17.769 9.34911 10.1532 10.1992 10.1532 10.1992V12.3772C10.1532 13.3293 9.12757 13.9039 8.32706 13.4313V13.4296Z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="17"
                    viewBox="0 0 22 17"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4377 1.71835C13.4006 1.70182 13.36 1.69499 13.3196 1.6985C13.2792 1.702 13.2404 1.71573 13.2066 1.73842C13.1728 1.7611 13.1452 1.79202 13.1263 1.82833C13.1074 1.86464 13.0979 1.90518 13.0985 1.94622V3.90686C13.0985 4.13236 13.01 4.34862 12.8525 4.50807C12.6951 4.66752 12.4815 4.75709 12.2588 4.75709C11.1387 4.75709 8.87832 4.7656 6.71702 6.15488C5.06456 7.21597 3.37516 9.14771 2.35916 12.7459C4.07208 11.0743 6.0285 10.168 7.74141 9.68676C8.79415 9.39174 9.87624 9.2172 10.9674 9.16641C11.414 9.14514 11.8614 9.14968 12.3075 9.18001H12.3293L12.3377 9.18172L12.2588 10.0285L12.3428 9.18172C12.55 9.20281 12.7421 9.30115 12.8818 9.45765C13.0215 9.61415 13.0987 9.81762 13.0985 10.0285V11.9892C13.0985 12.1728 13.2832 12.2885 13.4377 12.2171L20.1281 7.22958L20.1987 7.18196C20.2352 7.15974 20.2654 7.12833 20.2864 7.09079C20.3074 7.05324 20.3184 7.01084 20.3184 6.9677C20.3184 6.92457 20.3074 6.88216 20.2864 6.84462C20.2654 6.80707 20.2352 6.77566 20.1987 6.75344L20.1281 6.70583L13.4377 1.71835ZM11.4191 10.855C11.3038 10.855 11.179 10.8584 11.0447 10.8652C10.3158 10.8992 9.30823 11.0114 8.18979 11.326C5.963 11.9518 3.32646 13.37 1.57324 16.5635C1.47843 16.7358 1.32736 16.8695 1.14592 16.9414C0.964485 17.0134 0.763977 17.0192 0.578764 16.9579C0.393549 16.8966 0.235159 16.772 0.130739 16.6054C0.0263176 16.4388 -0.0176315 16.2406 0.00642395 16.0448C0.785631 9.73607 3.17364 6.41675 5.8169 4.71968C7.90767 3.37631 10.0606 3.11784 11.4191 3.06853V1.94622C11.419 1.59604 11.5122 1.25231 11.6889 0.951297C11.8656 0.650286 12.1193 0.403156 12.4232 0.235984C12.727 0.0688126 13.0698 -0.0122027 13.4154 0.00148748C13.761 0.0151776 14.0965 0.123065 14.3865 0.313767L21.0938 5.31315C21.371 5.48841 21.5997 5.73225 21.7583 6.02171C21.9168 6.31116 22 6.63671 22 6.9677C22 7.2987 21.9168 7.62425 21.7583 7.9137C21.5997 8.20316 21.371 8.44699 21.0938 8.62226L14.3865 13.6216C14.0965 13.8123 13.761 13.9202 13.4154 13.9339C13.0698 13.9476 12.727 13.8666 12.4232 13.6994C12.1193 13.5323 11.8656 13.2851 11.6889 12.9841C11.5122 12.6831 11.419 12.3394 11.4191 11.9892V10.855Z"
                      fill="black"
                    />
                  </svg>
                )}
              </button>
            </div>
            {replyClicked ? (
              <ReplyInput
                commnetId={comment?.id}
                profile={profile}
                cancleBtnFn={onReplyBtnClick}
              />
            ) : null}
            {replyData?.length ? (
              <div className="reply-toggle">
                <button
                  className="cursor-pointer flex justify-center items-center hover:bg-main-20 rounded-4xl pl-3 pr-3 pt-1.5 pb-1.5 ml-1 mt-1 mb-1"
                  onClick={onReplyListClicked}
                >
                  <div className="flex items-center text-main">
                    {replyListClicked ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 14 8"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.645917 7.35408C0.692363 7.40065 0.747539 7.43759 0.808284 7.4628C0.869029 7.488 0.93415 7.50098 0.999917 7.50098C1.06568 7.50098 1.13081 7.488 1.19155 7.4628C1.2523 7.43759 1.30747 7.40065 1.35392 7.35408L6.99992 1.70708L12.6459 7.35408C12.6924 7.40057 12.7476 7.43745 12.8083 7.46261C12.8691 7.48777 12.9342 7.50071 12.9999 7.50071C13.0657 7.50071 13.1308 7.48777 13.1915 7.46261C13.2522 7.43745 13.3074 7.40057 13.3539 7.35408C13.4004 7.3076 13.4373 7.25241 13.4624 7.19167C13.4876 7.13093 13.5005 7.06583 13.5005 7.00008C13.5005 6.93434 13.4876 6.86924 13.4624 6.8085C13.4373 6.74776 13.4004 6.69257 13.3539 6.64608L7.35392 0.646083C7.30747 0.59952 7.2523 0.562577 7.19155 0.537371C7.13081 0.512164 7.06568 0.499189 6.99992 0.499189C6.93415 0.499189 6.86903 0.512164 6.80828 0.537371C6.74754 0.562577 6.69236 0.59952 6.64592 0.646083L0.645917 6.64608C0.599354 6.69253 0.562411 6.7477 0.537205 6.80845C0.511998 6.86919 0.499023 6.93432 0.499023 7.00008C0.499023 7.06585 0.511998 7.13097 0.537205 7.19172C0.562411 7.25246 0.599354 7.30764 0.645917 7.35408Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.64592 4.64592C1.69236 4.59935 1.74754 4.56241 1.80828 4.5372C1.86903 4.512 1.93415 4.49902 1.99992 4.49902C2.06568 4.49902 2.13081 4.512 2.19155 4.5372C2.2523 4.56241 2.30747 4.59935 2.35392 4.64592L7.99992 10.2929L13.6459 4.64592C13.6924 4.59943 13.7476 4.56255 13.8083 4.53739C13.8691 4.51223 13.9342 4.49929 13.9999 4.49929C14.0657 4.49929 14.1308 4.51223 14.1915 4.53739C14.2522 4.56255 14.3074 4.59943 14.3539 4.64592C14.4004 4.6924 14.4373 4.74759 14.4624 4.80833C14.4876 4.86907 14.5005 4.93417 14.5005 4.99992C14.5005 5.06566 14.4876 5.13076 14.4624 5.1915C14.4373 5.25224 14.4004 5.30743 14.3539 5.35392L8.35392 11.3539C8.30747 11.4005 8.2523 11.4374 8.19155 11.4626C8.13081 11.4878 8.06568 11.5008 7.99992 11.5008C7.93415 11.5008 7.86903 11.4878 7.80828 11.4626C7.74754 11.4374 7.69236 11.4005 7.64592 11.3539L1.64592 5.35392C1.59935 5.30747 1.56241 5.2523 1.5372 5.19155C1.512 5.13081 1.49902 5.06568 1.49902 4.99992C1.49902 4.93415 1.512 4.86903 1.5372 4.80828C1.56241 4.74754 1.59935 4.69236 1.64592 4.64592Z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    <span className="ml-2.5">답글 {replyData.length}개</span>
                  </div>
                </button>
              </div>
            ) : null}
            {replyListClicked ? (
              <ReplyList profile={profile} replys={replyData} />
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
