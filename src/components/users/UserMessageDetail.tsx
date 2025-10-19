import type { FC } from "react";

// --- 타입 정의 ---
export type MessageDetailData = {
  id: string;
  title: string;
  bodyMine: string;
  bodyFriend: string;
};

// --- 서브 컴포넌트 ---
// 반복되는 메시지 블록을 위한 재사용 컴포넌트
type MessageBlockProps = {
  label: string;
  content: string;
};

const MessageBlock: FC<MessageBlockProps> = ({ label, content }) => (
  <article>
    <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p>
    <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
      {content}
    </pre>
  </article>
);

// --- 메인 컴포넌트 ---
type Props = {
  message: MessageDetailData;
  onReply?: () => void;
};

const UserMessageDetail: FC<Props> = ({ message, onReply }) => {
  return (
    <div
      className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      role="region"
      aria-label={`${message.title} 상세`}
    >
      <div className="flex h-full flex-col">
        <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

        <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
          {/* 1. 분리된 MessageBlock 컴포넌트 사용 */}
          <MessageBlock
            label="이전에 내가 보낸 메시지"
            content={message.bodyMine}
          />
          <MessageBlock
            label="친구가 보낸 메시지"
            content={message.bodyFriend}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
            onClick={onReply}
          >
            답장
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMessageDetail;
