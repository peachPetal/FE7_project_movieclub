import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";

export default function ProtectedRoute() {
  const { session, loading } = useAuthSession();

  // 세션 로딩 중이면 아무것도 렌더링하지 않음
  if (loading) return null;

  // 로그인하지 않았다면 로그인 페이지로 리다이렉트
  if (!session) return <Navigate to="/login" replace />;

  // 로그인 상태면 하위 Route 렌더링
  return <Outlet />;
}