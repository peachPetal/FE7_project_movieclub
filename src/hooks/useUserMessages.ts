// src/hooks/useUserMessages.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../utils/supabase";
// UserMessageDetail의 타입을 직접 import
import type { MessageDetailData } from "../components/users/UserMessageDetail";

export type MessageItem = MessageDetailData & {
  unread: boolean;
  createdAt?: string;
  senderId?: string;
  receiverId?: string;
};

type FriendsMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  title: string;
  text: string;
  created_at: string;
};

/**
 * [수정됨] 로그인한 사용자가 특정 "상대 유저"로부터 '받은' 메시지 목록을 불러오는 훅
 * @param peerUserId 메시지를 보낸 '상대 유저'의 ID
 */
export function useUserMessages() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reqTokenRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    // if (!peerUserId) {
    //   setMessages([]);
    //   return;
    // }

    setIsLoading(true);
    setError(null);
    const myReqToken = ++reqTokenRef.current;

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const me = userData.user?.id;
      if (!me) {
        setIsLoading(false);
        setError("로그인이 필요합니다.");
        setMessages([]);
        return;
      }

      // "받은 편지함" 쿼리
      const { data, error: msgErr } = await supabase
        .from("friends_messages")
        .select("id, sender_id, receiver_id, title, text, created_at")
        .eq("receiver_id", me) // 👈 1. 받는 사람이 '나'
        .order("created_at", { ascending: false }) // 최신순
        .returns<FriendsMessageRow[]>();

      if (msgErr) throw msgErr;
      if (myReqToken !== reqTokenRef.current) return;

      // 3. [수정] 매핑 로직 (받은 메시지이므로 bodyMine은 항상 "")
      const mapped: MessageItem[] = (data || []).map((row) => {
        return {
          id: row.id,
          title: row.title ?? "",
          bodyMine: "", // "받은" 메시지이므로 '내'가 보낸 본문은 없음
          bodyFriend: row.text ?? "", // "상대"가 보낸 본문
          unread: false, 
          createdAt: row.created_at,
          senderId: row.sender_id, // 👈 Rule 3 (발신자 정보)
          receiverId: row.receiver_id,
        };
      });

      setMessages(mapped);
    } catch (e: unknown) {
      console.error("[useUserMessages] fetchMessages error:", e);
      setError(
        e instanceof Error ? e.message : "메시지를 불러오지 못했습니다."
      );
      setMessages([]);
    } finally {
      if (myReqToken === reqTokenRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = useCallback((messageId: string) => {
    // TODO: DB에 is_read 컬럼이 있다면 여기서 update 쿼리 실행
    setMessages((current) =>
      current.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
    );
  }, []);

  const refetch = useCallback(async () => {
    await fetchMessages();
  }, [fetchMessages]);

  /**
   * [추가됨] 메시지 전송 함수
   * - UserMessageList에서 insert 로직을 직접 구현하는 대신 훅을 통해 제공
   * - auth.getUser()로 안전하게 sender_id(me)를 가져옴
   */
  const sendMessage = useCallback(
    async (peerId: string, title: string, text: string) => {
      const { data: userData } = await supabase.auth.getUser();
      const senderId = userData.user?.id;
      if (!senderId) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase.from("friends_messages").insert({
        sender_id: senderId,
        receiver_id: peerId,
        title,
        text,
      });

      if (error) throw error;
      
      // 참고: "받은 편지함"이므로 refetch()를 호출해도
      // 방금 "보낸" 메시지는 목록에 나타나지 않는 것이 정상입니다.
    },
    [] // fetchMessages를 의존성에서 제거 (UX 정책)
  );

  // [수정됨] sendMessage 반환
  return { messages, isLoading, error, markAsRead, refetch, sendMessage };
}

// import { useState, useEffect, useCallback, useRef } from "react";
// import { supabase } from "../utils/supabase";
// import type { MessageDetailData } from "../components/users/UserMessageDetail";

// /**
//  * UI에서 쓰는 메시지 아이템 타입
//  * - detail 패널에서 요구하는 shape에 맞춰 title/bodyMine/bodyFriend를 제공
//  * - unread는 현재 DB 스키마에 없으므로 클라이언트 상태로만 관리(로컬)
//  */
// export type MessageItem = MessageDetailData & {
//   unread: boolean;
//   // 확장 필드(필요 시 사용)
//   createdAt?: string;
//   senderId?: string;
//   receiverId?: string;
// };

// /**
//  * DB friends_messages 테이블 Row 타입
//  * (컬럼명은 사용자님 스키마에 맞춤: sender_id / receiver_id / title / text / created_at / id)
//  */
// type FriendsMessageRow = {
//   id: string;
//   sender_id: string;
//   receiver_id: string;
//   title: string;
//   text: string;
//   created_at: string;
// };

// /**
//  * 특정 "상대 유저"와 주고받은 메시지 목록을 불러오는 커스텀 훅
//  * @param peerUserId 메시지를 주고받는 '상대 유저'의 ID
//  *
//  * - 현재 로그인 유저 ID는 훅 내부에서 Supabase Auth로 가져옵니다.
//  * - RLS 정책:
//  *   SELECT: (sender_id = auth.uid() OR receiver_id = auth.uid())
//  *   INSERT: (sender_id = auth.uid())
//  */
// export function useUserMessages(peerUserId: string | null | undefined) {
//   const [messages, setMessages] = useState<MessageItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // 최신 요청만 반영하기 위한 요청 토큰
//   const reqTokenRef = useRef(0);

//   /**
//    * Supabase에서
//    *   (sender_id = me AND receiver_id = peer) OR (sender_id = peer AND receiver_id = me)
//    * 조건에 해당하는 메시지를 시간 역순으로 가져옵니다.
//    * 이후 UI에 맞는 MessageItem으로 매핑합니다.
//    */
//   const fetchMessages = useCallback(async () => {
//     // peer가 없으면 초기화 후 종료
//     if (!peerUserId) {
//       setMessages([]);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     const myReqToken = ++reqTokenRef.current;

//     try {
//       // 현재 로그인 유저
//       const { data: userData, error: userErr } = await supabase.auth.getUser();
//       if (userErr) throw userErr;
//       const me = userData.user?.id;
//       if (!me) {
//         setIsLoading(false);
//         setError("로그인이 필요합니다.");
//         setMessages([]);
//         return;
//       }

//       // (me <-> peer) 간의 모든 메시지 조회
//       // Supabase 쿼리: OR 조건은 or() 사용. 컬럼은 sender_id / receiver_id.
//       // 정렬: 최신순 (created_at DESC)
//       const { data, error: msgErr } = await supabase
//         .from("friends_messages")
//         .select("id, sender_id, receiver_id, title, text, created_at")
//         // .or(
//         //   `and(sender_id.eq.${me},receiver_id.eq.${peerUserId}),and(sender_id.eq.${peerUserId},receiver_id.eq.${me})`
//         // )
//         .eq("receiver_id", peerUserId)
//         .order("created_at", { ascending: false })
//         .returns<FriendsMessageRow[]>();

//       if (msgErr) throw msgErr;

//       // 요청이 이미 더 최신 요청에게 추월당했다면 무시
//       if (myReqToken !== reqTokenRef.current) return;

//       // DB Row → UI에서 쓰는 구조로 매핑
//       const mapped: MessageItem[] = (data || []).map((row) => {
//         const isMine = row.receiver_id === me;
//         return {
//           id: row.id,
//           title: row.title ?? "",
//           bodyMine: isMine ? row.text ?? "" : "",
//           bodyFriend: !isMine ? row.text ?? "" : "",
//           unread: false, // DB에 unread 스키마가 없으므로 기본 false (원하면 로컬로 관리)
//           createdAt: row.created_at,
//           senderId: row.sender_id,
//           receiverId: row.receiver_id,
//         };
//       });

//       setMessages(mapped);
//     } catch (e: unknown) {
//       console.error("[useUserMessages] fetchMessages error:", e);
//       setError(
//         e instanceof Error ? e.message : "메시지를 불러오지 못했습니다."
//       );
//       setMessages([]);
//     } finally {
//       if (myReqToken === reqTokenRef.current) {
//         setIsLoading(false);
//       }
//     }
//   }, [peerUserId]);

//   // peerUserId가 바뀌면 자동으로 1회 조회
//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   /**
//    * 읽음 처리 (로컬 전용)
//    * - 현재 스키마엔 읽음 여부 컬럼이 없으므로 UI 상태로만 처리합니다.
//    * - 추후 스키마에 read_at 같은 컬럼이 추가되면,
//    *   여기서 supabase.update()로 서버에도 반영하면 됩니다.
//    */
//   const markAsRead = useCallback((messageId: string) => {
//     setMessages((current) =>
//       current.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
//     );
//   }, []);

//   /**
//    * 외부에서 강제로 목록 재조회가 필요할 때 호출
//    * (예: 메시지 전송 성공 직후 UsersPage에서 refreshKey++ → UserMessageList에서 refetch())
//    */
//   const refetch = useCallback(async () => {
//     await fetchMessages();
//   }, [fetchMessages]);

//   return { messages, isLoading, error, markAsRead, refetch };
// }
