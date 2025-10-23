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

  const handleFriendshipChange = async (payload: any) => {
    if (!userId) return;

    const friendId =
      payload.eventType === "DELETE"
        ? payload.old?.friend_id ?? payload.old?.user_id
        : payload.new?.friend_id ?? payload.new?.user_id;

    if (!friendId) return;

    queryClient.invalidateQueries({ queryKey });
  };


useEffect(() => {
  if (!userId) return;

  const channel = supabase.channel("friendship-changes");

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "friendship",
      filter: `user_id=eq.${userId}`,
    },
    handleFriendshipChange
  );

  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "friendship",
      filter: `friend_id=eq.${userId}`,
    },
    handleFriendshipChange
  );

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
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