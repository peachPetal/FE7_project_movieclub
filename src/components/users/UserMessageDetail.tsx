// src/components/users/UserMessageDetail.tsx
import { type FC, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../utils/supabase";
import { useUserMessages } from "../../hooks/useUserMessages";
import UserMessageReply from "./UserMessageReply";
import { confirmAlert } from "../alert/confirmAlert";

// --- 타입 정의 ---
export type MessageDetailData = {
  id: string;
  title: string;
  bodyMine: string;
  bodyFriend: string;
  senderId?: string;
};

// --- 서브 컴포넌트 ---
type MessageBlockProps = {
  label: string;
  content: string;
};

const MessageBlock: FC<MessageBlockProps> = ({ label, content }) => (
  <article>
    <p className="mb-2 font-medium text-[var(--color-text-main)]">{label}</p>
    <pre className="whitespace-pre-wrap rounded-md bg-[var(--color-background-sub)] p-3">
      {content}
    </pre>
  </article>
);

// --- 메인 컴포넌트 ---
type Props = {
  message: MessageDetailData;
  onReplySent?: () => void; // ✅ 답장 전송 콜백 (onReply 제거)
  onMessageDeleted?: () => void;
};

// ❌ openReplyOnLoad prop 제거
const UserMessageDetail: FC<Props> = ({
  message,
  onReplySent,
  onMessageDeleted,
}) => {
  // ❌ openReplyOnLoad 관련 로직 제거
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [senderName, setSenderName] = useState<string | null>(null);
  const { sendMessage, deleteMessage } = useUserMessages();

  // message.senderId가 바뀔 때마다 이름 조회
  useEffect(() => {
    if (!message.senderId) {
      setSenderName("보낸 사람");
      return;
    }

    const fetchSenderName = async () => {
      setSenderName(null); // 로딩 중
      try {
        const { data, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", message.senderId)
          .single();

        if (error) throw error;
        setSenderName(data ? data.name : "알 수 없는 사용자");
      } catch (err) {
        console.error("Sender name fetch error:", err);
        setSenderName("사용자명 로드 실패");
      }
    };

    fetchSenderName();
  }, [message.senderId]);

  /**
   * 답장 전송 핸들러
   */
  const handleSendReply = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    if (!message.senderId) {
      alert("보낸 사람을 알 수 없어 답장할 수 없습니다.");
      return;
    }

    try {
      await sendMessage(message.senderId, title, body);
      onReplySent?.(); // ✅ 부모에게 전송 완료 알림
      setIsReplyOpen(false); // 성공 시 모달 닫기
    } catch (err) {
      console.error("Reply send failed:", err);

      throw err;
    }
  };
const handleDelete = async () => {
    const result = await confirmAlert({
      title: "메시지 삭제 확인",
      text: "이 메시지를 정말로 삭제하시겠습니까?\n받은 편지함에서 영구적으로 제거됩니다.",
    });

    // 취소 시 함수 종료
    if (!result.isConfirmed) {
      return;
    }

    try {
      // 훅의 deleteMessage 함수 호출
      await deleteMessage(message.id);
      onMessageDeleted?.();
    } catch (err) {
      // 훅의 onError가 이미 토스트로 실패를 알림
      console.error("Message delete failed:", err);
    }
  };

  return (
    <>
      <div
        className="card-shadow min-h-[280px] rounded-xl border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-4 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]"
        role="region"
        aria-label={`${message.title} 상세`}
      >
        <div className="flex h-full flex-col">
          <h5 className="mb-4 text-xl font-semibold">{message.title}</h5>

          <div className="flex-1 space-y-6 text-sm text-[var(--color-text-sub)]">
            {message.bodyMine && (
              <MessageBlock
                label="이전에 내가 보낸 메시지"
                content={message.bodyMine}
              />
            )}

            <MessageBlock
              label={
                senderName
                  ? `${senderName}님이 보낸 메시지`
                  : "메시지 로딩 중..."
              }
              content={message.bodyFriend}
            />
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-white bg-[red] hover:opacity-90 transition-colors"
              onClick={handleDelete}
            >
              삭제
            </button>

            <button
              type="button"
              className="rounded-md px-4 py-2 text-white bg-[var(--color-main)] hover:opacity-90 transition-colors"
              onClick={() => setIsReplyOpen(true)}
            >
              답장
            </button>
          </div>
        </div>
      </div>

      {/* 모달 렌더링 로직 */}
      {isReplyOpen &&
        createPortal(
          <UserMessageReply
            title={`${senderName}님에게 답장`}
            onClose={() => setIsReplyOpen(false)}
            onSend={handleSendReply} // onSend 핸들러 전달
          />,
          document.body
        )}
    </>
  );
};

export default UserMessageDetail;
