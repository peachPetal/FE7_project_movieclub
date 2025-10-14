import { useMemo, useState } from "react";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import UserItem from "../components/users/UserItem";
import UserDetailPanel from "../components/users/UserDetailPanel";
import type { AppUser } from "../types/User";

export default function UsersPage() {
  const [users] = useState<AppUser[]>([
    { id: "1", name: "User1", isOnline: true, joinedAt: "20XX년 X월 X일" },
    { id: "2", name: "User2", isOnline: true, joinedAt: "20XX년 X월 X일" },
    { id: "3", name: "User3", isOnline: true },
    { id: "4", name: "User4", isOnline: false },
    { id: "5", name: "User5", isOnline: true },
    { id: "6", name: "User6", isOnline: false },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId) ?? null,
    [users, selectedId]
  );

  return (
    <div className="w-full h-full ml-[50px] flex gap-6">
      {/* 좌측 묶음: 필터 + 리스트 */}
      <div className="flex flex-col gap-4 w-[290px] max-w-lg">
        <FilterDropdown type="Users" />
        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u.id}>
              <UserItem
                user={u}
                selected={u.id === selectedId}
                onClick={(clicked) =>
                  setSelectedId((prev) =>
                    prev === clicked.id ? null : clicked.id
                  )
                }
              />
            </li>
          ))}
        </ul>
      </div>

      {/* 우측 상세 패널 */}
      <div className="flex w-[500px] min-w-0">
        {selectedUser ? (
          <UserDetailPanel user={selectedUser} />
        ) : (
          /* 처음 클릭하지 않을 시 */
          <></>
        )}
      </div>
    </div>
  );
}
