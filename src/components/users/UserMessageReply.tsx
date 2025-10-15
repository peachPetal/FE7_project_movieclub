import type { FC } from "react";

type Props = {
  title: string;
  onClose: () => void;
  onSend?: (payload: { title: string; body: string }) => void;
};

const UserMessageReply: FC<Props> = ({ title, onClose, onSend }) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: String(form.get("title") || ""),
      body: String((form.get("body") as string) || ""),
    };
    onSend?.(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="답장 닫기"
        onClick={onClose}
      />
      {/* Right Panel */}
      <aside
        className="absolute right-0 top-0 h-full w-[420px] bg-[var(--color-background-main)] border-l border-[var(--color-text-placeholder)] dark:border-[var(--color-text-light)] shadow-xl animate-slide-in-right will-change-transform"
        role="dialog"
        aria-modal="true"
        aria-label="메시지 답장"
      >
        <form
          className="h-full overflow-y-auto p-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h3 className="text-2xl font-bold text-[var(--color-text-main)]">
            {title}
          </h3>

          <label
            className="text-sm text-[var(--color-text-sub)]"
            htmlFor="reply-title"
          >
            답장 제목
          </label>
          <input
            id="reply-title"
            name="title"
            type="text"
            placeholder="답장 제목"
            className="rounded-md border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-2 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
            required
          />

          <label
            className="text-sm text-[var(--color-text-sub)]"
            htmlFor="reply-body"
          >
            답장 내용
          </label>
          <textarea
            id="reply-body"
            name="body"
            placeholder="답장 내용"
            rows={8}
            className="min-h-[180px] rounded-md border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-3 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
            required
          />

          <div className="mt-auto flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-4 py-2 border border-[var(--color-text-placeholder)] text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
            >
              보내기
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default UserMessageReply;
