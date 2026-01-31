import { useEffect, useMemo, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuthStore } from '@/store/authStore'
import type { FieldState } from '@/components/common/CommonInput'
import { loginSchema, type LoginFormData } from '@/schemas/auth'
import { AUTH_MESSAGES } from '@/constants/authMessages'
import { pickMessageFromAxios } from '@/utils/signupUtils'

type LocationState = { from?: string }

function submitButtonUI(isValid: boolean, isSubmitting: boolean) {
  const disabled = !isValid || isSubmitting
  return {
    label: isSubmitting
      ? AUTH_MESSAGES.login.submitBusy
      : AUTH_MESSAGES.login.submitLabel,
    disabled,
    variant: (disabled ? 'disabled' : 'primary') as 'disabled' | 'primary',
  }
}

export type LoginVM = {
  fields: {
    email: {
      name: 'email'
      state: FieldState
      locked: boolean
      helperTextByState?: Partial<Record<FieldState, ReactNode>>
      rightSlot?: ReactNode
    }
    password: {
      name: 'password'
      state: FieldState
      locked: boolean
      helperTextByState?: Partial<Record<FieldState, ReactNode>>
      rightSlot?: ReactNode
    }
  }
  messages: {
    formError: string | null
  }
  ui: {
    isSubmitting: boolean
    submitButton: {
      label: string
      disabled: boolean
      variant: 'disabled' | 'primary'
    }
  }
  actions: {
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
    goFindId: () => void
    goFindPw: () => void
  }
}

export function useLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((s) => s.login)

  const from = useMemo(() => {
    const state = location.state as LocationState | null
    return typeof state?.from === 'string' ? state.from : '/'
  }, [location.state])

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    setError,
    clearErrors,
  } = methods

  const formError = errors.root?.message ?? null

  const [email, password] = useWatch({
    control,
    name: ['email', 'password'],
  })

  useEffect(() => {
    if (formError) clearErrors('root')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password])

  const onSubmit = handleSubmit(async (data) => {
    clearErrors('root')
    try {
      await authLogin(data)
      navigate(from, { replace: true })
    } catch (err) {
      const message = pickMessageFromAxios(
        err,
        {},
        AUTH_MESSAGES.login.formError
      )
      setError('root', { type: 'server', message })
    }
  })

  const submitButton = useMemo(
    () => submitButtonUI(isValid, isSubmitting),
    [isValid, isSubmitting]
  )

  const vm: LoginVM = {
    fields: {
      email: {
        name: 'email',
        state: 'default',
        locked: false,
        helperTextByState: { default: null },
      },
      password: {
        name: 'password',
        state: 'default',
        locked: false,
        helperTextByState: { default: null },
      },
    },
    messages: { formError },
    ui: { isSubmitting, submitButton },
    actions: {
      onSubmit,
      goFindId: () => console.log('아이디 찾기'),
      goFindPw: () => console.log('비밀번호 찾기'),
    },
  }

  return { methods, vm }
}
