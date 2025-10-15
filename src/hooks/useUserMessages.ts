import { useState, useEffect, useMemo, useCallback } from "react";
import type { MessageDetailData } from "../components/users/UserMessageDetail";

// MessageItem 타입을 훅 파일에서도 사용할 수 있도록 export 합니다.
export type MessageItem = MessageDetailData & {
  unread: boolean;
};

// 목업 데이터를 생성하는 함수 (나중에 실제 API 호출로 대체 가능)
const fetchMockMessages = (userId: string): MessageItem[] => {
  console.log(`Fetching messages for user: ${userId}`); // 유저 변경 시 호출 확인용
  return [
    { id: "1", title: "첫 번째 메시지", unread: true, bodyMine: "...", bodyFriend: "..." },
    { id: "2", title: "두 번째 메시지", unread: true, bodyMine: "...", bodyFriend: "..." },
    { id: "3", title: "세 번째 메시지", unread: false, bodyMine: "...", bodyFriend: "..." },
  ];
};

/**
 * 특정 유저의 메시지 목록을 관리하는 커스텀 훅
 * @param userId 메시지를 가져올 유저의 ID
 */
export function useUserMessages(userId: string) {
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // userId가 변경되면 메시지 데이터를 다시 "가져옵니다".
  useEffect(() => {
    const userMessages = fetchMockMessages(userId);
    setMessages(userMessages);
  }, [userId]);

  // 특정 메시지를 읽음 처리하는 함수
  const markAsRead = useCallback((messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.map((msg) =>
        msg.id === messageId ? { ...msg, unread: false } : msg
      )
    );
  }, []);

  return { messages, markAsRead };
}