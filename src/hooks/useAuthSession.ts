// src/hooks/useAuthSession.ts
import { useState, useEffect, useRef } from "react";
import { supabase } from "../utils/supabase";
import { useMutation } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";

// DB의 온라인 상태를 업데이트하는 함수
const updateUserOnlineStatus = async (user: User, isOnline: boolean) => {
  const { error } = await supabase
    .from("users")
    .update({ 
      is_online: isOnline, 
      last_seen: new Date().toISOString() // 상태 변경 시 last_seen도 업데이트
    })
    .eq("id", user.id);

  if (error) {
    console.error(`Failed to set is_online=${isOnline}:`, error.message);
    throw new Error(error.message);
  }
};

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 최신 user 상태를 안전하게 추적하기 위한 ref
  const userRef = useRef<User | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ user, isOnline }: { user: User; isOnline: boolean }) =>
      updateUserOnlineStatus(user, isOnline),
  });

  useEffect(() => {
    // 초기 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);
      setLoading(false);

      // ✅ [유지] 세션 로드 시 (새로고침 포함) true로 설정
      if (currentUser) updateStatus({ user: currentUser, isOnline: true });
    });

    // 인증 상태 변경 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        const previousUser = userRef.current;
        const currentUser = newSession?.user ?? null;

        setSession(newSession);
        setUser(currentUser);
        setLoading(false);

        // ✅ [유지] 로그인 시 true로 설정
        if (event === "SIGNED_IN" && currentUser)
          updateStatus({ user: currentUser, isOnline: true });
        
        // ✅ [유지] 로그아웃 시 (Sidebar 버튼 클릭) false로 설정
        // supabase.auth.signOut()이 호출되면 이 이벤트가 발생합니다.
        if (event === "SIGNED_OUT" && previousUser)
          updateStatus({ user: previousUser, isOnline: false });
      }
    );

    // ❌ [제거] 창 닫힘 감지 (beforeunload) 로직 전체 제거
    // const handleBeforeUnload = () => {
    //   const currentUser = userRef.current;
    //   if (currentUser)
    //     updateStatus({ user: currentUser, isOnline: false });
    // };
    // window.addEventListener("beforeunload", handleBeforeUnload);

    // 클린업
    return () => {
      listener.subscription.unsubscribe();
      // ❌ [제거] beforeunload 리스너 제거 로직 삭제
      // window.removeEventListener("beforeunload", handleBeforeUnload);

      // ❌ [제거] 컴포넌트 언마운트(페이지 이동 등) 시 false로 설정하는 로직 삭제
      // const currentUser = userRef.current;
      // if (currentUser) updateStatus({ user: currentUser, isOnline: false });
    };
  }, [updateStatus]); // 의존성 배열에서 updateStatus만 남김

  return { session, user, loading };
}

/* --------------------------------------------------------------------------
📘 주석 정리

1️⃣ userRef 사용 이유
  - useEffect 내부 콜백이나 이벤트 리스너에서 stale state(이전 user 값)를 참조하는 문제를 방지하기 위해,
    항상 최신 user를 참조할 수 있도록 ref 사용.

2️⃣ updateStatus (react-query mutation)
  - DB의 users 테이블에 is_online 필드를 true/false로 업데이트.
  - 로그인 시 true, 로그아웃/창 닫힐 때 false로 변경.

3️⃣ Supabase Auth 흐름
  - getSession(): 페이지 새로고침 시 기존 세션 복원.
  - onAuthStateChange(): 로그인/로그아웃 이벤트 실시간 감지.
  - SIGNED_IN → is_online = true
  - SIGNED_OUT → is_online = false

4️⃣ beforeunload 이벤트
  - 사용자가 창을 닫을 때 오프라인 상태로 DB 반영 시도.
  - 단, beforeunload는 비동기 동작 보장이 약하므로
    더 안정적인 처리는 navigator.sendBeacon()으로 개선 가능.

5️⃣ cleanup 단계
  - 컴포넌트 언마운트 시에도 최신 userRef 기반으로 오프라인 처리.
-------------------------------------------------------------------------- */
