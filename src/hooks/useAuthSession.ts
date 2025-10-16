// src/hooks/useAuthSession.ts

import { useState, useEffect, useRef } from "react"; // useRef 추가
import { supabase } from "../utils/supabase";
import { useMutation } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";

// DB의 is_online 상태를 업데이트하는 함수 (변경 없음)
const updateUserOnlineStatus = async (user: User, isOnline: boolean) => {
  const { error } = await supabase
    .from("users")
    .update({ is_online: isOnline })
    .eq("id", user.id);

  if (error) {
    console.error(`Failed to set is_online to ${isOnline}:`, error.message);
    throw new Error(error.message);
  }
};

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1. 'stale state' 문제를 피하기 위해 user를 담을 ref 생성
  const userRef = useRef(user);

  // ✅ 2. user 상태가 변경될 때마다 ref의 current 값을 업데이트
  useEffect(() => {
    userRef.current = user;
  }, [user]);


  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ user, isOnline }: { user: User; isOnline: boolean }) =>
      updateUserOnlineStatus(user, isOnline),
  });

  // ✅ 3. 초기 설정 로직은 한 번만 실행되도록 의존성 배열을 []로 변경
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        updateStatus({ user: currentUser, isOnline: true });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        // ✅ 4. 리스너 내부에서는 이전 user 상태를 ref에서 가져와서 사용
        const previousUser = userRef.current;
        const currentUser = newSession?.user ?? null;

        setSession(newSession);
        setUser(currentUser);
        setLoading(false);

        if (_event === "SIGNED_IN" && currentUser) {
          updateStatus({ user: currentUser, isOnline: true });
        }
        if (_event === "SIGNED_OUT" && previousUser) {
          updateStatus({ user: previousUser, isOnline: false });
        }
      }
    );

    const handleBeforeUnload = () => {
      // ✅ 5. 페이지를 닫을 때도 ref의 최신 user 값을 사용
      const currentUser = userRef.current;
      if (currentUser) {
        // 참고: beforeunload는 비동기 작업을 보장하지 않으므로, 이 방식이 항상 동작하지 않을 수 있습니다.
        // navigator.sendBeacon()을 사용하는 것이 더 안정적일 수 있습니다.
        updateStatus({ user: currentUser, isOnline: false });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      // ✅ 6. 클린업 함수에서도 최신 유저 정보로 오프라인 처리
      const currentUser = userRef.current;
      if (currentUser) {
        updateStatus({ user: currentUser, isOnline: false });
      }
    };
  }, [updateStatus]); // ✅ 의존성 배열에서 user를 제거. updateStatus는 안정적이므로 유지 가능.
                      // 혹은 []로 해도 무방합니다.

  return { session, user, loading };
}