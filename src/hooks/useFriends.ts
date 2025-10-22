// src/hooks/useFriends.ts
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

type FriendDetailRow = {
  viewer_id: string;
  friend_id: string;
  friend_name: string;
  friend_avatar: string | null;
  friend_is_online: boolean;
};

// View에서 친구 목록 가져오기
async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from("user_friends_details")
    .select("*")
    .eq("viewer_id", userId);

  if (error) throw error;

  return (data || []).map((row: FriendDetailRow) => ({
    id: row.friend_id,
    name: row.friend_name,
    avatarUrl: row.friend_avatar ?? undefined,
    status: row.friend_is_online ? "online" : "offline",
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

  // --- 공통 처리 함수 ---
  const mapRowToFriend = (row: FriendDetailRow): Friend => ({
    id: row.friend_id,
    name: row.friend_name,
    avatarUrl: row.friend_avatar ?? undefined,
    status: row.friend_is_online ? "online" : "offline",
  });

  const handleFriendChange = (payload: any) => {
    if (!userId) return;

    if (payload.eventType === "INSERT") {
      const newFriend = mapRowToFriend(payload.new as FriendDetailRow);
      queryClient.setQueryData<Friend[]>(queryKey, (oldData) => {
        if (!oldData) return [newFriend];
        if (oldData.some((f) => f.id === newFriend.id)) return oldData;
        return [newFriend, ...oldData];
      });
    } else if (payload.eventType === "UPDATE") {
      const updatedFriend = mapRowToFriend(payload.new as FriendDetailRow);
      queryClient.setQueryData<Friend[]>(queryKey, (oldData) =>
        oldData ? oldData.map((f) => (f.id === updatedFriend.id ? updatedFriend : f)) : []
      );
    } else if (payload.eventType === "DELETE") {
      const deletedFriendId = (payload.old as FriendDetailRow).friend_id;
      if (deletedFriendId) {
        queryClient.setQueryData<Friend[]>(queryKey, (oldData) =>
          oldData ? oldData.filter((f) => f.id !== deletedFriendId) : []
        );
      }
    }
  };

  // --- 실시간 구독 ---
  useEffect(() => {
    if (!userId) return;

    // 1️⃣ viewer_id = userId 구독
    const viewerChannel = supabase
      .channel("user-friends-viewer-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_friends_details",
          filter: `viewer_id=eq.${userId}`,
        },
        handleFriendChange
      )
      .subscribe();

    // 2️⃣ friend_id = userId 구독
    const friendChannel = supabase
      .channel("user-friends-friend-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_friends_details",
          filter: `friend_id=eq.${userId}`,
        },
        handleFriendChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(viewerChannel);
      supabase.removeChannel(friendChannel);
    };
  }, [userId, queryClient]);

  return {
    friends,
    loading: isLoading,
    deleteFriend: deleteFriendMutation.mutate,
    isDeletingFriend: deleteFriendMutation.isPending,
  };
}

  // 실시간 구독 useEffect (변경 없음)
//   useEffect(() => {
//     if (!userId) return;
//     const friendshipChannel = supabase
//       .channel("friendship-changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "friendship",
//           filter: `or=(user_id.eq.${userId},friend_id.eq.${userId})`,
//         },
//         () => queryClient.invalidateQueries({ queryKey: ["friends", userId] })
//       )
//       .subscribe();

//     const usersChannel = supabase
//       .channel("users-changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "users",
//         },
//         (payload) => {
//           const isFriend = friends.some((f) => f.id === payload.new.id);
//           if (isFriend) {
//             queryClient.invalidateQueries({ queryKey: ["friends", userId] });
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(friendshipChannel);
//       supabase.removeChannel(usersChannel);
//     };
//   }, [userId, queryClient, friends]);

//   return {
//     friends,
//     loading: isLoading,
//     deleteFriend: deleteFriendMutation.mutate, // 삭제 함수
//     isDeletingFriend: deleteFriendMutation.isPending // 삭제 로딩 상태
//   };
// }

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
