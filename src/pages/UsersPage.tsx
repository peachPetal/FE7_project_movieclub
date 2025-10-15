import { createPortal } from "react-dom";
import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import UserItem from "../components/users/UserItem";
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, { type MessageDetailData } from "../components/users/UserMessageDetail";
import UserMessageReply from "../components/users/UserMessageReply";
import type { AppUser } from "../types/appUser";

// --- 서브 컴포넌트 타입 정의 ---
type UserListProps = {
  users: AppUser[];
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
  isLoading: boolean;
  error: Error | null;
};

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
const UserList = ({ users, selectedId, onSelectUser, isLoading, error }: UserListProps) => (
  <div className="flex w-[290px] max-w-lg flex-col gap-4">
    <FilterDropdown type="Users" />
    {isLoading && <div className="p-4 text-center text-[var(--color-text-sub)]">로딩 중...</div>}
    {error && <div className="p-4 text-center text-red-500">{error.message}</div>}
    {!isLoading && !error && (
      <ul className="space-y-3">
        {users.map((user) => ( <li key={user.id}><UserItem user={user} selected={user.id === selectedId} onClick={onSelectUser} /></li> ))}
      </ul>
    )}
  </div>
);

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
    users, isLoading, isError, error, currentUserId, selectedId, selectedUser,
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