// src/components/users/UserMessageList.tsx
import { useState, useCallback, useEffect } from "react";
import type { AppUser } from "../../types/appUser";
import type { MessageDetailData } from "./UserMessageDetail";
import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages";
import clsx from "clsx";
import { createPortal } from "react-dom";
import UserMessageReply from "./UserMessageReply";

type MessageListItemProps = {
  message: MessageItem;
  isActive: boolean;
  onClick: (id: string) => void;
};

const MessageListItem: React.FC<MessageListItemProps> = ({
  message,
  isActive,
  onClick,
}) => (
  <li>
    <button
      type="button"
      onClick={() => onClick(message.id)}
      aria-current={isActive}
      className={clsx(
        "flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors cursor-pointer",
        {
          "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]": isActive,
          "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]":
            !isActive,
        }
      )}
    >
      <span className="truncate">{message.title}</span>
      {!message.read && (
        <span
          className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
          aria-label="읽지 않음"
          title="읽지 않음"
        />
      )}
    </button>
  </li>
);

type Props = {
  user: AppUser;
  currentUserId: string | undefined;
  onSelect?: (message: MessageDetailData | null) => void;
  refreshKey?: number;
  onMessageSent?: () => void; // ✅ 새 메시지 전송 콜백 추가
};

export default function UserMessageList({
  user,
  currentUserId,
  onSelect,
  refreshKey,
  onMessageSent, // ✅
}: Props) {
  const isOwnProfile = user.id === currentUserId;

  // 훅에서 sendMessage를 받아옵니다.
  const { messages, markAsRead, refetch, sendMessage } = useUserMessages();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 다른 유저 프로필을 볼 때 메시지 작성 모달이 기본으로 열리도록 설정
  const [isComposeOpen, setIsComposeOpen] = useState(!isOwnProfile);

  useEffect(() => {
    if (isOwnProfile && typeof refetch === "function") {
      refetch();
    }
    setSelectedId(null);
  }, [user.id, refreshKey, refetch, isOwnProfile]); 

  const handleSelect = useCallback(
    (id: string) => {
      const newSelectedId = selectedId === id ? null : id;
      setSelectedId(newSelectedId);

      if (newSelectedId) {
        markAsRead(newSelectedId);
      }

      const raw = newSelectedId
        ? messages.find((m) => m.id === newSelectedId) || null
        : null;

      // 데이터 매핑 (훅이 반환하는 shape를 그대로 사용)
      const selectedMessageDetail: MessageDetailData | null = raw
        ? {
            id: raw.id,
            title: raw.title,
            bodyMine: raw.bodyMine,
            bodyFriend: raw.bodyFriend,
            senderId: raw.senderId,
          }
        : null;

      onSelect?.(selectedMessageDetail);
    },
    [selectedId, messages, markAsRead, onSelect]
  );

  return (
    <>
      {/* Rule 1 & 2: 내 프로필일 때만 받은 편지함 UI 렌더링 */}
      {isOwnProfile && (
        <section
          className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
          aria-label="내 받은 메시지 목록"
        >
          <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
          <ul className="flex flex-col gap-2">
            {messages.map((message) => (
              <MessageListItem
                key={message.id}
                message={message}
                isActive={selectedId === message.id}
                onClick={handleSelect}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Rule 6: 다른 유저 프로필일 때만 새 메시지 작성 모달 렌더링 */}
      {isComposeOpen && !isOwnProfile &&
        createPortal(
          <UserMessageReply
            title={`${user.name}님에게 새 메시지`}
            onClose={() => setIsComposeOpen(false)}
            onSend={async ({ title, body }) => {
              // 1. 훅의 sendMessage 사용
              await sendMessage(user.id, title, body);
              // 2. ✅ 부모에게 전송 완료 알림
              onMessageSent?.();
              // 3. 모달 닫기
              setIsComposeOpen(false);
            }}
            isReply={false}
          />,
          document.body
        )}
    </>
  );
}
// // src/components/users/UserMessageList.tsx (일부 수정)
// import { useState, useCallback, useEffect } from "react";
// import type { AppUser } from "../../types/appUser";
// import type { MessageDetailData } from "./UserMessageDetail";
// import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages";
// import clsx from "clsx";
// import { createPortal } from "react-dom";
// import UserMessageReply from "./UserMessageReply";

// type MessageListItemProps = {
//   message: MessageItem;
//   isActive: boolean;
//   onClick: (id: string) => void;
// };

// const MessageListItem: React.FC<MessageListItemProps> = ({
//   message,
//   isActive,
//   onClick,
// }) => (
//   <li>
//     <button
//       type="button"
//       onClick={() => onClick(message.id)}
//       aria-current={isActive}
//       className={clsx(
//         "flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors",
//         {
//           "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]": isActive,
//           "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]":
//             !isActive,
//         }
//       )}
//     >
//       <span className="truncate">{message.title}</span>
//       {message.unread && (
//         <span
//           className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
//           aria-label="읽지 않음"
//           title="읽지 않음"
//         />
//       )}
//     </button>
//   </li>
// );

// type Props = {
//   user: AppUser;
//   currentUserId: string | undefined;
//   onSelect?: (message: MessageDetailData | null) => void;
//   refreshKey?: number;
// };

// export default function UserMessageList({ user, currentUserId, onSelect, refreshKey }: Props) {
//   // [수정] 훅에서 sendMessage를 받아옵니다.
//   // 2. [추가] 내 프로필인지 여부 확인
//   const isOwnProfile = user.id === currentUserId;

//   const { messages, markAsRead, refetch, sendMessage } = useUserMessages();
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [isComposeOpen, setIsComposeOpen] = useState(!isOwnProfile);

//   useEffect(() => {
// // 3. [수정] 내 프로필을 볼 때만 받은 편지함을 refetch
//     if (isOwnProfile && typeof refetch === "function") {
//       refetch();
//     }
//     setSelectedId(null);
//   }, [user.id, refreshKey, refetch]);

//   const handleSelect = useCallback(
//     (id: string) => {
//       const newSelectedId = selectedId === id ? null : id;
//       setSelectedId(newSelectedId);

//       if (newSelectedId) {
//         markAsRead(newSelectedId);
//       }
      
//       const raw = newSelectedId
//         ? messages.find((m) => m.id === newSelectedId) || null
//         : null;

//       // [수정] 데이터 매핑 로직 수정
//       // 수정된 훅은 MessageDetailData의 shape와 일치하는
//       // { id, title, bodyMine: "", bodyFriend: "..." } 형태를 반환합니다.
//       // (raw as any).body 같은 위험한 코드를 제거하고 raw의 속성을 그대로 사용합니다.
//       const selectedMessageDetail: MessageDetailData | null = raw
//         ? {
//             id: raw.id,
//             title: raw.title,
//             bodyMine: raw.bodyMine, // 훅이 ""을 반환
//             bodyFriend: raw.bodyFriend, // 훅이 row.text를 반환
//             senderId: raw.senderId, // 👈 [수정] senderId를 여기에 추가
//           }
//         : null;

//       onSelect?.(selectedMessageDetail);
//     },
//     [selectedId, messages, markAsRead, onSelect]
//   );

//   return (
//     <>
// {isOwnProfile && (

//        <section
//          className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
// aria-label={
//            isOwnProfile 
//              ? "내 받은 메시지 목록" 
//              : `${user.name}님에게 메시지 보내기`
//          }
//        >
// {/* [수정] Rule 1 & 2: 내 프로필일 때만 받은 편지함 UI 렌더링 */}
//          {isOwnProfile && (
//            <>
//              <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
//              <ul className="flex flex-col gap-2">
//                {messages.map((message) => (
//                  <MessageListItem
//                    key={message.id}
//                    message={message}
//                    isActive={selectedId === message.id}
//                    onClick={handleSelect}
//                  />
//                ))}
//              </ul>
//            </>
//          )}
//       </section>)
// }

// {/* [수정] Rule 6: 모달도 다른 유저 프로필일 때만 렌더링 */}
//       {isComposeOpen && !isOwnProfile &&
//         createPortal(
//           <UserMessageReply
//             title={`${user.name}님에게 새 메시지`}
//             onClose={() => setIsComposeOpen(false)}
//             onSend={async ({ title, body }) => {
//               // 1. 훅의 sendMessage 사용
//               await sendMessage(user.id, title, body);
//               // 2. refetch() 제거 (수정된 훅에서 이미 제거됨)
//               // 3. 모달 닫기
//               setIsComposeOpen(false);
//             }}
//             isReply={false}
//           />,
//           document.body
//         )}
//     </>
//   );
// }

// import { useState, useCallback, useEffect } from "react";
// import type { AppUser } from "../../types/appUser";
// import type { MessageDetailData } from "./UserMessageDetail";
// import { useUserMessages, type MessageItem } from "../../hooks/useUserMessages"; // 1. 커스텀 훅과 타입 import
// import clsx from "clsx";

// import { createPortal } from "react-dom";
// import { supabase } from "../../utils/supabase";
// // import UserMessageReply from "./UserMessageReply";
// import UserMessageReply from "./UserMessageReply";


// type MessageListItemProps = {
//   message: MessageItem;
//   isActive: boolean;
//   onClick: (id: string) => void;
// };

// const MessageListItem: React.FC<MessageListItemProps> = ({
//   message,
//   isActive,
//   onClick,
// }) => (
//   <li>
//     <button
//       type="button"
//       onClick={() => onClick(message.id)}
//       aria-current={isActive}
//       className={clsx(
//         "flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors",
//         {
//           "bg-[var(--color-main-10)] ring-1 ring-[var(--color-main)]": isActive,
//           "bg-[var(--color-background-sub)] hover:bg-[var(--color-main-10)]":
//             !isActive,
//         }
//       )}
//     >
//       <span className="truncate">{message.title}</span>
//       {message.unread && (
//         <span
//           className="ml-3 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-alert)]"
//           aria-label="읽지 않음"
//           title="읽지 않음"
//         />
//       )}
//     </button>
//   </li>
// );

// type Props = {
//   user: AppUser;
//   currentUserId: string | undefined;
//   onSelect?: (message: MessageDetailData | null) => void;
//   refreshKey?: number;
// };

// export default function UserMessageList({ user, currentUserId, onSelect, refreshKey }: Props) {
//   // 데이터 로직을 커스텀 훅에 위임
//   const { messages, markAsRead, refetch } = useUserMessages(user.id);
//   // UI 상태(선택된 ID)만 직접 관리
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   // 메세지 보내기 모달 상태
//   const [isComposeOpen, setIsComposeOpen] = useState(false);

//   useEffect(() => {
//     // user 변경이나 상위에서 refreshKey가 증가할 때 목록 재조회
//     if (typeof refetch === "function") {
//       refetch();
//     }
//     // 선택 해제(옵션): 유저 전환 시 디테일 패널 초기화
//     setSelectedId(null);
//   }, [user.id, refreshKey, refetch]);

//   // 핸들러 로직 단순화
//   const handleSelect = useCallback(
//     (id: string) => {
//       const newSelectedId = selectedId === id ? null : id;
//       setSelectedId(newSelectedId);

//       if (newSelectedId) {
//         // 읽음 처리
//         markAsRead(newSelectedId);
//       }

//       // ✅ 부모가 기대하는 형태로 어댑트
//       const raw = newSelectedId
//         ? messages.find((m) => m.id === newSelectedId) || null
//         : null;

//       const selectedMessageDetail: MessageDetailData | null = raw
//         ? {
//             id: raw.id,
//             title: raw.title ?? "",
//             // 훅의 스키마에 따라 다를 수 있어 안전하게 any로 읽습니다.
//             bodyMine: raw.bodyMine ?? (raw as any).body ?? "",
//             bodyFriend: raw.bodyFriend ?? "",
//           }
//         : null;

//       onSelect?.(selectedMessageDetail);
//     },
//     [selectedId, messages, markAsRead, onSelect]
//   );

//   return (
//     <>
//       <section
//         className="card-shadow rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
//         aria-label={`${user.name}님과의 메시지 목록`}
//       >
//         <h4 className="mb-3 text-lg font-bold">받은 메시지</h4>
//         <ul className="flex flex-col gap-2">
//           {/* 서브 컴포넌트를 사용하여 렌더링 로직 위임 */}
//           {messages.map((message) => (
//             <MessageListItem
//               key={message.id}
//               message={message}
//               isActive={selectedId === message.id}
//               onClick={handleSelect}
//             />
//           ))}
//         </ul>
//         <div className="mt-4 flex justify-end">
//           {user.id !== currentUserId && (
//             <button
//               type="button"
//               className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:opacity-90"
//               onClick={() => setIsComposeOpen(true)}
//             >
//               메시지 보내기
//             </button>
//           )}
//         </div>
//       </section>
//       {isComposeOpen &&
//         createPortal(
//           <UserMessageReply
//             title={`${user.name}님에게 새 메시지`}
//             onClose={() => setIsComposeOpen(false)}
//             onSend={async ({ title, body }) => {
//               // 실패 시 throw → 폼 컴포넌트가 catch + alert
//               // const senderId = (await supabase.auth.getUser()).data.user?.id;
//               // if (!senderId) {
//               //   throw new Error("로그인이 필요합니다.");
//               // }

//               const { error } = await supabase.from("friends_messages").insert({
//                 sender_id: currentUserId,
//                 receiver_id: user.id,
//                 title,
//                 text: body,
//               });
//               if (error) throw error;

//               // ✅ 성공: 목록 즉시 갱신 + 모달 닫기
//               await refetch();
//               setIsComposeOpen(false);
//             }}
//           />,
//           document.body
//         )}
//     </>
//   );
// }
