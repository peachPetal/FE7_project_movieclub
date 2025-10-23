import React from "react";
import accountIcon from "../../assets/person-circle-white.svg";

interface SidebarHeaderProps {
  isLoggedIn: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  name?: string;
  avatarUrl?: string;
  loading: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isLoggedIn,
  isCollapsed,
  onToggleCollapse,
  name,
  avatarUrl,
  loading,
}) => {
  const displayName = !loading && isLoggedIn ? name ?? "Loading..." : "로그인 해주세요";

  return (
    <div
      className={`flex h-[110px] shrink-0 items-center p-4 bg-[var(--color-main)] text-white relative ${
        isCollapsed ? "rounded-[10px]" : "rounded-t-[10px]"
      }`}
    >
      {/* 아바타 */}
      <div className="relative mr-4">
        <img
          src={avatarUrl ?? accountIcon}
          alt="Account"
          className="w-12 h-12 rounded-full object-cover"
        />
        {!loading && isLoggedIn && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-[var(--color-main)] bg-[var(--color-alert-online)]" />
        )}
      </div>

      {/* 사용자 이름 */}
      <div>
        <p className="text-[16px] text-white/90">{displayName}</p>
      </div>

      {/* 접기/펼치기 버튼 */}
      {!loading && isLoggedIn && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 right-4 p-1 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25l7.5 7.5 7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
};
