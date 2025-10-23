import { useState, useEffect } from "react";
import type { AppUser } from "../../types/appUser";
import UserRendering from "./UserRendering";

export type UserListProps = {
  users: AppUser[];
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
  isLoading: boolean;
  error: Error | null;
};

const MIN_LOADING_TIME = 1000;

const UserList = ({
  users,
  selectedId,
  onSelectUser,
  isLoading,
  error,
}: UserListProps) => {
  const [showLoading, setShowLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => setShowLoading(false), MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const list: (AppUser | undefined)[] = showLoading
    ? Array.from({ length: 10 }).map(() => undefined)
    : users;

  return (
    <div className="flex w-[290px] max-w-lg flex-col gap-4">
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
