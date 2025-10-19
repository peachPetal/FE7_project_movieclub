import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../utils/supabase";
import type { MessageDetailData } from "../components/users/UserMessageDetail";

/**
 * UI에서 쓰는 메시지 아이템 타입
 * - detail 패널에서 요구하는 shape에 맞춰 title/bodyMine/bodyFriend를 제공
 * - unread는 현재 DB 스키마에 없으므로 클라이언트 상태로만 관리(로컬)
 */
export type MessageItem = MessageDetailData & {
  unread: boolean;
  // 확장 필드(필요 시 사용)
  createdAt?: string;
  senderId?: string;
  receiverId?: string;
};

/**
 * DB friends_messages 테이블 Row 타입
 * (컬럼명은 사용자님 스키마에 맞춤: sender_id / receiver_id / title / text / created_at / id)
 */
type FriendsMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  title: string;
  text: string;
  created_at: string;
};

/**
 * 특정 "상대 유저"와 주고받은 메시지 목록을 불러오는 커스텀 훅
 * @param peerUserId 메시지를 주고받는 '상대 유저'의 ID
 *
 * - 현재 로그인 유저 ID는 훅 내부에서 Supabase Auth로 가져옵니다.
 * - RLS 정책:
 *   SELECT: (sender_id = auth.uid() OR receiver_id = auth.uid())
 *   INSERT: (sender_id = auth.uid())
 */
export function useUserMessages(peerUserId: string | null | undefined) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 최신 요청만 반영하기 위한 요청 토큰
  const reqTokenRef = useRef(0);

  /**
   * Supabase에서
   *   (sender_id = me AND receiver_id = peer) OR (sender_id = peer AND receiver_id = me)
   * 조건에 해당하는 메시지를 시간 역순으로 가져옵니다.
   * 이후 UI에 맞는 MessageItem으로 매핑합니다.
   */
  const fetchMessages = useCallback(async () => {
    // peer가 없으면 초기화 후 종료
    if (!peerUserId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    const myReqToken = ++reqTokenRef.current;

    try {
      // 현재 로그인 유저
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const me = userData.user?.id;
      if (!me) {
        setIsLoading(false);
        setError("로그인이 필요합니다.");
        setMessages([]);
        return;
      }

      // (me <-> peer) 간의 모든 메시지 조회
      // Supabase 쿼리: OR 조건은 or() 사용. 컬럼은 sender_id / receiver_id.
      // 정렬: 최신순 (created_at DESC)
      const { data, error: msgErr } = await supabase
        .from("friends_messages")
        .select("id, sender_id, receiver_id, title, text, created_at")
        .or(
          `and(sender_id.eq.${me},receiver_id.eq.${peerUserId}),and(sender_id.eq.${peerUserId},receiver_id.eq.${me})`
        )
        .order("created_at", { ascending: false })
        .returns<FriendsMessageRow[]>();

      if (msgErr) throw msgErr;

      // 요청이 이미 더 최신 요청에게 추월당했다면 무시
      if (myReqToken !== reqTokenRef.current) return;

      // DB Row → UI에서 쓰는 구조로 매핑
      const mapped: MessageItem[] = (data || []).map((row) => {
        const isMine = row.sender_id === me;
        return {
          id: row.id,
          title: row.title ?? "",
          bodyMine: isMine ? row.text ?? "" : "",
          bodyFriend: !isMine ? row.text ?? "" : "",
          unread: false, // DB에 unread 스키마가 없으므로 기본 false (원하면 로컬로 관리)
          createdAt: row.created_at,
          senderId: row.sender_id,
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
  }, [peerUserId]);

  // peerUserId가 바뀌면 자동으로 1회 조회
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /**
   * 읽음 처리 (로컬 전용)
   * - 현재 스키마엔 읽음 여부 컬럼이 없으므로 UI 상태로만 처리합니다.
   * - 추후 스키마에 read_at 같은 컬럼이 추가되면,
   *   여기서 supabase.update()로 서버에도 반영하면 됩니다.
   */
  const markAsRead = useCallback((messageId: string) => {
    setMessages((current) =>
      current.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
    );
  }, []);

  /**
   * 외부에서 강제로 목록 재조회가 필요할 때 호출
   * (예: 메시지 전송 성공 직후 UsersPage에서 refreshKey++ → UserMessageList에서 refetch())
   */
  const refetch = useCallback(async () => {
    await fetchMessages();
  }, [fetchMessages]);

  return { messages, isLoading, error, markAsRead, refetch };
}
