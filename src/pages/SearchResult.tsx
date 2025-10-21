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

// ✅ [추가] UsersPage에서 사용하는 컴포넌트 import
import UserDetailPanel from "../components/users/UserDetailPanel";
import UserMessageDetail, {
  type MessageDetailData,
} from "../components/users/UserMessageDetail";

// ✅ [추가] 수정한 커스텀 훅 import
import { useUsersPageLogic } from "../hooks/useUsersPageLogic";

// -----------------------------------------------------------------
// ✅ [추가] UsersPage의 UserDetails 서브 컴포넌트 (동일)
// -----------------------------------------------------------------
type UserDetailsProps = {
  selectedUser: AppUser | null;
  pickedMessage: MessageDetailData | null;
  onPickMessage: (message: MessageDetailData | null) => void;
  currentUserId: string | undefined;
  onAddFriend: () => void;
  isAddingFriend: boolean;
  refreshKey?: number;
  onMessageSent?: () => void;
  onReplySent?: () => void;
  isMessageOpen: boolean;
  onToggleMessage: () => void;
};

// 이 컴포넌트의 내부 코드는 UsersPage와 동일합니다.
const UserDetails = ({
  selectedUser,
  pickedMessage,
  onPickMessage,
  currentUserId,
  onAddFriend,
  isAddingFriend,
  refreshKey,
  onMessageSent,
  onReplySent,
  isMessageOpen,
  onToggleMessage,
}: UserDetailsProps) => {
  if (!selectedUser) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--color-text-sub)]">
        {" "}
        사용자를 선택하여 상세 정보를 확인하세요.{" "}
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
          refreshKey={refreshKey}
          onMessageSent={onMessageSent}
          isMessageOpen={isMessageOpen}
          onToggleMessage={onToggleMessage}
        />
      </div>
      {pickedMessage && (
        <div className="w-full md:w-[450px] md:min-w-[450px]">
          <UserMessageDetail
            message={pickedMessage}
            onReplySent={onReplySent}
          />
        </div>
      )}
    </>
  );
};
// -----------------------------------------------------------------
// ✅ [수정] 메인 페이지 컴포넌트
// -----------------------------------------------------------------
const SearchResultPage = () => {
  const { query } = useParams<{ query: string }>();

  // --- 1. 페이지 고유의 데이터 패칭 상태 ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<ReviewSubset[]>([]);
  // 💡 [핵심] 페이지가 직접 검색 결과를 패칭하여 보관하는 상태
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- 2. ✅ [수정] UI 로직을 훅에 위임 ---
  // 💡 [핵심] 페이지가 패칭한 `users` 상태를 훅에 "주입"
  const {
    users: processedUsers, // 훅이 가공(정렬 등)한 users 배열
    currentUserId,
    selectedId,
    selectedUser,
    pickedMessage,
    isMessageOpen,
    userDetailsRef,
    handleSelectUser,
    setPickedMessage,
    handleAddFriend, // 훅이 제공하는 핸들러
    isAddingFriend, // 훅이 제공하는 상태
    toggleMessage,
  } = useUsersPageLogic(users); // <--- [핵심] users 배열을 인자로 전달

  // --- 3. 메시지 새로고침 상태 (페이지가 관리) ---
  const [messagesRefreshKey, setMessagesRefreshKey] = useState(0);
  const handleRefreshMessages = () => {
    setMessagesRefreshKey((k) => k + 1);
  };

  // --- 4. 데이터 패칭 useEffect (페이지 고유 로직) ---
  useEffect(() => {
    if (!query) return;

    // 쿼리가 변경되면 users 상태가 비워지므로
    // useUsersPageLogic 훅의 selectedId도 초기화해야 합니다.
    // (훅 내부 로직으로 이미 처리될 수도 있지만, 명시적으로 호출)
    handleSelectUser(null as any); // 선택 해제

    const fetchData = async () => {
      setIsLoading(true);
      setMovies([]);
      setReviews([]);
      setUsers([]); // 💡 users 상태 초기화

      if (query.startsWith("@")) {
        const userProfiles = await searchUsers(query);
        const appUsers: AppUser[] = userProfiles.map((profile) => ({
          ...profile,
          created_at: new Date().toISOString(), // 임시 데이터
        }));
        setUsers(appUsers); // 💡 패칭된 users를 state에 저장
      } else {
        // ... (영화 및 리뷰 검색)
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
    // ✅ handleSelectUser는 useCallback으로 메모이징되어 있어도,
    // 의존성 배열에 추가하는 것이 React 원칙에 맞습니다.
  }, [query, handleSelectUser]);

  const isUserSearch = query?.startsWith("@") ?? false;

  // --- 5. JSX 렌더링 ---
  return (
    <div className="bg-[var(--color-background-main)] text-[var(--color-text-main)] min-h-screen p-8">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[var(--color-main)]">{query}</span> 검색 결과
        </h1>

        {isUserSearch ? (
          <>
            {/* -------------------------------
                사용자 검색 결과
            ------------------------------- */}
            <h2 className="text-2xl font-semibold text-[var(--color-text-secondary)] my-6">
              사용자
              <span className="text-[var(--color-main)]">
                {/* 💡 훅이 가공한 'processedUsers'의 길이를 사용 */}
                {!isLoading ? processedUsers.length : "..."}
              </span>
              건
            </h2>

            {/* ✅ UsersPage와 동일한 레이아웃 */}
            <div className="flex h-full w-full gap-6">
              <div className="w-[300px] min-w-[300px]">
                <UserList
                  users={processedUsers} // 💡 훅이 가공한 users
                  isLoading={isLoading} // 💡 페이지가 관리하는 isLoading
                  selectedId={selectedId} // 훅이 제공
                  onSelectUser={handleSelectUser} // 훅이 제공
                  error={null} // 훅이 error도 반환하므로 error={error} 사용 가능
                />
              </div>

              {/* ✅ 훅의 상태와 핸들러를 UserDetails로 전달 */}
              <div ref={userDetailsRef} className="flex flex-1 gap-6">
                <UserDetails
                  selectedUser={selectedUser} // 훅이 제공
                  pickedMessage={pickedMessage} // 훅이 제공
                  onPickMessage={setPickedMessage} // 훅이 제공
                  currentUserId={currentUserId} // 훅이 제공
                  onAddFriend={handleAddFriend} // 훅이 제공
                  isAddingFriend={isAddingFriend} // 훅이 제공
                  refreshKey={messagesRefreshKey}
                  onMessageSent={handleRefreshMessages}
                  onReplySent={handleRefreshMessages}
                  isMessageOpen={isMessageOpen} // 훅이 제공
                  onToggleMessage={toggleMessage} // 훅이 제공
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* -------------------------------
                영화 검색 결과 (변경 없음)
            ------------------------------- */}
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
            />
            <br />
            {/* -------------------------------
                리뷰 검색 결과 (변경 없음)
            ------------------------------- */}
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
