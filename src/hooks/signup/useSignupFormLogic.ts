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
} from '@/utils/signupUtils'
import { useEmailVerification } from '@/hooks/signup/useEmailVerification'
import { useSmsVerification } from '@/hooks/signup/useSmsVerification'
import type { Status } from '@/hooks/useVerificationFlow'

export function useSignupFormLogic() {
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

  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<Status>('idle')
  const [nicknameMsg, setNicknameMsg] = useState<string | null>(null)

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

  const emailFlow = useEmailVerification({
    email,
    emailCode,
    busy,
    setBusy,
    clearErrors: clearFieldErrors,
    setFieldError,
  })

  const smsFlow = useSmsVerification({
    phoneNumber,
    phone2,
    phone3,
    smsCode,
    busy,
    setBusy,
    clearErrors: clearFieldErrors,
    setFieldError,
  })

  useEffect(() => {
    setNicknameChecked(false)
    setNicknameStatus('idle')
    setNicknameMsg(null)
  }, [nickname])

  const onCheckNickname = async () => {
    setFormError(null)

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

  return {
    methods,
    watchValues: {
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
    busy,
    formError,
    setFormError,
    nicknameChecked,
    nicknameStatus,
    nicknameMsg,
    onCheckNickname,
    emailFlow,
    smsFlow,
    onSubmit,
    trigger,
    formState,
  }
}
