import React, { useState, useRef } from "react";
import defaultProfile from "../assets/defaultProfile.svg";
import profileCameraBtn from "../assets/profileCameraBtn.svg";
import FilterDropdown from "../components/common/buttons/FilterDropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { useUserProfile } from "../hooks/useUserProfile";

// 아바타 업로드 함수
async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `avatar/${userId}.${fileExt}`;

  // 1. 스토리지에 파일 업로드
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw uploadError;

  // 2. 업로드된 파일의 Public URL 가져오기
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
  const publicUrl = urlData.publicUrl;

  // 캐시 버스팅을 위해 URL에 현재 시간 타임스탬프를 쿼리 파라미터로 추가
  const cacheBustingUrl = `${publicUrl}?t=${new Date().getTime()}`;

  // 3. users 테이블에 '캐시 버스팅 URL' 업데이트
  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_url: cacheBustingUrl })
    .eq("id", userId);
  if (dbError) throw dbError;

  return cacheBustingUrl;
}

// 아바타 삭제 함수
async function deleteAvatar(userId: string, currentUrl: string | null | undefined): Promise<void> {
  if (!currentUrl) return;

  const urlWithoutQuery = currentUrl.split("?")[0];
  const pathInBucket = urlWithoutQuery.split("/avatars/")[1];
  
  if (pathInBucket) {
    const { error: removeError } = await supabase.storage.from("avatars").remove([pathInBucket]);
    if (removeError) {
      console.error("Error removing file from storage:", removeError);
      throw removeError;
    }
  }

  // 2. users 테이블에서 avatar_url을 null로 업데이트
  const { error: dbError } = await supabase.from("users").update({ avatar_url: null }).eq("id", userId);
  if (dbError) throw dbError;
}


// --- 컴포넌트 ---

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { profile, loading: isProfileLoading } = useUserProfile();
  const userId = profile?.id;

  const [tempPreview, setTempPreview] = useState<string | null>(null);

  const avatarUrl = tempPreview || profile?.avatar_url || defaultProfile;

  // 이미지 업로드 mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      if (!userId) throw new Error("User not logged in");
      return uploadAvatar(userId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      setTempPreview(null); // 성공했으니 임시 미리보기는 초기화
    },
    onError: () => {
      setTempPreview(null);
    },
  });

  // 이미지 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("User not logged in");
      return deleteAvatar(userId, profile?.avatar_url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempPreview(URL.createObjectURL(file));
    uploadMutation.mutate(file);
  };

  const handleClick = () => fileInputRef.current?.click();
  const handleDelete = () => deleteMutation.mutate();

  const isLoading = isProfileLoading || uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="relative w-full h-screen bg-[var(--color-background-main)]">
      <h1 className="absolute top-0 left-0 text-[32px] font-bold text-[var(--color-text-main)]">
        프로필 설정
      </h1>
      <br />
      <div className="absolute top-15 left-0 w-[650px] h-[230px] bg-[var(--color-background-sub)] rounded-[10px] card-shadow flex items-center px-6">
        <div className="relative flex flex-col items-center flex-shrink-0">
          <div
            className={`w-full h-full rounded-full border-2 border-[var(--color-text-placeholder)] cursor-pointer hover:border-[var(--color-main)] relative ${isLoading ? 'opacity-50' : ''}`}
            onClick={!isLoading ? handleClick : undefined}
          >
            <img
              src={avatarUrl} 
              alt="Profile"
              className="w-[120px] h-[120px] object-cover rounded-full"
            />
            <img
              src={profileCameraBtn}
              alt="Camera"
              className="absolute bottom-0 right-0 cursor-pointer"
            />
          </div>
          <button
            className="mt-2 text-[var(--color-alert)] text-sm font-medium hover:underline"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || !profile?.avatar_url} 
          >
            {deleteMutation.isPending ? "삭제 중..." : "이미지 삭제"}
          </button>
        </div>
        <div className="ml-6 text-[16px] font-medium items-start -mt-[15px] text-[var(--color-text-main)] leading-6 flex">
          <div>
            내 프로필 이미지를 올려주세요
            <br />
            이미지는{" "}
            <span className="text-[var(--color-main)] font-medium">
              JPG, JPEG, PNG
            </span>{" "}
            형식만 업로드할 수 있습니다.
          </div>
        </div>
      </div>

      <div className="w-[650px] flex flex-col items-start mt-80">
        <h1 className="text-[32px] font-bold text-[var(--color-text-main)] mb-2">
          내 게시물
        </h1>
        <div className="w-[200px] h-[40px]">
          <FilterDropdown type="MyPosts" />
        </div>
      </div>

      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploadMutation.isPending}
      />
    </div>
  );
};

export default Profile;