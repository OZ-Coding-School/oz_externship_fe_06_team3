import { useVerificationFlow } from '@/hooks/useVerificationFlow'
import * as authApi from '@/api/auth'
import { pickMessageFromAxios } from '@/utils/signupUtils'
import { emailZ } from '@/utils/signupUtils'

const TTL_SEC = 5 * 60

type UseEmailVerificationArgs = {
  email: string
  emailCode: string
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (names: string | string[]) => void
  setFieldError: (name: string, message: string) => void
}

export function useEmailVerification({
  email,
  emailCode,
  busy,
  setBusy,
  clearErrors,
  setFieldError,
}: UseEmailVerificationArgs) {
  return useVerificationFlow({
    identity: email,
    code: emailCode,
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
        : { ok: false, message: '* 올바른 이메일 형식을 입력해주세요.' }
    },

    send: (identity) => authApi.sendEmailVerification({ email: identity }),
    verify: (identity, code) => authApi.verifyEmail({ email: identity, code }),
    getToken: (res) => res.email_token,

    getSendErrorMessage: (err) =>
      pickMessageFromAxios(
        err,
        {
          409: '* 이미 가입된 이메일입니다.',
          400: '* 이메일 형식을 확인해주세요.',
        },
        '* 이메일 인증 코드 전송에 실패했습니다.'
      ),
    getVerifyErrorMessage: (err) =>
      pickMessageFromAxios(
        err,
        {
          400: '* 인증코드가 일치하지 않습니다.',
          409: '* 이미 가입된 이메일입니다.',
        },
        '* 이메일 인증에 실패했습니다.'
      ),

    text: {
      sent: '* 인증코드를 전송했습니다.',
      resent: '* 인증코드를 재전송했습니다.',
      identityInvalid: '* 올바른 이메일 형식을 입력해주세요.',
      codeRequired: '* 인증코드를 입력해주세요.',
      expired: '* 인증 시간이 만료되었습니다. 인증코드를 다시 요청해주세요.',
      verifySuccess: '* 이메일 인증이 완료되었습니다.',
    },
  })
}
