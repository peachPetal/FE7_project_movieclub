import { useState } from "react";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import UserItem from "../components/users/UserItem";
import type { AppUser } from "../types/userClaims";

function UsersPage() {
  // 실제 API 연동 전까지 임시 데이터
  const [users] = useState<AppUser[]>([
    { id: "1", name: "User1", isOnline: true },
    { id: "2", name: "User2", isOnline: true },
    { id: "3", name: "User3", isOnline: true },
    { id: "4", name: "User4", isOnline: false },
    { id: "5", name: "User5", isOnline: true },
    { id: "6", name: "User6", isOnline: false },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full h-full ml-[50px] flex flex-col gap-4">
      <FilterDropdown type="Users" />

      <ul className="max-w-lg space-y-3 w-[290px]">
        {users.map((u) => (
          <li key={u.id}>
            <UserItem
              user={u}
              selected={u.id === selectedId}
              onClick={(clicked) => setSelectedId(clicked.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
