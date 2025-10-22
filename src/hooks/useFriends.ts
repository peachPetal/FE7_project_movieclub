// src/hooks/useFriends.ts (View를 사용하도록 수정한 최종본)
import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";
import { deleteFriend as deleteFriendApi } from "../api/friend/deleteFriendApi";
import { toast } from 'react-toastify';

export type FriendStatus = "online" | "offline";

export interface Friend {
  id: string; // 친구의 ID
  name: string;
  avatarUrl?: string;
  status: FriendStatus;
}

// ✅ View에서 가져올 행의 타입 정의
type FriendDetailRow = {
  viewer_id: string;
  friend_id: string;
  friend_name: string;
  friend_avatar: string | null;
  friend_is_online: boolean;
};

// --- ✅ 1. fetchFriends 함수 수정 ---
// View를 조회하도록 변경
async function fetchFriends(userId: string): Promise<Friend[]> {
  const { data, error } = await supabase
    .from("user_friends_details") // ⬅️ View 이름
    .select("*")
    .eq("viewer_id", userId); // ⬅️ RLS가 있어도 필터링은 필요

  if (error) throw error;

  // View의 데이터를 Friend 타입으로 매핑
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

  const queryKey = ["friends", userId]; // 쿼리 키

  const { data: friends = [], isLoading } = useQuery<Friend[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchFriends(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
  // 친구 삭제 뮤테이션
  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return deleteFriendApi(userId, friendId); // API 호출
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
      toast.success("친구를 삭제했습니다."); // ✅ 2. 성공 토스트 추가
    },
    onError: (error: Error) => { // error 타입을 명시
      console.error("Failed to delete friend:", error);
      toast.error(`친구 삭제 실패: ${error.message}`); // ✅ 3. 실패 토스트 추가
    },
  });
useEffect(() => {
    if (!userId) return;

    // View의 Row를 Friend 타입으로 변환하는 헬퍼 함수
    const mapRowToFriend = (row: FriendDetailRow): Friend => ({
      id: row.friend_id,
      name: row.friend_name,
      avatarUrl: row.friend_avatar ?? undefined,
      status: row.friend_is_online ? "online" : "offline",
    });

    const channel = supabase
      .channel("user-friends-details-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE 모두 감지
          schema: "public",
          table: "user_friends_details", // ⬅️ View 구독
          filter: `viewer_id=eq.${userId}`, // ⬅️ "나"의 목록만
        },
        (payload) => {

          if (payload.eventType === 'INSERT') {
            // --- 친구 추가 (INSERT) ---
            // payload.new에 이름, 아바타, 상태가 모두 포함되어 있음!
            const newFriend = mapRowToFriend(payload.new as FriendDetailRow);
            queryClient.setQueryData(
              queryKey,
              (oldData: Friend[] | undefined) => {
                if (!oldData) return [newFriend];
                // 중복 추가 방지
                if (oldData.some(f => f.id === newFriend.id)) return oldData;
                return [newFriend, ...oldData];
              }
            );
          } 
          
          else if (payload.eventType === 'UPDATE') {
            // --- 친구 정보 변경 (UPDATE: 온라인 상태, 이름 변경 등) ---
            const updatedFriend = mapRowToFriend(payload.new as FriendDetailRow);
            queryClient.setQueryData(
              queryKey,
              (oldData: Friend[] | undefined) => 
                oldData ? oldData.map(f => f.id === updatedFriend.id ? updatedFriend : f) : []
            );
          } 
          
          else if (payload.eventType === 'DELETE') {
            // --- 친구 삭제 (DELETE) ---
            const deletedFriendId = (payload.old as FriendDetailRow).friend_id;
            if (deletedFriendId) {
              queryClient.setQueryData(
                queryKey,
                (oldData: Friend[] | undefined) =>
                  oldData ? oldData.filter(f => f.id !== deletedFriendId) : []
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, queryKey]); // queryKey 의존성 추가

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
