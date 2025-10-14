import { useEffect, useState } from "react";
import type { AppUser } from "../../types/User";
import profileIconBlack from "../../assets/person-circle-black.svg";
import profileIconWhite from "../../assets/person-circle-white.svg";

type Props = {
  user: AppUser;
  selected?: boolean;
  onClick?: (user: AppUser) => void;
  className?: string;
};

export default function UserItem({
  user,
  selected,
  onClick,
  className,
}: Props) {
  const { name, isOnline } = user;

  // 다크 모드 상태 관리
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => onClick?.(user)}
      className={[
        "shadow-sm w-full flex items-center gap-3 rounded-xl border transition",
        "px-4 py-3",
        "border-[var(--color-text-placeholder)]",
        "hover:border-[var(--color-text-light)] hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]",
        selected
          ? "border-[var(--color-main)] ring-2 ring-[var(--color-main-10)]"
          : "",
        "dark:bg-[var(--color-background-sub)] dark:border-[var(--color-text-light)] dark:hover:border-[var(--color-text-sub)]",
        className || "",
        `
        card-shadow flex items-center gap-4 p-4 rounded-lg cursor-pointer transition
        ${
          selected
            ? "bg-[color:var(--color-main-10)]" // 선택된 상태 (투명도 90%)
            : "bg-[color:var(--color-background-main)] hover:bg-[color:var(--color-main-10)]"
        }
      `,
      ].join(" ")}
      aria-pressed={selected}
    >
      {/* 다크 모드에 따라 아이콘 변경 */}
      <div className="relative h-10 w-10 shrink-0 rounded-full bg-[var(--color-background-sub)] overflow-hidden">
        <img
          src={isDark ? profileIconWhite : profileIconBlack}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="min-w-0 text-left">
        <p className="truncate font-medium text-[var(--color-text-main)]">
          {name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--color-text-sub)]">
          {isOnline ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-alert-online)]" />
              온라인
            </>
          ) : (
            "오프라인"
          )}
        </p>
      </div>
    </button>
  );
}
