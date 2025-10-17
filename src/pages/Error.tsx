import { useNavigate } from "react-router-dom";
import errorLogo from "../assets/404-error.svg";
import DefaultBtn from "../components/common/buttons/DefaultBtn";

function Error() {
  const navigate = useNavigate();

  // 홈 페이지로 이동
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
      {/* 404 에러 로고 */}
      <img
        src={errorLogo}
        alt="Error Logo"
        className="w-[491px] h-[127px] mb-8"
      />

      {/* 안내 문구 */}
      <div className="flex flex-col mb-8">
        <p className="mt-4 font-pretendard font-normal text-[20px] text-[var(--color-text-main)]">
          죄송합니다. 페이지를 찾을 수 없습니다.
        </p>
        <p className="mt-4 font-pretendard font-normal text-[20px] text-[var(--color-text-main)]">
          존재하지 않는 주소를 입력하셨거나
        </p>
        <p className="mt-4 font-pretendard font-normal text-[20px] text-[var(--color-text-main)]">
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
      </div>

      {/* 홈으로 돌아가기 버튼 */}
      <div className="mt-4">
        <DefaultBtn
          size="lg"
          text="홈으로 돌아가기"
          highlight={false}
          onClickFn={goHome}
        />
      </div>
    </div>
  );
}

export default Error;

/*
주석 설명:

1. useNavigate
   - react-router-dom 훅
   - 페이지 이동 기능 제공

2. 404 에러 로고
   - 중앙에 시각적 안내
   - w-[491px], h-[127px], mb-8: 크기와 마진 조정

3. 안내 문구
   - flex-col 배치
   - 폰트: Pretendard, font-normal
   - 텍스트 크기: 20px
   - 색상: var(--color-text-main)

4. DefaultBtn
   - 공통 버튼 컴포넌트
   - size="lg", highlight={false}, onClickFn={goHome}
   - 클릭 시 홈("/")으로 이동
*/
