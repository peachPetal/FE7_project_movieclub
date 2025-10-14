import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";

export function useAuthListener() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ 세션 가져오기 실패:", error.message);
      }
      setSession(data.session);
    };

    getInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session };
}
