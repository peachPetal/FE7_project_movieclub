import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";

interface NotificationModalProps {
  position: { top: number; left: number };
  modalRef: React.RefObject<HTMLDivElement | null>;
  userId: string | undefined;
  data: Message[];
  isLoading: boolean;
}

export interface Message {
  id: number;
  title: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  read?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  position,
  modalRef,
  userId,
  data: messages,
  isLoading,
}) => {
  const navigate = useNavigate();

  const handleMessageClick = async (msg: Message) => {
    if (!userId) return;

    try {
      await supabase
        .from("friends_messages")
        .update({ read: true })
        .eq("id", msg.id);

      navigate("/users", {
        state: {
          selectedUserId: userId,
          senderIdToShow: msg.sender_id,
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
      className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-60 px-4 py-3 overflow-y-auto"
      style={{ top: position.top, left: position.left + 15 }}
    >
      {isLoading ? (
        <p className="text-[var(--color-text-main)] text-center">
          알림을 불러오는 중...
        </p>
      ) : messages.length === 0 ? (
        <p className="text-[var(--color-text-main)] text-center">
          새 알림이 없습니다.
        </p>
      ) : (
        messages.map((msg) => (
          <button
            type="button"
            key={msg.id}
            onClick={() => handleMessageClick(msg)} // ✅ msg 객체 전체 전달
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

// // src/components/layouts/sidebar/NotificationModal.tsx
// import React, { useEffect, useState } from "react";
// // 1. useNavigate 훅 임포트
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../utils/supabase";

// interface NotificationModalProps {
//   position: { top: number; left: number };
//   modalRef: React.RefObject<HTMLDivElement | null>;
//   userId: string | undefined;
// }

// interface Message {
//   id: number;
//   title: string;
//   created_at: string;
//   sender_id: string;
//   receiver_id: string;
//   text: string;
// }

// export const NotificationModal: React.FC<NotificationModalProps> = ({
//   position,
//   modalRef,
//   userId,
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   // 2. navigate 함수 초기화
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       // sender_id를 명시적으로 select
//       const { data, error } = await supabase
//         .from("friends_messages")
//         .select("id, title, created_at, sender_id, receiver_id, text")
//         .eq("receiver_id", userId)
//         .order("created_at", { ascending: false });

//       const messages = data as Message[];

//       if (error) {
//         console.error("Error fetching messages:", error);
//       } else {
//         setMessages(messages);
//       }
//     };
    
//     if (userId) { // userId가 있을 때만 실행
//       fetchMessages();
//     }
//   }, [userId]);

//   /**
//    * 3. 메시지 클릭 핸들러
//    * @param id 이동할 사용자의 ID
//    */
//   // [수정] 파라미터 이름을 senderId에서 id로 변경 (더 일반적)
//   const handleMessageClick = (id: string) => {
//     // /users 페이지로 이동
//     navigate('/users', {
//       // state를 통해 UsersPage가 어떤 사용자를 선택하고
//       // 메시지 창을 열어야 하는지 알려줍니다.
//       state: {
//         selectedUserId: id,
//         openMessages: true,
//       },
//     });
//   };

//   return (
//     <div
//       ref={modalRef}
//       className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4 py-3 overflow-y-auto"
//       style={{ top: position.top, left: position.left + 15 }}
//     >
//       {messages.length === 0 ? (
//         <p className="text-[var(--color-text-main)] text-center">
//           새 알림이 없습니다.
//         </p>
//       ) : (
//         messages.map((msg) => (
//           <button // 4. p 태그를 button으로 변경하여 접근성 향상
//             type="button"
//             key={msg.id}
//             onClick={() => handleMessageClick(msg.receiver_id)}
//             className="
//               w-full // 버튼이므로 너비 100%
//               text-[var(--color-text-main)] 
//               py-2 
//               px-2 // 패딩 추가
//               text-center // 텍스트 정렬
//               truncate // 긴 제목은 잘라냄
//               cursor-pointer
//               rounded-md
//               hover:bg-[var(--color-background-hover)]
//               hover:shadow-md
//               transition-all duration-200
//             "
//             title={msg.title} // 툴팁으로 전체 제목 표시
//           >
//             {msg.title}
//           </button>
//         ))
//       )}
//     </div>
//   );
// };
// // src/components/layouts/sidebar/NotificationModal.tsx
// import React, { useEffect, useState } from "react";
// import { supabase } from "../../utils/supabase";

// interface NotificationModalProps {
//   position: { top: number; left: number };
//   modalRef: React.RefObject<HTMLDivElement | null>;
//   userId: string | undefined;
// }

// interface Message {
//   id: number;
//   title: string;
//   created_at: string;
//   sender_id: string;
//   receiver_id: string;
//   text: string;
// }

// export const NotificationModal: React.FC<NotificationModalProps> = ({
//   position,
//   modalRef,
//   userId,
// }) => {
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("friends_messages")
//         .select("id, title, created_at, sender_id, receiver_id, text")
//         .eq("receiver_id", userId)
//         .order("created_at", { ascending: false });

//       const messages = data as Message[];

//       if (error) {
//         console.error("Error fetching messages:", error);
//       } else {
//         setMessages(messages);
//       }
//     };

//     fetchMessages();
//   }, [userId]);

//   return (
//     <div
//       ref={modalRef}
//       className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4 py-3 overflow-y-auto"
//       style={{ top: position.top, left: position.left + 15 }}
//     >
//       {messages.length === 0 ? (
//         <p className="text-[var(--color-text-main)] text-center">
//           새 알림이 없습니다.
//         </p>
//       ) : (
//         messages.map((msg) => (
//           <p
//             key={msg.id}
//             className="
//           text-[var(--color-text-main)] 
//           py-2 
//           text-center 
//           cursor-pointer
//           rounded-md
//           hover:bg-[var(--color-background-hover)]
//           hover:shadow-md
//           transition-all duration-200
//         "
//           >
//             {msg.title}
//           </p>
//         ))
//       )}
//     </div>
//   );
// };