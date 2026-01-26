import type { LoginPayload, LoginResult, User } from '@/types/auth'

const FAKE_USER: User = {
  id: 'user-001',
  email: 'test@example.com',
  name: '테스트 유저',
}

const FAKE_PASSWORD = 'Test123!'

export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  const ok =
    payload.email.trim().toLowerCase() === FAKE_USER.email &&
    payload.password === FAKE_PASSWORD

  if (!ok) {
    throw new Error('INVALID_CREDENTIALS')
  }

  return {
    accessToken: 'fake-access-token',
    user: FAKE_USER,
  }
}
