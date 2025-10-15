import React from "react";
import { type Friend } from "../../hooks/useFriends";
import friendsIcon from "../../assets/person-circle-black.svg";
import messageIcon from "../../assets/message.svg";
import deleteFriendMouseOff from "../../assets/deleteFriendMouseOff.svg";
import deleteFriendMouseOn from "../../assets/deleteFriendMouseOn.svg";

interface FriendContextMenuProps {
  friend: Friend;
  position: { top: number; left: number };
  onDelete: () => void;
  isDeleting: boolean;
  modalRef: React.RefObject<HTMLDivElement | null>;
}

export const FriendContextMenu: React.FC<FriendContextMenuProps> = ({
  friend,
  position,
  onDelete,
  isDeleting,
  modalRef,
}) => {
  return (
    <div
      ref={modalRef}
      className="absolute w-[290px] h-[82px] bg-[var(--color-background-sub)] rounded-lg shadow-md z-50 flex items-center px-4"
      style={{ top: position.top, left: position.left + 15 }}
    >
      <div className="relative w-12 h-12">
        <img
          src={friend.avatarUrl ?? friendsIcon}
          alt={friend.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0 right-0 block w-4 h-4 rounded-full border-2 border-[var(--color-background-sub)] ${
            friend.status === "online"
              ? "bg-[var(--color-alert-online)]"
              : "bg-[var(--color-text-light)]"
          }`}
        />
      </div>
      <div className="ml-4 flex flex-col justify-center">
        <p className="font-medium text-[var(--color-text-main)]">
          {friend.name}
        </p>
        <p className="text-sm text-[var(--color-text-sub)] capitalize">
          {friend.status}
        </p>
      </div>
      <div className="ml-auto flex gap-2">
        <button
          className="relative w-8 h-8 group"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <img
            src={deleteFriendMouseOff}
            alt="delete"
            className="w-8 h-8 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
          />
          <img
            src={deleteFriendMouseOn}
            alt="delete hover"
            className="w-8 h-8 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        </button>
        <button className="w-8 h-8">
          <img src={messageIcon} className="w-8 h-8" alt="message" />
        </button>
      </div>
    </div>
  );
};