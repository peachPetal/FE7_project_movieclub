import React from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages";

interface NotificationModalProps {
  position: { top: number; left: number };
  modalRef: React.RefObject<HTMLDivElement | null>;
  userId: string | undefined;
  queryClient: QueryClient;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  position,
  modalRef,
  userId,
  queryClient,
}) => {
  const navigate = useNavigate();
  const {
    messages: unreadMessages,
    isLoading,
    markAsRead,
  } = useUserMessages({ filter: 'unread' });

  const handleMessageClick = async (msg: MessageItem) => { 
    if (!userId) return;

    try {
      await markAsRead(msg.id);

      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });

      navigate("/users", {
        state: {
          selectedUserId: userId,
          openMessages: true,
        },
      });
    } catch (error) {
      console.error("메시지 읽음 처리 중 오류:", error);
    }
  };

  return (
    <div
      ref={modalRef}
      data-ignore-outside-click="true"
      className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-60 px-4 py-3 overflow-y-auto"
      style={{ top: position.top, left: position.left + 15 }}
    >
      {isLoading ? (
        <p className="text-[var(--color-text-main)] text-center">
          알림을 불러오는 중...
        </p>
      ) : unreadMessages.length === 0 ? (
        <p className="text-[var(--color-text-main)] text-center">
          새 알림이 없습니다.
        </p>
      ) : (
        unreadMessages.map((msg) => (
          <button
            key={msg.id}
            type="button"
            onClick={() => handleMessageClick(msg)}
            className="
              w-full
              text-[var(--color-text-main)]
              py-2
              px-2
              text-center
              truncate
              cursor-pointer
              rounded-md
              hover:bg-[var(--color-background-hover)]
              hover:shadow-md
              transition-all duration-200
            "
            title={msg.title}
          >
            {msg.title}
          </button>
        ))
      )}
    </div>
  );
};