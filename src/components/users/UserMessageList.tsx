import { useState, useCallback } from "react";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";
import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages"; // 1. 커스텀 훅과 타입 import
import clsx from "clsx";

type MessageListItemProps = {
  message: MessageItem;
  isActive: boolean;
  onClick: (id: string) => void;
};

const MessageListItem: React.FC<MessageListItemProps> = ({ message, isActive, onClick }) => (
  <li>
    <button
      type="button"
      onClick={() => onClick(message.id)}
      aria-current={isActive}
      className={clsx(
        "flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors",
        {
          "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]": isActive,
          "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]": !isActive,
        }
      )}
    >
      <span className="truncate">{message.title}</span>
      {message.unread && (
        <span
          className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
          aria-label="읽지 않음"
          title="읽지 않음"
        />
      )}
    </button>
  </li>
);

type Props = {
  user: AppUser;
  onSelect?: (message: MessageDetailData | null) => void;
};

export default function UserMessageList({ user, onSelect }: Props) {
  // 3. 데이터 로직을 커스텀 훅에 위임
  const { messages, markAsRead } = useUserMessages(user.id);
  // UI 상태(선택된 ID)만 직접 관리
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 4. 핸들러 로직 단순화
  const handleSelect = useCallback((id: string) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);

      if (newSelectedId) {
        // 읽음 처리 로직을 훅에서 가져와 실행
        markAsRead(newSelectedId);
      }

      // 부모 컴포넌트에 선택된 메시지 정보 전달
      const selectedMessage = newSelectedId
        ? messages.find((m) => m.id === newSelectedId) || null
        : null;
      onSelect?.(selectedMessage);
    }, [selectedId, messages, markAsRead, onSelect]);

  return (
    <section
      className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label={`${user.name}님과의 메시지 목록`}
    >
      <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
      <ul className="flex flex-col gap-2">
        {/* 5. 서브 컴포넌트를 사용하여 렌더링 로직 위임 */}
        {messages.map((message) => (
          <MessageListItem
            key={message.id}
            message={message}
            isActive={selectedId === message.id}
            onClick={handleSelect}
          />
        ))}
      </ul>
    </section>
  );
}