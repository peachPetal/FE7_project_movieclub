// src/hooks/useFriends.ts
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

// ✅ 친구 목록을 가져오는 함수
async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data: friendships, error: friendshipError } = await supabase
    .from("friendship")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

  if (friendshipError) throw friendshipError;
  if (!friendships?.length) return [];

  const friendIds = friendships.map((f) =>
    f.user_id === userId ? f.friend_id : f.user_id
  );

  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, name, avatar_url, is_online")
    .in("id", friendIds);

  if (usersError) throw usersError;

  return (
    usersData?.map((u) => ({
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

    // ✅ 친구 관계 변경 감지
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
        () => queryClient.invalidateQueries({ queryKey: ["friends", userId] })
      )
      .subscribe();

    // ✅ 친구의 온라인 상태 변경 감지
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
          const isFriend = friends.some((f) => f.id === payload.new.id);
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

/* --------------------------------------------------------------------------
📘 주석 정리

1️⃣ fetchFriends(userId)
  - friendship 테이블에서 로그인한 사용자의 친구 관계를 모두 가져옴.
  - user_id / friend_id 중 자신이 아닌 ID만 추출해 친구 ID 목록 생성.
  - users 테이블에서 해당 친구들의 프로필 + is_online 상태 조회.

2️⃣ useQuery (React Query)
  - key: ["friends", userId]
  - 5분 동안 캐시 유지 (staleTime = 5분)
  - userId 존재 시에만 활성화 (enabled 조건)

3️⃣ 실시간 업데이트 (Supabase Realtime)
  - friendship 테이블 변경 시: 친구 추가/삭제 반영
  - users 테이블 변경 시: 친구의 온라인 상태(is_online) 변경 반영
  - invalidateQueries()로 최신 데이터 자동 refetch

4️⃣ cleanup
  - 컴포넌트 언마운트 시 구독 해제 (removeChannel)
-------------------------------------------------------------------------- */
