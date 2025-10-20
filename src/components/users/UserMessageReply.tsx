// src/components/users/UserMessageReply.tsx
import { useState, type FC, type SetStateAction } from "react";
import { SidePanel } from "../common/side-panel/SidePanel";
import { FormField } from "../common/form-field/FormField";

type Props = {
  title: string;
  onClose: () => void;
  onSend?: (payload: { title: string; body: string }) => void | Promise<void>;
  isReply?: boolean;
};

const UserMessageReply: FC<Props> = ({
  title,
  onClose,
  onSend,
  isReply = true,
}) => {
  const [replyTitle, setReplyTitle] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const titleTrimmed = replyTitle.trim();
    const bodyTrimmed = replyBody.trim();

    if (!titleTrimmed || !bodyTrimmed) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    if (isSending) return;

    try {
      setIsSending(true);

      const maybePromise = onSend?.({ title: titleTrimmed, body: bodyTrimmed });
      if (
        maybePromise &&
        typeof (maybePromise as Promise<void>).then === "function"
      ) {
        await (maybePromise as Promise<void>);
      }

      // alert("메시지 전송이 완료되었습니다."); // ❌ UX 개선: 불필요한 알림 제거
      onClose(); // 성공 시 패널 닫기
    } catch (err) {
      console.error("[UserMessageReply] send failed:", err);
      alert("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SidePanel
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="rounded-md px-4 py-2 border border-[var(--color-text-placeholder)] text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
            onClick={onClose}
            disabled={isSending}
          >
            취소
          </button>
          <button
            type="submit"
            form="reply-form"
            className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
            disabled={isSending}
            aria-busy={isSending}
          >
            {isSending ? "보내는 중..." : "보내기"}
          </button>
        </>
      }
    >
      <form
        id="reply-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <FormField
          id="reply-title"
          label={isReply ? "답장 제목" : "메시지 제목"}
          name="title"
          placeholder={isReply ? "답장 제목" : "메시지 제목"}
          value={replyTitle}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setReplyTitle(e.target.value)
          }
          required
        />
        <FormField
          id="reply-body"
          label={isReply ? "답장 내용" : "메시지 내용"}
          as="textarea"
          name="body"
          placeholder={isReply ? "답장 내용" : "메시지 내용"}
          rows={8}
          value={replyBody}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setReplyBody(e.target.value)
          }
          required
        />
      </form>
    </SidePanel>
  );
};

export default UserMessageReply;
// // src/components/users/UserMessageReply.tsx
// import { useState, type FC, type SetStateAction } from "react";
// import { SidePanel } from "../common/side-panel/SidePanel";
// import { FormField } from "../common/form-field/FormField";

// type Props = {
//   title: string;
//   onClose: () => void;
//   // onSend가 Promise를 반환할 수도 있도록 타입 확장
//   onSend?: (payload: { title: string; body: string }) => void | Promise<void>;
//   isReply?: boolean;
// };

// const UserMessageReply: FC<Props> = ({ title, onClose, onSend, isReply=true }) => {
//   const [replyTitle, setReplyTitle] = useState("");
//   const [replyBody, setReplyBody] = useState("");
//   const [isSending, setIsSending] = useState(false);

//   const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
//     e.preventDefault();

//     const titleTrimmed = replyTitle.trim();
//     const bodyTrimmed = replyBody.trim();

//     if (!titleTrimmed || !bodyTrimmed) {
//       alert("제목과 내용을 모두 입력해주세요.");
//       return;
//     }
//     if (isSending) return; // 중복 제출 방지

//     try {
//       setIsSending(true);

//       const maybePromise = onSend?.({ title: titleTrimmed, body: bodyTrimmed });
//       if (
//         maybePromise &&
//         typeof (maybePromise as Promise<void>).then === "function"
//       ) {
//         await (maybePromise as Promise<void>);
//       }

//       alert("메시지 전송이 완료되었습니다.");
//       onClose(); // 성공 시 패널 닫기
//     } catch (err) {
//       console.error("[UserMessageReply] send failed:", err);
//       alert("메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <SidePanel
//       title={title}
//       onClose={onClose}
//       footer={
//         <>
//           <button
//             type="button"
//             className="rounded-md px-4 py-2 border border-[var(--color-text-placeholder)] text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//             onClick={onClose}
//             disabled={isSending}
//           >
//             취소
//           </button>
//           <button
//             type="submit"
//             form="reply-form"
//             className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
//             disabled={isSending}
//             aria-busy={isSending}
//           >
//             {isSending ? "보내는 중..." : "보내기"}
//           </button>
//         </>
//       }
//     >
//       <form
//         id="reply-form"
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4"
//       >
// <FormField
//   id="reply-title"
//   label={isReply ? "답장 제목" : "메시지 제목"}
//   name="title"
//   placeholder={isReply ? "답장 제목" : "메시지 제목"}
//   value={replyTitle}
//   onChange={(e: { target: { value: SetStateAction<string> } }) =>
//     setReplyTitle(e.target.value)
//   }
//   required
// />
// <FormField
//   id="reply-body"
//   label={isReply ? "답장 내용" : "메시지 내용"}
//   as="textarea"
//   name="body"
//   placeholder={isReply ? "답장 내용" : "메시지 내용"}
//   rows={8}
//   value={replyBody}
//   onChange={(e: { target: { value: SetStateAction<string> } }) =>
//     setReplyBody(e.target.value)
//   }
//   required
// />
//       </form>
//     </SidePanel>
//   );
// };

// export default UserMessageReply;
