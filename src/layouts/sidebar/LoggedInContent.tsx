import React, { useState } from "react";
import { type Friend } from "../../hooks/useFriends";
import { isDarkMode } from "../../lib/theme";

// --- Asset Imports ---
import notificationsIcon from "../../assets/notifications.svg";
import notificationAlertIcon from "../../assets/notificationsAlert.svg";
import profileIcon from "../../assets/person.svg";
import friendsIcon from "../../assets/person-circle-black.svg";
import darkmodeIcon from "../../assets/darkmode.svg";
import lightmodeIcon from "../../assets/lightmode.svg";
import logoutIcon from "../../assets/logout.svg";

// --- Props 타입 정의 ---
interface LoggedInContentProps {
  friendsData: Friend[];
  onFriendClick: (friend: Friend, e: React.MouseEvent<HTMLDivElement>) => void;
  onLogout: () => void;
  onNotificationClick: () => void;
  notificationButtonRef: React.RefObject<HTMLButtonElement | null>;
  onProfileClick: () => void;
  onChangeThemeClick: () => void;
  notificationCount: number;
}

// --- 컴포넌트 ---
export const LoggedInContent: React.FC<LoggedInContentProps> = ({
  friendsData,
  onFriendClick,
  onLogout,
  onNotificationClick,
  notificationButtonRef,
  onProfileClick,
  onChangeThemeClick,
  notificationCount,
}) => {
  const [isFriendsMenuOpen, setIsFriendsMenuOpen] = useState(true);
  
  const [isDark, setIsDark] = useState(isDarkMode());
  const handleThemeChange = () => {
    onChangeThemeClick(); 
    setIsDark((prev) => !prev); 
  };

  const notificationIconToUse =
    notificationCount > 0 ? notificationAlertIcon : notificationsIcon;

  return (
    <div className="flex flex-col flex-1 p-4 overflow-visible">
      <ul className="space-y-1">
        {/* Notifications Button */}
        <li>
          <button
            ref={notificationButtonRef}
            onClick={onNotificationClick}
            className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
          >
            <img
              src={notificationIconToUse}
              alt="Notifications"
              className="w-6 h-6 mr-3"
            />
            Notifications
            {notificationCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={() => setIsFriendsMenuOpen((prev) => !prev)}
            className="flex w-full items-center p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
            aria-expanded={isFriendsMenuOpen}
          >
            <img src={friendsIcon} alt="Friends" className="w-6 h-6 mr-3" />
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
              isFriendsMenuOpen ? "max-h-[30rem]" : "max-h-0"
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
              <img src={profileIcon} alt="Profile" className="w-6 h-6 mr-3" />
              Profile
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
              onClick={handleThemeChange}
            >
              <img
                src={isDark ? lightmodeIcon : darkmodeIcon}
                alt="Change Theme"
                className="w-6 h-6 mr-3"
              />
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-main-10)]"
              onClick={onLogout}
            >
              <img src={logoutIcon} alt="Logout" className="w-6 h-6 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};