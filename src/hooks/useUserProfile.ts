import { supabase } from "../utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuthSession } from "./useAuthSession";

export type UserProfile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export function useUserProfile() {
  const { user } = useAuthSession();
  const userId = user?.id;

  const { data: profile, isPending: loading } = useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile", userId],
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
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return { profile, loading };
}
