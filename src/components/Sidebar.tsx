import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import notificationsIcon from "../assets/notifications.svg";
import profileIcon from "../assets/person.svg";
import friendsIcon from "../assets/person-circle-black.svg";
import settingIcon from "../assets/setting.svg";
import logoutIcon from "../assets/logout.svg";
import accountIcon from "../assets/person-circle-white.svg";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFriendsMenuOpen, setIsFriendsMenuOpen] = useState(true);

  // 로그인 상태 예시 (나중에 실제 auth 상태로 교체 가능)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const friendsData = [
    { id: 1, name: "Friend 1", status: "online" as const },
    { id: 2, name: "Friend 2", status: "offline" as const },
    { id: 3, name: "Friend 3", status: "offline" as const },
  ];

  const handleToggleCollapse = () => setIsCollapsed(!isCollapsed);
  const handleToggleFriendsMenu = () =>
    setIsFriendsMenuOpen(!isFriendsMenuOpen);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/loginPage");
  };

  return (
    <aside
      className={`
        w-[290px] bg-[#FAFAFA] shadow-lg rounded-[10px] font-pretendard flex flex-col
        transition-all duration-300 ease-in-out ml-[50px]
        ${isLoggedIn ? (isCollapsed ? "h-[852px]" : "h-[110px]") : "h-[255px]"}
      `}
    >
      {/* 상단 영역 */}
      <div
        className={`flex h-[110px] items-center p-4 bg-[#9858F3] text-white relative ${
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
          {isLoggedIn ? (
            <p className="text-sm text-white/90">kikoherrsc@gmail.com</p>
          ) : (
            <p className="text-sm text-white/90">로그인 해주세요</p>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={handleToggleCollapse}
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
                isCollapsed ? "-rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 로그인 여부에 따른 사이드바 내용 */}
      {!isCollapsed && (
        <div className="flex flex-col flex-1 p-4 overflow-y-auto transition-all duration-300">
          {isLoggedIn ? (
            <>
              {/* 상단 메뉴 */}
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
                  >
                    <img
                      src={notificationsIcon}
                      alt="Notifications"
                      className="w-6 h-6 mr-3"
                    />
                    Notifications
                  </a>
                </li>

                <li>
                  <button
                    onClick={handleToggleFriendsMenu}
                    className="flex w-full items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
                    aria-expanded={isFriendsMenuOpen}
                  >
                    <img
                      src={friendsIcon}
                      alt="Friends"
                      className="w-6 h-6 mr-3"
                    />
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
                          <a
                            href="#"
                            className="flex items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
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
                                    : "bg-black"
                                }`}
                              />
                            </div>
                            <span>{friend.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              {/* 하단 메뉴 */}
              <div className="mt-auto border-t border-gray-200 pt-4">
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="flex items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
                    >
                      <img
                        src={profileIcon}
                        alt="Profile"
                        className="w-6 h-6 mr-3"
                      />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
                    >
                      <img
                        src={settingIcon}
                        alt="Settings"
                        className="w-6 h-6 mr-3"
                      />
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center p-2 rounded-lg text-[#373737] hover:bg-gray-200"
                    >
                      <img
                        src={logoutIcon}
                        alt="Logout"
                        className="w-6 h-6 mr-3"
                      />
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            // 로그인되지 않은 상태일 때
            <div className="flex flex-col items-center justify-center flex-1">
              <button
                className="px-4 py-2 bg-[#9858F3] text-white rounded-lg hover:bg-[#8645e6] transition-colors"
                onClick={handleLoginClick}
              >
                로그인 / 회원가입
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}