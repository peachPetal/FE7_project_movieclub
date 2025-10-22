// src/utils/confirmAlert.ts

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
        "bg-[red] text-white font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:opacity-90 mr-2",
      cancelButton:
        "bg-[var(--color-background-main)] text-[var(--color-text-main)] border border-[var(--color-text-placeholder)] font-medium px-4 py-2 rounded-lg cursor-pointer transition hover:bg-[var(--color-main-10)]",
    },
    buttonsStyling: false,

    allowOutsideClick: false, 
    allowEscapeKey: false,    
    
    didOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
            swalContainer.setAttribute('data-ignore-outside-click', 'true');
        }
    },
    didClose: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) {
            swalContainer.removeAttribute('data-ignore-outside-click');
        }
    }
  });
};