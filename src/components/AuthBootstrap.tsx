import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export default function AuthBootstrap() {
  const hydrateFromAuth = useAuthStore((state) => state.hydrateFromAuth);
  useEffect(() => {
    hydrateFromAuth();
    console.log(1);
  }, [hydrateFromAuth]);
  return null;
}
