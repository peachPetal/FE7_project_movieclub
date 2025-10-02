import { useState, useRef, useEffect } from "react";
import logo from "../assets/movieClub.svg";

/**
 * MOVIECLUB 웹사이트의 메인 헤더
 * - 로고, 네비게이션, 검색창이 모두 포함된 단일 컴포넌트입니다.
 */
export default function Header() {
  //--- 상태(State) 및 참조(Ref) 정의 ---//

  const navItems = [
    { id: 1, name: "HOME" },
    { id: 2, name: "MOVIES" },
    { id: 3, name: "REVIEWS" },
    { id: 4, name: "USERS" },
  ];

  const [activeTab, setActiveTab] = useState<number>(1);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navListRef = useRef<HTMLLIElement[]>([]);

  //--- 로직 (Effect) ---//

  // activeTab이 변경될 때마다 인디케이터의 위치를 업데이트하는 Effect
  useEffect(() => {
    const updateIndicator = () => {
      const activeItem = navListRef.current[activeTab - 1];
      if (activeItem) {
        setIndicatorStyle({
          left: activeItem.offsetLeft,
          width: activeItem.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]); // activeTab state가 변경될 때만 이 effect를 재실행합니다.

  //--- 렌더링 (Return JSX) ---//

  return (
    <header className="relative w-full h-[82px] bg-white shadow-sm font-sans">
      {/* 1. 로고 */}
      <div className="absolute top-[25px] left-[105px]">
        <img src={logo} alt="MOVIECLUB Logo" className="w-[165px] h-[48px]" />
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
                      ? "text-[#9858F3]"
                      : "text-black/50 hover:text-black/80"
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
    </header>
  );
}
