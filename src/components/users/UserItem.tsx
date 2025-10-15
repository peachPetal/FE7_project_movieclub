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

export default function UserItem({ user, selected, onClick, className }: Props) {
  const { name, is_online, avatar_url } = user;
  const { isDark } = useTheme();

  const fallbackIcon = isDark ? profileIconWhite : profileIconBlack;

  return (
    <button
      type="button"
      onClick={() => onClick?.(user)}
      className={clsx(
        // 기본 스타일
        "flex w-full cursor-pointer items-center gap-4 rounded-lg p-4 text-left transition",
        // 포커스 스타일
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]",
        
        // ✅ 다크 모드 스타일 추가
        // 그림자와 미세한 테두리를 추가하여 입체감을 줍니다.
        "dark:shadow-lg dark:shadow-black/20 dark:border dark:border-neutral-800",

        // 선택 상태에 따른 배경색 변경
        {
          "bg-[var(--color-main-10)]": selected,
          "bg-[var(--color-background-main)] hover:bg-[var(--color-main-10)] dark:bg-neutral-900 dark:hover:bg-neutral-800":
            !selected,
        },
        className,
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