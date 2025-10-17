import React from "react";

interface NotificationModalProps {
  position: { top: number; left: number };
  modalRef: React.RefObject<HTMLDivElement | null>;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  position,
  modalRef,
}) => {
  return (
    <div
      ref={modalRef}
      className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4 py-3"
      style={{ top: position.top, left: position.left + 15 }}
    >
      <p className="text-[var(--color-text-main)]">Notification 내용</p>
      {/* TODO: 실제 알림 리스트나 컴포넌트로 교체 가능 */}
    </div>
  );
};
