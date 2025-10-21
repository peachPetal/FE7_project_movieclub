// src/hooks/useUserMessages.ts
import { useEffect, useMemo, useCallback } from "react"; // useCallback 추가
import { supabase } from "../utils/supabase";
import type { MessageDetailData } from "../components/users/UserMessageDetail";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";
import { toast } from 'react-toastify';

export type MessageItem = MessageDetailData & {
  read: boolean;
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
  read: boolean;
};

type UseUserMessagesOptions = {
  filter?: 'all' | 'unread';
};

async function fetchMessages(userId: string): Promise<MessageItem[]> {
  const { data, error: msgErr } = await supabase
    .from("friends_messages")
    .select("id, sender_id, receiver_id, title, text, created_at, read")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false })
    .returns<FriendsMessageRow[]>();

  if (msgErr) throw msgErr;

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title ?? "",
    bodyMine: "",
    bodyFriend: row.text ?? "",
    read: row.read ?? false,
    createdAt: row.created_at,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
  }));
}

export function useUserMessages(
  options: UseUserMessagesOptions = { filter: 'all' }
) {
  const { filter } = options;
  const queryClient = useQueryClient();
  const { user } = useAuthSession();
  const userId = user?.id;

  const queryKey = ['messages', userId];

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchMessages(userId!),
    enabled: !!userId, // 로그인했을 때만 실행
  });

  useEffect(() => {
    if (!userId) return;

    const channelName = `my_inbox_${userId}`;
    // ✅ [수정] 'subscription' 변수 선언 제거 (직접 .subscribe() 호출)
    const channel = supabase.channel(channelName) // 변수 이름 변경 (선택사항)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'friends_messages', filter: `receiver_id=eq.${userId}` },
        (payload) => {
          const newMessageRow = payload.new as FriendsMessageRow;
          const newMessage: MessageItem = {
            id: newMessageRow.id,
            title: newMessageRow.title ?? "",
            bodyMine: "",
            bodyFriend: newMessageRow.text ?? "",
            read: newMessageRow.read ?? false,
            createdAt: newMessageRow.created_at,
            senderId: newMessageRow.sender_id,
            receiverId: newMessageRow.receiver_id,
          };
          queryClient.setQueryData(queryKey, (oldData: MessageItem[] | undefined) => {
            return oldData ? [newMessage, ...oldData] : [newMessage];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'friends_messages', filter: `receiver_id=eq.${userId}` },
        (payload) => {
          const updatedRow = payload.new as FriendsMessageRow;
          queryClient.setQueryData(queryKey, (oldData: MessageItem[] | undefined) => {
            if (!oldData) return [];
            return oldData.map((msg) =>
              msg.id === updatedRow.id ? { ...msg, read: updatedRow.read } : msg
            );
          });
        }
      )
      .subscribe(); // ✅ .subscribe() 직접 호출

    return () => {
      // supabase.removeChannel(channel); // 채널 제거 안 함
      // ✅ 만약 채널 객체가 필요하다면 위에서 channel 변수를 사용하고 여기서 removeChannel 호출
      supabase.removeChannel(channel); // 예시: 필요 시 주석 해제
    };
  }, [userId, queryClient, queryKey]);


  const { mutateAsync: markAsReadMutation } = useMutation({ // 변수명 변경
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("friends_messages")
        .update({ read: true })
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      // 성공 토스트 없음
    },
    onError: (error: Error) => { // error 타입을 명시
      console.error("markAsRead DB update error:", error);
      toast.error(`읽음 처리 실패: ${error.message}`);
    },
  });

  // markAsRead 래핑 (기존 mutateAsync 호출만 유지)
  const markAsRead = useCallback(
    async (messageId: string) => {
      try {
        await markAsReadMutation(messageId);
      } catch (e) {
        // onError에서 이미 처리
      }
    },
    [markAsReadMutation]
  );

  const { mutateAsync: sendMessageMutation } = useMutation({ // 변수명 변경
    mutationFn: async ({ peerId, title, text }: { peerId: string, title: string, text: string }) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      const { error } = await supabase.from("friends_messages").insert({
        sender_id: userId,
        receiver_id: peerId,
        title,
        text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("메세지 전송을 성공했습니다."); // ✅ 성공 토스트 유지
    },
    onError: (error: Error) => { // error 타입을 명시
      console.error("sendMessage error:", error);
      toast.error(`메세지 전송 실패: ${error.message}`); // ✅ 실패 토스트 유지
    }
  });

  // sendMessage 래핑 (단순 호출만 수행)
  const sendMessage = useCallback(
    async (peerId: string, title: string, text: string) => {
      try {
        await sendMessageMutation({ peerId, title, text });
        // onSuccess에서 토스트 호출하므로 여기서는 제거
      } catch (e) {
        // onError에서 이미 처리
      }
    },
    [sendMessageMutation]
  );

  const filteredMessages = useMemo(() => {
    if (filter === 'unread') {
      return messages.filter(msg => msg.read === false);
    }
    return messages;
  }, [messages, filter]);

  return {
    messages: filteredMessages,
    isLoading,
    error: error as string | null,
    markAsRead, // 수정된 래핑 함수
    refetch: () => queryClient.invalidateQueries({ queryKey: queryKey }),
    sendMessage // 수정된 래핑 함수
  };
}