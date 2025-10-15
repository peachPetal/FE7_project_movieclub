import { supabase } from "../utils/supabase";

export async function deleteFriend(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase
    .from("friendship")
    .delete()
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
    );

  if (error) {
    console.error("Failed to delete friend:", error);
    throw new Error("친구 삭제에 실패했습니다.");
  }
}