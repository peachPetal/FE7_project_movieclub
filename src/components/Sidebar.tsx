import React, { useState } from 'react';

//--- SVG 아이콘 임포트 ---//
import notificationsIcon from '../assets/notifications.svg';
import profileIcon from '../assets/person.svg';
import friendsIcon from '../assets/person-circle-black.svg';
import settingIcon from '../assets/setting.svg';
import logoutIcon from '../assets/logout.svg';
import accountIcon from "../assets/person-circle-white.svg";

/**
 * 애플리케이션의 메인 사이드바
 * - 프로필, 메뉴, 친구 목록 등 모든 UI와 로직을 포함하는 단일 컴포넌트입니다.
 */
export default function Sidebar() {
  //--- 상태(State) 정의 ---//

  // 사이드바 전체의 축소/확장 상태
  const [isCollapsed, setIsCollapsed] = useState(false);
  // 친구 목록 드롭다운의 열림/닫힘 상태
  const [isFriendsMenuOpen, setIsFriendsMenuOpen] = useState(true);

  
  //--- 데이터 ---//
  
  // 친구 목록 데이터 (컴포넌트 분리 대신 map을 사용하기 위함)
  const friendsData = [
    { id: 1, name: 'Friend 1', status: 'online' as const },
    { id: 2, name: 'Friend 2', status: 'offline' as const },
    { id: 3, name: 'Friend 3', status: 'offline' as const },
  ];

  
  //--- 이벤트 핸들러 ---//

  // 사이드바 전체를 토글하는 함수
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 친구 목록 드롭다운을 토글하는 함수
  const handleToggleFriendsMenu = () => {
    setIsFriendsMenuOpen(!isFriendsMenuOpen);
  };


  //--- 렌더링 (Return JSX) ---//

  return (
    <aside
      className={`
        absolute top-[130px] left-[46px] w-[290px] bg-[#FAFAFA]
        shadow-lg rounded-[10px] font-pretendard flex flex-col
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'h-[110px]' : 'h-[752px]'}
      `}
    >
      {/* 1. 상단 프로필 영역 */}
      <div
        className={`
          flex h-[110px] shrink-0 items-center rounded-t-[10px] bg-[#9858F3] p-4 text-white relative
          ${isCollapsed ? 'rounded-b-[10px]' : ''}
        `}
      >
        <div className="relative mr-4">
          <img src={accountIcon} alt="Account" />
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-[#9858F3] bg-green-500" />
        </div>
        <div>
          <p className="text-sm text-white/80">kikoherrsc@gmail.com</p>
        </div>
        <button
          onClick={handleToggleCollapse}
          className="absolute top-4 right-4 p-1 text-white rounded-full hover:bg-white/20 transition-colors"
          aria-label={isCollapsed ? "펼치기" : "접기"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-300 ease-in-out ${isCollapsed ? '-rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* 2. 메인 콘텐츠 영역 (축소 시 전체 숨김) */}
      <div className={`flex flex-col flex-grow p-4 overflow-hidden ${isCollapsed ? 'hidden' : ''}`}>
        
        {/* 2-1. 상단 메뉴 (알림, 친구) */}
        <div className="flex-grow overflow-y-auto">
          <ul className="space-y-1">
            {/* 알림 메뉴 */}
            <li>
              <a href="#" className="flex items-center rounded-lg p-2 text-base font-medium text-[#373737] hover:bg-gray-200">
                <img src={notificationsIcon} alt="Notifications" className="w-6 h-6 mr-3" />
                Notifications
              </a>
            </li>
            {/* 친구 목록 드롭다운 */}
            <li>
              <button
                onClick={handleToggleFriendsMenu}
                className="flex w-full items-center rounded-lg p-2 text-base font-medium text-[#373737] hover:bg-gray-200"
                aria-expanded={isFriendsMenuOpen}
              >
                <img src={friendsIcon} alt="Friends" className="w-6 h-6 mr-3" />
                <span>Friends</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  className={`w-4 h-4 ml-auto transition-transform duration-300 ${isFriendsMenuOpen ? '' : '-rotate-180'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFriendsMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="space-y-1 pt-1 pl-6">
                  {/* FriendListItem 컴포넌트 대신 map()을 사용하여 JSX를 직접 렌더링 */}
                  {friendsData.map((friend) => (
                    <li key={friend.id}>
                      <a href="#" className="flex items-center rounded-lg py-2 px-3 text-base font-medium text-[#373737] hover:bg-gray-200">
                        <div className="relative mr-3">
                          <img src={friendsIcon} alt={friend.name} className="h-8 w-8" />
                          <span
                            className={`
                              absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white
                              ${friend.status === 'online' ? 'bg-green-500' : 'bg-black'}
                            `}
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
        </div>
        
        {/* 2-2. 하단 메뉴 (프로필, 설정, 로그아웃) */}
        <div className="shrink-0 border-t border-gray-200 pt-4 mt-4">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center rounded-lg p-2 text-base font-medium text-[#373737] hover:bg-gray-200">
                <img src={profileIcon} alt="Profile" className="w-6 h-6 mr-3" />
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center rounded-lg p-2 text-base font-medium text-[#373737] hover:bg-gray-200">
                <img src={settingIcon} alt="Settings" className="w-6 h-6 mr-3" />
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center rounded-lg p-2 text-base font-medium text-[#373737] hover:bg-gray-200">
                <img src={logoutIcon} alt="Logout" className="w-6 h-6 mr-3" />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}