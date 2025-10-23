import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";
import { deleteFriend as deleteFriendApi } from "../api/friend/deleteFriendApi";
import { toast } from "react-toastify";

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from("friendship")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

  if (error) throw error;

  const friendIds = data.map((row) =>
    row.user_id === userId ? row.friend_id : row.user_id
  );

  if (friendIds.length === 0) return [];

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, name, avatar_url, is_online")
    .in("id", friendIds);

  if (usersError) throw usersError;

  return usersData.map((user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatar_url ?? undefined,
    status: user.is_online ? "online" : "offline",
  }));
}

export function useFriends() {
  const queryClient = useQueryClient();
  const { user } = useAuthSession();
  const userId = user?.id;
  const queryKey = ["friends", userId];

  const { data: friends = [], isLoading } = useQuery<Friend[], Error>({
    queryKey,
    queryFn: () => fetchFriends(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const friendsCount = friends.length;

  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return deleteFriendApi(userId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("친구를 삭제했습니다.");
    },
    onError: (error: Error) => {
      console.error("Failed to delete friend:", error);
      toast.error(`친구 삭제 실패: ${error.message}`);
    },
  });

  const handleFriendshipChange = async () => {
    if (!userId) return;

    // const friendId =
    //   payload.eventType === "DELETE"
    //     ? payload.old?.friend_id ?? payload.old?.user_id
    //     : payload.new?.friend_id ?? payload.new?.user_id;

    // if (!friendId) return;

    queryClient.invalidateQueries({ queryKey });
  };


useEffect(() => {
  if (!userId) return;

  const friendshipChannel = supabase.channel("friendship-changes");

  friendshipChannel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "friendship",
      filter: `user_id=eq.${userId}`,
    },
    handleFriendshipChange
  );

  friendshipChannel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "friendship",
      filter: `friend_id=eq.${userId}`,
    },
    handleFriendshipChange
  );

  friendshipChannel.subscribe();

// --- 2. 친구 온라인 상태 변경 (is_online) 채널 추가 (새로 추가) ---
  const onlineStatusChannel = supabase.channel("users-online-status");

  onlineStatusChannel
    .on(
      "postgres_changes",
      {
        event: "UPDATE", // UPDATE 이벤트만 감지
        schema: "public",
        table: "users", // users 테이블 감지
      },
      (payload) => {
        const updatedUser = payload.new as any;
        const updatedUserId = updatedUser.id;
        
        // 내 자신의 업데이트는 무시하고, is_online 필드가 변경된 경우에만 처리
        if (updatedUserId === userId || updatedUser.is_online === undefined) return; 

        const newStatus: FriendStatus = updatedUser.is_online ? "online" : "offline";

        // friends 쿼리 캐시를 직접 업데이트하여 실시간 반영
        queryClient.setQueryData(
          queryKey,
          (oldFriends: Friend[] | undefined) => {
            if (!oldFriends) return [];

            // 업데이트된 유저가 현재 친구 목록에 포함되어 있는지 확인
            const isFriendUpdate = oldFriends.some(f => f.id === updatedUserId);
            if (!isFriendUpdate) return oldFriends;

            // 해당 친구의 상태를 업데이트하고, 상태가 변경된 경우에만 새로운 배열 반환
            return oldFriends.map((friend) => {
              if (friend.id === updatedUserId && friend.status !== newStatus) {
                return {
                  ...friend,
                  status: newStatus,
                };
              }
              return friend;
            });
          }
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(friendshipChannel);
    supabase.removeChannel(onlineStatusChannel);
  };
}, [userId, queryClient]);


  return {
    friends,
    loading: isLoading,
    deleteFriend: deleteFriendMutation.mutate,
    isDeletingFriend: deleteFriendMutation.isPending,
    friendsCount
  };
}