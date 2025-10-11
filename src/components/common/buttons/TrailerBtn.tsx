import { useEffect } from "react";

export default function TrailerBtn({ src }: { src: string }) {
  useEffect(() => {}, []);

  return (
    <>
      <a
        className="flex justify-center items-center text-[24px] duration-200 border bg-main text-white rounded-[20px] pt-3 pr-5 pb-3 pl-5 hover:bg-main-80 transition-colors"
        href={src}
        target="_blank"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 15 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-4"
        >
          <path
            d="M14.2418 9.81584L2.31176 16.7886C1.29931 17.3798 0 16.664 0 15.4723V1.52667C0 0.336832 1.29744 -0.380845 2.31176 0.212183L14.2418 7.18498C14.4721 7.31742 14.6636 7.50886 14.7967 7.73988C14.9299 7.97089 15 8.23328 15 8.50041C15 8.76754 14.9299 9.02993 14.7967 9.26094C14.6636 9.49196 14.4721 9.6834 14.2418 9.81584Z"
            fill="white"
          />
        </svg>
        <span className="-translate-y-0.5 font-semibold">트레일러</span>
      </a>
    </>
  );
}
