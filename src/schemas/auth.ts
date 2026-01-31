import { z } from 'zod'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,15}$/
const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,10}$/

function isValidYYYYMMDD(v: string) {
  const raw = v.replace(/\D/g, '')
  if (!/^\d{8}$/.test(raw)) return false

  const y = Number(raw.slice(0, 4))
  const m = Number(raw.slice(4, 6))
  const d = Number(raw.slice(6, 8))

  if (y < 1900 || y > 2100) return false
  if (m < 1 || m > 12) return false
  if (d < 1 || d > 31) return false

  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '* 이메일을 입력해주세요.')
    .email('* 올바른 이메일 형식을 입력해주세요.'),

  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .regex(PASSWORD_REGEX, '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, '* 이름을 입력해주세요.'),

    nickname: z
      .string()
      .trim()
      .regex(NICKNAME_REGEX, '* 닉네임은 2~10자, 한글/영문/숫자만 가능합니다.'),

    birthdate: z
      .string()
      .trim()
      .regex(/^\d{8}$/, '* 생년월일은 8자리로 입력해주세요. (예: 20000101)')
      .refine(isValidYYYYMMDD, '* 존재하지 않는 날짜입니다. (예: 20000101)'),

    gender: z.enum(['male', 'female'], { message: '* 성별을 선택해주세요.' }),

    email: z
      .string()
      .trim()
      .min(1, '* 이메일을 입력해주세요.')
      .email('* 올바른 이메일 형식을 입력해주세요.'),

    emailVerificationCode: z
      .string()
      .trim()
      .min(1, '* 인증코드를 입력해주세요.'),

    phone1: z.string().trim().length(3, '* 3자리 입력'),
    phone2: z
      .string()
      .trim()
      .regex(/^\d{4}$/, '* 4자리 입력'),
    phone3: z
      .string()
      .trim()
      .regex(/^\d{4}$/, '* 4자리 입력'),
    phoneVerificationCode: z
      .string()
      .trim()
      .min(1, '* 인증번호를 입력해주세요.'),

    password: z
      .string()
      .min(1, '* 비밀번호를 입력해주세요.')
      .regex(PASSWORD_REGEX, '* 6~15자의 영문/숫자/특수문자를 포함해주세요.'),

    passwordConfirm: z.string().min(1, '* 비밀번호를 다시 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '* 비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

export type SignupFormData = z.infer<typeof signupSchema>
