import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useFriends, type Friend } from "../../hooks/useFriends";
import { supabase } from "../../utils/supabase";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { Message } from "./NotificationModal";

import { deleteFriend } from "../../api/friend/deleteFriendApi";
import { SidebarHeader } from "./sidebarHeader";
import { LoggedInContent } from "./LoggedInContent";
import { FriendContextMenu } from "./FriendContextMenu";
import { NotificationModal } from "./NotificationModal";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user, loading } = useAuthSession();
  const { profile } = useUserProfile();
  const { friends } = useFriends();

  const isLoggedIn = !!user;
  const userId = user?.id;

  const { data: notificationsData, isLoading: isNotificationsLoading } =
    useQuery({
      queryKey: ["notifications", userId],
      queryFn: async () => {
        if (!userId) return [];
        const { data, error } = await supabase
          .from("friends_messages")
          .select("id, title, created_at, sender_id, receiver_id, text, read")
          .eq("receiver_id", userId)
          .eq("read", false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return (data as Message[]) ?? [];
      },
      enabled: !!userId, // userId가 있을 때만 쿼리 실행
      refetchInterval: 60000, // 1분마다 새 알림이 있는지 확인
    });

  const notifications: Message[] = notificationsData ?? [];
  const notificationCount = notifications.length;

  // UI 상태
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalFriend, setModalFriend] = useState<Friend | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState({
    top: 0,
    left: 0,
  });

  // DOM 참조
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const modalFriendRef = useRef<HTMLDivElement>(null);
  const modalNotificationRef = useRef<HTMLDivElement>(null);

  // 친구 삭제 뮤테이션
  const deleteFriendMutation = useMutation({
    mutationFn: (friendId: string) => {
      if (!userId) throw new Error("User not logged in");
      return deleteFriend(userId, friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
      setModalFriend(null);
    },
  });

  // 이벤트 핸들러
  const handleToggleCollapse = useCallback(
    () => setIsCollapsed((prev) => !prev),
    [],
  );

  const handleFriendClick = useCallback(
    (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => {
      if (modalNotificationOpen) setModalNotificationOpen(false);
      const rect = e.currentTarget.getBoundingClientRect();
      setModalPosition({
        top: rect.top + window.scrollY,
        left: rect.right + 10,
      });
      setModalFriend(friend);
    },
    [modalNotificationOpen],
  );

  const handleDeleteFriend = useCallback(() => {
    if (modalFriend) deleteFriendMutation.mutate(modalFriend.id);
  }, [modalFriend, deleteFriendMutation]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login");
  }, [navigate]);

  const handleProfileClick = useCallback(
    () => navigate("/profile"),
    [navigate],
  );
  const handleSettingsClick = useCallback(
    () => navigate("/settings"),
    [navigate],
  );

  // 알림 버튼 클릭
  const handleNotificationClick = useCallback(() => {
    setModalFriend(null);
    setModalNotificationOpen((prev) => {
      if (!prev && notificationButtonRef.current) {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        setNotificationPosition({
          top: rect.top + window.scrollY,
          left: rect.right + 10,
        });
      }
      return !prev;
    });
  }, []);

  const closeModals = useCallback(() => {
    setModalFriend(null);
    setModalNotificationOpen(false);
  }, []);

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modalFriendRef.current && !modalFriendRef.current.contains(target))
        closeModals();
      if (
        modalNotificationRef.current &&
        !modalNotificationRef.current.contains(target)
      )
        closeModals();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModals]);

  return (
    <>
      <aside
        className={`w-[290px] bg-[var(--color-background-sub)] shadow-lg rounded-[10px] font-pretendard flex flex-col transition-all duration-300 ease-in-out ml-[50px] ${
          !loading && isLoggedIn
            ? isCollapsed
              ? "h-[110px]"
              : "h-[852px]"
            : "h-[255px]"
        }`}
      >
        <SidebarHeader
          isLoggedIn={isLoggedIn}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          name={profile?.name ?? undefined}
          avatarUrl={profile?.avatar_url ?? undefined}
          loading={loading}
        />

        {!isCollapsed && (
          <>
            {!loading && isLoggedIn ? (
              <LoggedInContent
                friendsData={friends}
                onFriendClick={handleFriendClick}
                onLogout={handleLogout}
                onNotificationClick={handleNotificationClick}
                notificationButtonRef={notificationButtonRef}
                onProfileClick={handleProfileClick}
                onSettingsClick={handleSettingsClick}
                // ✅ 4. 알림 개수를 prop으로 전달합니다.
                notificationCount={notificationCount}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-4">
                <button
                  className="w-[200px] h-[50px] bg-[var(--color-main)] text-white rounded-lg hover:bg-[var(--color-main-80)] transition-colors"
                  onClick={() => navigate("/login")}
                >
                  로그인 / 회원가입
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {modalFriend && (
        <FriendContextMenu
          friend={modalFriend}
          position={modalPosition}
          onDelete={handleDeleteFriend}
          isDeleting={deleteFriendMutation.isPending}
          modalRef={modalFriendRef}
        />
      )}

      {modalNotificationOpen && (
        <NotificationModal
            position={notificationPosition}
            modalRef={modalNotificationRef}
            userId={userId}
            data={notifications}
            isLoading={isNotificationsLoading}
            queryClient={queryClient}
          />
      )}
    </>
  );
}
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserProfile } from "../../hooks/useUserProfile";
// import { useAuthSession } from "../../hooks/useAuthSession";
// import { useFriends, type Friend } from "../../hooks/useFriends";
// import { supabase } from "../../utils/supabase";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { deleteFriend } from "../../api/friend/deleteFriendApi";
// import { SidebarHeader } from "./sidebarHeader";
// import { LoggedInContent } from "./LoggedInContent";
// import { FriendContextMenu } from "./FriendContextMenu";
// import { NotificationModal } from "./NotificationModal";

// export default function Sidebar() {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const { user, loading } = useAuthSession();
//   const { profile } = useUserProfile();
//   const { friends } = useFriends();

//   const isLoggedIn = !!user;
//   const userId = user?.id;

//   // UI 상태
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [modalFriend, setModalFriend] = useState<Friend | null>(null);
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [modalNotificationOpen, setModalNotificationOpen] = useState(false);
//   const [notificationPosition, setNotificationPosition] = useState({
//     top: 0,
//     left: 0,
//   });

//   // DOM 참조
//   const notificationButtonRef = useRef<HTMLButtonElement>(null);
//   const modalFriendRef = useRef<HTMLDivElement>(null);
//   const modalNotificationRef = useRef<HTMLDivElement>(null);

//   // 친구 삭제 뮤테이션
//   const deleteFriendMutation = useMutation({
//     mutationFn: (friendId: string) => {
//       if (!userId) throw new Error("User not logged in");
//       return deleteFriend(userId, friendId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["friends", userId] });
//       setModalFriend(null);
//     },
//   });

//   // 이벤트 핸들러
//   const handleToggleCollapse = useCallback(
//     () => setIsCollapsed((prev) => !prev),
//     []
//   );

//   const handleFriendClick = useCallback(
//     (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => {
//       if (modalNotificationOpen) setModalNotificationOpen(false);
//       const rect = e.currentTarget.getBoundingClientRect();
//       setModalPosition({
//         top: rect.top + window.scrollY,
//         left: rect.right + 10,
//       });
//       setModalFriend(friend);
//     },
//     [modalNotificationOpen]
//   );

//   const handleDeleteFriend = useCallback(() => {
//     if (modalFriend) deleteFriendMutation.mutate(modalFriend.id);
//   }, [modalFriend, deleteFriendMutation]);

//   const handleLogout = useCallback(async () => {
//     await supabase.auth.signOut();
//     navigate("/login");
//   }, [navigate]);

//   const handleProfileClick = useCallback(
//     () => navigate("/profile"),
//     [navigate]
//   );
//   const handleSettingsClick = useCallback(
//     () => navigate("/settings"),
//     [navigate]
//   );

//   // 알림 버튼 클릭
//   const handleNotificationClick = useCallback(() => {
//     setModalFriend(null);
//     setModalNotificationOpen((prev) => {
//       if (!prev && notificationButtonRef.current) {
//         const rect = notificationButtonRef.current.getBoundingClientRect();
//         setNotificationPosition({
//           top: rect.top + window.scrollY,
//           left: rect.right + 10,
//         });
//       }
//       return !prev;
//     });
//   }, []);

//   const closeModals = useCallback(() => {
//     setModalFriend(null);
//     setModalNotificationOpen(false);
//   }, []);

//   // 바깥 클릭 시 모달 닫기
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;
//       if (modalFriendRef.current && !modalFriendRef.current.contains(target))
//         closeModals();
//       if (
//         modalNotificationRef.current &&
//         !modalNotificationRef.current.contains(target)
//       )
//         closeModals();
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [closeModals]);

//   return (
//     <>
//       <aside
//         className={`w-[290px] bg-[var(--color-background-sub)] shadow-lg rounded-[10px] font-pretendard flex flex-col transition-all duration-300 ease-in-out ml-[50px] ${
//           !loading && isLoggedIn
//             ? isCollapsed
//               ? "h-[110px]"
//               : "h-[852px]"
//             : "h-[255px]"
//         }`}
//       >
//         <SidebarHeader
//           isLoggedIn={isLoggedIn}
//           isCollapsed={isCollapsed}
//           onToggleCollapse={handleToggleCollapse}
//           name={profile?.name ?? undefined}
//           avatarUrl={profile?.avatar_url ?? undefined}
//           loading={loading}
//         />

//         {!isCollapsed && (
//           <>
//             {!loading && isLoggedIn ? (
//               <LoggedInContent
//                 friendsData={friends}
//                 onFriendClick={handleFriendClick}
//                 onLogout={handleLogout}
//                 onNotificationClick={handleNotificationClick}
//                 notificationButtonRef={notificationButtonRef}
//                 onProfileClick={handleProfileClick}
//                 onSettingsClick={handleSettingsClick}
//               />
//             ) : (
//               <div className="flex flex-col items-center justify-center flex-1 p-4">
//                 <button
//                   className="w-[200px] h-[50px] bg-[var(--color-main)] text-white rounded-lg hover:bg-[var(--color-main-80)] transition-colors"
//                   onClick={() => navigate("/login")}
//                 >
//                   로그인 / 회원가입
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </aside>

//       {modalFriend && (
//         <FriendContextMenu
//           friend={modalFriend}
//           position={modalPosition}
//           onDelete={handleDeleteFriend}
//           isDeleting={deleteFriendMutation.isPending}
//           modalRef={modalFriendRef}
//         />
//       )}

//       {modalNotificationOpen && (
//         <NotificationModal
//           position={notificationPosition}
//           modalRef={modalNotificationRef}
//           userId={userId}
//         />
//       )}
//     </>
//   );
// }
