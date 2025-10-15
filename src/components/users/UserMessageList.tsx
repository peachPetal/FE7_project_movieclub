import { useEffect, useMemo, useState } from "react";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";

type Props = {
  user: AppUser;
  onSelect?: (message: MessageDetailData | null) => void;
};

type MessageItem = MessageDetailData & {
  unread: boolean;
};

export default function UserMessageList({ user, onSelect }: Props) {
  // 초기 목업(사용자별로 다른 데이터라 가정)
  const seed: MessageItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "메시지 제목",
        unread: true,
        bodyMine: "이전에 내가 보낸 메시지 내용~~~~~\n\n여\n\n러\n\n줄",
        bodyFriend: "친구가 보낸 메시지 내용\n내용\n내용\n~~~~",
      },
      {
        id: "2",
        title: "메시지 제목",
        unread: true,
        bodyMine: "내가 보낸 메시지 (2)",
        bodyFriend: "친구가 보낸 메시지 (2)",
      },
      {
        id: "3",
        title: "메시지 제목",
        unread: false,
        bodyMine: "내가 보낸 메시지 (3)",
        bodyFriend: "친구가 보낸 메시지 (3)",
      },
    ],
    []
  );

  // 리스트 상태(읽음/안읽음 포함)
  const [items, setItems] = useState<MessageItem[]>(seed);

  // 선택 토글 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 유저가 바뀌면 목록/선택 상태 초기화
  useEffect(() => {
    setItems(seed);
    setSelectedId(null);
    onSelect?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleClick = (id: string) => {
    setSelectedId((prev) => {
      const next = prev === id ? null : id; // 같은 항목 → 접힘, 다른 항목 → 전환

      // 선택 전환될 때 읽음 처리
      if (next) {
        setItems((curr) =>
          curr.map((m) => (m.id === next ? { ...m, unread: false } : m))
        );
      }

      const picked = next ? (items.find((m) => m.id === next) as MessageDetailData) ?? null : null;
      onSelect?.(picked);
      return next;
    });
  };

  return (
    <section
      className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label={`${user.name}님과의 메시지 목록`}
    >
      <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>

      <ul className="flex flex-col gap-2">
        {items.map((m) => {
          const isActive = selectedId === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => handleClick(m.id)}
                aria-current={isActive}
                className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]"
                    : "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]"
                }`}
              >
                <span className="truncate">{m.title}</span>
                {m.unread && (
                  <span
                    className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
                    aria-label="읽지 않음"
                    title="읽지 않음"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
