import { useEffect, useMemo, useCallback } from "react";
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
  senderName?: string;
};

type FriendsMessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  title: string;
  text: string;
  created_at: string;
  read: boolean;
  sender_name: string ;
};

type UseUserMessagesOptions = {
  filter?: 'all' | 'unread';
};


async function fetchMessages(userId: string): Promise<MessageItem[]> {
  const { data: messagesData, error: messagesError } = await supabase
    .from("friends_messages")
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });

  if (messagesError) throw messagesError;

  const senderIds = messagesData.map((msg) => msg.sender_id);

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, name")
    .in("id", senderIds);

  if (usersError) throw usersError;

  const userMap = new Map(usersData.map((u) => [u.id, u.name]));

  return messagesData.map((msg) => ({
    id: msg.id,
    title: msg.title ?? "",
    bodyMine: "",
    bodyFriend: msg.text ?? "",
    read: msg.read ?? false,
    createdAt: msg.created_at!,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    senderName: userMap.get(msg.sender_id) ?? "Unknown",
  }));
}

// async function fetchMessages(userId: string): Promise<MessageItem[]> {

// const { data, error } = await supabase
//   .from("friends_messages")
//   .select(`
//     id,
//     title,
//     text,
//     created_at,
//     read,
//     sender_id,
//     receiver_id,
//     sender:users (
//       name
//     )
//   `)
//   .eq("receiver_id", userId)
//   .order("created_at", { ascending: false });

//   if (error) throw error;

//   return (data || []).map((row) => ({
//     id: row.id,
//     title: row.title ?? "",
//     bodyMine: "",
//     bodyFriend: row.text ?? "",
//     read: row.read ?? false,
//     createdAt: row.created_at!,
//     senderId: row.sender_id,
//     receiverId: row.receiver_id,
//     senderName: row.sender?.name ?? "Unknown",
//   }));
// }

export function useUserMessages(
  options: UseUserMessagesOptions = { filter: 'all' }
) {
  const { filter } = options;
  const queryClient = useQueryClient();
  const { user } = useAuthSession();
  const userId = user?.id;

  const queryKey = ['messages', userId, filter];

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchMessages(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const channelName = `my_inbox_${userId}`;
    const channel = supabase.channel(channelName)
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
        senderName: newMessageRow.sender_name ?? "Unknown", // view에서 바로 가져오기
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
.on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'friends_messages', filter: `receiver_id=eq.${userId}` },
        (payload) => {
          // payload.old에서 삭제된 메시지 ID를 가져옵니다.
          const deletedMessageId = payload.old.id;
          if (deletedMessageId) {
            // 캐시(queryData)에서 해당 메시지를 즉시 제거합니다.
            queryClient.setQueryData(queryKey, (oldData: MessageItem[] | undefined) => {
              if (!oldData) return [];
              return oldData.filter((msg) => msg.id !== deletedMessageId);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, queryKey]);


  const { mutateAsync: markAsReadMutation } = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("friends_messages")
        .update({ read: true })
        .eq("id", messageId);
      if (error) throw error;
    },
    onSuccess: () => {
    },
    onError: (error: Error) => {
      console.error("markAsRead DB update error:", error);
      toast.error(`읽음 처리 실패: ${error.message}`);
    },
  });

  const markAsRead = useCallback(
    async (messageId: string) => {
      try {
        await markAsReadMutation(messageId);
      } catch (e) {
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
      toast.success("메세지 전송을 성공했습니다.");
    },
    onError: (error: Error) => {
      console.error("sendMessage error:", error);
      toast.error(`메세지 전송 실패: ${error.message}`);
    }
  });

  const sendMessage = useCallback(
    async (peerId: string, title: string, text: string) => {
      try {
        await sendMessageMutation({ peerId, title, text });
      } catch (e) {
      }
    },
    [sendMessageMutation]
  );
  
// ✅ 2. deleteMessage 뮤테이션 추가
  const { mutateAsync: deleteMessageMutation } = useMutation({
    mutationFn: async (messageId: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.");

      // 받은 메시지만 삭제할 수 있도록 receiver_id 조건 추가
      const { error } = await supabase
        .from("friends_messages")
        .delete()
        .eq("id", messageId)
        .eq("receiver_id", userId); // ⬅️ 중요

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("메세지를 삭제했습니다.");
      // 화면 업데이트는 useEffect의 'DELETE' 구독이 처리합니다.
    },
    onError: (error: Error) => {
      console.error("deleteMessage error:", error);
      toast.error(`메세지 삭제 실패: ${error.message}`);
    }
  });

  // ✅ 3. deleteMessage 콜백 함수 추가
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        await deleteMessageMutation(messageId);
      } catch (e) {
        // onError가 이미 토스트를 처리하므로 여긴 비워둬도 됩니다.
      }
    },
    [deleteMessageMutation]
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
    markAsRead,
    refetch: () => queryClient.invalidateQueries({ queryKey: queryKey }),
    sendMessage,
    deleteMessage,
  };
}