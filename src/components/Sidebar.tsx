import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuthListener } from "../hooks/useAuthListener";
import { useFriends, type Friend } from "../hooks/useFriends";
import { supabase } from "../utils/supabase";

import notificationsIcon from "../assets/notifications.svg";
import profileIcon from "../assets/person.svg";
import friendsIcon from "../assets/person-circle-black.svg";
import settingIcon from "../assets/setting.svg";
import logoutIcon from "../assets/logout.svg";
import accountIcon from "../assets/person-circle-white.svg";
import messageIcon from "../assets/message.svg";
import deleteFriendMouseOff from "../assets/deleteFriendMouseOff.svg";
import deleteFriendMouseOn from "../assets/deleteFriendMouseOn.svg";

interface SidebarHeaderProps {
  isLoggedIn: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  name?: string;
  avatarUrl?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isLoggedIn,
  isCollapsed,
  onToggleCollapse,
  name,
  avatarUrl,
}) => (
  <div
    className={`flex h-[110px] shrink-0 items-center p-4 bg-[var(--color-main)] text-white relative ${
      isCollapsed ? "rounded-[10px]" : "rounded-t-[10px]"
    }`}
  >
    <div className="relative mr-4">
      <img
        src={avatarUrl ?? accountIcon}
        alt="Account"
        className="w-10 h-10 rounded-full object-cover"
      />
      {isLoggedIn && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-[var(--color-main)] bg-[var(--color-alert-online)]" />
      )}
    </div>
    <div>
      <p className="text-sm text-white/90">
        {isLoggedIn ? name ?? "사용자" : "로그인 해주세요"}
      </p>
    </div>
    {isLoggedIn && (
      <button
        onClick={onToggleCollapse}
        className="absolute top-4 right-4 p-1 text-white rounded-full hover:bg-white/20 transition-colors"
        aria-label={isCollapsed ? "펼치기" : "접기"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-6 h-6 transition-transform duration-300 ease-in-out ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 8.25l7.5 7.5 7.5-7.5"
          />
        </svg>
      </button>
    )}
  </div>
);

interface LoggedInContentProps {
  friendsData: Friend[];
  onFriendClick: (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => void;
  onLogout: () => void;
  onNotificationClick: () => void;
  notificationButtonRef: React.RefObject<HTMLButtonElement | null>;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

const LoggedInContent: React.FC<LoggedInContentProps> = ({
  friendsData,
  onFriendClick,
  onLogout,
  onNotificationClick,
  notificationButtonRef,
  onProfileClick,
  onSettingsClick,
}) => {
  const [isFriendsMenuOpen, setIsFriendsMenuOpen] = useState(true);
  const handleToggleFriendsMenu = () =>
    setIsFriendsMenuOpen(!isFriendsMenuOpen);

  return (
    <div className="flex flex-col flex-1 p-4 overflow-visible">
      <ul className="space-y-1">
        <li>
          <button
            ref={notificationButtonRef}
            onClick={onNotificationClick}
            className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
          >
            <img src={notificationsIcon} alt="" className="w-6 h-6 mr-3" />
            Notifications
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={handleToggleFriendsMenu}
            className="flex w-full items-center p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
            aria-expanded={isFriendsMenuOpen}
          >
            <img src={friendsIcon} alt="" className="w-6 h-6 mr-3" />
            <span>Friends</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                isFriendsMenuOpen ? "" : "-rotate-180"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isFriendsMenuOpen ? "max-h-120" : "max-h-0"
            }`}
          >
            <ul className="space-y-1 pl-6 pt-1">
              {friendsData.map((friend) => (
                <li key={friend.id}>
                  <div
                    className="group flex items-center flex-1 p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)] transition-colors cursor-pointer"
                    onClick={(e) => onFriendClick(friend, e)}
                  >
                    <div className="flex items-center flex-1">
                      <div className="relative mr-3 w-8 h-8">
                        <img
                          src={friend.avatarUrl ?? friendsIcon}
                          alt={friend.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full border-2 border-[var(--color-background-sub)] ${
                            friend.status === "online"
                              ? "bg-[var(--color-alert-online)]"
                              : "bg-[var(--color-text-light)]"
                          }`}
                        />
                      </div>
                      <span>{friend.name}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>

      <div className="mt-auto border-t border-[var(--color-text-placeholder)] pt-4">
        <ul className="space-y-1">
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
              onClick={onProfileClick}
            >
              <img src={profileIcon} alt="" className="w-6 h-6 mr-3" />
              Profile
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
              onClick={onSettingsClick}
            >
              <img src={settingIcon} alt="" className="w-6 h-6 mr-3" />
              Settings
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
              onClick={onLogout}
            >
              <img src={logoutIcon} alt="" className="w-6 h-6 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function Sidebar() {
  const { session } = useAuthListener();
  const { profile } = useUserProfile();
  const userId = session?.user?.id ?? null;

  const { friends, setFriends } = useFriends(userId);
  const isLoggedIn = !!session?.user;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalFriend, setModalFriend] = useState<Friend | null>(null);
  const [modalY, setModalY] = useState(0);
  const [modalNotificationOpen, setModalNotificationOpen] = useState(false);
  const [notificationY, setNotificationY] = useState(0);

  const navigate = useNavigate();
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const modalFriendRef = useRef<HTMLDivElement>(null);
  const modalNotificationRef = useRef<HTMLDivElement>(null);

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleFriendClick = (
    friend: Friend,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (modalNotificationOpen) setModalNotificationOpen(false);
    const rect = e.currentTarget.getBoundingClientRect();
    setModalY(rect.top + window.scrollY);
    setModalFriend(friend);
  };

  const handleDeleteFriend = async (friendId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("friendship")
        .delete()
        .or(
          `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
        );

      if (error) throw error;

      // UI 업데이트
      setFriends(friends.filter((f) => f.id !== friendId));
      setModalFriend(null);
    } catch (err) {
      console.error("Failed to delete friend:", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleProfileClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  const handleNotificationClick = () => {
    setModalFriend(null);
    setModalNotificationOpen((prev) => {
      if (!prev && notificationButtonRef.current) {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        setNotificationY(rect.top + window.scrollY);
      }
      return !prev;
    });
  };

  const closeModals = () => {
    setModalFriend(null);
    setModalNotificationOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (modalFriend &&
          modalFriendRef.current &&
          !modalFriendRef.current.contains(event.target as Node)) ||
        (modalNotificationOpen &&
          modalNotificationRef.current &&
          !modalNotificationRef.current.contains(event.target as Node))
      ) {
        closeModals();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalFriend, modalNotificationOpen]);

  return (
    <>
      <aside
        className={`w-[290px] bg-[var(--color-background-sub)] shadow-lg rounded-[10px] font-pretendard flex flex-col transition-all duration-300 ease-in-out ml-[50px] ${
          isLoggedIn ? (isCollapsed ? "h-[110px]" : "h-[852px]") : "h-[255px]"
        }`}
      >
        <SidebarHeader
          isLoggedIn={isLoggedIn}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          name={profile?.name ?? undefined}
          avatarUrl={profile?.avatar_url ?? undefined}
        />

        {!isCollapsed && (
          <>
            {isLoggedIn ? (
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

      {/* Friend 모달 */}
      {modalFriend && (
        <div
          ref={modalFriendRef}
          className="absolute left-[347px] w-[290px] h-[82px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 flex items-center px-4"
          style={{ top: modalY }}
        >
          <div className="relative w-12 h-12">
            <img
              src={modalFriend.avatarUrl ?? friendsIcon}
              alt={modalFriend.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-[var(--color-background-sub)] ${
                modalFriend.status === "online"
                  ? "bg-[var(--color-alert-online)]"
                  : "bg-[var(--color-text-light)]"
              }`}
            />
          </div>
          <div className="ml-4 flex flex-col justify-center">
            <p className="font-medium text-[var(--color-text-main)]">
              {modalFriend.name}
            </p>
            <p className="text-sm text-[var(--color-text-sub)] capitalize">
              {modalFriend.status}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              className="relative w-8 h-8 group"
              onClick={(e) => {
                e.stopPropagation();
                if (modalFriend) handleDeleteFriend(modalFriend.id);
              }}
            >
              <img
                src={deleteFriendMouseOff}
                alt="delete"
                className="w-8 h-8 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
              />
              <img
                src={deleteFriendMouseOn}
                alt="delete hover"
                className="w-8 h-8 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </button>
            <button className="w-8 h-8">
              <img src={messageIcon} className="w-8 h-8" alt="message" />
            </button>
          </div>
        </div>
      )}

      {/* Notification 모달 */}
      {modalNotificationOpen && (
        <div
          ref={modalNotificationRef}
          className="absolute left-[347px] w-[290px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4"
          style={{ top: notificationY, height: 82 * 3 }}
        >
          <p className="p-4 text-[var(--color-text-main)]">Notification 내용</p>
        </div>
      )}
    </>
  );
}
