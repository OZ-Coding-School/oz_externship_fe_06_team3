import type { LoginPayload, LoginResult } from '@/types/auth'
import { apiClient } from '@/api/client'

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await apiClient.post<LoginResult>(
    '/api/v1/accounts/login/',
    payload
  )
  return data
}

export async function logout(): Promise<void> {
  return
}

export async function restoreSession(): Promise<LoginResult | null> {
  return null
}
