import type { LoginPayload, LoginResult } from '@/types/auth'
import { mockLogin } from '@/mocks/auth.mock'

// 백엔드 추가시 이 파일만 수정하면 됨

export async function login(payload: LoginPayload): Promise<LoginResult> {
  return mockLogin(payload)
}

export async function logout(): Promise<void> {
  return
}

export async function restoreSession(): Promise<LoginResult | null> {
  return null
}
