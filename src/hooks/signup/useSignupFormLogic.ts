import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch, type Path } from 'react-hook-form'
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
import { AUTH_MESSAGES } from '@/constants/authMessages'
import { useEmailVerification } from '@/hooks/signup/useEmailVerification'
import { useSmsVerification } from '@/hooks/signup/useSmsVerification'
import type { Status } from '@/hooks/useVerificationFlow'
import {
  type FlowMessage,
  IDLE_FLOW_MESSAGE,
  deriveFieldState,
} from '@/utils/formMessage'

export type BusyAction = 'nickname' | 'email' | 'sms' | 'submit' | null

const SIGNUP_WATCH_FIELDS = [
  'name',
  'nickname',
  'birthdate',
  'email',
  'emailVerificationCode',
  'phone1',
  'phone2',
  'phone3',
  'phoneVerificationCode',
  'password',
  'passwordConfirm',
] as const

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

  const { handleSubmit, control, setError, clearErrors, trigger, formState } =
    methods

  const watched = useWatch({
    control,
    name: SIGNUP_WATCH_FIELDS,
  })

  const [
    nameRaw,
    nicknameRaw,
    birthdateRaw,
    emailRaw,
    emailVerificationCodeRaw,
    phone1Raw,
    phone2Raw,
    phone3Raw,
    phoneVerificationCodeRaw,
    passwordRaw,
    passwordConfirmRaw,
  ] = watched ?? []

  const name = (nameRaw ?? '').toString().trim()
  const nickname = (nicknameRaw ?? '').toString().trim()
  const birthdate = (birthdateRaw ?? '').toString().trim()
  const email = (emailRaw ?? '').toString().trim()
  const emailVerificationCode = (emailVerificationCodeRaw ?? '')
    .toString()
    .trim()
  const phone1 = (phone1Raw ?? '').toString().trim()
  const phone2 = (phone2Raw ?? '').toString().trim()
  const phone3 = (phone3Raw ?? '').toString().trim()
  const phoneVerificationCode = (phoneVerificationCodeRaw ?? '')
    .toString()
    .trim()
  const password = (passwordRaw ?? '') as string
  const passwordConfirm = (passwordConfirmRaw ?? '') as string

  const [busyAction, setBusyAction] = useState<BusyAction>(null)

  const makeSetBusy =
    (action: Exclude<BusyAction, null>) => (isBusy: boolean) => {
      setBusyAction((curr) => {
        if (isBusy) return action
        return curr === action ? null : curr
      })
    }

  const busy = busyAction !== null
  const [formError, setFormError] = useState<string | null>(null)

  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameStatus, setNicknameStatus] = useState<Status>('idle')
  const [nicknameFlowMessage, setNicknameFlowMessage] =
    useState<FlowMessage>(IDLE_FLOW_MESSAGE)

  const { errors } = formState
  const nicknameFieldState = deriveFieldState({
    hasError: !!errors.nickname?.message,
    isVerified: nicknameChecked,
    isSuccess: nicknameStatus === 'success',
  })

  const phoneNumber = useMemo(() => {
    return `${phone1}${phone2}${phone3}`.replace(/\D/g, '')
  }, [phone1, phone2, phone3])

  const clearFieldErrors = (
    names: Path<SignupFormData> | Path<SignupFormData>[]
  ) => {
    clearErrors(names)
  }

  const setFieldError = (name: Path<SignupFormData>, message: string) => {
    setError(name, { message })
  }

  const emailFlow = useEmailVerification({
    email,
    emailVerificationCode,
    busy,
    setBusy: makeSetBusy('email'),
    clearErrors: clearFieldErrors,
    setFieldError,
  })

  const smsFlow = useSmsVerification({
    phoneNumber,
    phone2,
    phone3,
    phoneVerificationCode,
    busy,
    setBusy: makeSetBusy('sms'),
    clearErrors: clearFieldErrors,
    setFieldError,
  })

  useEffect(() => {
    setNicknameChecked(false)
    setNicknameStatus('idle')
    setNicknameFlowMessage(IDLE_FLOW_MESSAGE)
  }, [nickname])

  const onCheckNickname = async () => {
    setFormError(null)

    const ok = await trigger('nickname')
    if (!ok) return

    clearErrors('nickname')

    setBusyAction('nickname')
    try {
      await authApi.checkNickname({ nickname })
      setNicknameChecked(true)
      setNicknameStatus('success')
      setNicknameFlowMessage({
        type: 'success',
        message: AUTH_MESSAGES.nickname.available,
        scope: null,
      })
    } catch (err) {
      setNicknameChecked(false)
      setNicknameFlowMessage(IDLE_FLOW_MESSAGE)
      const msg = pickMessageFromAxios(
        err,
        {
          409: AUTH_MESSAGES.nickname.duplicated,
          400: AUTH_MESSAGES.nickname.invalidFormat,
        },
        AUTH_MESSAGES.nickname.checkFailed
      )
      setNicknameStatus('error')
      setError('nickname', { message: msg })
    } finally {
      setBusyAction((curr) => (curr === 'nickname' ? null : curr))
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null)

    if (!nicknameChecked)
      return setFormError(AUTH_MESSAGES.form.requireNicknameCheck)
    if (!emailFlow.verified || !emailFlow.token)
      return setFormError(AUTH_MESSAGES.form.requireEmailVerify)
    if (!smsFlow.verified || !smsFlow.token)
      return setFormError(AUTH_MESSAGES.form.requireSmsVerify)

    const birthday = formatBirthday(data.birthdate)
    if (!birthday) {
      setError('birthdate', { message: AUTH_MESSAGES.common.birthdateFormat })
      return
    }

    setBusyAction('submit')
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
          409: AUTH_MESSAGES.form.signupDuplicate,
          400: AUTH_MESSAGES.form.signupBadRequest,
        },
        AUTH_MESSAGES.form.signupFailed
      )
      setFormError(msg)
    } finally {
      setBusyAction((curr) => (curr === 'submit' ? null : curr))
    }
  })

  return {
    methods,
    watchValues: {
      name,
      nickname,
      birthdate,
      email,
      emailVerificationCode,
      phone1,
      phone2,
      phone3,
      phoneVerificationCode,
      password,
      passwordConfirm,
      phoneNumber,
    },
    busy,
    busyAction,
    formError,
    setFormError,
    nicknameChecked,
    nicknameStatus,
    nicknameFlowMessage,
    nicknameFieldState,
    onCheckNickname,
    emailFlow,
    smsFlow,
    onSubmit,
    trigger,
    formState,
  }
}
