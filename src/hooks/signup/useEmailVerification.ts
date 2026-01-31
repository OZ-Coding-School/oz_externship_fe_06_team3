import type { Path } from 'react-hook-form'
import type { SignupFormData } from '@/schemas/auth'
import { useVerificationFlow } from '@/hooks/useVerificationFlow'
import * as authApi from '@/api/auth'
import { pickMessageFromAxios, emailZ } from '@/utils/signupUtils'
import { AUTH_MESSAGES } from '@/constants/authMessages'

const TTL_SEC = 5 * 60

type UseEmailVerificationArgs = {
  email: string
  emailVerificationCode: string
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (
    names: Path<SignupFormData> | Path<SignupFormData>[]
  ) => void
  setFieldError: (name: Path<SignupFormData>, message: string) => void
}

export function useEmailVerification({
  email,
  emailVerificationCode,
  busy,
  setBusy,
  clearErrors,
  setFieldError,
}: UseEmailVerificationArgs) {
  return useVerificationFlow({
    identity: email,
    code: emailVerificationCode,
    ttlSec: TTL_SEC,
    busy,
    setBusy,
    clearErrors,
    setFieldError,

    identityFields: ['email'],
    codeField: 'emailVerificationCode',

    validateIdentity: (v) => {
      const ok = emailZ.safeParse(v).success
      return ok
        ? { ok: true }
        : { ok: false, message: AUTH_MESSAGES.email.identityInvalid }
    },

    send: (identity) => authApi.sendEmailVerification({ email: identity }),
    verify: (identity, code) => authApi.verifyEmail({ email: identity, code }),
    getToken: (res) => res.email_token,

    getSendErrorMessage: (err) =>
      pickMessageFromAxios(err, {
        409: AUTH_MESSAGES.email.sendErrorAlreadyRegistered,
        400: AUTH_MESSAGES.email.sendErrorBadRequest,
      }, AUTH_MESSAGES.email.sendErrorFallback),
    getVerifyErrorMessage: (err) =>
      pickMessageFromAxios(err, {
        400: AUTH_MESSAGES.email.verifyErrorMismatch,
        409: AUTH_MESSAGES.email.verifyErrorAlreadyRegistered,
      }, AUTH_MESSAGES.email.verifyErrorFallback),

    text: {
      sent: AUTH_MESSAGES.email.sendSuccess,
      resent: AUTH_MESSAGES.email.sendResent,
      identityInvalid: AUTH_MESSAGES.email.identityInvalid,
      codeRequired: AUTH_MESSAGES.email.codeRequired,
      expired: AUTH_MESSAGES.email.expired,
      verifySuccess: AUTH_MESSAGES.email.verifySuccess,
    },
  })
}
