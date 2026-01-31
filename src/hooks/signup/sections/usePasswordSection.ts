import { useEffect, useMemo, useRef } from 'react'
import type { SignupFormData } from '@/schemas/auth'
import { PASSWORD_REGEX } from '@/utils/signupUtils'
import type { FieldState } from '@/components/common/CommonInput'
import { AUTH_MESSAGES } from '@/constants/authMessages'
import type {
  PasswordSectionMessages,
  PasswordSectionUI,
  PasswordSectionValues,
} from './types'

export type UsePasswordSectionArgs = {
  password: string
  passwordConfirm: string
  trigger: (name: keyof SignupFormData) => Promise<boolean>
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
    if (!pw) return AUTH_MESSAGES.password.required
    if (!PASSWORD_REGEX.test(pw)) return AUTH_MESSAGES.password.invalidFormat
    return confirm === pw
      ? AUTH_MESSAGES.password.match
      : AUTH_MESSAGES.password.mismatch
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
