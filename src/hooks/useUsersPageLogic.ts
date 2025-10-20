// hooks/useUsersPageLogic.ts

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// 1. react-router-dom에서 useLocation 임포트
import { useLocation } from "react-router-dom";
import type { AppUser } from "../types/appUser";
import type { MessageDetailData } from "../components/users/UserMessageDetail";
import { getUsers } from "../api/user/userApi";
import { addFriend } from "../api/friend/addFriendApi";
import { useAuthSession } from "./useAuthSession";

/**
 * UsersPage의 데이터 조회, 상태, 로직을 모두 관리하는 커스텀 훅.
 */
export function useUsersPageLogic() {
  const queryClient = useQueryClient();
  const { user: sessionUser } = useAuthSession();
  const currentUserId = sessionUser?.id;

  // 2. useLocation 훅을 사용하여 location 객체 가져오기
  const location = useLocation();
  // location.state 타입 정의
  const initialState = location.state as
    | { selectedUserId?: string; openMessages?: boolean }
    | undefined;

  // 3. TanStack Query로 사용자 목록 조회
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // 4. TanStack Query로 친구 추가 기능 구현
  const addFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!currentUserId) throw new Error("로그인이 필요합니다.");
      return addFriend(currentUserId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      // toast.success("친구 추가에 성공했습니다!");
    },
    onError: (error: Error) => {
      console.error(error);
      // toast.error(error.message);
    },
  });

  // 5. UI 상호작용과 관련된 상태
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(
    null
  );
  // 6. [수정] isMessageOpen 상태를 UserDetailPanel에서 여기로 이동
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  // 7. [수정] isReplyOpen 상태 제거 (UsersPage.tsx에서 사용 안 함)
  const userDetailsRef = useRef<HTMLDivElement>(null);

  // 8. 가져온 데이터를 UI에 맞게 가공 (기존과 동일)
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
    [processedUsers, selectedId]
  );

  // 9. [추가] NotificationModal에서 이동 시 사용자 선택 및 패널 열기
  useEffect(() => {
    // 사용자가 로드되었고, location.state에 selectedUserId가 있는지 확인
    if (initialState?.selectedUserId && users.length > 0) {
      const userExists = users.some(
        (u) => u.id === initialState.selectedUserId
      );
      if (userExists) {
        // 사용자 선택
        setSelectedId(initialState.selectedUserId);
        // 메시지 패널 열기
        if (initialState.openMessages) {
          setIsMessageOpen(true);
        }
        // 1회성 동작이므로 state를 비워줍니다.
        window.history.replaceState({}, document.title);
      }
    }
    // users가 로드되거나 location state가 변경될 때 실행
  }, [users, initialState?.selectedUserId, initialState?.openMessages]);

  // 10. [유지] 외부 클릭 시 선택 해제하는 로직 (pickedMessage도 닫도록 수정)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDetailsRef.current &&
        !userDetailsRef.current.contains(event.target as Node)
      ) {
        setSelectedId(null);
        setPickedMessage(null);
        setIsMessageOpen(false); // 외부 클릭 시 메시지 패널도 닫기
      }
    };
    if (selectedId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedId]); // selectedId에만 의존

  // 11. 이벤트 핸들러 함수들
  const handleSelectUser = useCallback((user: AppUser) => {
    setSelectedId((prevId) => {
      const newId = prevId === user.id ? null : user.id;
      if (prevId !== newId) {
        setPickedMessage(null);
        setIsMessageOpen(false); // 12. [수정] isReplyOpen -> isMessageOpen
      }
      return newId;
    });
  }, []);

  const handleAddFriend = useCallback(() => {
    if (!selectedUser) return;
    addFriendMutation.mutate(selectedUser.id);
  }, [selectedUser, addFriendMutation]);

  // 13. [추가] 메시지 패널 토글 핸들러
  const toggleMessage = useCallback(() => setIsMessageOpen((p) => !p), []);

  // 14. [수정] openReply, closeReply 제거

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
    isMessageOpen, // [추가]
    isAddingFriend: addFriendMutation.isPending,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    toggleMessage, // [추가]
    userDetailsRef,
    // [제거] isReplyOpen, openReply, closeReply
  };
}
// // hooks/useUsersPageLogic.ts

// import { useState, useMemo, useCallback, useRef, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // useQueryClient 추가
// import type { AppUser } from "../types/appUser";
// import type { MessageDetailData } from "../components/users/UserMessageDetail";
// import { getUsers } from "../api/user/userApi";
// import { addFriend } from "../api/friend/addFriendApi";
// import { useAuthSession } from "./useAuthSession";
// // import { toast } from "react-hot-toast"; // 사용자 피드백 라이브러리 예시

// /**
//  * UsersPage의 데이터 조회, 상태, 로직을 모두 관리하는 커스텀 훅.
//  */
// export function useUsersPageLogic() {
//   // 0. QueryClient 인스턴스 가져오기 (데이터 동기화를 위해)
//   const queryClient = useQueryClient();

//   // 1. 현재 로그인한 사용자 정보 가져오기
//   const { user: sessionUser } = useAuthSession();
//   const currentUserId = sessionUser?.id;

//   // 2. TanStack Query로 사용자 목록 조회
//   const { data: users = [], isLoading, isError, error } = useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });

//   // 3. TanStack Query로 친구 추가 기능 구현
//   const addFriendMutation = useMutation({
//     mutationFn: (friendId: string) => {
//       if (!currentUserId) throw new Error("로그인이 필요합니다.");
//       return addFriend(currentUserId, friendId);
//     },
//     onSuccess: () => {
//       // ✅ [개선] 친구 추가 성공 시, 관련 쿼리를 무효화하여 최신 데이터로 업데이트
//       // 예를 들어 'friends'라는 쿼리 키를 사용하는 친구 목록이 있다면 아래와 같이 처리
//       queryClient.invalidateQueries({ queryKey: ["friends"] });
//       // toast.success("친구 추가에 성공했습니다!"); // ✅ [개선] 사용자에게 성공 피드백
//     },
//     onError: (error: Error) => {
//       console.error(error); // 에러 로깅
//       // toast.error(error.message); // ✅ [개선] 사용자에게 에러 피드백
//     },
//   });

//   // 4. UI 상호작용과 관련된 상태
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(null);
//   const [isReplyOpen, setIsReplyOpen] = useState(false);
//   const userDetailsRef = useRef<HTMLDivElement>(null); // ✅ [추가] 외부 클릭 감지용 ref

//   // 5. 가져온 데이터를 UI에 맞게 가공
//   // (기존 코드와 동일, 매우 잘 작성됨)
//   const processedUsers = useMemo(() => {
//     const formattedUsers = users.map((user) => ({
//       ...user,
//       joinedAt: user.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "정보 없음",
//     }));
//     if (!currentUserId) return formattedUsers;
//     return formattedUsers.sort((a, b) => {
//       if (a.id === currentUserId) return -1;
//       if (b.id === currentUserId) return 1;
//       return a.name.localeCompare(b.name);
//     });
//   }, [users, currentUserId]);

//   const selectedUser = useMemo(() => processedUsers.find((u) => u.id === selectedId) ?? null, [processedUsers, selectedId]);

//   // ✅ [추가] 외부 클릭 시 선택 해제하는 로직
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (userDetailsRef.current && !userDetailsRef.current.contains(event.target as Node)) {
//         setSelectedId(null);
//         setPickedMessage(null);
//       }
//     };
//     if (selectedId) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [selectedId]);


//   // 6. 이벤트 핸들러 함수들 (기존 코드와 동일, 최적화 잘 되어있음)
//   const handleSelectUser = useCallback((user: AppUser) => {
//     setSelectedId((prevId) => {
//       const newId = prevId === user.id ? null : user.id;
//       if (prevId !== newId) {
//         setPickedMessage(null);
//         setIsReplyOpen(false);
//       }
//       return newId;
//     });
//   }, []);

//   const handleAddFriend = useCallback(() => {
//     if (!selectedUser) return;
//     addFriendMutation.mutate(selectedUser.id);
//   }, [selectedUser, addFriendMutation]);

//   const openReply = useCallback(() => setIsReplyOpen(true), []);
//   const closeReply = useCallback(() => setIsReplyOpen(false), []);

//   // 7. 페이지 컴포넌트에 필요한 모든 상태와 함수를 반환
//   return {
//     users: processedUsers,
//     isLoading,
//     isError,
//     error,
//     currentUserId,
//     selectedId,
//     selectedUser,
//     pickedMessage,
//     isReplyOpen,
//     isAddingFriend: addFriendMutation.isPending,
//     handleSelectUser,
//     setPickedMessage,
//     handleAddFriend,
//     openReply,
//     closeReply,
//     userDetailsRef, // ✅ [추가] ref 반환
//   };
// }