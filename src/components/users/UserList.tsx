// src/components/users/UserList.tsx
import { useState } from "react";
import type { AppUser } from "../../types/appUser";
import { FILTER_OPTIONS, type FilterOption } from "../../types/Filter";
import FilterDropdown from "../common/buttons/FilterDropdown";
import UserItem from "./UserItem";

// --- UserList 컴포넌트 전용 Props 타입 ---
export type UserListProps = {
  users: AppUser[];
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
  isLoading: boolean;
  error: Error | null;
};

// --- UserList 컴포넌트 ---
const UserList = ({
  users,
  selectedId,
  onSelectUser,
  isLoading,
  error,
}: UserListProps) => {
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.Users[0]);
  const handleChangeFilter = (filter: FilterOption) => {
    setFilter(filter);
  };
  return (
    <div className="flex w-[290px] max-w-lg flex-col gap-4">
      <FilterDropdown
        type="Users"
        filter={filter}
        handleChangeFilter={handleChangeFilter}
      />
      {isLoading && (
        <div className="p-4 text-center text-[var(--color-text-sub)]">
          로딩 중...
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">{error.message}</div>
      )}
      {!isLoading && !error && (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id}>
              <UserItem
                user={user}
                selected={user.id === selectedId}
                onClick={onSelectUser}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
