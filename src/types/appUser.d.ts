export interface AppUser {
  id: string;
  name: string;
  avatar_url?: string; // Supabase 컬럼명과 일치
  is_online?: boolean; // Supabase 컬럼명과 일치
  created_at: string;  
  joinedAt?: string;   // 가공된 데이터
}