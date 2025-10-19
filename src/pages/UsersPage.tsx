import { useState } from "react";
import { createPortal } from "react-dom";
import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
import UserList from "../components/users/UserList";
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, {
  type MessageDetailData,
} from "../components/users/UserMessageDetail";
import UserMessageReply from "../components/users/UserMessageReply";
import type { AppUser } from "../types/appUser";

import { supabase } from "../utils/supabase";

// --- 서브 컴포넌트 타입 정의 ---
type UserDetailsProps = {
  selectedUser: AppUser | null;
  pickedMessage: MessageDetailData | null;
  onPickMessage: (message: MessageDetailData | null) => void;
  onReply: () => void;
  currentUserId: string | undefined;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  refreshKey?: number;
};

// --- 서브 컴포넌트 ---
const UserDetails = ({
  selectedUser,
  pickedMessage,
  onPickMessage,
  onReply,
  currentUserId,
  onAddFriend,
  isAddingFriend,
  refreshKey,
}: UserDetailsProps) => {
  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]">
        {" "}
        사용자를 선택하여 대화를 시작하세요.{" "}
      </div>
    );
  }
  return (
    <>
      <div className="w-[500px] min-w-[450px]">
        <UserDetailPanel
          user={selectedUser}
          onPickMessage={onPickMessage}
          currentUserId={currentUserId}
          onAddFriend={onAddFriend}
          isAddingFriend={isAddingFriend}
          refreshKey={refreshKey}
        />
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
    users,
    isLoading,
    error,
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isReplyOpen,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    isAddingFriend,
    openReply,
    closeReply,
  } = useUsersPageLogic();

  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);

  return (
    <div className="ml-[50px] flex h-full w-full gap-6">
      <UserList
        users={users}
        selectedId={selectedId}
        onSelectUser={handleSelectUser}
        isLoading={isLoading}
        error={error}
      />
      <UserDetails
        selectedUser={selectedUser}
        pickedMessage={pickedMessage}
        onPickMessage={setPickedMessage}
        onReply={openReply}
        currentUserId={currentUserId}
        onAddFriend={handleAddFriend}
        isAddingFriend={isAddingFriend}
        refreshKey={messagesRefreshKey}
      />
      {isReplyOpen &&
        pickedMessage &&
        selectedUser &&
        createPortal(
          <UserMessageReply
            title={pickedMessage.title}
            onClose={closeReply}
            onSend={async (payload) => {
              try {
                const senderId =
                  currentUserId ??
                  (await supabase.auth.getUser()).data.user?.id;
                if (!senderId) {
                  alert("로그인이 필요합니다.");
                  return;
                }

                const { error } = await supabase
                  .from("friends_messages")
                  .insert({
                    sender_id: senderId,
                    receiver_id: selectedUser.id,
                    title: payload.title,
                    text: payload.body,
                  });
                if (error) throw error;

                // ✅ 전송 성공 → 목록 새로고침 트리거
                setMessagesRefreshKey((k) => k + 1);
                // (선택) 답장 패널 닫기
                // closeReply();
              } catch (e) {
                console.error(e);
                alert("메시지 전송에 실패했습니다.");
              }
            }}
          />,
          document.body
        )}
    </div>
  );
}
