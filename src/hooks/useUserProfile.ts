import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useAuthListener } from "./useAuthListener";

type UserProfile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export function useUserProfile() {
  const { session } = useAuthListener();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("❌ 프로필 가져오기 실패:", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  return { profile, loading };
}
