import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

export function useFriends(userId: string | null) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        // 1️⃣ friendship 테이블에서 친구 관계 조회
        const { data: friendships, error: friendshipError } = await supabase
          .from("friendship")
          .select("user_id, friend_id")
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

        if (friendshipError) throw friendshipError;

        if (!friendships || friendships.length === 0) {
          setFriends([]);
          setLoading(false);
          return;
        }

        // 2️⃣ 상대방 ID만 추출
        const friendIds = friendships.map(f =>
          f.user_id === userId ? f.friend_id : f.user_id
        );

        // 3️⃣ users 테이블에서 상대방 프로필 조회
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, name, email, avatar_url")
          .in("id", friendIds);

        if (usersError) throw usersError;

        // 4️⃣ Friend 배열 생성
        const mapped: Friend[] = usersData?.map(u => ({
          id: u.id,
          name: u.name,
          avatarUrl: u.avatar_url ?? undefined,
          status: "offline", // 기본값
        })) ?? [];

        setFriends(mapped);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  return { friends, loading, setFriends };
}
