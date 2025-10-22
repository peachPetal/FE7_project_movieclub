import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function useLoginRequiredAlert() {
  const navigate = useNavigate();

  const loginRequiredAlert = async () => {
    const result = await Swal.fire({
      title: "로그인이 필요한 기능입니다.",
      icon: "warning",
      iconColor: "#F65050",
      showCancelButton: false,
      confirmButtonText: "확인",
      customClass: {
        popup: "rounded-xl shadow-lg !bg-background-main",
        title: "!font-semibold !text-text-main",
        htmlContainer: "!text-s !text-text-sub",
        confirmButton:
          "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) navigate("/login");
  };
  return loginRequiredAlert;
}
