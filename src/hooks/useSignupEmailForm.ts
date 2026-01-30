import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { signupSchema, type SignupFormData } from '@/schemas/auth'
import * as authApi from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import {
  pickMessageFromAxios,
  formatBirthday,
  mapGender,
  PASSWORD_REGEX,
  emailZ,
} from '@/utils/signupUtils'
import type { FieldState } from '@/components/common/CommonInput'
import { useVerificationFlow, type Status } from '@/hooks/useVerificationFlow'

export function useSignupEmailForm() {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      nickname: '',
      birthdate: '',
      gender: 'male',
      email: '',
      emailVerificationCode: '',
      phone1: '010',
      phone2: '',
      phone3: '',
      phoneVerificationCode: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const { handleSubmit, watch, setError, clearErrors, trigger, formState } =
    methods

  const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{2,10}$/

  const [busy, setBusy] = useState(false)

  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<Status>('idle')
  const [nicknameMsg, setNicknameMsg] = useState<string | null>(null)

  const [formError, setFormError] = useState<string | null>(null)

  const name = watch('name')?.trim() ?? ''
  const nickname = watch('nickname')?.trim() ?? ''
  const birthdate = watch('birthdate')?.trim() ?? ''

  const email = watch('email')?.trim() ?? ''
  const emailCode = watch('emailVerificationCode')?.trim() ?? ''

  const phone1 = watch('phone1')?.trim() ?? ''
  const phone2 = watch('phone2')?.trim() ?? ''
  const phone3 = watch('phone3')?.trim() ?? ''
  const smsCode = watch('phoneVerificationCode')?.trim() ?? ''

  const password = watch('password') ?? ''
  const passwordConfirm = watch('passwordConfirm') ?? ''

  const phoneNumber = useMemo(() => {
    return `${phone1}${phone2}${phone3}`.replace(/\D/g, '')
  }, [phone1, phone2, phone3])

  // 비밀번호 상태 관리
  const passwordFieldState: FieldState = useMemo(() => {
    const value = password.trim()
    if (!value) return 'default'
    return PASSWORD_REGEX.test(value) ? 'success' : 'error'
  }, [password])

  const passwordConfirmState: FieldState = useMemo(() => {
    const pw = password.trim()
    const confirm = passwordConfirm.trim()

    if (!confirm) return 'default'

    // 비밀번호가 유효하지 않으면 비밀번호 확인도 에러 처리
    if (!pw) return 'error'
    if (!PASSWORD_REGEX.test(pw)) return 'error'

    // 비밀번호 유효할 때만 일치 판정
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

  // 비밀번호가 바뀌면 비밀번호 확인도 즉시 재검사
  useEffect(() => {
    if (passwordConfirm.trim()) {
      void trigger('passwordConfirm')
    }
  }, [password, passwordConfirm, trigger])

  // 닉네임 입력 변경 시 초기화
  useEffect(() => {
    setNicknameChecked(false)
    setNicknameStatus('idle')
    setNicknameMsg(null)
  }, [nickname])

  // 닉네임 상태 변환
  const toFieldState = (s: Status): FieldState =>
    s === 'success' ? 'success' : s === 'error' ? 'error' : 'default'

  const clearFieldErrors = (names: string | string[]) => {
    if (Array.isArray(names)) {
      clearErrors(names as (keyof SignupFormData)[])
    } else {
      clearErrors(names as keyof SignupFormData)
    }
  }

  const setFieldError = (name: string, message: string) => {
    setError(name as keyof SignupFormData, { message })
  }

  // 닉네임 중복 확인
  const onCheckNickname = async () => {
    setFormError(null)

    // zod 검증을 먼저 통과해야 중복확인 API 호출
    const ok = await trigger('nickname')
    if (!ok) return

    clearErrors('nickname')

    setBusy(true)
    try {
      await authApi.checkNickname({ nickname })
      setNicknameChecked(true)
      setNicknameStatus('success')
      setNicknameMsg('* 사용 가능한 닉네임입니다.')
    } catch (err) {
      setNicknameChecked(false)
      const msg = pickMessageFromAxios(
        err,
        {
          409: '* 이미 사용 중인 닉네임입니다.',
          400: '* 닉네임 형식을 확인해주세요.',
        },
        '* 닉네임 중복 확인에 실패했습니다.'
      )
      setNicknameStatus('error')
      setNicknameMsg(msg)
      setError('nickname', { message: msg })
    } finally {
      setBusy(false)
    }
  }

  // 이메일 인증 플로우
  const emailFlow = useVerificationFlow({
    identity: email,
    code: emailCode,
    ttlSec: 5 * 60,
    busy,
    setBusy,
    clearErrors: clearFieldErrors,
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

  // 휴대폰 인증 플로우
  const smsFlow = useVerificationFlow({
    identity: phoneNumber,
    code: smsCode,
    ttlSec: 5 * 60,
    busy,
    setBusy,
    clearErrors: clearFieldErrors,
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

  // 회원가입 제출
  const onSubmit = handleSubmit(async (data) => {
    setFormError(null)

    if (!nicknameChecked)
      return setFormError('* 닉네임 중복확인을 진행해주세요.')
    if (!emailFlow.verified || !emailFlow.token)
      return setFormError('* 이메일 인증을 완료해주세요.')
    if (!smsFlow.verified || !smsFlow.token)
      return setFormError('* 휴대폰 인증을 완료해주세요.')

    const birthday = formatBirthday(data.birthdate)
    if (!birthday) {
      setError('birthdate', {
        message: '* 8자리로 입력해주세요. (예: 20000101)',
      })
      return
    }

    setBusy(true)
    try {
      await authApi.signup({
        password: data.password,
        password_confirm: data.passwordConfirm,
        nickname: data.nickname.trim(),
        name: data.name.trim(),
        birthday,
        gender: mapGender(data.gender),
        email_token: emailFlow.token,
        sms_token: smsFlow.token,
      })

      await authLogin({ email: data.email.trim(), password: data.password })
      navigate('/', { replace: true })
    } catch (err) {
      const msg = pickMessageFromAxios(
        err,
        {
          409: '* 이미 가입된 정보이거나 중복된 회원가입 내역입니다.',
          400: '* 입력값을 다시 확인해주세요.',
        },
        '* 회원가입에 실패했습니다. 입력값을 다시 확인해주세요.'
      )
      setFormError(msg)
    } finally {
      setBusy(false)
    }
  })

  // 닉네임 상태
  const nicknameFieldState = toFieldState(nicknameStatus)

  // 휴대폰 인증 상태
  const phoneDigitsState: FieldState = smsFlow.verified
    ? 'success'
    : smsFlow.sendStatus === 'error'
      ? 'error'
      : smsFlow.sendStatus === 'success'
        ? 'success'
        : 'default'

  // 회원가입 제출 가능 여부
  const canSubmit =
    formState.isValid &&
    nicknameChecked &&
    emailFlow.verified &&
    smsFlow.verified &&
    passwordFieldState === 'success' &&
    passwordConfirmState === 'success' &&
    !busy

  const canCheckNickname =
    !busy && !nicknameChecked && NICKNAME_REGEX.test(nickname)

  return {
    methods,

    values: {
      name,
      nickname,
      birthdate,
      email,
      emailCode,
      phone1,
      phone2,
      phone3,
      smsCode,
      password,
      passwordConfirm,
      phoneNumber,
    },

    ui: {
      busy,

      nicknameChecked,
      canCheckNickname,
      nicknameFieldState,

      // 이메일 인증 상태
      emailVerified: emailFlow.verified,
      emailCodeSent: emailFlow.codeSent,
      emailFieldState: emailFlow.ui.fieldState as FieldState,
      emailCodeFieldState: emailFlow.ui.codeFieldState as FieldState,
      emailTimer: emailFlow.timer,
      emailSendLabel: emailFlow.codeSent ? '재전송' : '인증코드전송',
      canSendEmail: emailFlow.ui.canSend,
      canVerifyEmail: emailFlow.ui.canVerify,

      // 휴대폰 인증 상태
      smsVerified: smsFlow.verified,
      smsCodeSent: smsFlow.codeSent,
      phoneDigitsState,
      smsCodeFieldState: smsFlow.ui.codeFieldState as FieldState,
      smsTimer: smsFlow.timer,
      smsSendLabel: smsFlow.codeSent ? '재전송' : '인증번호 받기',
      canSendSms: smsFlow.ui.canSend,
      canVerifySms: smsFlow.ui.canVerify,
      phoneSendStatus: smsFlow.sendStatus,

      // 비밀번호 상태
      passwordFieldState,
      passwordConfirmState,

      canSubmit,
    },

    messages: {
      nicknameMsg,

      // 이메일 인증 메시지
      emailSendMsg: emailFlow.sendMsg,
      emailVerifyMsg: emailFlow.verifyMsg,

      // 휴대폰 인증 메시지
      phoneSendMsg: smsFlow.sendMsg,
      smsVerifyMsg: smsFlow.verifyMsg,

      // 비밀번호 확인 메시지
      passwordConfirmMsg,

      formError,
    },

    actions: {
      onCheckNickname,

      // 이메일 인증 버튼
      onSendEmailCode: emailFlow.actions.onSendCode,
      onVerifyEmailCode: emailFlow.actions.onVerifyCode,

      // 휴대폰 인증 버튼
      onSendSmsCode: smsFlow.actions.onSendCode,
      onVerifySmsCode: smsFlow.actions.onVerifyCode,

      onSubmit,
    },
  }
}
