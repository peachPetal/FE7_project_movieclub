import Navigation from "./Navigation";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header
      className="w-full h-[65px] bg-[var(--color-background-main)] shadow-[5px_5px_8px_0_rgba(0,0,0,0.1)]
      dark:shadow-[5px_5px_10px_0_rgba(255,255,255,0.1)] font-sans flex items-center justify-between px-[140px] relative"
    >
      <div className="w-5/6 m-auto flex justify-between items-center ">
        {" "}
        <Navigation />
        <SearchBar />
      </div>
    </header>
  );
}
