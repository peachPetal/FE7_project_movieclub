import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

interface NotificationModalProps {
  position: { top: number; left: number };
  modalRef: React.RefObject<HTMLDivElement | null>;
  userId: string | undefined;
}

interface Message {
  id: number;
  title: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  text: string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  position,
  modalRef,
  userId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("friends_messages")
        .select("id, title, created_at, sender_id, receiver_id, text")
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });

      const messages = data as Message[];

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(messages);
      }
    };

    fetchMessages();
  }, [userId]);

  return (
    <div
      ref={modalRef}
      className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4 py-3 overflow-y-auto"
      style={{ top: position.top, left: position.left + 15 }}
    >
      {messages.length === 0 ? (
        <p className="text-[var(--color-text-main)] text-center">
          새 알림이 없습니다.
        </p>
      ) : (
        messages.map((msg) => (
          <p
            key={msg.id}
            className="
          text-[var(--color-text-main)] 
          py-2 
          text-center 
          cursor-pointer
          rounded-md
          hover:bg-[var(--color-background-hover)]
          hover:shadow-md
          transition-all duration-200
        "
          >
            {msg.title}
          </p>
        ))
      )}
    </div>
  );
};