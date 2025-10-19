import { useState, useCallback } from "react";
import { useTheme } from "../../hooks/useTheme";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";

// Asset Imports
import profileIconBlack from "../../assets/person-circle-black.svg";
import profileIconWhite from "../../assets/person-circle-white.svg";
import addFriendIcon from "../../assets/add-friend.svg";
import deleteFriendMouseOff from "../../assets/delete-friend-mouse-off.svg";
import messageUserIcon from "../../assets/message-user.svg";
import UserMessageList from "./UserMessageList";

// --- 서브 컴포넌트 Props 타입 ---
type UserActionsProps = {
  onToggleMessage: () => void;
  isMessageOpen: boolean;
  onAddFriend: () => void;
  isAddingFriend: boolean;
};

// --- 서브 컴포넌트 정의 ---
const UserProfileHeader = ({
  user,
  isDark,
}: {
  user: AppUser;
  isDark: boolean;
}) => {
  const fallbackIcon = isDark ? profileIconWhite : profileIconBlack;
  return (
    <div className="flex items-start gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--color-background-sub)]">
        <img
          src={user.avatar_url || fallbackIcon}
          alt={`${user.name}의 프로필 아바타`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-2xl font-bold">{user.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-sub)]">
          {user.is_online ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--color-alert-online)]" />{" "}
              Online
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--color-text-light)]" />{" "}
              Offline
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-sub)]">
          가입일: {user.joinedAt ?? "정보 없음"}
        </p>
      </div>
    </div>
  );
};

const UserActions = ({
  onToggleMessage,
  isMessageOpen,
  onAddFriend,
  isAddingFriend,
}: UserActionsProps) => (
  <div className="flex items-end self-stretch gap-2">
    <button
      onClick={onAddFriend}
      disabled={isAddingFriend}
      className="relative h-10 w-10 group disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="친구로 추가"
      title="친구로 추가"
    >
      <img
        src={deleteFriendMouseOff}
        alt="친구 추가"
        className="w-10 h-10 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
      />
      <img
        src={addFriendIcon}
        alt="친구 추가 호버"
        className="w-10 h-10 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </button>
    <button
      onClick={onToggleMessage}
      aria-expanded={isMessageOpen}
      aria-label="쪽지 보기"
      title="쪽지 보기"
      className="flex h-10 w-10 items-center justify-center rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
    >
      <img src={messageUserIcon} alt="" className="h-full w-full" />
    </button>
  </div>
);

// --- 메인 컴포넌트 Props 타입 ---
type Props = {
  user: AppUser;
  currentUserId: string | undefined;
  onPickMessage?: (msg: MessageDetailData | null) => void;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  refreshKey?: number;
};

// --- 메인 컴포넌트 ---
export default function UserDetailPanel({
  user,
  currentUserId,
  onPickMessage,
  onAddFriend,
  isAddingFriend,
  refreshKey,
}: Props) {
  const { isDark } = useTheme();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const toggleMessage = useCallback(() => setIsMessageOpen((p) => !p), []);

  return (
    <div className="w-full">
      <aside
        className="card-shadow flex w-full h-[284px] items-start justify-between rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        aria-label="선택된 유저 상세 정보"
      >
        <UserProfileHeader user={user} isDark={isDark} />
        {user.id !== currentUserId && (
          <UserActions
            onToggleMessage={toggleMessage}
            isMessageOpen={isMessageOpen}
            onAddFriend={onAddFriend}
            isAddingFriend={isAddingFriend}
          />
        )}
      </aside>
      {isMessageOpen && (
        <div className="mt-4">
          <UserMessageList
            user={user}
            onSelect={(m) => onPickMessage?.(m)}
            refreshKey={refreshKey}
          />
        </div>
      )}
    </div>
  );
}
