import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import searchIcon from "../../assets/searchBar.svg";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate(); // navigate 훅 사용

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search/${query}`); // /search/검색어 경로로 이동
      setQuery(""); // 검색 후 입력창 비우기 (선택사항)
    }
  };

  return (
    <div className="relative w-[268px] h-[40px] flex-shrink-0">
      <img
        src={searchIcon}
        alt="Search"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none dark:invert"
      />
      <input
        type="text"
        placeholder="Search"
        value={query} // value 속성 연결
        onChange={(e) => setQuery(e.target.value)} // onChange 핸들러 추가
        onKeyDown={handleSearch} // onKeyDown 핸들러 추가
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full bg-[var(--color-background-main)] border border-[var(--color-text-placeholder)] rounded-full
          pl-10 pr-4 text-[13px] text-[var(--color-text-main)] placeholder:text-[var(--color-text-placeholder)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]"
      />

      {isFocused && query.trim() === "" && ( // 검색어가 없을 때만 툴팁 표시
        <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-10">
          {/* Tooltip Arrow */}
          <div
            className="absolute -top-[7px] left-1/2 -translate-x-1/2 
              w-0 h-0 border-l-[7.5px] border-l-transparent 
              border-r-[7.5px] border-r-transparent 
              border-b-[7.5px] border-b-[var(--color-main)]"
          />
          {/* Tooltip Body */}
          <div
            className="w-[268px] h-[40px] bg-[var(--color-main)] rounded-[30px] 
              flex items-center justify-center shadow-lg"
          >
            <p className="text-white text-[10px] font-normal font-pretendard">
              사용자를 찾으려면 @아이디를 입력해 보세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";
// import searchIcon from "../../assets/searchBar.svg";

// export default function SearchBar() {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className="relative w-[268px] h-[40px] flex-shrink-0">
//       <img
//         src={searchIcon}
//         alt="Search"
//         className="absolute left-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] pointer-events-none dark:invert"
//       />
//       <input
//         type="text"
//         placeholder="Search"
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         className="w-full h-full bg-[var(--color-background-main)] border border-[var(--color-text-placeholder)] rounded-full
//           pl-10 pr-4 text-[13px] text-[var(--color-text-main)] placeholder:text-[var(--color-text-placeholder)]
//           focus:outline-none focus:ring-2 focus:ring-[var(--color-main-20)]"
//       />

//       {isFocused && (
//         <div className="absolute top-[50px] left-1/2 -translate-x-1/2 z-10">
//           {/* Tooltip Arrow */}
//           <div
//             className="absolute -top-[7px] left-1/2 -translate-x-1/2 
//               w-0 h-0 border-l-[7.5px] border-l-transparent 
//               border-r-[7.5px] border-r-transparent 
//               border-b-[7.5px] border-b-[var(--color-main)]"
//           />
//           {/* Tooltip Body */}
//           <div
//             className="w-[268px] h-[40px] bg-[var(--color-main)] rounded-[30px] 
//               flex items-center justify-center shadow-lg"
//           >
//             <p className="text-white text-[10px] font-normal font-pretendard">
//               사용자를 찾으려면 <span className="font-semibold">@아이디</span>
//               를 입력해 보세요
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }