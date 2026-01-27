import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuthStore } from '@/store/authStore'
import type { FieldState } from '@/components/common/CommonInput'
import { loginSchema, type LoginFormData } from '@/schemas/auth'

type LocationState = { from?: string }

export function useLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((s) => s.login)

  const from = useMemo(() => {
    const state = location.state as LocationState | null
    return typeof state?.from === 'string' ? state.from : '/'
  }, [location.state])

  const [formError, setFormError] = useState<string | null>(null)
  const [loginFailed, setLoginFailed] = useState(false)

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting, submitCount, isValid },
    watch,
  } = methods

  const email = watch('email') ?? ''
  const password = watch('password') ?? ''

  const showValidation = submitCount > 0

  const emailState: FieldState =
    loginFailed || (showValidation && !!errors.email) ? 'error' : 'default'

  const passwordState: FieldState =
    loginFailed || (showValidation && !!errors.password) ? 'error' : 'default'

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null)
    setLoginFailed(false)

    try {
      await authLogin(data)
      navigate(from, { replace: true })
    } catch {
      setLoginFailed(true)
      setFormError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  })

  useEffect(() => {
    if (!loginFailed && !formError) return
    setLoginFailed(false)
    setFormError(null)
  }, [email, password]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    methods,
    onSubmit,

    formError,
    isSubmitting,
    isValid,

    emailState,
    passwordState,

    goSignup: () => navigate('/signup'),
    goFindId: () => console.log('아이디 찾기'),
    goFindPw: () => console.log('비밀번호 찾기'),
  }
}
