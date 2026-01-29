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
  restore: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, user }) =>
        set({ accessToken, user, isAuthenticated: true }),

      clearAuth: () =>
        set({ accessToken: null, user: null, isAuthenticated: false }),

      login: async (payload) => {
        try {
          const res = await authApi.login(payload)
          if (!res?.access_token) throw new Error('LOGIN_FAILED')

          set({ accessToken: res.access_token, isAuthenticated: true })

          const user = await authApi.me()
          set({ user, isAuthenticated: true })
        } catch (err) {
          set({ accessToken: null, user: null, isAuthenticated: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          get().clearAuth()
        }
      },

      restore: async () => {
        const token = get().accessToken
        if (!token) return

        try {
          const user = await authApi.me()
          set({ user, isAuthenticated: true })
        } catch {
          get().clearAuth()
        }
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
