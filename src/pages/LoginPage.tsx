import SocialBtn from "../components/common/buttons/SocialBtn";

export default function LoginPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="login-cotainer w-[470px] h-500px">
        <h1 className="text-4xl font-bold mb-11 text-center">로그인</h1>
        <SocialBtn socialType="google" />
        <SocialBtn socialType="kakao" />
        <SocialBtn socialType="github" />
      </div>
    </div>
  );
}
