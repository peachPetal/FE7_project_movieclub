// hooks/useUsersPageLogic.ts

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { AppUser } from "../types/appUser";
import type { MessageDetailData } from "../components/users/UserMessageDetail";
import { getUsers } from "../api/user/userApi";
import { addFriend } from "../api/friend/addFriendApi";
import { deleteFriend } from "../api/friend/deleteFriendApi";
import { useAuthSession } from "./useAuthSession";
import { supabase } from "../utils/supabase";
import { toast } from 'react-toastify';
import { useFriends } from "./useFriends";

const MAX_FRIENDS_COUNT = 9;

/**
 * UsersPage의 데이터 조회, 상태, 로직을 모두 관리하는 커스텀 훅.
 * @param externalUsers - (선택) 외부에서 주입할 사용자 목록.
 * 이 값이 제공되면, 훅 내부의 'users' 쿼리는 비활성화됩니다.
 */

export function useUsersPageLogic(externalUsers?: AppUser[]) {
  const queryClient = useQueryClient();
  const { user: sessionUser } = useAuthSession();
  const currentUserId = sessionUser?.id;

  const location = useLocation();
  const initialState = location.state as
    | { selectedUserId?: string; openMessages?: boolean }
    | undefined;

  const { friendsCount } = useFriends();

  const {
    data: internalUsers = [],
    isLoading: isInternalLoading,
    isError: isInternalError,
    error: internalError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: !externalUsers,
  });

  const users = externalUsers || internalUsers;
  const isLoading = externalUsers ? false : isInternalLoading;
  const isError = externalUsers ? false : isInternalError;
  const error = externalUsers ? null : internalError;

  const addFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      
      if (friendsCount >= MAX_FRIENDS_COUNT) {
        throw new Error(`친구는 최대 ${MAX_FRIENDS_COUNT}명까지만 추가할 수 있습니다.`);
      }
      
      return addFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", currentUserId] });
      toast.success("친구를 추가했습니다");
    },
    onError: (error: Error) => {
      toast.error(`친구 추가 실패: ${error.message}`);
    },
  });

  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      return deleteFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", currentUserId] });
      toast.success("친구를 삭제했습니다.");
    },
    onError: (error: Error) => {
      console.error("Failed to delete friend:", error);
      toast.error(`친구 삭제 실패: ${error.message}`);
    },
  });


  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(
    null,
  );
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const userDetailsRef = useRef<HTMLDivElement>(null);

  const processedUsers = useMemo(() => {
    const formattedUsers = users.map((user) => ({
      ...user,
      joinedAt: user.created_at
        ? new Date(user.created_at).toLocaleDateString("ko-KR")
        : "정보 없음",
    }));
    if (!currentUserId) return formattedUsers;
    return formattedUsers.sort((a, b) => {
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [users, currentUserId]);

  const selectedUser = useMemo(
    () => processedUsers.find((u) => u.id === selectedId) ?? null,
    [processedUsers, selectedId],
  );

  useEffect(() => {
    if (initialState?.selectedUserId && users.length > 0) {
      const userExists = users.some(
        (u) => u.id === initialState.selectedUserId,
      );
      if (userExists) {
        setSelectedId(initialState.selectedUserId);
        if (initialState.openMessages) {
          setIsMessageOpen(true);
        }
        window.history.replaceState({}, document.title);
      }
    }
  }, [users, initialState?.selectedUserId, initialState?.openMessages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if ((target as Element).closest('[data-ignore-outside-click="true"]')) {
        return;
      }

      if (
        userDetailsRef.current &&
        !userDetailsRef.current.contains(event.target as Node)
      ) {
        setSelectedId(null);
        setPickedMessage(null);
        setIsMessageOpen(false);
      }
    };
    if (selectedId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedId]);

  useEffect(() => {
    if (externalUsers || !currentUserId) return;
    // ... (기존 Realtime 구독 코드)
    const subscription = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          queryClient.setQueryData(
            ["users"],
            (oldData: AppUser[] | undefined) => {
              if (!oldData) return [];
              return oldData.map((user) =>
                user.id === payload.new.id
                  ? { ...user, is_online: payload.new.is_online }
                  : user,
              );
            },
          );
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, queryClient, externalUsers]);


  const handleSelectUser = useCallback((user: AppUser | null) => {
    setSelectedId((prevId) => {
      if (user === null) {
        setPickedMessage(null);
        setIsMessageOpen(false);
        return null;
      }
      const newId = prevId === user.id ? null : user.id;
      if (prevId !== newId) {
        setPickedMessage(null);
        setIsMessageOpen(false);
      }
      return newId;
    });
  }, []);

  const handleAddFriend = useCallback(() => {
    if (!selectedUser) return;
    addFriendMutation.mutate(selectedUser.id);
  }, [selectedUser, addFriendMutation]);

  const handleDeleteFriend = useCallback(() => {
    if (!selectedUser) return;
    deleteFriendMutation.mutate(selectedUser.id);
  }, [selectedUser, deleteFriendMutation]);


  const toggleMessage = useCallback(() => setIsMessageOpen((p) => !p), []);

  return {
    users: processedUsers,
    isLoading,
    isError,
    error,
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isMessageOpen,
    isAddingFriend: addFriendMutation.isPending,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    toggleMessage,
    userDetailsRef,
    handleDeleteFriend,
    isDeletingFriend: deleteFriendMutation.isPending,
  };
}