import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginPayload, User } from '@/types/auth'
import * as authApi from '@/api/auth'

type AuthState = {
  accessToken: string | null
  user: User | null

  setAuth: (payload: { accessToken: string; user: User }) => void
  clearAuth: () => void

  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  restore: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAuth: ({ accessToken, user }) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),

      login: async (payload) => {
        const res = await authApi.login(payload)
        set({ accessToken: res.accessToken, user: res.user })
      },

      logout: async () => {
        await authApi.logout()
        set({ accessToken: null, user: null })
      },

      restore: async () => {
        const res = await authApi.restoreSession()
        if (!res) return
        set({ accessToken: res.accessToken, user: res.user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ accessToken: s.accessToken, user: s.user }),
    }
  )
)

// 로그인 여부 확인(accessToken이 있는지 없는지 확인)
export const selectIsAuthenticated = (s: AuthState) => !!s.accessToken
