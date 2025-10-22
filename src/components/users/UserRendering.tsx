// src/components/users/UserRendering.tsx
import type { AppUser } from "../../types/appUser";
import UserItem from "./UserItem";
import UserSkeleton from "../skeleton/UserSkeleton";

type UserRenderingProps = {
  data?: AppUser;
  isLoading: boolean;
  selectedId: string | null;
  onSelectUser: (user: AppUser) => void;
};

export default function UserRendering({
  data,
  isLoading,
  selectedId,
  onSelectUser,
}: UserRenderingProps) {
  if (isLoading || !data) {
    return <UserSkeleton />;
  }

  return (
    <UserItem
      user={data}
      selected={data.id === selectedId}
      onClick={onSelectUser}
    />
  );
}
