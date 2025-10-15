import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";
import logo from "../../assets/movieClub.svg";

// 네비게이션 항목 정의
const NAV_ITEMS = [
  { id: 1, name: "HOME", path: "/" },
  { id: 2, name: "MOVIES", path: "/movies" },
  { id: 3, name: "REVIEWS", path: "/reviews" },
  { id: 4, name: "USERS", path: "/users" },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navListRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = NAV_ITEMS.findIndex(
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
    <div className="flex items-center space-x-[121px]">
      <button onClick={() => navigate("/")} className="flex-shrink-0">
        <img src={logo} alt="MOVIECLUB Logo" className="w-[165px] h-[48px]" />
      </button>

      <nav className="relative">
        <ul className="flex relative">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.id}
              ref={(el) => {if(el) (navListRef.current[index] = el)}}
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
  );
}