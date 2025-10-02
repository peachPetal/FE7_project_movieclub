import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/movieClub.svg';
import search from '../assets/searchBar.svg';

/**
 * MOVIECLUB 웹사이트의 메인 헤더
 * - 로고, 네비게이션, 검색창이 모두 포함된 단일 컴포넌트입니다.
 */
export default function Header() {
  //--- 상태(State) 및 참조(Ref) 정의 ---//

  const navItems = [
    { id: 1, name: 'HOME' },
    { id: 2, name: 'MOVIES' },
    { id: 3, name: 'REVIEWS' },
    { id: 4, name: 'USERS' },
  ];

  // 현재 활성화된 탭의 ID를 저장하는 state
  const [activeTab, setActiveTab] = useState<number>(1);
  // 인디케이터의 left, width 값을 저장하는 state
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  // 네비게이션 <li> 요소들의 DOM 참조를 저장하기 위한 ref
  const navListRef = useRef<HTMLLIElement[]>([]);

  //--- 로직 (Effect) ---//

  // activeTab이 변경될 때마다 인디케이터의 위치를 업데이트하는 Effect
  useEffect(() => {
    // 인디케이터의 위치와 너비를 계산하고 state를 업데이트하는 함수
    const updateIndicator = () => {
      const activeItem = navListRef.current[activeTab - 1];
      if (activeItem) {
        setIndicatorStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
        });
      }
    };

    // 탭 변경 시 즉시 위치 업데이트
    updateIndicator();
    // 브라우저 창 크기가 변경될 때도 위치를 다시 계산 (반응형 대응)
    window.addEventListener('resize', updateIndicator);
    // 컴포넌트가 사라지거나, useEffect가 다시 실행되기 전에 이벤트 리스너를 제거 (메모리 누수 방지)
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]); // activeTab state가 변경될 때만 이 effect를 재실행합니다.

  //--- 렌더링 (Return JSX) ---//

  return (
    <header className="relative w-full h-[82px] bg-white shadow-sm font-sans">
      {/* 1. 로고 */}
      <div className="absolute top-[25px] left-[105px]">
        <img
          src={logo}
          alt="MOVIECLUB Logo"
          className="w-[165px] h-[48px]"
        />
      </div>

      {/* 2. 네비게이션 */}
      <nav className="absolute top-[35px] left-[351px]">
        {/* 인디케이터의 위치 기준이 되도록 relative 설정 */}
        <ul className="flex relative">
          {navItems.map((item, index) => (
            <li
              key={item.id}
              // 각 li 요소의 DOM 참조를 배열에 저장
              ref={(el) => {
                if (el) navListRef.current[index] = el;
              }}
            >
              <button
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-[120px] h-[45px] flex items-center justify-center
                  text-[20px] font-medium tracking-wider
                  transition-colors duration-300
                  ${
                    activeTab === item.id
                      ? 'text-[#9858F3]'
                      : 'text-black/50 hover:text-black/80'
                  }
                `}
              >
                {item.name}
              </button>
            </li>
          ))}

          {/* 활성 탭을 시각적으로 나타내는 인디케이터 바 */}
          <div
            className="absolute -bottom-1 h-[3px] bg-[#9858F3] rounded-full transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        </ul>
      </nav>

      {/* 3. 검색창 */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[2.97%] w-[13.96%] h-[40px]">
        <img
          src={search}
          alt="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search"
          className="
            w-full h-full bg-white border border-black/12 rounded-full
            pl-10 pr-4
            text-[13px] placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-[#9858F3]/50
          "
        />
      </div>
    </header>
  );
}
