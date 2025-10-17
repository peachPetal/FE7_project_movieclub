// src/stores/authStore.ts
import type { Claims } from "../types/userClaims";
import type { Users } from "../types/users"
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { supabase } from "../utils/supabase";

// ================================
// AuthStore 타입 정의
// ================================
type AuthStore = {
  isLoading: boolean;      // 사용자 인증 정보 로딩 상태
  claims: Claims | null;   // Supabase JWT claims
  user: Users | null;      // 사용자 정보
  setClaims: (c: Claims) => void; // claims 상태 업데이트
  hydrateFromAuth: () => void;    // Supabase auth에서 상태 초기화
  clearAuth: () => void;          // 인증 상태 초기화
};

// ================================
// Zustand store 생성
// ================================
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        isLoading: true,
        claims: null,
        user: null,

        // claims 업데이트
        setClaims: (c: Claims) => set((state) => { state.claims = c }),

        // Supabase auth에서 사용자 정보 가져오기
        hydrateFromAuth: async () => {
          set({ isLoading: true });

          // 1. Supabase claims 가져오기
          const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims();
          if (claimsErr) {
            set({ claims: null, user: null, isLoading: false });
            return;
          }

          const claims = claimsData?.claims ?? null;
          set({ claims });

          // 2. claims.sub 존재하면 users 테이블에서 사용자 정보 가져오기
          if (claims?.sub) {
            const { data: user, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", claims.sub)
              .single();

            if (error) {
              set({ claims: null, user: null, isLoading: false });
              return;
            }

            set((state) => {
              state.user = user;
            });
          }

          set({ isLoading: false });
        },

        // 인증 상태 초기화
        clearAuth: () => set({ claims: null, user: null }),
      })),
      { name: "auth-store" } // localStorage key
    )
  )
);
