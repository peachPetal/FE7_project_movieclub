import { createPortal } from "react-dom";
import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
import UserList from "../components/users/UserList";
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, { type MessageDetailData } from "../components/users/UserMessageDetail";
import UserMessageReply from "../components/users/UserMessageReply";
import type { AppUser } from "../types/appUser";

// --- 서브 컴포넌트 타입 정의 ---

type UserDetailsProps = {
  selectedUser: AppUser | null;
  pickedMessage: MessageDetailData | null;
  onPickMessage: (message: MessageDetailData | null) => void;
  onReply: () => void;
  currentUserId: string | undefined;
  onAddFriend: () => void;
  isAddingFriend: boolean;
};

// --- 서브 컴포넌트 ---
const UserDetails = ({ selectedUser, pickedMessage, onPickMessage, onReply, currentUserId, onAddFriend, isAddingFriend }: UserDetailsProps) => {
  if (!selectedUser) {
    return ( <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]"> 사용자를 선택하여 대화를 시작하세요. </div> );
  }
  return (
    <>
      <div className="w-[500px] min-w-[450px]">
        <UserDetailPanel user={selectedUser} onPickMessage={onPickMessage} currentUserId={currentUserId} onAddFriend={onAddFriend} isAddingFriend={isAddingFriend} />
      </div>
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail message={pickedMessage} onReply={onReply} />
        </div>
      )}
    </>
  );
};

// --- 메인 페이지 컴포넌트 ---
export default function UsersPage() {
  const {
    users, isLoading, error, currentUserId, selectedId, selectedUser,
    pickedMessage, isReplyOpen, handleSelectUser, setPickedMessage, handleAddFriend,
    isAddingFriend, openReply, closeReply,
  } = useUsersPageLogic();

  return (
    <div className="ml-[50px] flex h-full w-full gap-6">
      <UserList users={users} selectedId={selectedId} onSelectUser={handleSelectUser} isLoading={isLoading} error={error} />
      <UserDetails
        selectedUser={selectedUser}
        pickedMessage={pickedMessage}
        onPickMessage={setPickedMessage}
        onReply={openReply}
        currentUserId={currentUserId}
        onAddFriend={handleAddFriend}
        isAddingFriend={isAddingFriend}
      />
      {isReplyOpen && pickedMessage && selectedUser && createPortal(
        <UserMessageReply
          title={pickedMessage.title}
          onClose={closeReply}
          onSend={(payload) => {
            console.log("send reply", { to: selectedUser.name, ...payload });
          }}
        />,
        document.body
      )}
    </div>
  );
}