import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useFriends, type Friend } from "../../hooks/useFriends";
import { supabase } from "../../utils/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 분리된 컴포넌트 및 API 임포트
import { deleteFriend } from "../../api/deleteFriendApi";
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

  // UI 상태 관리
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalFriend, setModalFriend] = useState<Friend | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationY, setNotificationY] = useState(0);

  // DOM 요소 참조
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const modalFriendRef = useRef<HTMLDivElement>(null);
  const modalNotificationRef = useRef<HTMLDivElement>(null);

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

  const handleToggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);

  const handleFriendClick = useCallback(
    (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => {
      if (modalNotificationOpen) setModalNotificationOpen(false);
      const rect = e.currentTarget.getBoundingClientRect();
      setModalPosition({ top: rect.top + window.scrollY, left: rect.right + 10 });
      setModalFriend(friend);
    },
    [modalNotificationOpen]
  );

  const handleDeleteFriend = useCallback(() => {
    if (modalFriend) {
      deleteFriendMutation.mutate(modalFriend.id);
    }
  }, [modalFriend, deleteFriendMutation]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login");
  }, [navigate]);

  const handleProfileClick = useCallback(() => navigate("/profile"), [navigate]);
  const handleSettingsClick = useCallback(() => navigate("/settings"), [navigate]);

  const handleNotificationClick = useCallback(() => {
    setModalFriend(null);
    setModalNotificationOpen((prev) => {
      if (!prev && notificationButtonRef.current) {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        setNotificationY(rect.top + window.scrollY);
      }
      return !prev;
    });
  }, []);

  const closeModals = useCallback(() => {
    setModalFriend(null);
    setModalNotificationOpen(false);
  }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;
//       if (modalFriendRef.current && !modalFriendRef.current.contains(target)) {
//         setModalFriend(null);
//       }
//       if (modalNotificationRef.current && !modalNotificationRef.current.contains(target)) {
//         setModalNotificationOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    // 모달 DOM 요소를 변수로 추출
    const friendModal = modalFriendRef.current;
    const notificationModal = modalNotificationRef.current;
    // 👍 Friend 모달이 열려있고, 바깥을 클릭했을 때
    if (friendModal && !friendModal.contains(target)) {
      closeModals();
    }
    
    // 👍 Notification 모달이 열려있고, 바깥을 클릭했을 때
    if (notificationModal && !notificationModal.contains(target)) {
      closeModals();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [closeModals]); // ✅ useCallback으로 감싼 closeModals를 의존성 배열에 추가


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
          position={{ top: notificationY, left: modalPosition.left}}
          modalRef={modalNotificationRef}
        />
      )}
    </>
  );
}