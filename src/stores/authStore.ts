import type { Claims } from "../types/userClaims";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Users } from "../types/users";
import { create } from "zustand";
import supabase from "../../utils/supabase";

type AuthStore = {
  isLoading: boolean;
  claims: Claims;
  user: Users | null;
  setClaims: (c: Claims) => void;
  hydrateFromAuth: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set) => ({
        isLoading: true,
        claims: null,
        user: null,
        setClaims: (c: Claims) => set((state) => (state.claims = c)),
        hydrateFromAuth: async () => {
          set({ isLoading: true });

          const { data: claimsData, error: claimsErr } =
            await supabase.auth.getClaims();

          if (claimsErr) {
            set({ claims: null, user: null, isLoading: false });
            return;
          }

          const claims = claimsData?.claims;
          set({ claims: claims });

          if (claims?.sub) {
            const { data: users, error } = await supabase
              .from("users")
              .select("*")
              .eq("id", claims.sub)
              .single();

            if (error) {
              set({ claims: null, user: null, isLoading: false });
              return;
            }

            set((state) => {
              state.user = users;
            });
          }
          set({ isLoading: false });
        },
        clearAuth: () => {
          set({ claims: null, user: null });
        },
      })),
      { name: "auth-store" }
    )
  )
);
