import { useMemo } from 'react'
import type { FieldState } from '@/components/common/CommonInput'
import type { SubmitSectionActions, SubmitSectionUI } from './types'

export type UseSubmitSectionArgs = {
  formValid: boolean
  busy: boolean
  nicknameChecked: boolean
  emailVerified: boolean
  smsVerified: boolean
  passwordFieldState: FieldState
  passwordConfirmState: FieldState
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}

type CanSubmitInput = Pick<
  UseSubmitSectionArgs,
  | 'formValid'
  | 'busy'
  | 'nicknameChecked'
  | 'emailVerified'
  | 'smsVerified'
  | 'passwordFieldState'
  | 'passwordConfirmState'
>

function computeCanSubmit(args: CanSubmitInput): boolean {
  const {
    formValid,
    busy,
    nicknameChecked,
    emailVerified,
    smsVerified,
    passwordFieldState,
    passwordConfirmState,
  } = args
  if (!formValid) return false
  if (!nicknameChecked) return false
  if (!emailVerified) return false
  if (!smsVerified) return false
  if (passwordFieldState !== 'success') return false
  if (passwordConfirmState !== 'success') return false
  if (busy) return false
  return true
}

export function useSubmitSection(args: UseSubmitSectionArgs) {
  const {
    formValid,
    busy,
    nicknameChecked,
    emailVerified,
    smsVerified,
    passwordFieldState,
    passwordConfirmState,
    onSubmit,
  } = args

  const canSubmit = useMemo(
    () =>
      computeCanSubmit({
        formValid,
        busy,
        nicknameChecked,
        emailVerified,
        smsVerified,
        passwordFieldState,
        passwordConfirmState,
      }),
    [
      formValid,
      busy,
      nicknameChecked,
      emailVerified,
      smsVerified,
      passwordFieldState,
      passwordConfirmState,
    ]
  )

  const ui: SubmitSectionUI = useMemo(
    () => ({ canSubmit }),
    [canSubmit]
  )

  const actions: SubmitSectionActions = useMemo(
    () => ({ onSubmit }),
    [onSubmit]
  )

  return { ui, actions }
}
