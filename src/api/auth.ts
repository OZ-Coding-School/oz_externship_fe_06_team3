import { apiClient } from '@/api/client'
import type { LoginPayload, User } from '@/types/auth'

export type LoginResult = { access_token: string }
export type VerifyEmailResult = { detail?: string; email_token: string }
export type VerifySmsResult = { detail?: string; sms_token: string }

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await apiClient.post<LoginResult>(
    '/api/v1/accounts/login/',
    payload
  )
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/accounts/logout/')
}

export async function me(accessToken: string | null = null): Promise<User> {
  const config =
    accessToken && accessToken !== ''
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined

  const { data } = await apiClient.get<User>('/api/v1/accounts/me/', config)
  return data
}

export async function checkNickname(payload: {
  nickname: string
}): Promise<void> {
  await apiClient.post('/api/v1/accounts/check-nickname/', payload)
}

export async function sendEmailVerification(payload: {
  email: string
}): Promise<void> {
  await apiClient.post('/api/v1/accounts/verification/send-email/', payload)
}

export async function verifyEmail(payload: {
  email: string
  code: string
}): Promise<VerifyEmailResult> {
  const { data } = await apiClient.post<VerifyEmailResult>(
    '/api/v1/accounts/verification/verify-email/',
    payload
  )
  return data
}

export async function sendSmsVerification(payload: {
  phone_number: string
}): Promise<void> {
  await apiClient.post('/api/v1/accounts/verification/send-sms/', payload)
}

export async function verifySms(payload: {
  phone_number: string
  code: string
}): Promise<VerifySmsResult> {
  const { data } = await apiClient.post<VerifySmsResult>(
    '/api/v1/accounts/verification/verify-sms/',
    payload
  )
  return data
}

export async function signup(payload: {
  password: string
  password_confirm?: string
  nickname: string
  name: string
  birthday: string
  gender: 'M' | 'F'
  email_token: string
  sms_token: string
}): Promise<void> {
  await apiClient.post('/api/v1/accounts/signup/', payload)
}
