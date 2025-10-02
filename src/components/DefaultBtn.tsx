import { tv } from "tailwind-variants/lite";

const buttonStyle = tv({
  base: "rounded-[10px] flex justify-center items-center font-bold duration-200",
  variants: {
    size: {
      sm: "w-[100px] h-[45px] text-xs",
      md: "w-[170px] h-[57px] text-[15px]",
      lg: "w-[470px] h-[55px] text-[16px]",
    },
    highlight: {
      true: "bg-main text-white hover:opacity-90 transition-opacity",
      false:
        "border bg-background-main text-main hover:bg-main-10 transition-colors",
    },
    defaultVariants: {
      size: "lg",
    },
  },
});

/* 
DefaultBtn은 호출 시 size, text, highLight를 인자로 받습니다
1. size: "sm" | "md" | "lg" 
    "sm": 댓글 등록, 메시지 답장 등
    "md": 사이드바 로그인/회원가입, 영화 트레일러 바로가기, 좋아요 등
    "lg": 로그인, 회원가입 등
2. text: string
    버튼에 들어갈 텍스트
3. highLight: boolean
    true: 메인 컬러가 들어간 버튼
    false: 컬러 X 버튼

사용 예시: <DefaultBtn size="md" text="회원가입" highlight={true} />
*/

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
        <a href="" className="w-full h-full flex justify-center items-center">
          <span>{text}</span>
        </a>
      </div>
    </>
  );
}
