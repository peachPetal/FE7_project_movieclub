// src/pages/SearchResultPage.tsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// --- API, 컴포넌트, 타입 import ---
import { tmdbSearch } from "../api/search/movieSearch";
import { searchReviews } from "../api/search/searchReviews";
import { searchUsers } from "../api/search/searchUsers";
import MoviesRendering from "../components/movies/MoviesRendering";
import ReviewsRendering from "../components/reviews/ReviewsRendering";
import UserList from "../components/users/UserList";
import type { ReviewSubset } from "../types/Review";
import type { AppUser } from "../types/appUser";

import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, {
  type MessageDetailData,
} from "../components/users/UserMessageDetail";

import { useUsersPageLogic } from "../hooks/useUsersPageLogic";

// -----------------------------------------------------------------
// UserDetails 서브 컴포넌트 타입 정의
// -----------------------------------------------------------------
type UserDetailsProps = {
  selectedUser: AppUser | null;
  pickedMessage: MessageDetailData | null;
  onPickMessage: (message: MessageDetailData | null) => void;
  currentUserId: string | undefined;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  onDeleteFriend: () => void; // ✅ 1. 타입 추가
  isDeletingFriend: boolean; // ✅ 2. 타입 추가
  refreshKey?: number;
  onMessageSent?: () => void;
  onReplySent?: () => void;
  isMessageOpen: boolean;
  onToggleMessage: () => void;
};

// UserDetails 서브 컴포넌트 구현
const UserDetails = ({
  selectedUser,
  pickedMessage,
  onPickMessage,
  currentUserId,
  onAddFriend,
  isAddingFriend,
  onDeleteFriend, // ✅ 3. prop 받기
  isDeletingFriend, // ✅ 4. prop 받기
  refreshKey,
  onMessageSent,
  onReplySent,
  isMessageOpen,
  onToggleMessage,
}: UserDetailsProps) => {
  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]">
        {/* {" "}
        사용자를 선택하여 상세 정보를 확인하세요.{" "} */}
      </div>
    );
  }
  return (
    <>
      <div className="w-[500px] min-w-[450px]">
        <UserDetailPanel
          user={selectedUser}
          onPickMessage={onPickMessage}
          currentUserId={currentUserId}
          onAddFriend={onAddFriend}
          isAddingFriend={isAddingFriend}
          onDeleteFriend={onDeleteFriend} // ✅ 5. UserDetailPanel로 전달
          isDeletingFriend={isDeletingFriend} // ✅ 6. UserDetailPanel로 전달
          refreshKey={refreshKey}
          onMessageSent={onMessageSent}
          isMessageOpen={isMessageOpen}
          onToggleMessage={onToggleMessage}
        />
      </div>
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail
            key={pickedMessage.id}
            message={pickedMessage}
            onReplySent={onReplySent}
          />
        </div>
      )}
    </>
  );
};
// -----------------------------------------------------------------
// 메인 페이지 컴포넌트
// -----------------------------------------------------------------
const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();

  // --- 페이지 고유 데이터 패칭 상태 ---
  const [movies, setMovies] = useState<any[]>([]); // Movie 타입 사용 권장
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- UI 로직 (useUsersPageLogic 훅 사용) ---
  const {
    users: processedUsers,
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isMessageOpen,
    userDetailsRef,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend,
    isAddingFriend,
    toggleMessage,
    handleDeleteFriend, // ✅ 7. 훅에서 받아오기
    isDeletingFriend, // ✅ 8. 훅에서 받아오기
  } = useUsersPageLogic(users);

  // --- 메시지 새로고침 상태 ---
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);
  const handleRefreshMessages = () => {
    setMessagesRefreshKey((k) => k + 1);
  };

  // --- 데이터 패칭 useEffect ---
  useEffect(() => {
    if (!query) return;

    handleSelectUser(null as any); // 선택 해제

    const fetchData = async () => {
      setIsLoading(true);
      setMovies([]);
      setReviews([]);
      setUsers([]);

      if (query.startsWith("@")) {
        const userProfiles = await searchUsers(query);
        const appUsers: AppUser[] = userProfiles.map((profile) => ({
          ...profile,
          created_at: new Date().toISOString(), // 임시 데이터
        }));
        setUsers(appUsers);
      } else {
        const [movieResults, reviewResults] = await Promise.all([
          tmdbSearch(query),
          searchReviews(query),
        ]);
        setMovies(movieResults);
        setReviews(reviewResults);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [query, handleSelectUser]);

  const isUserSearch = query?.startsWith("@") ?? false;

  // --- JSX 렌더링 ---
  return (
    <div className="bg-[var(--color-background-main)] text-[var(--color-text-main)] min-h-screen p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--color-main)]">{query}</span> 검색 결과
        </h1>

        {isUserSearch ? (
          <>
            <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)] my-6">
              사용자{" "}
              <span className="text-[var(--color-main)]">
                {!isLoading ? processedUsers.length : "..."}
              </span>
              건
            </h2>

            <div className="flex h-full w-full gap-6">
              {/* <div className="w-[300px] min-w-[300px]"> */}
              <div className="w-[300px] min-w-[300px] sticky top-6 self-start overflow-y-auto max-h-[calc(100vh-6rem)]">
                <UserList
                  users={processedUsers}
                  isLoading={isLoading}
                  selectedId={selectedId}
                  onSelectUser={handleSelectUser}
                  error={null}
                />
              </div>

              {/* <div ref={userDetailsRef} className="flex flex-1 gap-6"> */}
              <div ref={userDetailsRef} className="flex flex-1 gap-6 sticky top-6 self-start">
                <UserDetails
                  selectedUser={selectedUser}
                  pickedMessage={pickedMessage}
                  onPickMessage={setPickedMessage}
                  currentUserId={currentUserId}
                  onAddFriend={handleAddFriend}
                  isAddingFriend={isAddingFriend}
                  onDeleteFriend={handleDeleteFriend} // ✅ 9. prop 전달
                  isDeletingFriend={isDeletingFriend} // ✅ 10. prop 전달
                  refreshKey={messagesRefreshKey}
                  onMessageSent={handleRefreshMessages}
                  onReplySent={handleRefreshMessages}
                  isMessageOpen={isMessageOpen}
                  onToggleMessage={toggleMessage}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 영화 검색 결과 */}
            <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] my-6">
              영화{" "}
              <span className="text-[var(--color-main)]">
                {!isLoading ? movies.length : "..."}
              </span>
              건
            </h2>
            <MoviesRendering
              data={movies}
              isLoading={isLoading}
              variant="page"
              skeletonCount={20}
            />
            <br />
            {/* 리뷰 검색 결과 */}
            <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] mb-6">
              리뷰{" "}
              <span className="text-[var(--color-main)]">
                {!isLoading ? reviews.length : "..."}
              </span>
              건
            </h2>
            <ReviewsRendering
              data={reviews}
              isLoading={isLoading}
              variant="page"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
// // src/pages/SearchResultPage.tsx

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// // --- API, 컴포넌트, 타입 import ---
// import { tmdbSearch } from "../api/search/movieSearch";
// import { searchReviews } from "../api/search/searchReviews";
// import { searchUsers } from "../api/search/searchUsers";
// import MoviesRendering from "../components/movies/MoviesRendering";
// import ReviewsRendering from "../components/reviews/ReviewsRendering";
// import UserList from "../components/users/UserList";
// import type { ReviewSubset } from "../types/Review";
// import type { AppUser } from "../types/appUser";

// const SearchResultPage = () => {
//   const { query } = useParams<{ query: string }>();

//   // --- 상태 관리 ---
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [reviews, setReviews] = useState<ReviewSubset[]>([]);
//   const [users, setUsers] = useState<AppUser[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // --- 검색 데이터 fetch ---
//   useEffect(() => {
//     if (!query) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       setMovies([]);
//       setReviews([]);
//       setUsers([]);

//       if (query.startsWith("@")) {
//         // --- 사용자 검색 ---
//         const userProfiles = await searchUsers(query);
//         const appUsers: AppUser[] = userProfiles.map((profile) => ({
//           ...profile,
//           created_at: new Date().toISOString(), // 임시 데이터
//         }));
//         setUsers(appUsers);
//       } else {
//         // --- 영화 및 리뷰 검색 ---
//         const [movieResults, reviewResults] = await Promise.all([
//           tmdbSearch(query),
//           searchReviews(query),
//         ]);
//         setMovies(movieResults);
//         setReviews(reviewResults);
//       }

//       setIsLoading(false);
//     };

//     fetchData();
//   }, [query]);

//   const isUserSearch = query?.startsWith("@") ?? false;

//   return (
//     <div className="bg-[var(--color-background-main)] text-[var(--color-text-main)] min-h-screen p-8">
//       {/* -------------------------------
//           검색 쿼리 제목
//       ------------------------------- */}
//       <div className="w-full">
//         <h1 className="text-3xl font-bold mb-2">
//           <span className="text-[var(--color-main)]">{query}</span> 검색 결과
//         </h1>

//         {isUserSearch ? (
//           <>
//             {/* -------------------------------
//                 사용자 검색 결과
//             ------------------------------- */}
//             <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)] my-6">
//               사용자
//               <span className="text-[var(--color-main)]">
//                 {!isLoading ? users.length : "..."}
//               </span>
//               건
//             </h2>

//             <UserList
//               users={users}
//               isLoading={isLoading}
//               selectedId={null} // 선택 기능 없음
//               onSelectUser={() => {}} // 클릭해도 아무 동작 없음
//               error={null}
//             />
//           </>
//         ) : (
//           <>
//             {/* -------------------------------
//                 영화 검색 결과
//             ------------------------------- */}
//             <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] my-6">
//               영화{" "}
//               <span className="text-[var(--color-main)]">
//                 {!isLoading ? movies.length : "..."}
//               </span>
//               건
//             </h2>
//             <MoviesRendering
//               data={movies}
//               isLoading={isLoading}
//               variant="page"
//             />

//             <br />

//             {/* -------------------------------
//                 리뷰 검색 결과
//             ------------------------------- */}
//             <h2 className="text-[40px] font-semibold text-[var(--color-text-secondary)] mb-6">
//               리뷰{" "}
//               <span className="text-[var(--color-main)]">
//                 {!isLoading ? reviews.length : "..."}
//               </span>
//               건
//             </h2>
//             <ReviewsRendering
//               data={reviews}
//               isLoading={isLoading}
//               variant="page"
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResultPage;
