import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/movieClub.svg";
import search from "../assets/searchBar.svg";

export default function Header() {
  // ✅ 네비게이션 메뉴 정의
  const navItems = [
    { id: 1, name: "HOME", path: "/" },
    { id: 2, name: "MOVIES", path: "/movies" },
    { id: 3, name: "REVIEWS", path: "/reviews" },
    { id: 4, name: "USERS", path: "/error" }, 
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navListRef = useRef<HTMLLIElement[]>([]);

  // 인디케이터 위치 조정
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(
        (item) => item.path === location.pathname
      );

      if (activeIndex !== -1) {
        const activeItem = navListRef.current[activeIndex];
        if (activeItem) {
          setIndicatorStyle({
            left: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
            opacity: 1,
          });
        }
      } else {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location.pathname]);

  return (
    <header className="w-full h-[8vh] bg-white shadow-sm font-sans flex items-center justify-between px-[105px]">
      {/* 로고 + 네비게이션 */}
      <div className="flex items-center space-x-[121px]">
        <button onClick={() => navigate("/")} className="flex-shrink-0">
          <img
            src={logo}
            alt="MOVIECLUB Logo"
            className="w-[165px] h-[48px]"
          />
        </button>

        <nav className="relative">
          <ul className="flex relative">
            {navItems.map((item, index) => (
              <li
                key={item.id}
                ref={(el) => {
                  if (el) navListRef.current[index] = el;
                }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-[120px] h-[45px] flex items-center justify-center
                    text-[20px] font-medium tracking-wider transition-colors duration-300
                    ${
                      location.pathname === item.path
                        ? "text-[#9858F3]"
                        : "text-black/50 hover:text-black/80"
                    }`}
                >
                  {item.name}
                </button>
              </li>
            ))}

            {/* 인디케이터 */}
            <div
              className="absolute -bottom-1 h-[3px] bg-[#9858F3] rounded-full transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </ul>
        </nav>
      </div>

      {/* 검색창 */}
      <div className="relative w-[220px] h-[40px] flex-shrink-0">
        <img
          src={search}
          alt="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full bg-white border border-black/12 rounded-full
            pl-10 pr-4 text-[13px] placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-[#9858F3]/50"
        />
      </div>
    </header>
  );
}
