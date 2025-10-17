import { Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
  return (
    <>
      {/* Public 전용 페이지를 렌더링할 위치 */}
      <Outlet />
    </>
  );
}

/*
주석 설명:

1. PublicOnlyRoute
   - 로그인하지 않은 사용자만 접근 가능한 페이지 라우트
   - 현재는 단순히 Outlet을 통해 하위 Route를 렌더링
   - 추후 로그인 상태 체크 로직 추가 가능
     예: 
       const session = useAuthSession();
       if (session) return <Navigate to="/" />;
       return <Outlet />;
*/
