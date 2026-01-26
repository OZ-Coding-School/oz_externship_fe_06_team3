import { z } from 'zod'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,15}$/

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),

  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요.')
    .regex(
      PASSWORD_REGEX,
      '비밀번호는 6~15자이며 영문/숫자/특수문자를 모두 포함해야 합니다.'
    ),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const PASSWORD_HELPER =
  '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합'
