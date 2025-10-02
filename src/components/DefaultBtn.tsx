import { tv } from "tailwind-variants/lite";

const buttonStyle = tv({
  base: "rounded-[10px] flex justify-center items-center font-bold",
  variants: {
    size: {
      sm: "w-[100px] h-[45px] text-xs",
      md: "w-[170px] h-[57px] text-[15px]",
      lg: "w-[470px] h-[55px] text-[16px]",
    },
    highlight: {
      true: "bg-main text-white",
      false: "border bg-background-main text-main",
    },
    defaultVariants: {
      size: "lg",
    },
  },
});

export default function DefaultBtn({
  size,
  text,
  highlight,
}: {
  size: ButtonType;
  text: string;
  highlight: boolean;
}) {
  return (
    <>
      <div className={buttonStyle({ size: size, highlight: highlight })}>
        <a href="">{text}</a>
      </div>
    </>
  );
}
