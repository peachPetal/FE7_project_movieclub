import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AppUser } from "../types/appUser";
import type { MessageDetailData } from "../components/users/UserMessageDetail";
import { getUsers } from "../api/userApi";
import { addFriend } from "../api/addFriendApi";
import { useAuthSession } from "./useAuthSession";

/**
 * UsersPage의 데이터 조회, 상태, 로직을 모두 관리하는 커스텀 훅.
 */
export function useUsersPageLogic() {
  // 1. 현재 로그인한 사용자 정보 가져오기
  const { user: sessionUser } = useAuthSession();
  const currentUserId = sessionUser?.id;

  // 2. TanStack Query로 사용자 목록 조회 (서버 상태)
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // 3. TanStack Query로 친구 추가 기능 구현 (서버 상태 변경)
  const addFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      return addFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      console.log("친구 추가 성공!");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // 4. UI 상호작용과 관련된 상태 (클라이언트 상태)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // 5. 가져온 데이터를 UI에 맞게 가공
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
    [processedUsers, selectedId]
  );

  // 6. 이벤트 핸들러 함수들
  const handleSelectUser = useCallback((user: AppUser) => {
    setSelectedId((prevId) => {
      const newId = prevId === user.id ? null : user.id;
      if (prevId !== newId) {
        setPickedMessage(null);
        setIsReplyOpen(false);
      }
      return newId;
    });
  }, []);

  const handleAddFriend = useCallback(() => {
    if (!currentUserId) return alert("로그인이 필요합니다.");
    if (!selectedUser) return;
    if (currentUserId === selectedUser.id) return;

    addFriendMutation.mutate(selectedUser.id);
  }, [currentUserId, selectedUser, addFriendMutation]);

  const openReply = useCallback(() => setIsReplyOpen(true), []);
  const closeReply = useCallback(() => setIsReplyOpen(false), []);

  // 7. 페이지 컴포넌트에 필요한 모든 상태와 함수를 반환
  return {
    users: processedUsers,
    isLoading,
    isError,
    error,
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isReplyOpen,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    isAddingFriend: addFriendMutation.isPending,
    openReply,
    closeReply,
  };
}