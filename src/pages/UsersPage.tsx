import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import UserItem from "../components/users/UserItem";
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, {
  type MessageDetailData,
} from "../components/users/UserMessageDetail";
import UserMessageReply from "../components/users/UserMessageReply";
import type { AppUser } from "../types/appUser";

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

  // 유저 선택이 해제되거나 다른 유저로 바뀌면 우측 메시지/답장 상태 초기화
  useEffect(() => {
    setPickedMessage(null);
    setIsReplyOpen(false);
  }, [selectedUser]);

  // 오른쪽 패널에서 보여줄 메시지
  const [pickedMessage, setPickedMessage] = useState<MessageDetailData | null>(
    null
  );
  const [isReplyOpen, setIsReplyOpen] = useState(false);

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

      {/* 가운데: 유저 상세 + 받은 메시지 목록 (선택 콜백으로 우측에 반영) */}
      <div className="w-[500px] min-w-[450px]">
        {selectedUser ? (
          <UserDetailPanel
            user={selectedUser}
            onPickMessage={setPickedMessage}
          />
        ) : (
          <></>
        )}
      </div>

      {/* 오른쪽: 메시지 상세 '컴포넌트 영역' (선택 없으면 아무것도 표시하지 않음) */}
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail
            message={pickedMessage}
            onReply={() => setIsReplyOpen(true)}
          />
        </div>
      )}

      {/* 답장 패널은 '포털'로만 띄움 */}
      {isReplyOpen &&
        pickedMessage &&
        createPortal(
          <UserMessageReply
            title={pickedMessage.title}
            onClose={() => setIsReplyOpen(false)}
            onSend={(payload) => {
              // TODO: API 연동
              console.log("send reply", { to: selectedUser?.name, ...payload });
            }}
          />,
          document.body
        )}
    </div>
  );
}
