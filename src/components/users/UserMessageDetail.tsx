// src/components/users/UserMessageDetail.tsx
import { type FC, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../utils/supabase";
import { useUserMessages } from "../../hooks/useUserMessages";
import UserMessageReply from "./UserMessageReply";

// --- 타입 정의 ---
export type MessageDetailData = {
  id: string;
  title: string;
  bodyMine: string;
  bodyFriend: string;
  senderId?: string;
};

// --- 서브 컴포넌트 ---
type MessageBlockProps = {
  label: string;
  content: string;
};

const MessageBlock: FC<MessageBlockProps> = ({ label, content }) => (
  <article>
    <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p>
    <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
      {content}
    </pre>
  </article>
);

// --- 메인 컴포넌트 ---
type Props = {
  message: MessageDetailData;
  onReplySent?: () => void; // ✅ 답장 전송 콜백 (onReply 제거)
};

// ❌ openReplyOnLoad prop 제거
const UserMessageDetail: FC<Props> = ({ message, onReplySent }) => {
  // ❌ openReplyOnLoad 관련 로직 제거
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [senderName, setSenderName] = useState<string | null>(null);

  // 훅에서 sendMessage 함수를 가져옴
  const { sendMessage } = useUserMessages();

  // message.senderId가 바뀔 때마다 이름 조회
  useEffect(() => {
    if (!message.senderId) {
      setSenderName("보낸 사람");
      return;
    }

    const fetchSenderName = async () => {
      setSenderName(null); // 로딩 중
      try {
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", message.senderId)
          .single();

        if (error) throw error;
        setSenderName(data ? data.name : "알 수 없는 사용자");
      } catch (err) {
        console.error("Sender name fetch error:", err);
        setSenderName("사용자명 로드 실패");
      }
    };

    fetchSenderName();
  }, [message.senderId]);

  /**
   * 답장 전송 핸들러
   */
  const handleSendReply = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    if (!message.senderId) {
      alert("보낸 사람을 알 수 없어 답장할 수 없습니다.");
      return;
    }

    try {
      await sendMessage(message.senderId, title, body);
      onReplySent?.(); // ✅ 부모에게 전송 완료 알림
      setIsReplyOpen(false); // 성공 시 모달 닫기
    } catch (err) {
      console.error("Reply send failed:", err);
      // 실패 알림은 UserMessageReply에서 이미 처리
      // alert("답장 전송에 실패했습니다.");
      
      // UserMessageReply 컴포넌트가 catch에서 오류를 throw하게 하려면
      // 여기서 re-throw를 해줘야 합니다.
      throw err;
    }
  };

  return (
    <>
      <div
        className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        role="region"
        aria-label={`${message.title} 상세`}
      >
        <div className="flex h-full flex-col">
          <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

          <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
            {message.bodyMine && (
              <MessageBlock
                label="이전에 내가 보낸 메시지"
                content={message.bodyMine}
              />
            )}

            <MessageBlock
              label={
                senderName ? `${senderName}님이 보낸 메시지` : "메시지 로딩 중..."
              }
              content={message.bodyFriend}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
              onClick={() => setIsReplyOpen(true)} // 자체 state로 모달 열기
            >
              답장
            </button>
          </div>
        </div>
      </div>

      {/* 모달 렌더링 로직 */}
      {isReplyOpen &&
        createPortal(
          <UserMessageReply
            title={`${senderName}님에게 답장`}
            onClose={() => setIsReplyOpen(false)}
            onSend={handleSendReply} // onSend 핸들러 전달
          />,
          document.body
        )}
    </>
  );
};

export default UserMessageDetail;
// // src/components/users/UserMessageDetail.tsx
// import { type FC, useState, useEffect } from "react";
// import { createPortal } from "react-dom"; // 1. createPortal 임포트
// import { supabase } from "../../utils/supabase";
// import { useUserMessages } from "../../hooks/useUserMessages"; // 2. 훅 임포트
// import UserMessageReply from "./UserMessageReply"; // 3. 모달 임포트

// // --- 타입 정의 ---
// export type MessageDetailData = {
//   id: string;
//   title: string;
//   bodyMine: string; // (현재 "받은 편지함" 로직에서는 비어있음)
//   bodyFriend: string;
//   senderId?: string; // (이전 단계에서 추가됨)
// };

// // --- 서브 컴포넌트 (label을 다시 받도록 수정) ---
// type MessageBlockProps = {
//   label: string;
//   content: string;
// };

// const MessageBlock: FC<MessageBlockProps> = ({ label, content }) => (
//   <article>
//     <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p>
//     <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
//       {content}
//     </pre>
//   </article>
// );

// // --- 메인 컴포넌트 ---
// type Props = {
//   message: MessageDetailData;
//   onReply?: () => void; // (이 prop은 이제 버튼에서 직접 사용되지 않음)
// };

// const UserMessageDetail: FC<Props & { openReplyOnLoad?: boolean }> = ({ message, openReplyOnLoad }) => {
//   const [isReplyOpen, setIsReplyOpen] = useState(openReplyOnLoad ?? false);

//   useEffect(() => {
//     if (openReplyOnLoad) setIsReplyOpen(true);
//   }, [openReplyOnLoad]);

//   // --- States ---
//   const [senderName, setSenderName] = useState<string | null>(null);

//   // --- Hooks ---
//   // 5. sendMessage 함수를 훅에서 가져옴
//   //    (훅 초기화 시 peerUserId는 null을 전달. sendMessage 함수만 필요하기 때문)
//   const { sendMessage } = useUserMessages();

//   // 7. message.senderId가 바뀔 때마다 이름 조회 (이전 단계와 동일)
//   useEffect(() => {
//     if (!message.senderId) {
//       setSenderName("보낸 사람");
//       return;
//     }

//     const fetchSenderName = async () => {
//       setSenderName(null); // 로딩 중
//       try {
//         const { data, error } = await supabase
//           .from("users") // (테이블명은 실제 환경에 맞게)
//           .select("name")
//           .eq("id", message.senderId)
//           .single();

//         if (error) throw error;
//         setSenderName(data ? data.name : "알 수 없는 사용자");
//       } catch (err) {
//         console.error("Sender name fetch error:", err);
//         setSenderName("사용자명 로드 실패");
//       }
//     };

//     fetchSenderName();
//   }, [message.senderId]);

//   /**
//    * 6. [추가] 답장 전송 핸들러
//    */
//   const handleSendReply = async ({ title, body }: { title: string, body: string }) => {
//     if (!message.senderId) {
//       alert("보낸 사람을 알 수 없어 답장할 수 없습니다.");
//       return;
//     }
    
//     try {
//       // 받는 사람(receiver): 원본 메시지의 보낸 사람(message.senderId)
//       // 보내는 사람(sender): 훅 내부에서 'me'로 자동 설정됨
//       await sendMessage(message.senderId, title, body);
//       setIsReplyOpen(false); // 성공 시 모달 닫기
//     } catch (err) {
//       console.error("Reply send failed:", err);
//       alert("답장 전송에 실패했습니다.");
//     }
//   };

//   return (
//     // 7. Fragment(<>)로 감싸서 모달을 포함
//     <>
//       <div
//         className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//         role="region"
//         aria-label={`${message.title} 상세`}
//       >
//         <div className="flex h-full flex-col">
//           <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

//           <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
//             {/* ... (bodyMine 렌더링 로직) ... */}
//             {message.bodyMine && (
//               <MessageBlock
//                 label="이전에 내가 보낸 메시지"
//                 content={message.bodyMine}
//               />
//             )}
            
//             {/* ... (bodyFriend 렌더링 로직) ... */}
//             <MessageBlock
//               label={senderName ? `${senderName}님이 보낸 메시지` : "메시지 로딩 중..."}
//               content={message.bodyFriend}
//             />
//           </div>

//           <div className="mt-4 flex justify-end">
//             <button
//               type="button"
//               className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
//               onClick={() => setIsReplyOpen(true)} // 8. onReply 대신 모달 열기
//             >
//               답장
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 9. 모달 렌더링 로직 추가 */}
//       {isReplyOpen &&
//         createPortal(
//           <UserMessageReply
//             title={`${senderName}님에게 답장`} // 답장 제목 자동 완성
//             onClose={() => setIsReplyOpen(false)}
//             onSend={handleSendReply} // onSend 핸들러 전달
//           />,
//           document.body
//         )}
//     </>
//   );
// };

// export default UserMessageDetail;
// // src/components/users/UserMessageDetail.tsx
// import { type FC, useState, useEffect } from "react"; // 👈 1. useState, useEffect 추가
// import { supabase } from "../../utils/supabase"; // 👈 2. supabase import 추가

// // --- 타입 정의 ---
// export type MessageDetailData = {
//   id: string;
//   title: string;
//   bodyMine: string; // (현재 "받은 편지함" 로직에서는 비어있음)
//   bodyFriend: string;
//   senderId?: string; // 👈 3. senderId를 받도록 타입에 추가
// };

// // --- 서브 컴포넌트 (label을 다시 받도록 수정) ---
// type MessageBlockProps = {
//   label: string; // 👈 4. label prop 활성화
//   content: string;
// };

// const MessageBlock: FC<MessageBlockProps> = ({ label, content }) => (
//   <article>
//     {/* 5. label 주석 해제 */}
//     <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p>
//     <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
//       {content}
//     </pre>
//   </article>
// );

// // --- 메인 컴포넌트 ---
// type Props = {
//   message: MessageDetailData;
//   onReply?: () => void;
// };

// const UserMessageDetail: FC<Props> = ({ message, onReply }) => {
//   // 👈 6. 보낸 사람 이름을 저장할 state 추가
//   const [senderName, setSenderName] = useState<string | null>(null);

//   // 👈 7. message.senderId가 바뀔 때마다 실행되는 effect 추가
//   useEffect(() => {
//     // senderId가 없으면 아무것도 안 함
//     if (!message.senderId) {
//       setSenderName("보낸 사람"); // 폴백
//       return;
//     }

//     // 이름 조회 함수
//     const fetchSenderName = async () => {
//       setSenderName(null); // 이전 이름 리셋 (로딩 표시)
//       try {
//         // 'users' 테이블에서 senderId에 해당하는 name 조회 (테이블명은 실제 환경에 맞게)
//         const { data, error } = await supabase
//           .from("users") // 👈 (가정) 실제 사용자 테이블명으로 변경하세요.
//           .select("name")
//           .eq("id", message.senderId)
//           .single();

//         if (error) throw error;

//         if (data) {
//           setSenderName(data.name);
//         } else {
//           setSenderName("알 수 없는 사용자");
//         }
//       } catch (err) {
//         console.error("Sender name fetch error:", err);
//         setSenderName("사용자명 로드 실패");
//       }
//     };

//     fetchSenderName();
//   }, [message.senderId]); // message.senderId가 변경될 때마다 다시 조회

//   return (
//     <div
//       className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//       role="region"
//       aria-label={`${message.title} 상세`}
//     >
//       <div className="flex h-full flex-col">
//         <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

//         <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
//           {/* (받은 편지함이므로 bodyMine은 비어있지만, 만약을 위해 조건부 렌더링) */}
//           {message.bodyMine && (
//             <MessageBlock
//               label="이전에 내가 보낸 메시지"
//               content={message.bodyMine}
//             />
//           )}

//           {/* 👈 8. label에 state 바인딩 */}
//           <MessageBlock
//             label={senderName ? `${senderName}님이 보낸 메시지` : "메시지 로딩 중..."}
//             content={message.bodyFriend}
//           />
//         </div>

//         <div className="mt-4 flex justify-end">
//              <button
//                type="button"
//                className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
//                onClick={onReply}
//              >
//                답장
//              </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserMessageDetail;

// import type { FC } from "react";

// // --- 타입 정의 ---
// export type MessageDetailData = {
//   id: string;
//   title: string;
//   bodyMine: string;
//   bodyFriend: string;
// };

// // --- 서브 컴포넌트 ---
// // 반복되는 메시지 블록을 위한 재사용 컴포넌트
// type MessageBlockProps = {
//   // label: string;
//   content: string;
// };

// const MessageBlock: FC<MessageBlockProps> = ({ content }) => (
//   <article>
//     {/* <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p> */}
//     <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
//       {content}
//     </pre>
//   </article>
// );

// // --- 메인 컴포넌트 ---
// type Props = {
//   message: MessageDetailData;
//   onReply?: () => void;
// };

// const UserMessageDetail: FC<Props> = ({ message, onReply }) => {
//   return (
//     <div
//       className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//       role="region"
//       aria-label={`${message.title} 상세`}
//     >
//       <div className="flex h-full flex-col">
//         <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

//         <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
//           {/* 1. 분리된 MessageBlock 컴포넌트 사용 */}
//           {/* <MessageBlock
//             label="이전에 내가 보낸 메시지"
//             content={message.bodyMine}
//           /> */}
//           <MessageBlock
//             // label="친구가 보낸 메시지"
//             content={message.bodyFriend}
//           />
//         </div>

//         <div className="mt-4 flex justify-end">
//           <button
//             type="button"
//             className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
//             onClick={onReply}
//           >
//             답장
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserMessageDetail;
