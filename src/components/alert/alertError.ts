import Swal from "sweetalert2";

export const alertError = (text: string) => {
  return Swal.fire({
    title: "Error",
    text: text,
    icon: "warning",
    iconColor: "#F65050",
    showCancelButton: false,
    confirmButtonText: "확인",
    customClass: {
      popup: "rounded-xl shadow-lg !bg-background-main",
      title: "!font-semibold !text-text-main",
      htmlContainer: "!text-s !text-text-sub",
      confirmButton:
        "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
    },
    buttonsStyling: false,
  });
};
