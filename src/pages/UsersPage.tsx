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
  isAddingFriend: boolean;
  refreshKey?: number;
  onMessageSent?: () => void;
  onReplySent?: () => void;
  isMessageOpen: boolean; // ✅ [추가]
  onToggleMessage: () => void; // ✅ [추가]
};

// --- 서브 컴포넌트 ---
const UserDetails = ({
  selectedUser,
  pickedMessage,
  onPickMessage,
  currentUserId,
  onAddFriend,
  isAddingFriend,
  refreshKey,
  onMessageSent,
  onReplySent,
  isMessageOpen, // ✅ [추가]
  onToggleMessage, // ✅ [추가]
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
    // ✅ Fragment(<>)를 div로 변경 (ref 연결을 위해)
    // ✅ 또는 상위에서 div로 감싸도 동일합니다. 여기서는 <> 유지
    <>
      <div className="w-[500px] min-w-[450px]">
        <UserDetailPanel
          user={selectedUser}
          onPickMessage={onPickMessage}
          currentUserId={currentUserId}
          onAddFriend={onAddFriend}
          isAddingFriend={isAddingFriend}
          refreshKey={refreshKey}
          onMessageSent={onMessageSent}
          isMessageOpen={isMessageOpen} // ✅ [전달]
          onToggleMessage={onToggleMessage} // ✅ [전달]
        />
      </div>
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail
            message={pickedMessage}
            onReplySent={onReplySent}
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
    isMessageOpen, // ✅ [추가]
    userDetailsRef, // ✅ [추가]
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    isAddingFriend,
    toggleMessage, // ✅ [추가]
  } = useUsersPageLogic();

  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);

  const handleRefreshMessages = () => {
    setMessagesRefreshKey((k) => k + 1);
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
      {/* ✅ [추가] UserDetails를 div로 감싸고 userDetailsRef를 연결합니다.
        이 div 바깥을 클릭하면 useUsersPageLogic의 handleClickOutside가 동작합니다.
      */}
      <div ref={userDetailsRef} className="flex flex-1 gap-6">
        <UserDetails
          selectedUser={selectedUser}
          pickedMessage={pickedMessage}
          onPickMessage={setPickedMessage}
          currentUserId={currentUserId}
          onAddFriend={handleAddFriend}
          isAddingFriend={isAddingFriend}
          refreshKey={messagesRefreshKey}
          onMessageSent={handleRefreshMessages}
          onReplySent={handleRefreshMessages}
          isMessageOpen={isMessageOpen} // ✅ [전달]
          onToggleMessage={toggleMessage} // ✅ [전달]
        />
      </div>
    </div>
  );
}
// // src/pages/UsersPage.tsx
// import { useState } from "react";
// // ❌ createPortal, UserMessageReply, supabase 임포트 제거 (로직 이동)
// import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
// import UserList from "../components/users/UserList";
// import UserDetailPanel from "../components/users/UserDetailPanel";
// import UserMessageDetail, {
//   type MessageDetailData,
// } from "../components/users/UserMessageDetail";
// import type { AppUser } from "../types/appUser";

// // --- 서브 컴포넌트 타입 정의 ---
// type UserDetailsProps = {
//   selectedUser: AppUser | null;
//   pickedMessage: MessageDetailData | null;
//   onPickMessage: (message: MessageDetailData | null) => void;
//   // onReply 제거 ❌
//   currentUserId: string | undefined;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   refreshKey?: number;
//   onMessageSent?: () => void; // ✅ 새 메시지 전송 콜백
//   onReplySent?: () => void; // ✅ 답장 전송 콜백
// };

// // --- 서브 컴포넌트 ---
// const UserDetails = ({
//   selectedUser,
//   pickedMessage,
//   onPickMessage,
//   // onReply, ❌
//   currentUserId,
//   onAddFriend,
//   isAddingFriend,
//   refreshKey,
//   onMessageSent, // ✅
//   onReplySent, // ✅
// }: UserDetailsProps) => {
//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]">
//         {" "}
//         사용자를 선택하여 대화를 시작하세요.{" "}
//       </div>
//     );
//   }
//   return (
//     <>
//       <div className="w-[500px] min-w-[450px]">
//         <UserDetailPanel
//           user={selectedUser}
//           onPickMessage={onPickMessage}
//           currentUserId={currentUserId}
//           onAddFriend={onAddFriend}
//           isAddingFriend={isAddingFriend}
//           refreshKey={refreshKey}
//           onMessageSent={onMessageSent} // ✅ 콜백 전달
//         />
//       </div>
//       {pickedMessage && (
//         <div className="w-full md:w-[450px] md:min-w-[450px]">
//           <UserMessageDetail
//             message={pickedMessage}
//             onReplySent={onReplySent} // ✅ 콜백 전달 (onReply 제거)
//           />
//         </div>
//       )}
//     </>
//   );
// };

// // --- 메인 페이지 컴포넌트 ---
// export default function UsersPage() {
//   const {
//     users,
//     isLoading,
//     error,
//     currentUserId,
//     selectedId,
//     selectedUser,
//     pickedMessage,
//     // isReplyOpen, openReply, closeReply 제거 ❌
//     handleSelectUser,
//     setPickedMessage,
//     handleAddFriend,
//     isAddingFriend,
//   } = useUsersPageLogic();

//   // ✅ 메시지 목록 새로고침을 위한 state
//   const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);

//   // ✅ 새 메시지 또는 답장 전송 시 목록 새로고침을 트리거하는 핸들러
//   const handleRefreshMessages = () => {
//     setMessagesRefreshKey((k) => k + 1);
//   };

//   return (
//     <div className="ml-[50px] flex h-full w-full gap-6">
//       <UserList
//         users={users}
//         selectedId={selectedId}
//         onSelectUser={handleSelectUser}
//         isLoading={isLoading}
//         error={error}
//       />
//       <UserDetails
//         selectedUser={selectedUser}
//         pickedMessage={pickedMessage}
//         onPickMessage={setPickedMessage}
//         // onReply={openReply} 제거 ❌
//         currentUserId={currentUserId}
//         onAddFriend={handleAddFriend}
//         isAddingFriend={isAddingFriend}
//         refreshKey={messagesRefreshKey} // ✅ state 전달
//         onMessageSent={handleRefreshMessages} // ✅ 핸들러 전달
//         onReplySent={handleRefreshMessages} // ✅ 핸들러 전달
//       />
//       {/* ❌ 중복된 답장 모달(createPortal) 로직 전체 제거 */}
//     </div>
//   );
// }

// // src/pages/UsersPage.tsx
// import { useState } from "react";
// import { createPortal } from "react-dom";
// import { useUsersPageLogic } from "../hooks/useUsersPageLogic";
// import UserList from "../components/users/UserList";
// import UserDetailPanel from "../components/users/UserDetailPanel";
// import UserMessageDetail, {
//   type MessageDetailData,
// } from "../components/users/UserMessageDetail";
// import UserMessageReply from "../components/users/UserMessageReply";
// import type { AppUser } from "../types/appUser";

// import { supabase } from "../utils/supabase";

// // --- 서브 컴포넌트 타입 정의 ---
// type UserDetailsProps = {
//   selectedUser: AppUser | null;
//   pickedMessage: MessageDetailData | null;
//   onPickMessage: (message: MessageDetailData | null) => void;
//   onReply: () => void;
//   currentUserId: string | undefined;
//   onAddFriend: () => void;
//   isAddingFriend: boolean;
//   refreshKey?: number;
// };

// // --- 서브 컴포넌트 ---
// const UserDetails = ({
//   selectedUser,
//   pickedMessage,
//   onPickMessage,
//   onReply,
//   currentUserId,
//   onAddFriend,
//   isAddingFriend,
//   refreshKey,
// }: UserDetailsProps) => {
//   if (!selectedUser) {
//     return (
//       <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]">
//         {" "}
//         사용자를 선택하여 대화를 시작하세요.{" "}
//       </div>
//     );
//   }
//   return (
//     <>
//       <div className="w-[500px] min-w-[450px]">
//         <UserDetailPanel
//           user={selectedUser}
//           onPickMessage={onPickMessage}
//           currentUserId={currentUserId}
//           onAddFriend={onAddFriend}
//           isAddingFriend={isAddingFriend}
//           refreshKey={refreshKey}
//         />
//       </div>
//       {pickedMessage && (
//         <div className="w-full md:w-[450px] md:min-w-[450px]">
//           <UserMessageDetail message={pickedMessage} onReply={onReply} />
//         </div>
//       )}
//     </>
//   );
// };

// // --- 메인 페이지 컴포넌트 ---
// export default function UsersPage() {
//   const {
//     users,
//     isLoading,
//     error,
//     currentUserId,
//     selectedId,
//     selectedUser,
//     pickedMessage,
//     isReplyOpen,
//     handleSelectUser,
//     setPickedMessage,
//     handleAddFriend,
//     isAddingFriend,
//     openReply,
//     closeReply,
//   } = useUsersPageLogic();

//   const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);

//   return (
//     <div className="ml-[50px] flex h-full w-full gap-6">
//       <UserList
//         users={users}
//         selectedId={selectedId}
//         onSelectUser={handleSelectUser}
//         isLoading={isLoading}
//         error={error}
//       />
//       <UserDetails
//         selectedUser={selectedUser}
//         pickedMessage={pickedMessage}
//         onPickMessage={setPickedMessage}
//         onReply={openReply}
//         currentUserId={currentUserId}
//         onAddFriend={handleAddFriend}
//         isAddingFriend={isAddingFriend}
//         refreshKey={messagesRefreshKey}
//       />
//       {isReplyOpen &&
//         pickedMessage &&
//         selectedUser &&
//         createPortal(
//           <UserMessageReply
//             title={pickedMessage.title}
//             onClose={closeReply}
//             onSend={async (payload) => {
//               try {
//                 const senderId =
//                   currentUserId ??
//                   (await supabase.auth.getUser()).data.user?.id;
//                 if (!senderId) {
//                   alert("로그인이 필요합니다.");
//                   return;
//                 }

//                 const { error } = await supabase
//                   .from("friends_messages")
//                   .insert({
//                     sender_id: senderId,
//                     receiver_id: selectedUser.id,
//                     title: payload.title,
//                     text: payload.body,
//                   });
//                 if (error) throw error;

//                 // ✅ 전송 성공 → 목록 새로고침 트리거
//                 setMessagesRefreshKey((k) => k + 1);
//                 // (선택) 답장 패널 닫기
//                 // closeReply();
//               } catch (e) {
//                 console.error(e);
//                 alert("메시지 전송에 실패했습니다.");
//               }
//             }}
//           />,
//           document.body
//         )}
//     </div>
//   );
// }
