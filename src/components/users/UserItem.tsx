import type { AppUser } from "../../types/User";
import profileIcon from "../../assets/person.svg";

type Props = {
  user: AppUser;
  selected?: boolean;
  onClick?: (user: AppUser) => void;
  className?: string;
};

export default function UserItem({
  user,
  selected,
  onClick,
  className,
}: Props) {
  const { name, isOnline } = user;

  return (
    <button
      type="button"
      onClick={() => onClick?.(user)}
      className={[
        // 카드 베이스
        "w-full flex items-center gap-3 rounded-xl border transition",
        "px-4 py-3",
        // 배경 및 테두리 색상
        "bg-[var(--color-background-sub)] border-[var(--color-text-placeholder)]",
        // 호버/포커스
        "hover:border-[var(--color-text-light)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]",
        // 선택 상태
        selected
          ? "border-[var(--color-main)] ring-2 ring-[var(--color-main-10)]"
          : "",
        // 다크 모드
        "dark:bg-[var(--color-background-main)] dark:border-[var(--color-text-light)] dark:hover:border-[var(--color-text-sub)]",
        className || "",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div className="relative h-10 w-10 shrink-0 rounded-full bg-[var(--color-background-sub)] overflow-hidden">
        <img
          src={profileIcon}
          alt=""
          className="absolute inset-0 w-8 h-8 object-cover rounded-full"
        />
      </div>

      <div className="min-w-0 text-left">
        <p className="truncate font-medium text-[var(--color-text-main)]">
          {name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--color-text-sub)]">
          {isOnline ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-alert-online)]" />
              온라인
            </>
          ) : (
            "오프라인"
          )}
        </p>
      </div>
    </button>
  );
}
