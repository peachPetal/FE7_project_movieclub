import { useNavigate } from "react-router-dom";
import errorLogo from "../assets/404error.svg";

function Error() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
      {/* 404 로고 */}
      <img
        src={errorLogo}
        alt="errorLogo"
        className="w-[491px] h-[127px] mb-8"
      />

      <div className="flex flex-col mb-8">
        <p className="mt-4 font-pretendard font-normal text-[#333333] text-[20px]">
          죄송합니다. 페이지를 찾을 수 없습니다.
        </p>
        <p className="mt-4 font-pretendard font-normal text-[20px] text-[#333333]">
          존재하지 않는 주소를 입력하셨거나
        </p>
        <p className="mt-4 font-pretendard font-normal text-[20px] text-[#333333]">
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
      </div>

      <div className="mt-4">
        <button
          onClick={goHome}
          className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default Error;
