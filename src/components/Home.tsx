import LoginPage from "../pages/LoginPage";
import FilterDropdown from "./common/buttons/FilterDropdown";

export default function HomeContent() {
  return (
    <main className="flex justify-center items-center w-full">
      <FilterDropdown type="Reviews" />
      <LoginPage />
    </main>
  );
}
