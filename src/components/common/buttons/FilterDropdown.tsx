import { useEffect, useState } from "react";
import Select, {
  type GroupBase,
  type SingleValue,
  type StylesConfig,
} from "react-select";

export default function FilterDropdown({ type }: { type: FilterType }) {
  const [options, setOptions] = useState<FilterOption[]>([]);
  const [selected, setSelected] = useState<FilterOption | null>(null);

  useEffect(() => {
    if (type === "Movies") {
      setOptions([
        { value: "all", label: "전체 보기" },
        { value: "romance", label: "로맨스" },
        { value: "action", label: "액션" },
      ]);
      // 나중에 api 데이터 들어오면 해당하는 장르로 바꿀 것
    } else if (type === "Reviews" || type === "Comments") {
      setOptions([
        { value: "all", label: "모든 유저" },
        { value: "friends", label: "친구" },
      ]);
    } else if (type === "Users") {
      setOptions([
        { value: "all", label: "전체 보기" },
        { value: "latest", label: "최신순" },
        { value: "popular", label: "인기순" },
      ]);
    } else if (type === "MyPosts") {
      setOptions([
        { value: "reviews", label: "리뷰" },
        { value: "comments", label: "댓글" },
      ]);
    } else if (type === "Likes") {
      setOptions([
        { value: "movies", label: "영화" },
        { value: "reviews", label: "리뷰" },
      ]);
    }
    setSelected(options[0]);
  }, []);

  const onChange = (e: SingleValue<FilterOption>) => {
    setSelected(e);
  };

  const customStyles: StylesConfig<
    FilterOption,
    false,
    GroupBase<FilterOption>
  > = {
    control: (base) => ({
      ...base,
      borderColor: "#9858F3",
      boxShadow: "none",
      borderRadius: "0.5rem",
      color: "#6B7280",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        borderColor: "#9858F3",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#F3EBFF" : "#fff",
      fontSize: "14px",
      color: state.isSelected ? "#9858F3" : "#111827",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      border: "1px solid #9858F3",
      borderRadius: "0.5rem",
      boxShadow: "0",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6B7280",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#9858F3",
      fontSize: "14px",
    }),
  };

  return (
    <>
      {selected === null ? null : (
        <div className="w-[200px] h-[40px]">
          <Select
            options={options}
            defaultValue={options[0]}
            value={selected}
            onChange={onChange}
            styles={customStyles}
            components={{ IndicatorSeparator: () => null }}
            isSearchable={false}
          />
        </div>
      )}
    </>
  );
}
