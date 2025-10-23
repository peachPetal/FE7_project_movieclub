// UserItem.tsx

import clsx from "clsx";
import { useTheme } from "../../hooks/useTheme";
import type { AppUser } from "../../types/appUser";
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
  const { name, is_online, avatar_url } = user;
  const { isDark } = useTheme();

  const fallbackIcon = isDark ? profileIconWhite : profileIconBlack;

  return (
    <button
      type="button"
      onClick={() => onClick?.(user)}
      className={clsx(
        "flex w-full cursor-pointer items-center gap-4 rounded-lg p-4 text-left transition",

        "focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]",

        // ⭐️ [수정] 다크 모드 스타일은 dark: 접두사를 유지합니다.
        "dark:shadow-lg dark:shadow-black/20 dark:border dark:border-neutral-800",

        {
          "bg-[var(--color-main-10)] shadow-md": selected, // ⭐️ 선택된 항목은 라이트 모드에서도 그림자를 추가하여 강조
          
          // ⭐️ [추가/수정] 라이트 모드일 때 테두리(border)와 작은 그림자를 추가하여 구분합니다.
          "bg-[var(--color-background-main)] hover:bg-[var(--color-main-10)] border border-neutral-200 shadow-sm hover:shadow-md dark:bg-neutral-900 dark:hover:bg-neutral-800":
            !selected,
        },
        className
      )}
      aria-pressed={selected}
    >
      {/* 아바타 이미지 */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-background-sub)]">
        <img
          src={avatar_url || fallbackIcon}
          alt={`${name}의 프로필 아바타`}
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* 사용자 정보 */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--color-text-main)]">
          {name}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--color-text-sub)]">
          {is_online ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--color-alert-online)]" />
              Online
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[var(--color-text-light)]" />
              Offline
            </>
          )}
        </p>
      </div>
    </button>
  );
}