import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LoginPayload, User } from '@/types/auth'
import * as authApi from '@/api/auth'

type AuthState = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean

  setAuth: (payload: { accessToken: string; user: User }) => void
  clearAuth: () => void

  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, user }) =>
        set({ accessToken, user, isAuthenticated: true }),

      clearAuth: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),

      login: async (payload) => {
        const res = await authApi.login(payload)
        set({
          accessToken: res.accessToken,
          user: res.user,
          isAuthenticated: true,
        })
      },

      logout: async () => {
        await authApi.logout()
        set({ accessToken: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        accessToken: s.accessToken,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
