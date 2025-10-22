import Swal from "sweetalert2";

export const confirmAlert = async ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => {
  return await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    iconColor: "#F65050",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    customClass: {
      popup: "rounded-xl shadow-lg !bg-background-main",
      title: "!font-semibold !text-text-main",
      htmlContainer: "!text-s !text-text-sub",
      confirmButton:
        "bg-main text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-50 mr-2",
      cancelButton:
        "bg-background-main text-text-main border-1 border-main font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-main-10",
    },
    buttonsStyling: false,
  });
};
