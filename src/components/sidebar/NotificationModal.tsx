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
      className="absolute w-[290px] h-[320px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 px-4"
      style={{ top: position.top, left: position.left + 25 }}
    >
      <p className="p-4 text-[var(--color-text-main)]">Notification 내용</p>
    </div>
  );
};