import type { AppUser } from "../../types/User";

type Props = { user: AppUser };

export default function UserMessageList({ user }: Props) {
  // 실제 연동 전 임시 목업
  const mock = [
    { id: "1", title: "메시지 제목", unread: true },
    { id: "2", title: "메시지 제목", unread: false },
    { id: "3", title: "메시지 제목", unread: false },
  ];

  return (
    <section
      className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label={`${user.name}님과의 메시지 목록`}
    >
      <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
      <ul className="flex flex-col gap-2">
        {mock.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-md bg-[var(--color-background-sub)] px-4 py-3"
          >
            <span className="truncate">{m.title}</span>
            {m.unread && (
              <span
                className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
                aria-label="읽지 않음"
                title="읽지 않음"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
