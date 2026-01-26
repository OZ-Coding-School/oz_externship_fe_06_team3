import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// 로그인이 필요한 페이지에서 사용되는 컴포넌트입니다. 로그인이 되어있지 않으면 /login 페이지로 리다이렉트 됩니다.
type LocationState = {
  from?: string
}
// 
export function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    const from = location.pathname + location.search
    return (
      <Navigate to="/login" replace state={{ from } satisfies LocationState} />
    )
  }

  return <Outlet />
}
