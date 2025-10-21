import { useState, useEffect } from "react";
import type { AppUser } from "../../types/appUser";
import { FILTER_OPTIONS } from "../../types/Filter";
import FilterDropdown from "../common/buttons/FilterDropdown";
import UserRendering from "./UserRendering";

export type UserListProps = {
  users: AppUser[];
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
  isLoading: boolean;
  error: Error | null;
};

const MIN_LOADING_TIME = 1000; // 최소 1초 동안 스켈레톤 유지

const UserList = ({
  users,
  selectedId,
  onSelectUser,
  isLoading,
  error,
}: UserListProps) => {
  const [filter, setFilter] = useState(FILTER_OPTIONS.Users[0]);
  const [showLoading, setShowLoading] = useState(isLoading);

  // 최소 로딩 시간 로직
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => setShowLoading(false), MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleChangeFilter = (filter: typeof FILTER_OPTIONS.Users[number]) =>
    setFilter(filter);

  const list: (AppUser | undefined)[] = showLoading
    ? Array.from({ length: 9 }).map(() => undefined)
    : users;

  return (
    <div className="flex w-[290px] max-w-lg flex-col gap-4">
      <FilterDropdown
        type="Users"
        filter={filter}
        handleChangeFilter={handleChangeFilter}
      />

      {error && (
        <div className="p-4 text-center text-red-500">{error.message}</div>
      )}

      <ul className="space-y-3">
        {list.map((user, i) => (
          <li key={user?.id ?? i}>
            <UserRendering
              data={user}
              isLoading={showLoading}
              selectedId={selectedId}
              onSelectUser={onSelectUser}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;


// // src/components/users/UserList.tsx
// import { useState } from "react";
// import type { AppUser } from "../../types/appUser";
// import { FILTER_OPTIONS, type FilterOption } from "../../types/Filter";
// import FilterDropdown from "../common/buttons/FilterDropdown";
// import UserItem from "./UserItem";

// // --- UserList 컴포넌트 전용 Props 타입 ---
// export type UserListProps = {
//   users: AppUser[];
//   selectedId: string | null;
//   onSelectUser: (user: AppUser) => void;
//   isLoading: boolean;
//   error: Error | null;
// };

// // --- UserList 컴포넌트 ---
// const UserList = ({
//   users,
//   selectedId,
//   onSelectUser,
//   isLoading,
//   error,
// }: UserListProps) => {
//   const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.Users[0]);
//   const handleChangeFilter = (filter: FilterOption) => {
//     setFilter(filter);
//   };
//   return (
//     <div className="flex w-[290px] max-w-lg flex-col gap-4">
//       <FilterDropdown
//         type="Users"
//         filter={filter}
//         handleChangeFilter={handleChangeFilter}
//       />
//       {isLoading && (
//         <div className="p-4 text-center text-[var(--color-text-sub)]">
//           로딩 중...
//         </div>
//       )}
//       {error && (
//         <div className="p-4 text-center text-red-500">{error.message}</div>
//       )}
//       {!isLoading && !error && (
//         <ul className="space-y-3">
//           {users.map((user) => (
//             <li key={user.id}>
//               <UserItem
//                 user={user}
//                 selected={user.id === selectedId}
//                 onClick={onSelectUser}
//               />
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default UserList;
