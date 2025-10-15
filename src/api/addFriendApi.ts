import { supabase } from "../utils/supabase";

/**
 * 'friendship' 테이블에 새로운 친구 관계를 추가합니다.
 * @param userId - 친구 추가를 요청하는 사용자 ID
 * @param friendId - 친구로 추가될 사용자 ID
 */
export async function addFriend(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase
    .from("friendship")
    .insert({
      user_id: userId,
      friend_id: friendId,
    });

  if (error) {
    console.error("Error adding friend:", error);
    // 이미 친구 관계일 경우 (duplicate key) 에러 처리
    if (error.code === '23505') {
      throw new Error("이미 친구 관계이거나 친구 요청을 보낸 사용자입니다.");
    }
    throw new Error("친구 추가에 실패했습니다.");
  }
}