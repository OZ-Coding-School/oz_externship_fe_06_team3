import { http, HttpResponse, delay } from 'msw'

const CODE_TTL_MS = 5 * 60 * 1000

// 테스트용 인증코드
const FIXED_EMAIL_CODE = 'ABCDE12345' // 이메일 코드: ABCDE12345
const FIXED_SMS_CODE = '123456' // SMS 코드: 123456

// 테스트용 아이디/비밀번호
const SEED_EMAIL = 'test@example.com' // 아이디: test@example.com
const SEED_PASSWORD = 'Test123!' // 비밀번호: Test123!

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const api = (path: string) => new RegExp(`(${escapeRegExp(path)})(\\?.*)?$`)

type UserDto = {
  id: number
  email: string
  nickname: string
  name: string
  phone_number: string
  birthday: string // YYYY-MM-DD
  gender: 'M' | 'F'
  profile_img_url?: string | null
  created_at?: string
}

type StoredUser = {
  password: string
  user: UserDto
}

const usersByEmail = new Map<string, StoredUser>()
const usedNicknames = new Set<string>()
const usedPhones = new Set<string>()

const emailCodes = new Map<string, { code: string; at: number }>()
const smsCodes = new Map<string, { code: string; at: number }>()

const emailTokens = new Map<string, string>()
const smsTokens = new Map<string, string>()

const accessTokens = new Map<string, string>()

let seq = 1

const normEmail = (v: string) => v.trim().toLowerCase()
const normPhone = (v: string) => v.replace(/\D/g, '')
const now = () => Date.now()

const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const randomBase62 = (len: number) =>
  Array.from(
    { length: len },
    () => base62[Math.floor(Math.random() * base62.length)]
  ).join('')

const token = (p: string) => `${p}_${randomBase62(24)}`

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

const error = (status: number, payload: JsonValue) =>
  HttpResponse.json(payload, { status })

// 시드 유저 추가
if (!usersByEmail.has(SEED_EMAIL)) {
  const user: UserDto = {
    id: seq++,
    email: SEED_EMAIL,
    nickname: '테스트유저',
    name: '테스트 유저',
    phone_number: '01012345678',
    birthday: '2000-01-01',
    gender: 'M',
    profile_img_url: null,
    created_at: new Date().toISOString(),
  }
  usersByEmail.set(SEED_EMAIL, { password: SEED_PASSWORD, user })
  usedNicknames.add(user.nickname.toLowerCase())
  usedPhones.add(user.phone_number)
}

export const loginHandler = http.post(
  api('/api/v1/accounts/login/'),
  async ({ request }) => {
    await delay(120)
    const body = (await request.json()) as { email?: string; password?: string }
    const email = normEmail(String(body.email ?? ''))
    const password = String(body.password ?? '')

    const found = usersByEmail.get(email)
    if (!found || found.password !== password) {
      return error(400, {
        error_detail: {
          password: ['이메일 또는 비밀번호가 올바르지 않습니다.'],
        },
      })
    }

    const access_token = token('access')
    accessTokens.set(access_token, email)

    return HttpResponse.json({ access_token }, { status: 200 })
  }
)

export const logoutHandler = http.post(
  api('/api/v1/accounts/logout/'),
  async () => {
    await delay(80)
    return HttpResponse.json(
      { detail: '로그아웃 되었습니다.' },
      { status: 200 }
    )
  }
)

export const meHandler = http.get(
  api('/api/v1/accounts/me/'),
  async ({ request }) => {
    await delay(80)

    const auth = request.headers.get('authorization') ?? ''
    const access = auth.startsWith('Bearer ')
      ? auth.slice('Bearer '.length)
      : ''
    const email = accessTokens.get(access)

    if (!email) {
      return error(401, { error_detail: '인증 정보가 없습니다.' })
    }

    const found = usersByEmail.get(email)
    if (!found) {
      return error(401, { error_detail: '사용자를 찾을 수 없습니다.' })
    }

    return HttpResponse.json(found.user, { status: 200 })
  }
)

export const checkNicknameHandler = http.post(
  api('/api/v1/accounts/check-nickname/'),
  async ({ request }) => {
    await delay(80)
    const body = (await request.json()) as { nickname?: string }
    const nickname = String(body.nickname ?? '').trim()

    if (!nickname) {
      return error(400, {
        error_detail: { nickname: ['닉네임을 입력해주세요.'] },
      })
    }

    if (usedNicknames.has(nickname.toLowerCase())) {
      return error(409, {
        error_detail: { nickname: ['이미 사용 중인 닉네임입니다.'] },
      })
    }

    return HttpResponse.json(
      { detail: '사용가능한 닉네임 입니다.' },
      { status: 200 }
    )
  }
)

export const sendEmailHandler = http.post(
  api('/api/v1/accounts/verification/send-email/'),
  async ({ request }) => {
    await delay(80)
    const body = (await request.json()) as { email?: string }
    const email = normEmail(String(body.email ?? ''))

    if (!email) {
      return error(400, { error_detail: { email: ['이메일을 입력해주세요.'] } })
    }

    if (usersByEmail.has(email)) {
      return error(409, { error_detail: '이미 가입된 이메일입니다.' })
    }

    emailCodes.set(email, { code: FIXED_EMAIL_CODE, at: now() })

    return HttpResponse.json(
      { detail: '이메일 인증 코드가 전송되었습니다.' },
      { status: 200 }
    )
  }
)

export const verifyEmailHandler = http.post(
  api('/api/v1/accounts/verification/verify-email/'),
  async ({ request }) => {
    await delay(80)
    const body = (await request.json()) as { email?: string; code?: string }
    const email = normEmail(String(body.email ?? ''))
    const code = String(body.code ?? '').trim()

    if (!email) {
      return error(400, { error_detail: { email: ['이메일을 입력해주세요.'] } })
    }
    if (!code) {
      return error(400, {
        error_detail: { code: ['인증코드를 입력해주세요.'] },
      })
    }

    if (usersByEmail.has(email)) {
      return error(409, { error_detail: '이미 가입된 이메일입니다.' })
    }

    const saved = emailCodes.get(email)
    if (!saved) {
      return error(400, {
        error_detail: { code: ['인증코드가 일치하지 않습니다.'] },
      })
    }

    if (now() - saved.at > CODE_TTL_MS) {
      emailCodes.delete(email)
      return error(400, {
        error_detail: { code: ['인증 시간이 만료되었습니다.'] },
      })
    }

    if (saved.code !== code) {
      return error(400, {
        error_detail: { code: ['인증코드가 일치하지 않습니다.'] },
      })
    }

    const email_token = token('email')
    emailTokens.set(email_token, email)

    return HttpResponse.json(
      { detail: '이메일 인증에 성공하였습니다.', email_token },
      { status: 200 }
    )
  }
)

export const sendSmsHandler = http.post(
  api('/api/v1/accounts/verification/send-sms/'),
  async ({ request }) => {
    await delay(80)
    const body = (await request.json()) as { phone_number?: string }
    const phone = normPhone(String(body.phone_number ?? ''))

    if (phone.length < 10) {
      return error(400, {
        error_detail: { phone_number: ['휴대폰 번호를 확인해주세요.'] },
      })
    }

    if (usedPhones.has(phone)) {
      return error(409, {
        error_detail: '이미 가입에 사용된 휴대전화 번호입니다.',
      })
    }

    smsCodes.set(phone, { code: FIXED_SMS_CODE, at: now() })

    return HttpResponse.json(
      { detail: '회원가입을 위한 휴대폰 인증 코드가 전송되었습니다.' },
      { status: 200 }
    )
  }
)

export const verifySmsHandler = http.post(
  api('/api/v1/accounts/verification/verify-sms/'),
  async ({ request }) => {
    await delay(80)
    const body = (await request.json()) as {
      phone_number?: string
      code?: string
    }

    const phone = normPhone(String(body.phone_number ?? ''))
    const code = String(body.code ?? '').trim()

    if (phone.length < 10) {
      return error(400, {
        error_detail: { phone_number: ['휴대폰 번호를 확인해주세요.'] },
      })
    }
    if (!code) {
      return error(400, {
        error_detail: { code: ['인증번호를 입력해주세요.'] },
      })
    }

    if (usedPhones.has(phone)) {
      return error(409, {
        error_detail: '이미 가입에 사용된 휴대전화 번호입니다.',
      })
    }

    const saved = smsCodes.get(phone)
    if (!saved) {
      return error(400, {
        error_detail: { code: ['인증코드가 일치하지 않습니다.'] },
      })
    }

    if (now() - saved.at > CODE_TTL_MS) {
      smsCodes.delete(phone)
      return error(400, {
        error_detail: { code: ['인증 시간이 만료되었습니다.'] },
      })
    }

    if (saved.code !== code) {
      return error(400, {
        error_detail: { code: ['인증코드가 일치하지 않습니다.'] },
      })
    }

    const sms_token = token('sms')
    smsTokens.set(sms_token, phone)

    return HttpResponse.json(
      { detail: '회원가입을 위한 휴대폰 인증에 성공하였습니다.', sms_token },
      { status: 200 }
    )
  }
)

export const signupHandler = http.post(
  api('/api/v1/accounts/signup/'),
  async ({ request }) => {
    await delay(120)
    const body = (await request.json()) as {
      password?: string
      password_confirm?: string
      nickname?: string
      name?: string
      birthday?: string
      gender?: 'M' | 'F'
      email_token?: string
      sms_token?: string
    }

    const password = String(body.password ?? '')
    const password_confirm =
      body.password_confirm == null ? null : String(body.password_confirm)

    const nickname = String(body.nickname ?? '').trim()
    const name = String(body.name ?? '').trim()
    const birthday = String(body.birthday ?? '').trim()
    const gender = body.gender

    const email_token = String(body.email_token ?? '')
    const sms_token = String(body.sms_token ?? '')

    if (
      !password ||
      !nickname ||
      !name ||
      !birthday ||
      !gender ||
      !email_token ||
      !sms_token
    ) {
      return error(400, { error_detail: '필수 입력값을 확인해주세요.' })
    }

    if (password_confirm !== null && password_confirm !== password) {
      return error(400, {
        error_detail: { password_confirm: ['비밀번호가 일치하지 않습니다.'] },
      })
    }

    const email = emailTokens.get(email_token)
    const phone = smsTokens.get(sms_token)

    if (!email) {
      return error(400, {
        error_detail: { email_token: ['이메일 인증을 다시 진행해주세요.'] },
      })
    }
    if (!phone) {
      return error(400, {
        error_detail: { sms_token: ['휴대폰 인증을 다시 진행해주세요.'] },
      })
    }

    if (usersByEmail.has(email)) {
      return error(409, {
        error_detail: '이미 중복된 회원가입 내역이 존재합니다.',
      })
    }
    if (usedPhones.has(phone)) {
      return error(409, {
        error_detail: '이미 가입에 사용된 휴대전화 번호입니다.',
      })
    }
    if (usedNicknames.has(nickname.toLowerCase())) {
      return error(409, { error_detail: '이미 사용 중인 닉네임입니다.' })
    }

    const user: UserDto = {
      id: seq++,
      email,
      nickname,
      name,
      phone_number: phone,
      birthday,
      gender,
      profile_img_url: null,
      created_at: new Date().toISOString(),
    }

    usersByEmail.set(email, { password, user })
    usedPhones.add(phone)
    usedNicknames.add(nickname.toLowerCase())

    return HttpResponse.json(
      { detail: '회원가입이 완료되었습니다.' },
      { status: 201 }
    )
  }
)

export const authHandlers = [
  loginHandler,
  logoutHandler,
  meHandler,
  checkNicknameHandler,
  sendEmailHandler,
  verifyEmailHandler,
  sendSmsHandler,
  verifySmsHandler,
  signupHandler,
]
