import SocialBtn from "../components/common/buttons/SocialBtn.tsx";
import { supabase } from "../utils/supabase.ts";
import { useAuthStore } from "../stores/authStore.ts";
import { useEffect } from "react";

export default function LoginPage() {
  const user = useAuthStore((state) => state.user);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${import.meta.env.VITE_URL}/login`,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${import.meta.env.VITE_URL}/`,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  };
  const handleKaKaoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${import.meta.env.VITE_URL}/login`,
        },
      });
      if (error) throw error;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <div className="w-full h-full flex justify-center items-center mt-[-50px]">
        <div className="login-cotainer w-[470px] h-500px">
          <h1 className="text-4xl font-bold mb-11 text-center text-[var(--color-text-main)]">
            로그인
          </h1>
          <SocialBtn socialType="google" onClick={handleGoogleLogin} />
          <SocialBtn socialType="kakao" onClick={handleKaKaoLogin} />
          <SocialBtn socialType="github" onClick={handleGithubLogin} />
        </div>
      </div>
    </>
  );
}
