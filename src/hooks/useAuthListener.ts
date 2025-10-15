import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";

// 로그인 상태 추적
export function useAuthListener() {
  const [session, setSession] = useState<Session | null>(null);

  // 로그인 상태를 db에서 가져와서 저장
  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("❌ 세션 가져오기 실패:", error.message);
      }
      setSession(data.session);
    };

    getInitialSession();

    // 실시간 로그인 - 로그아웃 감지
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // 클린 업 함수
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const syncUserProfile = async (user: Session["user"]) => {
    const { id, email, user_metadata } = user;

    // ✅ name은 여러 키 중 첫 번째로 존재하는 걸 사용
    const name =
      user_metadata.full_name ||
      user_metadata.name ||
      user_metadata.nickname ||
      user_metadata.user_name ||
      user_metadata.preferred_username ||
      null;

    // ✅ avatar_url도 provider마다 다를 수 있음
    const avatar_url =
      user_metadata.avatar_url ||
      user_metadata.picture ||
      user_metadata.avatar ||
      null;

    const { error } = await supabase
      .from("users")
      .upsert({ id, email, name, avatar_url }, { onConflict: "id" });

    if (error) console.error("❌ 프로필 동기화 실패:", error.message);
    else console.log("✅ 프로필 동기화 성공:", { id, email, name, avatar_url });
  };

  return { session };
}
