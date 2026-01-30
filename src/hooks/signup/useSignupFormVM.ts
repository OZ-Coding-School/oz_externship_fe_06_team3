import { useEffect, useMemo } from 'react'
import { PASSWORD_REGEX } from '@/utils/signupUtils'
import type { FieldState } from '@/components/common/CommonInput'
import type { Status } from '@/hooks/useVerificationFlow'

const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,10}$/

export type SignupFormVMInput = {
  password: string
  passwordConfirm: string
  trigger: (name: string) => Promise<boolean>
  nicknameStatus: Status
  nicknameChecked: boolean
  nickname: string
  busy: boolean
  formValid: boolean
  emailVerified: boolean
  smsVerified: boolean
  smsSendStatus: Status
}

function toFieldState(s: Status): FieldState {
  return s === 'success' ? 'success' : s === 'error' ? 'error' : 'default'
}

export function useSignupFormVM(input: SignupFormVMInput) {
  const {
    password,
    passwordConfirm,
    trigger,
    nicknameStatus,
    nicknameChecked,
    nickname,
    busy,
    formValid,
    emailVerified,
    smsVerified,
    smsSendStatus,
  } = input

  const passwordFieldState: FieldState = useMemo(() => {
    const value = password.trim()
    if (!value) return 'default'
    return PASSWORD_REGEX.test(value) ? 'success' : 'error'
  }, [password])

  const passwordConfirmState: FieldState = useMemo(() => {
    const pw = password.trim()
    const confirm = passwordConfirm.trim()

    if (!confirm) return 'default'
    if (!pw) return 'error'
    if (!PASSWORD_REGEX.test(pw)) return 'error'
    return confirm === pw ? 'success' : 'error'
  }, [password, passwordConfirm])

  const passwordConfirmMsg = useMemo(() => {
    const pw = password.trim()
    const confirm = passwordConfirm.trim()

    if (!confirm) return null
    if (!pw) return '* 비밀번호를 먼저 입력해주세요.'
    if (!PASSWORD_REGEX.test(pw)) return '* 비밀번호 형식이 올바르지 않습니다.'
    return confirm === pw
      ? '* 비밀번호가 일치합니다.'
      : '* 비밀번호가 일치하지 않습니다.'
  }, [password, passwordConfirm])

  useEffect(() => {
    if (passwordConfirm.trim()) {
      void trigger('passwordConfirm')
    }
  }, [password, passwordConfirm, trigger])

  const nicknameFieldState = useMemo(
    () => toFieldState(nicknameStatus),
    [nicknameStatus]
  )

  const phoneDigitsState: FieldState = useMemo(() => {
    if (smsVerified) return 'success'
    if (smsSendStatus === 'error') return 'error'
    if (smsSendStatus === 'success') return 'success'
    return 'default'
  }, [smsVerified, smsSendStatus])

  const canSubmit = useMemo(
    () =>
      formValid &&
      nicknameChecked &&
      emailVerified &&
      smsVerified &&
      passwordFieldState === 'success' &&
      passwordConfirmState === 'success' &&
      !busy,
    [
      formValid,
      nicknameChecked,
      emailVerified,
      smsVerified,
      passwordFieldState,
      passwordConfirmState,
      busy,
    ]
  )

  const canCheckNickname = useMemo(
    () => !busy && !nicknameChecked && NICKNAME_REGEX.test(nickname),
    [busy, nicknameChecked, nickname]
  )

  return {
    passwordFieldState,
    passwordConfirmState,
    passwordConfirmMsg,
    nicknameFieldState,
    phoneDigitsState,
    canSubmit,
    canCheckNickname,
  }
}
