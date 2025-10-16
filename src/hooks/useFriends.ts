import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession"; // ✅ 사용자 ID를 컨텍스트에서 가져오기

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data: friendships, error: friendshipError } = await supabase
    .from("friendship")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

  if (friendshipError) throw friendshipError;
  if (!friendships || friendships.length === 0) return [];

  const friendIds = friendships.map(f => (f.user_id === userId ? f.friend_id : f.user_id));

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, name, avatar_url, is_online")
    .in("id", friendIds);

  if (usersError) throw usersError;

  return (
    usersData?.map(u => ({
      id: u.id,
      name: u.name,
      avatarUrl: u.avatar_url ?? undefined,
      status: u.is_online ? "online" : "offline",
    })) ?? []
  );
}

export function useFriends() {
  const queryClient = useQueryClient();
  const { user } = useAuthSession();
  const userId = user?.id;

  const { data: friends = [], isLoading } = useQuery<Friend[], Error>({
    queryKey: ["friends", userId],
    queryFn: () => fetchFriends(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, 
  });

  useEffect(() => {
    if (!userId) return;
    const friendshipChannel = supabase
      .channel("friendship-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendship",
          filter: `or=(user_id.eq.${userId},friend_id.eq.${userId})`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["friends", userId] });
        }
      )
      .subscribe();

    const usersChannel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          const isFriend = friends.some(friend => friend.id === payload.new.id);
          if (isFriend) {
            queryClient.invalidateQueries({ queryKey: ["friends", userId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendshipChannel);
      supabase.removeChannel(usersChannel);
    };
  }, [userId, queryClient, friends]);

  return { friends, loading: isLoading };
}

