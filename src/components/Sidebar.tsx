import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import notificationsIcon from "../assets/notifications.svg";
import profileIcon from "../assets/person.svg";
import friendsIcon from "../assets/person-circle-black.svg";
import settingIcon from "../assets/setting.svg";
import logoutIcon from "../assets/logout.svg";
import accountIcon from "../assets/person-circle-white.svg";

import messageIcon from "../assets/message.svg";
import deleteFriendMouseOff from "../assets/deleteFriendMouseOff.svg";
import deleteFriendMouseOn from "../assets/deleteFriendMouseOn.svg";

type FriendStatus = "online" | "offline";

interface Friend {
  id: number;
  name: string;
  status: FriendStatus;
}

interface SidebarHeaderProps {
  isLoggedIn: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isLoggedIn,
  isCollapsed,
  onToggleCollapse,
}) => (
  <div
    className={`flex h-[110px] shrink-0 items-center p-4 bg-[#9858F3] text-white relative ${
      isCollapsed ? "rounded-[10px]" : "rounded-t-[10px]"
    }`}
  >
    <div className="relative mr-4">
      <img src={accountIcon} alt="Account" className="w-10 h-10" />
      {isLoggedIn && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-[#9858F3] bg-green-500" />
      )}
    </div>
    <div>
      <p className="text-sm text-white/90">
        {isLoggedIn ? "kikoherrsc@gmail.com" : "로그인 해주세요"}
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
}

const LoggedInContent: React.FC<LoggedInContentProps> = ({
  friendsData,
  onFriendClick,
}) => {
  const [isFriendsMenuOpen, setIsFriendsMenuOpen] = useState(true);
  const handleToggleFriendsMenu = () =>
    setIsFriendsMenuOpen(!isFriendsMenuOpen);

  return (
    <div className="flex flex-col flex-1 p-4 overflow-y-auto">
      <ul className="space-y-1">
        <li>
          <button className="flex items-center w-full p-2 rounded-lg text-[#373737] hover:bg-gray-200">
            <img src={notificationsIcon} alt="" className="w-6 h-6 mr-3" />
            Notifications
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={handleToggleFriendsMenu}
            className="flex w-full items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
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
              isFriendsMenuOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <ul className="space-y-1 pl-6 pt-1">
              {friendsData.map((friend) => (
                <li key={friend.id}>
                  <div
                    className="group flex items-center justify-between p-2 rounded-lg text-[#373737] hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={(e) => onFriendClick(friend, e)}
                  >
                    <a
                      href={`/profile/${friend.id}`}
                      className="flex items-center flex-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="relative mr-3">
                        <img
                          src={friendsIcon}
                          alt={friend.name}
                          className="h-8 w-8"
                        />
                        <span
                          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white ${
                            friend.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <span>{friend.name}</span>
                    </a>

                    {/* <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity duration-200">
                      <button
                        type="button"
                        className="relative w-8 h-8 flex items-center justify-center rounded-full bg-gray-500 hover:bg-red-500 transition-colors group/delete"
                        aria-label="Delete friend"
                      >
                        <img
                          src={deleteFriendMouseOff}
                          alt="delete"
                          className="w-8 h-8 opacity-100 group-hover/delete:opacity-0 transition-opacity duration-200"
                        />
                        <img
                          src={deleteFriendMouseOn}
                          alt="delete hover"
                          className="w-8 h-8 absolute opacity-0 group-hover/delete:opacity-100 transition-opacity duration-200"
                        />
                      </button>

                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#9858F3] hover:bg-[#8645e6] transition-colors"
                        aria-label="Send message"
                      >
                        <img src={messageIcon} alt="message" className="w-8 h-8" />
                      </button>
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <ul className="space-y-1">
          <li>
            <button className="flex items-center w-full p-2 rounded-lg text-[#373737] hover:bg-gray-200">
              <img src={profileIcon} alt="" className="w-6 h-6 mr-3" />
              Profile
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-2 rounded-lg text-[#373737] hover:bg-gray-200">
              <img src={settingIcon} alt="" className="w-6 h-6 mr-3" />
              Settings
            </button>
          </li>
          <li>
            <button className="flex items-center w-full p-2 rounded-lg text-[#373737] hover:bg-gray-200">
              <img src={logoutIcon} alt="" className="w-6 h-6 mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

interface LoggedOutContentProps {
  onLoginClick: () => void;
}

const LoggedOutContent: React.FC<LoggedOutContentProps> = ({
  onLoginClick,
}) => (
  <div className="flex flex-col items-center justify-center flex-1 p-4">
    <button
      className="w-[200px] h-[50px] bg-[#9858F3] text-white rounded-lg hover:bg-[#8645e6] transition-colors"
      onClick={onLoginClick}
    >
      로그인 / 회원가입
    </button>
  </div>
);

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [modalFriend, setModalFriend] = useState<Friend | null>(null);
  const [modalY, setModalY] = useState(0);

  const friendsData: Friend[] = [
    { id: 1, name: "Friend 1", status: "online" },
    { id: 2, name: "Friend 2", status: "offline" },
    { id: 3, name: "Friend 3", status: "offline" },
  ];

  const navigate = useNavigate();
  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleLoginClick = () => navigate("/loginPage");

  const handleFriendClick = (
    friend: Friend,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalY(rect.top + window.scrollY);
    setModalFriend(friend);
  };

  const closeModal = () => setModalFriend(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <>
      <aside
        className={`
        w-[290px] bg-[#FAFAFA] shadow-lg rounded-[10px] font-pretendard flex flex-col
        transition-all duration-300 ease-in-out ml-[50px]
        ${isLoggedIn ? (isCollapsed ? "h-[110px]" : "h-[852px]") : "h-[255px]"}
      `}
      >
        <SidebarHeader
          isLoggedIn={isLoggedIn}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {!isCollapsed && (
          <>
            {isLoggedIn ? (
              <LoggedInContent
                friendsData={friendsData}
                onFriendClick={handleFriendClick}
              />
            ) : (
              <LoggedOutContent onLoginClick={handleLoginClick} />
            )}
          </>
        )}
      </aside>

      {/* 모달 */}
      {modalFriend && (
        <div
          ref={modalRef}
          className="absolute left-[347px] w-[290px] h-[82px] bg-[#FAFAFA] rounded-lg shadow-md z-50 flex items-center px-4"
          style={{ top: modalY }}
        >
          {/* 친구 아이콘 + 상태 */}
          <div className="relative w-12 h-12">
            <img
              src={friendsIcon}
              alt={modalFriend.name}
              className="w-full h-full rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-white ${
                modalFriend.status === "online" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>

          {/* 친구 이름과 상태 */}
          <div className="ml-4 flex flex-col justify-center">
            <p className="font-medium text-black">{modalFriend.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {modalFriend.status === "online" ? "Online" : "Offline"}
            </p>
          </div>

          {/* 버튼 */}
          <div className="ml-auto flex gap-2">
            <button className="relative w-8 h-8 group">
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
    </>
  );
}
