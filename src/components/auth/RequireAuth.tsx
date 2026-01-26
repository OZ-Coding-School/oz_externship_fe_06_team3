import { Navigate, Outlet, useLocation } from 'react-router'
import { selectIsAuthenticated, useAuthStore } from '@/store/authStore'

type LocationState = { from?: string }

// 로그인이 필요한 페이지 입장 시 로그인 페이지로 이동하는 컴포넌트

export function RequireAuth() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    const from = location.pathname + location.search
    // 로그인 페이지로 이동하면서 이동하려던 페이지 정보를 저장 (로그인 성공 시 이동하려던 페이지로 자동으로 이동하기 위해)
    return (
      <Navigate to="/login" replace state={{ from } satisfies LocationState} />
    )
  }

  return <Outlet />
}
