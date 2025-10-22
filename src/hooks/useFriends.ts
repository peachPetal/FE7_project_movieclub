
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
    .select("friend_id")
    .eq("user_id", userId);

  if (error) throw error;

  const friendIds = data.map((row) => row.friend_id);

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
        ? payload.old?.friend_id
        : payload.new?.friend_id;

    if (!friendId) return;

    if (payload.eventType === "INSERT") {
      const { data: userData, error } = await supabase
        .from("users")
        .select("id, name, avatar_url, is_online")
        .eq("id", friendId)
        .single();

      if (error || !userData) return;

      const newFriend: Friend = {
        id: userData.id,
        name: userData.name,
        avatarUrl: userData.avatar_url ?? undefined,
        status: userData.is_online ? "online" : "offline",
      };

      queryClient.setQueryData<Friend[]>(queryKey, (oldData) => {
        if (!oldData) return [newFriend];
        if (oldData.some((f) => f.id === newFriend.id)) return oldData;
        return [newFriend, ...oldData];
      });
    } else if (payload.eventType === "DELETE") {
      queryClient.setQueryData<Friend[]>(queryKey, (oldData) =>
        oldData ? oldData.filter((f) => f.id !== friendId) : []
      );
    }
  };

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("friendship-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendship",
          filter: `user_id=eq.${userId}`,
        },
        handleFriendshipChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    friends,
    loading: isLoading,
    deleteFriend: deleteFriendMutation.mutate,
    isDeletingFriend: deleteFriendMutation.isPending,
  };
}

// // src/hooks/useFriends.ts
// import { useEffect } from "react";
// import { supabase } from "../utils/supabase";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { useAuthSession } from "./useAuthSession";
// import { deleteFriend as deleteFriendApi } from "../api/friend/deleteFriendApi";
// import { toast } from "react-toastify";

// export type FriendStatus = "online" | "offline";

// export interface Friend {
//   id: string;
//   name: string;
//   avatarUrl?: string;
//   status: FriendStatus;
// }

// type FriendDetailRow = {
//   viewer_id: string;
//   friend_id: string;
//   friend_name: string;
//   friend_avatar: string | null;
//   friend_is_online: boolean;
// };

// // View에서 친구 목록 가져오기
// async function fetchFriends(userId: string): Promise<Friend[]> {
//   const { data, error } = await supabase
//     .from("user_friends_details")
//     .select("*")
//     .eq("viewer_id", userId);

//   if (error) throw error;

//   return (data || []).map((row: FriendDetailRow) => ({
//     id: row.friend_id,
//     name: row.friend_name,
//     avatarUrl: row.friend_avatar ?? undefined,
//     status: row.friend_is_online ? "online" : "offline",
//   }));
// }

// export function useFriends() {
//   const queryClient = useQueryClient();
//   const { user } = useAuthSession();
//   const userId = user?.id;
//   const queryKey = ["friends", userId];

//   const { data: friends = [], isLoading } = useQuery<Friend[], Error>({
//     queryKey,
//     queryFn: () => fetchFriends(userId!),
//     enabled: !!userId,
//     staleTime: 1000 * 60 * 5,
//   });

//   const deleteFriendMutation = useMutation({
//     mutationFn: (friendId: string) => {
//       if (!userId) throw new Error("로그인이 필요합니다.");
//       return deleteFriendApi(userId, friendId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey });
//       toast.success("친구를 삭제했습니다.");
//     },
//     onError: (error: Error) => {
//       console.error("Failed to delete friend:", error);
//       toast.error(`친구 삭제 실패: ${error.message}`);
//     },
//   });

//   // --- 공통 처리 함수 ---
//   const mapRowToFriend = (row: FriendDetailRow): Friend => ({
//     id: row.friend_id,
//     name: row.friend_name,
//     avatarUrl: row.friend_avatar ?? undefined,
//     status: row.friend_is_online ? "online" : "offline",
//   });

//   const handleFriendChange = (payload: any) => {
//     if (!userId) return;

//     if (payload.eventType === "INSERT") {
//       const newFriend = mapRowToFriend(payload.new as FriendDetailRow);
//       queryClient.setQueryData<Friend[]>(queryKey, (oldData) => {
//         if (!oldData) return [newFriend];
//         if (oldData.some((f) => f.id === newFriend.id)) return oldData;
//         return [newFriend, ...oldData];
//       });
//     } else if (payload.eventType === "UPDATE") {
//       const updatedFriend = mapRowToFriend(payload.new as FriendDetailRow);
//       queryClient.setQueryData<Friend[]>(queryKey, (oldData) =>
//         oldData ? oldData.map((f) => (f.id === updatedFriend.id ? updatedFriend : f)) : []
//       );
//     } else if (payload.eventType === "DELETE") {
//       const deletedFriendId = (payload.old as FriendDetailRow).friend_id;
//       if (deletedFriendId) {
//         queryClient.setQueryData<Friend[]>(queryKey, (oldData) =>
//           oldData ? oldData.filter((f) => f.id !== deletedFriendId) : []
//         );
//       }
//     }
//   };

//   // --- 실시간 구독 ---
// useEffect(() => {
//   if (!userId) return;

//   // viewer_id만 구독 (양방향 뷰이므로 충분)
//   const viewerChannel = supabase
//     .channel("user-friends-viewer-changes")
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "user_friends_details",
//         filter: `viewer_id=eq.${userId}`,
//       },
//       handleFriendChange
//     )
//     .subscribe();

//   return () => {
//     supabase.removeChannel(viewerChannel);
//   };
// }, [userId, queryClient]);

//   return {
//     friends,
//     loading: isLoading,
//     deleteFriend: deleteFriendMutation.mutate,
//     isDeletingFriend: deleteFriendMutation.isPending,
//   };
// }

