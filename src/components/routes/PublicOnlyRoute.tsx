import { Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
