import { useMemo } from "react";
import type { AppUser } from "../../types/User";
import profileIconBlack from "../../assets/person-circle-black.svg";
import profileIconWhite from "../../assets/person-circle-white.svg";

type Props = { user: AppUser };

export default function UserDetailPanel({ user }: Props) {
  const isDark = useMemo(() => localStorage.getItem("theme") === "dark", []);
  return (
    <aside
      className="card-shadow w-full rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
      aria-label="선택된 유저 상세 정보"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--color-background-sub)]">
          <img
            src={isDark ? profileIconWhite : profileIconBlack}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-2xl font-bold">{user.name}</h3>
          <p className="mt-1 text-sm text-[var(--color-text-sub)]">
            {user.isOnline ? (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-alert-online)]" />
                온라인
              </span>
            ) : (
              "오프라인"
            )}
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-sub)]">
            가입한 날짜: {user.joinedAt ?? "정보 없음"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 친구 추가 */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-alert-online)] text-white shadow hover:opacity-90"
            aria-label="친구로 추가"
            title="친구로 추가"
          >
            +
          </button>
          {/* 쪽지 */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-main)] text-white shadow hover:opacity-90"
            aria-label="쪽지 보내기"
            title="쪽지 보내기"
          >
            ✉
          </button>
        </div>
      </div>
    </aside>
  );
}
