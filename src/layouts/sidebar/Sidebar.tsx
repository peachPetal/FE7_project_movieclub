import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useFriends, type Friend } from "../../hooks/useFriends";
import { supabase } from "../../utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useUserMessages } from "../../hooks/useUserMessages";
import { SidebarHeader } from "./sidebarHeader";
import { LoggedInContent } from "./LoggedInContent";
import { FriendContextMenu } from "./FriendContextMenu";
import { NotificationModal } from "./NotificationModal";
import { toggleTheme } from "../../lib/theme";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user, loading } = useAuthSession();
  const { profile } = useUserProfile();

  const { friends, deleteFriend, isDeletingFriend } = useFriends();

  const isLoggedIn = !!user;
  const userId = user?.id;

  // 알림 개수 (기존과 동일)
  const { messages: notifications } = useUserMessages({
    filter: "unread",
  });
  const notificationCount = notifications.length;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalFriend, setModalFriend] = useState<Friend | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState({
    top: 0,
    left: 0,
  });

  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const modalFriendRef = useRef<HTMLDivElement>(null);
  const modalNotificationRef = useRef<HTMLDivElement>(null);
  const lastClickedFriendRef = useRef<HTMLElement | null>(null);

  const handleToggleCollapse = useCallback(
    () => setIsCollapsed((prev) => !prev),
    []
  );

  const handleFriendClick = useCallback(
    (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => {
      if (modalNotificationOpen) setModalNotificationOpen(false);
      lastClickedFriendRef.current = e.currentTarget;
      const rect = e.currentTarget.getBoundingClientRect();
      setModalPosition({
        // top: rect.top + window.scrollY,
        top: rect.top, // rect.top + window.scrollY 에서 window.scrollY 제거
        left: rect.right + 10,
      });
      setModalFriend(friend);
    },
    [modalNotificationOpen]
  );

  const handleDeleteFriend = useCallback(() => {
    if (modalFriend) {
      deleteFriend(modalFriend.id);
      setModalFriend(null); // 즉시 닫기
    }
  }, [modalFriend, deleteFriend]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/login");
  }, [navigate]);

  const handleProfileClick = useCallback(
    () => navigate("/profile"),
    [navigate]
  );

  const handleChangeThemeClick = useCallback(() => {
    toggleTheme();
  }, []);

  const handleNotificationClick = useCallback(() => {
    setModalFriend(null);
    setModalNotificationOpen((prev) => {
      if (!prev && notificationButtonRef.current) {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        setNotificationPosition({
          // top: rect.top + window.scrollY,
          // ✅ [수정] window.scrollY 제거: 뷰포트 상대 좌표 (fixed에 적합)
          top: rect.top, // rect.top + window.scrollY 에서 window.scrollY 제거
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

  useEffect(() => {
    const handleScroll = () => {
      // 1. 친구 컨텍스트 메뉴 위치 업데이트
      if (modalFriend && lastClickedFriendRef.current) {
        const rect = lastClickedFriendRef.current.getBoundingClientRect();
        setModalPosition({
          top: rect.top,
          left: rect.right + 10,
        });
      }

      // 2. 알림 모달 위치 업데이트
      if (modalNotificationOpen && notificationButtonRef.current) {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        setNotificationPosition({
          top: rect.top,
          left: rect.right + 10,
        });
      }
    };

    if (modalFriend || modalNotificationOpen) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [modalFriend, modalNotificationOpen]);

  useEffect(() => {
    // (외부 클릭 감지 로직 - 동일)
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
      {/* <aside
        className={`w-[290px] bg-[var(--color-background-sub)] shadow-lg rounded-[10px] font-pretendard flex flex-col transition-all duration-300 ease-in-out ml-[50px] ${
          !loading && isLoggedIn
            ? isCollapsed
              ? "h-[110px]"
              : "h-[852px]"
            : "h-[255px]"
        }`}
      > */}
      <aside
        className={`w-[290px] bg-[var(--color-background-sub)] shadow-lg rounded-[10px] font-pretendard flex flex-col transition-all duration-300 ease-in-out ${
          !loading && isLoggedIn
            ? isCollapsed
              ? "h-[110px]"
              : "max-h-[852px]" // ⭐️ 수정: max-h-[852px]만 남겨 유동적 높이 유지 (overflow-y-auto 제거)
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
                onChangeThemeClick={handleChangeThemeClick}
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
          isDeleting={isDeletingFriend}
          modalRef={modalFriendRef}
        />
      )}

      {modalNotificationOpen && (
        <NotificationModal
          position={notificationPosition}
          modalRef={modalNotificationRef}
          userId={userId}
          queryClient={queryClient}
        />
      )}
    </>
  );
}
