import AsyncSelect from "react-select/async";
import { type GroupBase } from "react-select";

const loadOptions = async (searchValue) => {
  const data = await fetch("/movies-dummy.json").then((res) => res.json());
  const filtered = data.filter((d) =>
    d.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return filtered.map((movie) => ({
    value: movie.id,
    label: movie.title,
  }));
};

const customStyles: StylesConfig<
  FilterOption,
  false,
  GroupBase<FilterOption>
> = {
  control: (base) => ({
    ...base,
    width: "300px",
    borderColor: "#9858F3",
    boxShadow: "none",
    borderRadius: "0.5rem",
    color: "#6B7280",
    fontSize: "14px",
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
  placeholder: (base, state) => ({
    ...base,
    color: "#6B7280",
    display: state.isFocused ? "none" : "block",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#9858F3",
    fontSize: "14px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
};

export default function ReviewSearch() {
  return (
    <>
      {" "}
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        styles={customStyles}
        isSearchable
        isClearable
        placeholder="영화 제목을 입력하세요"
      />
    </>
  );
}
