import { useNavigate } from "react-router-dom";

export default function useLoginRequiredAlert() {
  const navigate = useNavigate();

  const loginRequiredAlert = () => {
    alert("로그인이 필요한 기능입니다.");
    navigate("/login");
  };
  return loginRequiredAlert;
}
