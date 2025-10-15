import { useMemo, useState } from "react";
import type { AppUser } from "../../types/User";
import UserMessageDetail from "./UserMessageDetail";
import type { MessageDetailData } from "./UserMessageDetail";

type Props = { user: AppUser };

type MessageItem = MessageDetailData & {
  unread: boolean;
};

export default function UserMessageList({ user }: Props) {
  const mock: MessageItem[] = useMemo(
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
        unread: false,
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

  // 같은 제목을 다시 클릭하면 접힘, 다른 제목 클릭하면 교체하여 펼침
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => (selectedId ? mock.find((m) => m.id === selectedId) ?? null : null),
    [mock, selectedId]
  );

  const handleClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label={`${user.name}님과의 메시지`}
    >
      <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
        {/* 좌측 목록 */}
        <ul className="flex flex-col gap-2">
          {mock.map((m) => {
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

        {/* 우측 상세 (토글) */}
        {selected ? (
          <UserMessageDetail message={selected} />
        ) : (
          <div className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-sub)] dark:border-[var(--color-text-light)] grid place-items-center">
            메시지를 선택하세요
          </div>
        )}
      </div>
    </section>
  );
}
