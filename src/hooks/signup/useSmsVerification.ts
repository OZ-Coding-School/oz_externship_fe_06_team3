import type { Path } from 'react-hook-form'
import type { SignupFormData } from '@/schemas/auth'
import { useVerificationFlow } from '@/hooks/useVerificationFlow'
import * as authApi from '@/api/auth'
import { pickMessageFromAxios } from '@/utils/signupUtils'
import { AUTH_MESSAGES } from '@/constants/authMessages'

const TTL_SEC = 5 * 60

type UseSmsVerificationArgs = {
  phoneNumber: string
  phone2: string
  phone3: string
  phoneVerificationCode: string
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (
    names: Path<SignupFormData> | Path<SignupFormData>[]
  ) => void
  setFieldError: (name: Path<SignupFormData>, message: string) => void
}

export function useSmsVerification({
  phoneNumber,
  phone2,
  phone3,
  phoneVerificationCode,
  busy,
  setBusy,
  clearErrors,
  setFieldError,
}: UseSmsVerificationArgs) {
  return useVerificationFlow({
    identity: phoneNumber,
    code: phoneVerificationCode,
    ttlSec: TTL_SEC,
    busy,
    setBusy,
    clearErrors,
    setFieldError,

    identityFields: ['phone2', 'phone3'],
    codeField: 'phoneVerificationCode',

    validateIdentity: () => {
      const p2ok = /^\d{4}$/.test(phone2)
      const p3ok = /^\d{4}$/.test(phone3)
      if (!p2ok || !p3ok) {
        return {
          ok: false,
          message: AUTH_MESSAGES.sms.identityInvalid,
          fieldErrors: {
            ...(p2ok ? {} : { phone2: AUTH_MESSAGES.sms.phoneDigitError }),
            ...(p3ok ? {} : { phone3: AUTH_MESSAGES.sms.phoneDigitError }),
          },
        }
      }
      if (phoneNumber.length < 10) {
        return {
          ok: false,
          message: AUTH_MESSAGES.sms.identityInvalid,
        }
      }
      return { ok: true }
    },

    send: (identity) => authApi.sendSmsVerification({ phone_number: identity }),
    verify: (identity, code) =>
      authApi.verifySms({ phone_number: identity, code }),
    getToken: (res) => res.sms_token,

    getSendErrorMessage: (err) =>
      pickMessageFromAxios(err, {
        409: AUTH_MESSAGES.sms.sendErrorAlreadyRegistered,
        400: AUTH_MESSAGES.sms.sendErrorBadRequest,
      }, AUTH_MESSAGES.sms.sendErrorFallback),
    getVerifyErrorMessage: (err) =>
      pickMessageFromAxios(err, {
        400: AUTH_MESSAGES.sms.verifyErrorMismatch,
        409: AUTH_MESSAGES.sms.verifyErrorAlreadyRegistered,
      }, AUTH_MESSAGES.sms.verifyErrorFallback),

    text: {
      sent: AUTH_MESSAGES.sms.sendSuccess,
      resent: AUTH_MESSAGES.sms.sendResent,
      identityInvalid: AUTH_MESSAGES.sms.identityInvalid,
      codeRequired: AUTH_MESSAGES.sms.codeRequired,
      expired: AUTH_MESSAGES.sms.expired,
      verifySuccess: AUTH_MESSAGES.sms.verifySuccess,
    },
  })
}
