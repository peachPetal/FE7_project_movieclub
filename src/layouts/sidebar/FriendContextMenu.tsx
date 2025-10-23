import React, { useState } from "react"; // 1. useState 임포트
import { createPortal } from "react-dom"; // 2. createPortal 임포트
import { type Friend } from "../../hooks/useFriends";
import { useUserMessages } from "../../hooks/useUserMessages"; // 3. 훅 임포트
import UserMessageReply from "../../components/users/UserMessageReply"; // 4. 모달 컴포넌트 임포트

// Asset Imports
import friendsIcon from "../../assets/person-circle-black.svg";
import messageIcon from "../../assets/message.svg";
import deleteFriendMouseOn from "../../assets/delete-friend-mouse-on.svg";

interface FriendContextMenuProps {
  friend: Friend;
  position: { top: number; left: number };
  onDelete: () => void;
  isDeleting: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
}

export const FriendContextMenu: React.FC<FriendContextMenuProps> = ({
  friend,
  position,
  onDelete,
  isDeleting,
  modalRef,
}) => {
  const statusColor =
    friend.status === "online"
      ? "var(--color-alert-online)"
      : "var(--color-text-light)";

  // 5. 메시지 모달 상태 관리
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  // 6. 메시지 전송 함수 가져오기
  const { sendMessage } = useUserMessages();

  // 7. 메시지 전송 핸들러
  const handleSend = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    try {
      await sendMessage(friend.id, title, body);
      setIsMessageOpen(false); // 성공 시 닫기
    } catch (error) {
      console.error("Failed to send message:", error);
      // UserMessageReply 컴포넌트가 자체적으로 에러 알림을 띄웁니다.
      // 여기서 에러를 다시 throw해야 UserMessageReply가 catch할 수 있습니다.
      throw error;
    }
  };

  return (
    // 8. Portal을 형제로 두기 위해 Fragment(<>)로 감싸기
    <>
      <div
        ref={modalRef}
        // className="absolute w-[320px] h-[82px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 flex items-center px-4"
        className="fixed w-[330px] h-[82px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-1000 flex items-center px-4"
        style={{ top: position.top, left: position.left + 15 }}
      >
        <div className="relative w-12 h-12">
          <img
            src={friend.avatarUrl ?? friendsIcon}
            alt={friend.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-[var(--color-background-sub)]`}
            style={{ backgroundColor: statusColor }}
          />
        </div>

        <div className="ml-4 flex flex-col justify-center">
          <p className="font-medium text-[var(--color-text-main)]">
            {friend.name}
          </p>
          <p className="text-sm text-[var(--color-text-sub)] capitalize">
            {friend.status}
          </p>
        </div>

        {/* 친구 삭제 및 메세지 전송 버튼 */}
        <div className="ml-auto flex gap-2">
          <button
            className={`relative w-8 h-8 transition-transform hover:opacity-90 active:scale-95 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete Friend"
          >
            <img src={deleteFriendMouseOn} alt="delete" className="w-8 h-8" />
          </button>

          <button
            className="w-8 h-8 transition-transform hover:opacity-90 active:scale-95"
            aria-label="Send Message"
            onClick={() => setIsMessageOpen(true)}
          >
            <img src={messageIcon} className="w-8 h-8" alt="message" />
          </button>
        </div>
      </div>

      {/* 10. 메시지 작성 모달 렌더링 */}
      {isMessageOpen &&
        createPortal(
          <UserMessageReply
            title={`${friend.name}님에게 새 메시지`}
            onClose={() => setIsMessageOpen(false)}
            onSend={handleSend}
            isReply={false} // 새 메시지이므로 isReply=false
          />,
          document.body
        )}
    </>
  );
};
// import React from "react";
// import { type Friend } from "../../hooks/useFriends";
// import friendsIcon from "../../assets/person-circle-black.svg";
// import messageIcon from "../../assets/message.svg";
// import deleteFriendMouseOff from "../../assets/delete-friend-mouse-off.svg";
// import deleteFriendMouseOn from "../../assets/delete-friend-mouse-on.svg";

// interface FriendContextMenuProps {
//   friend: Friend;
//   position: { top: number; left: number };
//   onDelete: () => void;
//   isDeleting: boolean;
//   modalRef: React.RefObject<HTMLDivElement | null>;
// }

// export const FriendContextMenu: React.FC<FriendContextMenuProps> = ({
//   friend,
//   position,
//   onDelete,
//   isDeleting,
//   modalRef,
// }) => {
//   const statusColor =
//     friend.status === "online"
//       ? "var(--color-alert-online)"
//       : "var(--color-text-light)";

//   return (
//     <div
//       ref={modalRef}
//       className="absolute w-[320px] h-[82px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 flex items-center px-4"
//       style={{ top: position.top, left: position.left + 15}}
//     >
//       <div className="relative w-12 h-12">
//         <img
//           src={friend.avatarUrl ?? friendsIcon}
//           alt={friend.name}
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <span
//           className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-[var(--color-background-sub)]`}
//           style={{ backgroundColor: statusColor }}
//         />
//       </div>

//       <div className="ml-4 flex flex-col justify-center">
//         <p className="font-medium text-[var(--color-text-main)]">{friend.name}</p>
//         <p className="text-sm text-[var(--color-text-sub)] capitalize">{friend.status}</p>
//       </div>

//       <div className="ml-auto flex gap-2">
//         <button
//           className={`relative w-8 h-8 group ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
//           onClick={onDelete}
//           disabled={isDeleting}
//           aria-label="Delete Friend"
//         >
//           <img
//             src={deleteFriendMouseOff}
//             alt="delete"
//             className="w-8 h-8 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
//           />
//           <img
//             src={deleteFriendMouseOn}
//             alt="delete hover"
//             className="w-8 h-8 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//           />
//         </button>

//         <button className="w-8 h-8" aria-label="Send Message">
//           <img src={messageIcon} className="w-8 h-8" alt="message" />
//         </button>
//       </div>
//     </div>
//   );
// };
