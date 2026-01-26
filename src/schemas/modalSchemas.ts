import { z } from 'zod'

/**
 * 아이디 찾기 스키마
 */
export const findIdSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z
    .string()
    .min(1, '휴대전화번호를 입력해주세요.')
    .regex(/^[0-9-]+$/, '숫자와 하이픈(-)만 입력 가능합니다.'),
  verificationCode: z.string().min(1, '인증번호를 입력해주세요.'),
})

export type FindIdFormData = z.infer<typeof findIdSchema>

/**
 * 비밀번호 찾기 스키마
 */
export const findPasswordSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  verificationCode: z.string().min(1, '인증번호를 입력해주세요.'),
})

export type FindPasswordFormData = z.infer<typeof findPasswordSchema>

/**
 * 비밀번호 재설정 스키마
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .refine(
        (password) => {
          // 5~16자 체크
          if (password.length < 5 || password.length > 16) {
            return false
          }
          return true
        },
        {
          message: '비밀번호는 5~16자로 입력해주세요.',
        }
      )
      .refine(
        (password) => {
          // 영문 대소문자 모두 포함하는지 확인
          const hasLower = /[a-z]/.test(password)
          const hasUpper = /[A-Z]/.test(password)
          
          // 대소문자 모두 포함하는지 확인
          return hasLower && hasUpper
        },
        {
          message: '비밀번호는 영문 대소문자를 포함하여 입력해주세요.',
        }
      )
      .refine(
        (password) => {
          // 특수문자 포함하는지 확인
          const hasSpecial = /[@$!%*?&]/.test(password)
          return hasSpecial
        },
        {
          message: '비밀번호는 특수문자를 포함하여 입력해주세요.',
        }
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

/**
 * 계정 복구 스키마
 */
export const restoreAccountSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  verificationCode: z.string().min(1, '인증번호를 입력해주세요.'),
})

export type RestoreAccountFormData = z.infer<typeof restoreAccountSchema>

/**
 * 수강생 등록 스키마
 */
export const registerStudentSchema = z.object({
  course: z.string().min(1, '과정을 선택해주세요.'),
  batch: z.string().min(1, '기수를 선택해주세요.'),
})

export type RegisterStudentFormData = z.infer<typeof registerStudentSchema>

/**
 * 회원 탈퇴 사유 스키마
 */
export const withdrawalReasonSchema = z.object({
  reason: z.string().min(1, '탈퇴 사유를 선택해주세요.'),
  otherReason: z.string().optional(),
  feedback: z.string().optional(),
})

export type WithdrawalReasonFormData = z.infer<typeof withdrawalReasonSchema>

/**
 * 쪽지시험 시작 스키마
 * 참가 코드는 Base62 인코딩된 값 (영문 대소문자, 숫자 포함)
 */
export const startQuizSchema = z.object({
  code: z
    .string()
    .min(1, '참가 코드를 입력해주세요.')
    .regex(/^[A-Za-z0-9]+$/, '영문과 숫자만 입력 가능합니다.'),
})

export type StartQuizFormData = z.infer<typeof startQuizSchema>
