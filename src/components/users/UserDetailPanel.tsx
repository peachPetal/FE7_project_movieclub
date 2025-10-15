import { useMemo, useState, useCallback } from "react";
import type { AppUser } from "../../types/appUser";
import profileIconBlack from "../../assets/person-circle-black.svg";
import profileIconWhite from "../../assets/person-circle-white.svg";
import addFriendIcon from "../../assets/addFriend.svg";
import messageUserIcon from "../../assets/messageUser.svg";
import UserMessageList from "./UserMessageList";
import type { MessageDetailData } from "./UserMessageDetail";

type Props = {
  user: AppUser;
  onPickMessage?: (msg: MessageDetailData | null) => void; // ← 상위(UsersPage)로 전달
};

export default function UserDetailPanel({ user, onPickMessage }: Props) {
  const isDark = useMemo(() => localStorage.getItem("theme") === "dark", []);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const toggleMessage = useCallback(() => setIsMessageOpen((p) => !p), []);

  return (
    <div className="w-full">
      <aside
        className="card-shadow w-full h-[284px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        aria-label="선택된 유저 상세 정보"
      >
        <div className="flex items-start h-full gap-4">
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

          <div className="flex h-full items-end gap-2">
            {/* 친구 추가 */}
            <img
              src={addFriendIcon}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full"
              alt=""
              aria-label="친구로 추가"
              title="친구로 추가"
            />
            {/* 쪽지 토글 */}
            <img
              src={messageUserIcon}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
              alt=""
              aria-label="쪽지 보기"
              title="쪽지 보기"
              role="button"
              tabIndex={0}
              aria-expanded={isMessageOpen}
              onClick={toggleMessage}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleMessage();
                }
              }}
            />
          </div>
        </div>
      </aside>

      {/* 중앙 영역: 좌측 목록만 (상세는 우측 별도 영역에 표시) */}
      {isMessageOpen && (
        <div className="mt-4">
          <UserMessageList
            user={user}
            onSelect={(m) => onPickMessage?.(m)} // 같은 항목 재클릭 → null 전달
          />
        </div>
      )}
    </div>
  );
}
