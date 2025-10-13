import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/movieClub.svg";
import search from "../assets/searchBar.svg";

// Header 컴포넌트
export default function Header() {
  // Navigation Bar의 항목은 다음과 같음
  const navItems = [
    { id: 1, name: "HOME", path: "/" },
    { id: 2, name: "MOVIES", path: "/movies" },
    { id: 3, name: "REVIEWS", path: "/reviews" },
    { id: 4, name: "USERS", path: "/error" },
  ];

  // 라우팅 구현(이동, 현재 위치 반환)
  const navigate = useNavigate(); // 라우터 이동
  const location = useLocation(); // 현재 위치 반환

  // 인디케이터 상태 관리
  const [indicatorStyle, setIndicatorStyle] = useState({
    // 초기값 세팅
    left: 0,
    width: 0,
    opacity: 0,
  });

  // 검색바 상태 관리
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Dom 요소 조작
  const navListRef = useRef<HTMLLIElement[]>([]);

  //
  useEffect(() => {
    const updateIndicator = () => {
      // activeIndex는 navItems의 item중 path가 location.pathname과 같은 것
      const activeIndex = navItems.findIndex(
        (item) => item.path === location.pathname
      );

      // activeIndex가 -1이 아니면(존재하면)
      if (activeIndex !== -1) {
        // activeItem은 현재 Dom 요소
        const activeItem = navListRef.current[activeIndex];
        // activeItem이 존재하면 
        if (activeItem) {
          // indicator의 디자인을 수정
          setIndicatorStyle({
            left: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
            opacity: 1,
          });
        }
        // 존재하지 않으면 초기값
      } else {
        setIndicatorStyle({ left: 0, width: 0, opacity: 0 });
      }
    };

    // 인디케이터 업데이트
    updateIndicator();
    // 화면의 크기가 바뀌면 업데이트
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location.pathname]);

  return (
    <header className="w-full h-[8vh] bg-[var(--color-background-main)]   shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)]
  dark:shadow-[5px_5px_10px_0_rgba(255,255,255,0.1)] font-sans flex items-center justify-between px-[105px] relative">
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
                        ? "text-[var(--color-main)]"
                        : "text-[var(--color-text-sub)] hover:text-[var(--color-text-main)]"
                    }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
            <div
              className="absolute -bottom-1 h-[3px] bg-[var(--color-main)] rounded-full transition-all duration-300 ease-in-out"
              style={indicatorStyle}
            />
          </ul>
        </nav>
      </div>

      <div className="relative w-[268px] h-[40px] flex-shrink-0">
        <img
          src={search}
          alt="Search"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none dark:invert"
        />
        <input
          type="text"
          placeholder="Search"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full h-full bg-[var(--color-background-main)] border border-[var(--color-text-placeholder)] rounded-full
            pl-10 pr-4 text-[13px] text-[var(--color-text-main)] placeholder:text-[var(--color-text-placeholder)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)"
        />

        {isSearchFocused && (
          <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-10">
            <div
              className="absolute -top-[7px] left-1/2 -translate-x-1/2 
                         w-0 h-0 border-l-[7.5px] border-l-transparent 
                         border-r-[7.5px] border-r-transparent 
                         border-b-[7.5px] border-b-[var(--color-main)]"
            />
            <div
              className="w-[268px] h-[40px] bg-[var(--color-main)] rounded-[30px] 
                         flex items-center justify-center shadow-lg"
            >
              <p className="text-white text-[10px] font-normal font-pretendard">
                사용자를 찾으려면{" "}
                <span className="font-semibold">@아이디</span>를 입력해 보세요
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
