import { useState, useRef, useEffect } from "react";
import logo from "../assets/movieClub.svg";
import search from "../assets/searchBar.svg";

export default function Header() {
  const navItems = [
    { id: 1, name: "HOME" },
    { id: 2, name: "MOVIES" },
    { id: 3, name: "REVIEWS" },
    { id: 4, name: "USERS" },
  ];

  // 활성 탭 상태
  const [activeTab, setActiveTab] = useState<number>(1);
  // 인디케이터 스타일 상태
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  // 각 li의 DOM 참조
  const navListRef = useRef<HTMLLIElement[]>([]);

  //--- 로직 (Effect) ---//
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
  }, [activeTab]);

  //--- 렌더링 (Return JSX) ---//
  return (
    <header className="w-full h-[8vh] bg-white shadow-sm font-sans flex items-center justify-between px-[105px]">
      {/* 좌측: 로고 + 네비게이션 */}
      <div className="flex items-center space-x-[121px]">
        {/* 로고 */}
        <div className="flex-shrink-0">
          <img src={logo} alt="MOVIECLUB Logo" className="w-[165px] h-[48px]" />
        </div>

        {/* 네비게이션 */}
        <nav className="flex relative">
          <ul className="flex relative">
            {navItems.map((item, index) => (
              <li
                key={item.id}
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
            {/* 인디케이터 바 */}
            <div
              className="absolute -bottom-1 h-[3px] bg-[#9858F3] rounded-full transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </ul>
        </nav>
      </div>

      {/* 우측: 검색창 */}
      <div className="flex-shrink-0 w-[220px] h-[40px] relative">
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
            pl-10 pr-4 text-[13px] placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-[#9858F3]/50
          "
        />
      </div>
    </header>
  );
}
