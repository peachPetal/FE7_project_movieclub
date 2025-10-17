import { supabase } from "../utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";

export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
}

/**
 * 현재 로그인된 사용자의 프로필 정보를 불러오는 React Query 훅
 */
export function useUserProfile() {
  const { user } = useAuthSession();
  const userId = user?.id;

  const {
    data: profile,
    isPending: loading,
    error,
  } = useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile", userId],
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱

    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url, email")
        .eq("id", userId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  return { profile, loading, error };
}
