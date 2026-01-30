import { useVerificationFlow } from '@/hooks/useVerificationFlow'
import * as authApi from '@/api/auth'
import { pickMessageFromAxios } from '@/utils/signupUtils'

const TTL_SEC = 5 * 60

type UseSmsVerificationArgs = {
  phoneNumber: string
  phone2: string
  phone3: string
  smsCode: string
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (names: string | string[]) => void
  setFieldError: (name: string, message: string) => void
}

export function useSmsVerification({
  phoneNumber,
  phone2,
  phone3,
  smsCode,
  busy,
  setBusy,
  clearErrors,
  setFieldError,
}: UseSmsVerificationArgs) {
  return useVerificationFlow({
    identity: phoneNumber,
    code: smsCode,
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
          message: '* 휴대전화 번호를 올바르게 입력해주세요.',
          fieldErrors: {
            ...(p2ok ? {} : { phone2: '* 4자리 입력' }),
            ...(p3ok ? {} : { phone3: '* 4자리 입력' }),
          },
        }
      }
      if (phoneNumber.length < 10) {
        return {
          ok: false,
          message: '* 휴대전화 번호를 올바르게 입력해주세요.',
        }
      }
      return { ok: true }
    },

    send: (identity) => authApi.sendSmsVerification({ phone_number: identity }),
    verify: (identity, code) =>
      authApi.verifySms({ phone_number: identity, code }),
    getToken: (res) => res.sms_token,

    getSendErrorMessage: (err) =>
      pickMessageFromAxios(
        err,
        {
          409: '* 이미 가입에 사용된 휴대전화 번호입니다.',
          400: '* 휴대전화 번호 형식을 확인해주세요.',
        },
        '* 휴대폰 인증번호 전송에 실패했습니다.'
      ),
    getVerifyErrorMessage: (err) =>
      pickMessageFromAxios(
        err,
        {
          400: '* 인증코드가 일치하지 않습니다.',
          409: '* 이미 가입에 사용된 휴대전화 번호입니다.',
        },
        '* 휴대폰 인증에 실패했습니다.'
      ),

    text: {
      sent: '* 인증번호를 전송했습니다.',
      resent: '* 인증번호를 재전송했습니다.',
      identityInvalid: '* 휴대전화 번호를 올바르게 입력해주세요.',
      codeRequired: '* 인증번호를 입력해주세요.',
      expired: '* 인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.',
      verifySuccess: '* 휴대폰 인증이 완료되었습니다.',
    },
  })
}
