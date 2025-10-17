import { useState, type FC, type SetStateAction } from "react";
import { SidePanel } from "../common/side-panel/SidePanel"; // ✅ 1. 재사용 컴포넌트 import
import { FormField } from "../common/form-field/FormField";

type Props = {
  title: string;
  onClose: () => void;
  onSend?: (payload: { title: string; body: string }) => void;
};

const UserMessageReply: FC<Props> = ({ title, onClose, onSend }) => {
  // ✅ 2. useState로 폼 상태를 제어 (Controlled Components)
  const [replyTitle, setReplyTitle] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!replyTitle || !replyBody) return; // 간단한 유효성 검사

    onSend?.({ title: replyTitle, body: replyBody });
    onClose();
  };

  return (
    // ✅ 3. SidePanel을 사용하여 UI 뼈대를 구성
    <SidePanel
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="rounded-md px-4 py-2 border border-[var(--color-text-placeholder)] text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            form="reply-form" // form 속성을 사용하여 외부 버튼으로 form 제출
            className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
          >
            보내기
          </button>
        </>
      }
    >
      <form id="reply-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ✅ 4. FormField를 사용하여 폼 필드를 구성 */}
        <FormField
          id="reply-title"
          label="답장 제목"
          name="title"
          placeholder="답장 제목"
          value={replyTitle}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReplyTitle(e.target.value)}
          required
        />
        <FormField
          id="reply-body"
          label="답장 내용"
          as="textarea"
          name="body"
          placeholder="답장 내용"
          rows={8}
          value={replyBody}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReplyBody(e.target.value)}
          required
        />
      </form>
    </SidePanel>
  );
};

export default UserMessageReply;