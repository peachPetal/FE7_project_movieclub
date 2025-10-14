import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

export function useFriends(userEmail: string | null) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("friendship")
          .select(`
            friend:friend_id (
              id,
              email,
              avatar_url
            )
          `)
          .eq("user_id", userEmail);

        if (error) throw error;

        const mapped: Friend[] = data?.map((item: any) => ({
          id: item.friend.id,
          name: item.friend.email,
          avatarUrl: item.friend.avatar_url ?? undefined,
          status: "offline" as FriendStatus, // 기본값 offline
        })) ?? [];

        setFriends(mapped);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userEmail]);

  return { friends, loading };
}
