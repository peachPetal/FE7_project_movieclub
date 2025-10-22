// src/pages/UsersPage.tsx
import { useState } from "react";
import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
import UserList from "../components/users/UserList";
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, {
  type MessageDetailData,
} from "../components/users/UserMessageDetail";
import type { AppUser } from "../types/appUser";

// --- 서브 컴포넌트 타입 정의 ---
type UserDetailsProps = {
  selectedUser: AppUser | null;
  pickedMessage: MessageDetailData | null;
  onPickMessage: (message: MessageDetailData | null) => void;
  currentUserId: string | undefined;
  onAddFriend: () => void;
  onDeleteFriend: () => void;
  isAddingFriend: boolean;
  isDeletingFriend: boolean;
  refreshKey?: number;
  onMessageSent?: () => void;
  onReplySent?: () => void;
  onMessageDeleted?: () => void;
  isMessageOpen: boolean;
  onToggleMessage: () => void;
};

// --- 서브 컴포넌트 ---
const UserDetails = ({
  selectedUser,
  pickedMessage,
  onPickMessage,
  currentUserId,
  onAddFriend,
  onDeleteFriend,
  isAddingFriend,
  isDeletingFriend,
  refreshKey,
  onMessageSent,
  onReplySent,
  onMessageDeleted,
  isMessageOpen,
  onToggleMessage,
}: UserDetailsProps) => {
  // if (!selectedUser) {
  //   return (
  //     <div className="flex h-full w-full items-center justify-end text-[var(--color-text-sub)]">
  //       {" "}
  //       사용자를 선택하여 대화를 시작하세요.{" "}
  //     </div>
  //   );
  // }
  if (!selectedUser) {
    return null;
  }
  return (
    <>
      <div className="w-[500px] min-w-[450px]">
        <UserDetailPanel
          user={selectedUser}
          onPickMessage={onPickMessage}
          currentUserId={currentUserId}
          onAddFriend={onAddFriend}
          onDeleteFriend={onDeleteFriend}
          isAddingFriend={isAddingFriend}
          isDeletingFriend={isDeletingFriend}
          refreshKey={refreshKey}
          onMessageSent={onMessageSent}
          isMessageOpen={isMessageOpen}
          onToggleMessage={onToggleMessage}
        />
      </div>
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail
          key={pickedMessage.id}
            message={pickedMessage}
            onReplySent={onReplySent}
            onMessageDeleted={onMessageDeleted}
          />
        </div>
      )}
    </>
  );
};

// --- 메인 페이지 컴포넌트 ---
export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isMessageOpen,
    userDetailsRef,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    isAddingFriend,
    toggleMessage,
    handleDeleteFriend,
    isDeletingFriend,
  } = useUsersPageLogic();

  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);

  const handleRefreshMessages = () => {
    setMessagesRefreshKey((k) => k + 1);
  };

// ✅ 4. 삭제 완료 핸들러 정의
  const handleMessageDeleted = () => {
    setPickedMessage(null); // 👈 디테일 뷰 닫기
    handleRefreshMessages(); // 👈 리스트 새로고침
  };

  return (
    <div className="ml-[50px] flex h-full w-full gap-6">
      <UserList
        users={users}
        selectedId={selectedId}
        onSelectUser={handleSelectUser}
        isLoading={isLoading}
        error={error}
      />
      <div ref={userDetailsRef} className="flex h-[284px] w-[500px] gap-6">
        <UserDetails
          selectedUser={selectedUser}
          pickedMessage={pickedMessage}
          onPickMessage={setPickedMessage}
          currentUserId={currentUserId}
          onAddFriend={handleAddFriend}
          onDeleteFriend={handleDeleteFriend}
          isAddingFriend={isAddingFriend}
          isDeletingFriend={isDeletingFriend}
          refreshKey={messagesRefreshKey}
          onMessageSent={handleRefreshMessages}
          onReplySent={handleRefreshMessages}
          onMessageDeleted={handleMessageDeleted}
          isMessageOpen={isMessageOpen}
          onToggleMessage={toggleMessage}
        />
      </div>
    </div>
  );
}
