// src/components/users/UserDetailPanel.tsx

// --- 1. 임포트 ---
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuthSession } from "../../hooks/useAuthSession";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";
import { useFriends } from "../../hooks/useFriends";
import UserMessageList from "./UserMessageList";

// --- 2. Asset 임포트 ---
import profileIconBlack from "../../assets/person-circle-black.svg";
import profileIconWhite from "../../assets/person-circle-white.svg";
import addFriendIcon from "../../assets/add-friend.svg";
import deleteFriendIcon from "../../assets/delete-friend-mouse-on.svg";
import messageUserIcon from "../../assets/message-user.svg";

// ----------------------------------------------------------------
// --- 3. 서브 컴포넌트 정의 (UserProfileHeader - 변경 없음) ---
// ----------------------------------------------------------------

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
              <span className="h-2 w-2 rounded-full bg-[var(--color-alert-online)]" /> Online
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--color-text-light)]" /> Offline
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

// ----------------------------------------------------------------
// --- 3. 서브 컴포넌트 정의 (UserActions - 변경 없음) ---
// ----------------------------------------------------------------

type UserActionsProps = {
  isOwnProfile: boolean;
  isFriend: boolean;
  isAddingFriend: boolean;
  isDeletingFriend: boolean;
  onAddFriend: () => void;
  onDeleteFriend: () => void;
  onToggleMessage: () => void;
  isMessageOpen: boolean;
};

const UserActions = ({
  isOwnProfile,
  isFriend,
  isAddingFriend,
  isDeletingFriend,
  onAddFriend,
  onDeleteFriend,
  onToggleMessage,
  isMessageOpen,
}: UserActionsProps) => (
  <div className="flex items-end self-stretch gap-2">
    {!isOwnProfile && (
      <>
        {isFriend ? (
          <button
            onClick={onDeleteFriend} 
            disabled={isDeletingFriend}
            className="relative h-10 w-10 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={deleteFriendIcon} alt="친구 삭제" className="w-10 h-10" />
          </button>
        ) : (
          <button
            onClick={onAddFriend}
            disabled={isAddingFriend}
            className="relative h-10 w-10 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={addFriendIcon} alt="친구 추가" className="w-10 h-10" />
          </button>
        )}
      </>
    )}

    <button
      onClick={onToggleMessage}
      aria-expanded={isMessageOpen}
      aria-label="쪽지 보기"
      title="쪽지 보기"
      className="flex h-10 w-10 items-center justify-center rounded-full hover:opacity-90 active:scale-95"
    >
      <img src={messageUserIcon} alt="" className="h-full w-full" />
    </button>
  </div>
);

// ----------------------------------------------------------------
// --- 4. 메인 컴포넌트 Props 타입 정의 ---
// ----------------------------------------------------------------
type Props = {
  user: AppUser;
  currentUserId: string | undefined;
  onPickMessage?: (msg: MessageDetailData | null) => void;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  onDeleteFriend: () => void; 
  isDeletingFriend: boolean; 
  refreshKey?: number;
  onMessageSent?: () => void;
  isMessageOpen: boolean;
  onToggleMessage: () => void;
};

// ----------------------------------------------------------------
// --- 5. 메인 컴포넌트 정의 (default export) ---
// ----------------------------------------------------------------
export default function UserDetailPanel({
  user,
  currentUserId,
  onPickMessage,
  onAddFriend,
  isAddingFriend,
  onDeleteFriend, 
  isDeletingFriend, 
  refreshKey,
  onMessageSent,
  isMessageOpen,
  onToggleMessage,
}: Props) {
  const { isDark } = useTheme();
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();

  const { friends } = useFriends();
  const isFriend = friends.some((f) => f.id === user.id);
  const isOwnProfile = user.id === currentUserId;


  // --- 핸들러 (부모가 정의한 로직을 호출) ---
  const handleToggleMessage = useCallback(() => {
    if (loading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    onToggleMessage();
  }, [loading, session, navigate, onToggleMessage]);

  const handleAddFriend = useCallback(() => {
    if (loading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    onAddFriend();
  }, [loading, session, navigate, onAddFriend]);

  const handleDeleteFriend = useCallback(() => {
    if (loading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    onDeleteFriend();
  }, [loading, session, navigate, onDeleteFriend]);

  // --- 6. JSX 렌더링 ---
  return (
    <div className="w-full">
      <aside
        className="card-shadow flex w-full h-[284px] items-start justify-between rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        aria-label="선택된 유저 상세 정보"
      >
        <UserProfileHeader user={user} isDark={isDark} />

        {/* ✅ [수정] props로 받은 상태와 핸들러 전달 */}
        <UserActions
          isOwnProfile={isOwnProfile}
          isFriend={isFriend}
          isAddingFriend={isAddingFriend}
          isDeletingFriend={isDeletingFriend}
          onAddFriend={handleAddFriend}
          onDeleteFriend={handleDeleteFriend}
          onToggleMessage={handleToggleMessage}
          isMessageOpen={isMessageOpen}
        />
      </aside>

      {/* 메시지 리스트 (isMessageOpen 상태에 따라 렌더링) */}
      {isMessageOpen && (
        <div className="mt-4">
          <UserMessageList
            user={user}
            currentUserId={currentUserId}
            onSelect={(m) => onPickMessage?.(m)}
            refreshKey={refreshKey}
            onMessageSent={onMessageSent}
          />
        </div>
      )}
    </div>
  );
}