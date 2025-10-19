import { useState, useCallback, useEffect } from "react";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";
import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages"; // 1. 커스텀 훅과 타입 import
import clsx from "clsx";

type MessageListItemProps = {
  message: MessageItem;
  isActive: boolean;
  onClick: (id: string) => void;
};

const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isActive,
  onClick,
}) => (
  <li>
    <button
      type="button"
      onClick={() => onClick(message.id)}
      aria-current={isActive}
      className={clsx(
        "flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors",
        {
          "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]": isActive,
          "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]":
            !isActive,
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
  refreshKey?: number;
};

export default function UserMessageList({ user, onSelect, refreshKey }: Props) {
  // 데이터 로직을 커스텀 훅에 위임
  const { messages, markAsRead, refetch } = useUserMessages(user.id);
  // UI 상태(선택된 ID)만 직접 관리
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // user 변경이나 상위에서 refreshKey가 증가할 때 목록 재조회
    if (typeof refetch === "function") {
      refetch();
    }
    // 선택 해제(옵션): 유저 전환 시 디테일 패널 초기화
    setSelectedId(null);
  }, [user.id, refreshKey, refetch]);

  // 핸들러 로직 단순화
  const handleSelect = useCallback(
    (id: string) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);

      if (newSelectedId) {
        // 읽음 처리
        markAsRead(newSelectedId);
      }

      // ✅ 부모가 기대하는 형태로 어댑트
      const raw = newSelectedId
        ? messages.find((m) => m.id === newSelectedId) || null
        : null;

      const selectedMessageDetail: MessageDetailData | null = raw
        ? {
            id: raw.id,
            title: raw.title ?? "",
            // 훅의 스키마에 따라 다를 수 있어 안전하게 any로 읽습니다.
            bodyMine: raw.bodyMine ?? (raw as any).body ?? "",
            bodyFriend: raw.bodyFriend ?? "",
          }
        : null;

      onSelect?.(selectedMessageDetail);
    },
    [selectedId, messages, markAsRead, onSelect]
  );

  return (
    <section
      className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label={`${user.name}님과의 메시지 목록`}
    >
      <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
      <ul className="flex flex-col gap-2">
        {/* 서브 컴포넌트를 사용하여 렌더링 로직 위임 */}
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
