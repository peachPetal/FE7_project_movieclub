// src/components/users/UserDetailPanel.tsx
import { useCallback } from "react"; // 1. useState, useEffect 제거
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";
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
  onToggleMessage: () => void; // 2. 부모로부터 받은 핸들러 사용
  isMessageOpen: boolean;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  isOwnProfile?: boolean;
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
  isOwnProfile = false,
}: UserActionsProps) => (
  <div className="flex items-end self-stretch gap-2">
    {/* 자기 자신이 아닐 때만 친구 추가 버튼 표시 */}
    {!isOwnProfile && (
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
    )}
    <button
      onClick={onToggleMessage} // 3. prop으로 받은 핸들러 직접 사용
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
  onMessageSent?: () => void;
  isMessageOpen: boolean; // 4. [수정] prop으로 받음
  onToggleMessage: () => void; // 5. [수정] prop으로 받음
};

// --- 메인 컴포넌트 ---
export default function UserDetailPanel({
  user,
  currentUserId,
  onPickMessage,
  onAddFriend,
  isAddingFriend,
  refreshKey,
  onMessageSent,
  isMessageOpen, // 6. prop으로 받기
  onToggleMessage, // 7. prop으로 받기
}: Props) {
  const { isDark } = useTheme();
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();

  // 8. [제거] 내부 useState(isMessageOpen) 및 관련 useEffect 제거

  // 9. 인증 로직을 포함한 핸들러 래핑
  const handleToggleMessage = useCallback(() => {
    if (loading) return;
    if (!session) {
      navigate("/login");
      return;
    }
    // 인증 통과 시, 부모로부터 받은 toggle 함수 실행
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

  return (
    <div className="w-full">
      <aside
        className="card-shadow flex w-full h-[284px] items-start justify-between rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        aria-label="선택된 유저 상세 정보"
      >
        <UserProfileHeader user={user} isDark={isDark} />
        <UserActions
          onToggleMessage={handleToggleMessage} // 10. 래핑된 핸들러 전달
          isMessageOpen={isMessageOpen} // 11. prop 전달
          onAddFriend={handleAddFriend}
          isAddingFriend={isAddingFriend}
          isOwnProfile={user.id === currentUserId}
        />
      </aside>
      {/* 12. prop으로 받은 isMessageOpen 사용 */}
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
// // src/components/users/UserDetailPanel.tsx
// import { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthSession } from "../../hooks/useAuthSession";
// import { useTheme } from "../../hooks/useTheme";
// import type { AppUser } from "../../types/appUser";
// import type { MessageDetailData } from "./UserMessageDetail";

// // Asset Imports
// import profileIconBlack from "../../assets/person-circle-black.svg";
// import profileIconWhite from "../../assets/person-circle-white.svg";
// import addFriendIcon from "../../assets/add-friend.svg";
// import deleteFriendMouseOff from "../../assets/delete-friend-mouse-off.svg";
// import messageUserIcon from "../../assets/message-user.svg";
// import UserMessageList from "./UserMessageList";

// // --- 서브 컴포넌트 Props 타입 ---
// type UserActionsProps = {
//   onToggleMessage: () => void;
//   isMessageOpen: boolean;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   isOwnProfile?: boolean;
// };

// // --- 서브 컴포넌트 정의 ---
// const UserProfileHeader = ({
//   user,
//   isDark,
// }: {
//   user: AppUser;
//   isDark: boolean;
// }) => {
//   const fallbackIcon = isDark ? profileIconWhite : profileIconBlack;
//   return (
//     <div className="flex items-start gap-4">
//       <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--color-background-sub)]">
//         <img
//           src={user.avatar_url || fallbackIcon}
//           alt={`${user.name}의 프로필 아바타`}
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       </div>
//       <div className="min-w-0 flex-1">
//         <h3 className="truncate text-2xl font-bold">{user.name}</h3>
//         <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-sub)]">
//           {user.is_online ? (
//             <>
//               <span className="h-2 w-2 rounded-full bg-[var(--color-alert-online)]" /> Online
//             </>
//           ) : (
//             <>
//               <span className="h-2 w-2 rounded-full bg-[var(--color-text-light)]" /> Offline
//             </>
//           )}
//         </p>
//         <p className="mt-2 text-sm text-[var(--color-text-sub)]">
//           가입일: {user.joinedAt ?? "정보 없음"}
//         </p>
//       </div>
//     </div>
//   );
// };

// const UserActions = ({
//   onToggleMessage,
//   isMessageOpen,
//   onAddFriend,
//   isAddingFriend,
//   isOwnProfile = false,
// }: UserActionsProps) => (
//   <div className="flex items-end self-stretch gap-2">
//     {/* 자기 자신이 아닐 때만 친구 추가 버튼 표시 */}
//     {!isOwnProfile && (
//       <button
//         onClick={onAddFriend}
//         disabled={isAddingFriend}
//         className="relative h-10 w-10 group disabled:opacity-50 disabled:cursor-not-allowed"
//         aria-label="친구로 추가"
//         title="친구로 추가"
//       >
//         <img
//           src={deleteFriendMouseOff}
//           alt="친구 추가"
//           className="w-10 h-10 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
//         />
//         <img
//           src={addFriendIcon}
//           alt="친구 추가 호버"
//           className="w-10 h-10 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//         />
//       </button>
//     )}
//     <button
//       onClick={onToggleMessage}
//       aria-expanded={isMessageOpen}
//       aria-label="쪽지 보기"
//       title="쪽지 보기"
//       className="flex h-10 w-10 items-center justify-center rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
//     >
//       <img src={messageUserIcon} alt="" className="h-full w-full" />
//     </button>
//   </div>
// );

// // --- 메인 컴포넌트 Props 타입 ---
// type Props = {
//   user: AppUser;
//   currentUserId: string | undefined;
//   onPickMessage?: (msg: MessageDetailData | null) => void;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   refreshKey?: number;
//   onMessageSent?: () => void; // ✅ 새 메시지 전송 콜백 추가
//   // forceOpenMessage 제거 ❌
// };

// // --- 메인 컴포넌트 ---
// export default function UserDetailPanel({
//   user,
//   currentUserId,
//   onPickMessage,
//   onAddFriend,
//   isAddingFriend,
//   refreshKey,
//   onMessageSent, // ✅
// }: Props) {
//   const { isDark } = useTheme();
//   const { session, loading } = useAuthSession();
//   const navigate = useNavigate();

//   const [isMessageOpen, setIsMessageOpen] = useState(false);

//   // ❌ forceOpenMessage 관련 useEffect 제거

//   const toggleMessage = useCallback(() => {
//     if (loading) return;
//     if (!session) {
//       navigate("/login");
//       return;
//     }
//     setIsMessageOpen((p) => !p);
//   }, [loading, session, navigate]);

//   const handleAddFriend = useCallback(() => {
//     if (loading) return;
//     if (!session) {
//       navigate("/login");
//       return;
//     }
//     onAddFriend();
//   }, [loading, session, navigate, onAddFriend]);

//   return (
//     <div className="w-full">
//       <aside
//         className="card-shadow flex w-full h-[284px] items-start justify-between rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//         aria-label="선택된 유저 상세 정보"
//       >
//         <UserProfileHeader user={user} isDark={isDark} />
//         <UserActions
//           onToggleMessage={toggleMessage}
//           isMessageOpen={isMessageOpen}
//           onAddFriend={handleAddFriend}
//           isAddingFriend={isAddingFriend}
//           isOwnProfile={user.id === currentUserId}
//         />
//       </aside>
//       {isMessageOpen && (
//         <div className="mt-4">
//           <UserMessageList
//             user={user}
//             currentUserId={currentUserId}
//             onSelect={(m) => onPickMessage?.(m)}
//             refreshKey={refreshKey}
//             onMessageSent={onMessageSent} // ✅ 콜백 전달
//           />
//         </div>
//       )}
//     </div>
//   );
// }
// // src/components/users/UserDetailPanel.tsx
// import { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthSession } from "../../hooks/useAuthSession";
// import { useTheme } from "../../hooks/useTheme";
// import type { AppUser } from "../../types/appUser";
// import type { MessageDetailData } from "./UserMessageDetail";

// // Asset Imports
// import profileIconBlack from "../../assets/person-circle-black.svg";
// import profileIconWhite from "../../assets/person-circle-white.svg";
// import addFriendIcon from "../../assets/add-friend.svg";
// import deleteFriendMouseOff from "../../assets/delete-friend-mouse-off.svg";
// import messageUserIcon from "../../assets/message-user.svg";
// import UserMessageList from "./UserMessageList";

// // --- 서브 컴포넌트 Props 타입 ---
// type UserActionsProps = {
//   onToggleMessage: () => void;
//   isMessageOpen: boolean;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   isOwnProfile?: boolean;
// };

// // --- 서브 컴포넌트 정의 ---
// const UserProfileHeader = ({
//   user,
//   isDark,
// }: {
//   user: AppUser;
//   isDark: boolean;
// }) => {
//   const fallbackIcon = isDark ? profileIconWhite : profileIconBlack;
//   return (
//     <div className="flex items-start gap-4">
//       <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--color-background-sub)]">
//         <img
//           src={user.avatar_url || fallbackIcon}
//           alt={`${user.name}의 프로필 아바타`}
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       </div>
//       <div className="min-w-0 flex-1">
//         <h3 className="truncate text-2xl font-bold">{user.name}</h3>
//         <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-sub)]">
//           {user.is_online ? (
//             <>
//               <span className="h-2 w-2 rounded-full bg-[var(--color-alert-online)]" /> Online
//             </>
//           ) : (
//             <>
//               <span className="h-2 w-2 rounded-full bg-[var(--color-text-light)]" /> Offline
//             </>
//           )}
//         </p>
//         <p className="mt-2 text-sm text-[var(--color-text-sub)]">
//           가입일: {user.joinedAt ?? "정보 없음"}
//         </p>
//       </div>
//     </div>
//   );
// };

// const UserActions = ({
//   onToggleMessage,
//   isMessageOpen,
//   onAddFriend,
//   isAddingFriend,
//   isOwnProfile = false,
// }: UserActionsProps) => (
//   <div className="flex items-end self-stretch gap-2">
//     {/* 자기 자신이 아닐 때만 친구 추가 버튼 표시 */}
//     {!isOwnProfile && (
//       <button
//         onClick={onAddFriend}
//         disabled={isAddingFriend}
//         className="relative h-10 w-10 group disabled:opacity-50 disabled:cursor-not-allowed"
//         aria-label="친구로 추가"
//         title="친구로 추가"
//       >
//         <img
//           src={deleteFriendMouseOff}
//           alt="친구 추가"
//           className="w-10 h-10 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
//         />
//         <img
//           src={addFriendIcon}
//           alt="친구 추가 호버"
//           className="w-10 h-10 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//         />
//       </button>
//     )}
//     <button
//       onClick={onToggleMessage}
//       aria-expanded={isMessageOpen}
//       aria-label="쪽지 보기"
//       title="쪽지 보기"
//       className="flex h-10 w-10 items-center justify-center rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]"
//     >
//       <img src={messageUserIcon} alt="" className="h-full w-full" />
//     </button>
//   </div>
// );

// // --- 메인 컴포넌트 Props 타입 ---
// type Props = {
//   user: AppUser;
//   currentUserId: string | undefined;
//   onPickMessage?: (msg: MessageDetailData | null) => void;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   refreshKey?: number;
//   forceOpenMessage?: boolean; // 추가: 외부에서 메시지 패널 열기
// };

// // --- 메인 컴포넌트 ---
// export default function UserDetailPanel({
//   user,
//   currentUserId,
//   onPickMessage,
//   onAddFriend,
//   isAddingFriend,
//   refreshKey,
//   forceOpenMessage = false, // 기본값 false
// }: Props) {
//   const { isDark } = useTheme();
//   const { session, loading } = useAuthSession();
//   const navigate = useNavigate();

//   const [isMessageOpen, setIsMessageOpen] = useState(false);

//   // 외부 forceOpenMessage가 true면 메시지 열기
//   useEffect(() => {
//     if (forceOpenMessage) {
//       setIsMessageOpen(true);
//     }
//   }, [forceOpenMessage]);

//   const toggleMessage = useCallback(() => {
//     if (loading) return;
//     if (!session) {
//       navigate("/login");
//       return;
//     }
//     setIsMessageOpen((p) => !p);
//   }, [loading, session, navigate]);

//   const handleAddFriend = useCallback(() => {
//     if (loading) return;
//     if (!session) {
//       navigate("/login");
//       return;
//     }
//     onAddFriend();
//   }, [loading, session, navigate, onAddFriend]);

//   return (
//     <div className="w-full">
//       <aside
//         className="card-shadow flex w-full h-[284px] items-start justify-between rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-6 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//         aria-label="선택된 유저 상세 정보"
//       >
//         <UserProfileHeader user={user} isDark={isDark} />
//         <UserActions
//           onToggleMessage={toggleMessage}
//           isMessageOpen={isMessageOpen}
//           onAddFriend={handleAddFriend}
//           isAddingFriend={isAddingFriend}
//           isOwnProfile={user.id === currentUserId}
//         />
//       </aside>
//       {isMessageOpen && (
//         <div className="mt-4">
//           <UserMessageList
//             user={user}
//             currentUserId={currentUserId}
//             onSelect={(m) => onPickMessage?.(m)}
//             refreshKey={refreshKey}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
