// hooks/useUsersPageLogic.ts

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { AppUser } from "../types/appUser";
import type { MessageDetailData } from "../components/users/UserMessageDetail";
import { getUsers } from "../api/user/userApi";
import { addFriend } from "../api/friend/addFriendApi";
import { deleteFriend } from "../api/friend/deleteFriendApi"; // ✅ [추가] 1. 친구 삭제 API 임포트
import { useAuthSession } from "./useAuthSession";
import { supabase } from "../utils/supabase";
import { toast } from 'react-toastify';

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

  // ... (useQuery 'users' 로직 - 기존과 동일)
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

  // 4. TanStack Query로 친구 추가 기능 구현 (기존과 동일)
  const addFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      return addFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("친구를 추가했습니다");
    },
    onError: (error: Error) => {
      toast.error(`친구 추가 실패: ${error.message}`);
    },
  });

  // ✅ [추가] 2. TanStack Query로 친구 삭제 기능 구현
  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      // deleteFriendApi.ts의 deleteFriend 함수 사용
      return deleteFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      // 친구 추가와 동일하게 'friends' 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("친구를 삭제했습니다.");
    },
    onError: (error: Error) => {
      console.error("Failed to delete friend:", error);
      toast.error(`친구 삭제 실패: ${error.message}`);
    },
  });


  // 5. UI 상호작용과 관련된 상태 (기존과 동일)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(
    null,
  );
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const userDetailsRef = useRef<HTMLDivElement>(null);

  // ... (processedUsers, selectedUser, useEffects ... - 기존과 동일)
  const processedUsers = useMemo(() => {
    // ... (기존 코드)
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

      // ✅ [추가] 클릭된 요소 또는 그 부모 중에 data-ignore-outside-click 속성이 있는지 확인
      if ((target as Element).closest('[data-ignore-outside-click="true"]')) {
        // 만약 NotificationModal 내부(또는 data- 속성을 가진 다른 요소)를 클릭했다면,
        // 패널을 닫지 않고 함수를 종료합니다.
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


  // 11. 이벤트 핸들러 함수들
  const handleSelectUser = useCallback((user: AppUser | null) => {
    // ... (기존 코드)
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

  // ✅ [추가] 3. 친구 삭제 핸들러 함수
  const handleDeleteFriend = useCallback(() => {
    if (!selectedUser) return;
    deleteFriendMutation.mutate(selectedUser.id);
  }, [selectedUser, deleteFriendMutation]);


  const toggleMessage = useCallback(() => setIsMessageOpen((p) => !p), []);

  // 15. 페이지 컴포넌트에 필요한 모든 상태와 함수를 반환
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
    // ✅ [추가] 4. 삭제 관련 핸들러 및 상태 반환
    handleDeleteFriend,
    isDeletingFriend: deleteFriendMutation.isPending,
  };
}