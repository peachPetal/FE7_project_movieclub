// src/components/users/UserList.tsx
import type { AppUser } from '../../types/appUser'; 
import FilterDropdown from '../common/buttons/FilterDropdown';
import UserItem from './UserItem';

// --- UserList 컴포넌트 전용 Props 타입 ---
export type UserListProps = {
  users: AppUser[];
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
  isLoading: boolean;
  error: Error | null;
};

// --- UserList 컴포넌트 ---
const UserList = ({ users, selectedId, onSelectUser, isLoading, error }: UserListProps) => {
  return (
    <div className="flex w-[290px] max-w-lg flex-col gap-4">
      <FilterDropdown type="Users" />
      {isLoading && <div className="p-4 text-center text-[var(--color-text-sub)]">로딩 중...</div>}
      {error && <div className="p-4 text-center text-red-500">{error.message}</div>}
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