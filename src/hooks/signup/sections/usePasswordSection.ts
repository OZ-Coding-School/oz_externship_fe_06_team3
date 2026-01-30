import { useEffect, useMemo, useRef } from 'react'
import { PASSWORD_REGEX } from '@/utils/signupUtils'
import type { FieldState } from '@/components/common/CommonInput'
import type {
  PasswordSectionMessages,
  PasswordSectionUI,
  PasswordSectionValues,
} from './types'

export type UsePasswordSectionArgs = {
  password: string
  passwordConfirm: string
  trigger: (name: string) => Promise<boolean>
}

export function usePasswordSection(args: UsePasswordSectionArgs) {
  const { password, passwordConfirm, trigger } = args
  const triggerRef = useRef(trigger)
  triggerRef.current = trigger

  const values: PasswordSectionValues = useMemo(
    () => ({ password, passwordConfirm }),
    [password, passwordConfirm]
  )

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
      void triggerRef.current('passwordConfirm')
    }
  }, [password, passwordConfirm])

  const ui: PasswordSectionUI = useMemo(
    () => ({
      passwordFieldState,
      passwordConfirmState,
    }),
    [passwordFieldState, passwordConfirmState]
  )

  const messages: PasswordSectionMessages = useMemo(
    () => ({ passwordConfirmMsg }),
    [passwordConfirmMsg]
  )

  return { values, ui, messages }
}
