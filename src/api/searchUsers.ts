// src/api/searchUsers.ts

import { supabase } from '../utils/supabase'; // Supabase 클라이언트 경로

// 컴포넌트에서 사용할 사용자 정보 타입을 export 합니다.
export interface UserProfile {
  id: string; // Supabase auth user id (uuid)
  name: string; // users 테이블의 이름
  avatar_url: string; // users 테이블의 아바타 URL
}

/**
 * 🕵️ Supabase 'users' 테이블에서 사용자 이름(name)으로 프로필을 검색합니다.
 * @param query - '@'로 시작하는 검색어 (예: "@JohnDoe")
 * @returns {Promise<UserProfile[]>} - 검색된 사용자 프로필 목록
 */
export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  // 쿼리가 '@'로 시작하지 않거나 너무 짧으면 검색하지 않습니다.
  if (!query || !query.startsWith('@') || query.length < 2) {
    return [];
  }

  // '@' 기호를 제외한 실제 검색어를 추출합니다.
  const searchTerm = query.substring(1);

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, avatar_url")
      // 'name' 컬럼에서 검색어를 포함하는 사용자를 대소문자 구분 없이 찾습니다.
      .ilike("name", `%${searchTerm}%`);

    if (error) throw error;

    return data || [];

  } catch (e) {
    console.error('[Supabase API Error] searchUsers:', e);
    return [];
  }
};