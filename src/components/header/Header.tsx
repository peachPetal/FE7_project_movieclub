import Navigation from "./Navigation";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header
      className="w-full h-[8vh] bg-[var(--color-background-main)] shadow-[5px_5px_10px_0_rgba(0,0,0,0.25)]
      dark:shadow-[5px_5px_10px_0_rgba(255,255,255,0.1)] font-sans flex items-center justify-between px-[105px] relative"
    >
      <Navigation />
      <SearchBar />
    </header>
  );
}