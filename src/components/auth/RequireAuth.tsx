import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

type LocationState = {
  from?: string
}

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
