import { supabase } from "../../utils/supabase";
import type { AppUser } from "../../types/appUser";

/**
 * Supabase의 'users' 테이블에서 모든 사용자 목록을 조회합니다.
 * @returns AppUser 타입의 배열을 Promise로 반환합니다.
 */
export async function getUsers(): Promise<AppUser[]> {
  // Supabase의 'users' 테이블에서 모든 컬럼(*)을 선택합니다.
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Error fetching users:", error);
    // 에러 발생 시, 사용자에게 보여줄 메시지를 포함한 에러를 던집니다.
    throw new Error("사용자 목록을 불러오는 데 실패했습니다.");
  }

  // 데이터가 없을 경우(null) 빈 배열을 반환하여 타입 안정성을 지킵니다.
  return data || [];
}