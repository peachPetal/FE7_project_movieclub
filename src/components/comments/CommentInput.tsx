import { useNavigate, useParams } from "react-router-dom";
import DefaultBtn from "../common/buttons/DefaultBtn";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import type { UserProfile } from "../../hooks/useUserProfile";
import useLoginRequiredAlert from "../alert/useLoginRequiredAlert";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function CommentInput({
  profile,
  getComments,
}: {
  profile: UserProfile | undefined | null;
  getComments: () => Promise<void>;
}) {
  const { id: review_id } = useParams();
  const navigate = useNavigate();
  const { session, loading } = useAuthSession();

  const loginRequiredAlert = useLoginRequiredAlert();

  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return; // 아직 로딩 중이면 아무것도 안 함

    if (!session) {
      loginRequiredAlert();
      return;
    }

    if (!content) {
      Swal.fire({
        title: "댓글 내용을 입력해주세요.",
        icon: "warning",
        iconColor: "#9858F3",
        showCancelButton: false,
        confirmButtonText: "확인",
        customClass: {
          popup: "rounded-xl shadow-lg !bg-background-main",
          title: "!font-semibold !text-text-main",
          htmlContainer: "!text-s !text-text-sub",
          confirmButton:
            "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50",
        },
        buttonsStyling: false,
      });
      return;
    }

    const { error } = await supabase
      .from("review_comments")
      .insert([
        { author_id: profile?.id, review_id: review_id, content: content },
      ])
      .select();

    if (error) throw error;

    toast.success("댓글이 등록되었습니다.");
    getComments();

    setContent("");
  };

  return (
    <form
      className="comment-input_container flex"
      onClick={() => {
        if (!session) loginRequiredAlert();
      }}
      onSubmit={handleSubmit}
    >
      {profile?.avatar_url ? (
        <img
          src={profile?.avatar_url}
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

      <div className="comment-input flex flex-col w-full ml-2.5">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={content}
          className="pl-2 pb-2 mt-2 mb-2 border-b border-text-light placeholder:text-text-gborder-text-light focus:border-main-80 outline-0"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setContent(e.target.value);
          }}
        />
        <div className="flex justify-end">
          <DefaultBtn size="sm" text="등록" highlight={true} type="submit" />
        </div>
      </div>
    </form>
  );
}
