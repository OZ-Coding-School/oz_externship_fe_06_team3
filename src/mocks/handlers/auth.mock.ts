import { http, HttpResponse, delay } from 'msw'
import type { LoginPayload, LoginResult, User } from '@/types/auth'

const FAKE_USER: User = {
  id: 'user-001',
  email: 'test@example.com',
  name: '테스트 유저',
}

const FAKE_PASSWORD = 'Test123!'

export const loginHandler = http.post(
  '/api/v1/accounts/login/',
  async ({ request }) => {
    await delay(300)

    const body = (await request.json()) as LoginPayload
    const emailOk = body.email.trim().toLowerCase() === FAKE_USER.email
    const pwOk = body.password === FAKE_PASSWORD

    if (!emailOk || !pwOk) {
      return HttpResponse.json(
        { message: 'INVALID_CREDENTIALS' },
        { status: 400 }
      )
    }

    const result: LoginResult = {
      accessToken: 'fake-access-token',
      user: FAKE_USER,
    }

    return HttpResponse.json(result, { status: 200 })
  }
)
