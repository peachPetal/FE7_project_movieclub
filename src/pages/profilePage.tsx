import React, { useState, useRef, useEffect } from "react";
import defaultProfile from "../assets/defaultProfile.svg";
import profileCameraBtn from "../assets/profileCameraBtn.svg";
import FilterDropdown from "../components/common/buttons/FilterDropdown";

interface ProfileImageUploadProps {
  onUpload: (file: File | null) => void;
}

const Profile: React.FC<ProfileImageUploadProps> = ({ onUpload }) => {
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      onUpload(e.target.files[0]);
    }
  };

  const handleClick = () => fileInputRef.current?.click();
  const handleDelete = () => {
    setImage(null);
    onUpload(null);
  };

  const [previewUrl, setPreviewUrl] = useState<string>(defaultProfile);
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(defaultProfile);
    }
  }, [image]);

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* 타이틀 */}
      <h1 className="absolute top-0 left-0 text-[32px] font-bold text-gray-800">
        프로필 설정
      </h1>
      <br />
      {/* 프로필 박스 */}
      <div className="absolute top-15 left-0 w-[650px] h-[230px] bg-white rounded-[10px] shadow-md flex items-center px-6">
        {/* 프로필 이미지 영역 */}
        <div className="relative flex flex-col items-center flex-shrink-0">
          {/* 이미지 클릭 영역 */}
          <div className="w-full h-full rounded-full border-2 border-gray-300 cursor-pointer hover:border-blue-500 relative" onClick={handleClick}>
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* 카메라 버튼 */}
            <img
              src={profileCameraBtn}
              alt="Camera"
              className="absolute bottom-0 right-0 cursor-pointer"
              onClick={handleClick}
            />
          </div>

          {/* 삭제 버튼 */}
          <button
            className="mt-2 text-[rgba(245,54,54,0.87)] text-sm font-medium hover:underline"
            onClick={handleDelete}
          >
            이미지 삭제
          </button>
        </div>

        {/* 안내 텍스트 */}
        <div className="ml-6 text-[16px] font-medium items-start -mt-[15px] text-gray-700 leading-6 flex">
          <div>
            내 프로필 이미지를 올려주세요
            <br />
            이미지는{" "}
            <span className="text-[#9858F3] font-medium">JPG, JPEG, PNG</span>{" "}
            형식만 업로드할 수 있습니다.
          </div>
        </div>
      </div>

        {/* 프로필 박스 아래 */}
        <div className="w-[650px] flex flex-col items-start mt-80">
        {/* 내 게시물 타이틀 */}
        <h1 className="text-[32px] font-bold text-gray-800 mb-2">내 게시물</h1>

        {/* 필터 드롭다운 */}
        <div className="w-[200px] h-[40px]">
            <FilterDropdown type="MyPosts" />
        </div>
        </div>

      {/* 숨겨진 파일 input */}
      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default Profile;
