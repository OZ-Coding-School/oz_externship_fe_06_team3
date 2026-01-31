import { useEffect, useMemo, useReducer, useCallback, useRef } from 'react'
import type { Path } from 'react-hook-form'
import type { FieldState } from '@/components/common/CommonInput'
import type { SignupFormData } from '@/schemas/auth'
import { useCountdown } from '@/hooks/useCountdown'
import { type FlowMessage, IDLE_FLOW_MESSAGE } from '@/utils/formMessage'

export type Status = 'idle' | 'pending' | 'error' | 'success'

type ValidationResult = {
  ok: boolean
  message?: string
  fieldErrors?: Partial<Record<Path<SignupFormData>, string>>
}

type UseVerificationFlowArgs<TVerifyRes> = {
  identity: string
  code: string
  ttlSec: number
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (
    names: Path<SignupFormData> | Path<SignupFormData>[]
  ) => void
  setFieldError: (name: Path<SignupFormData>, message: string) => void

  identityFields: Path<SignupFormData>[]
  codeField: Path<SignupFormData>

  validateIdentity: (identity: string) => ValidationResult

  send: (identity: string) => Promise<void>
  verify: (identity: string, code: string) => Promise<TVerifyRes>
  getToken: (res: TVerifyRes) => string

  getSendErrorMessage: (err: unknown) => string
  getVerifyErrorMessage: (err: unknown) => string

  text: {
    sent: string
    resent: string
    identityInvalid: string
    codeRequired: string
    expired: string
    verifySuccess: string
  }
}

type ComputeUIParams = {
  verified: boolean
  sendStatus: Status
  verifyStatus: Status
  codeSent: boolean
  code: string
  busy: boolean
  identityValid: boolean
}

type ComputeUIResult = {
  canSend: boolean
  canVerify: boolean
  fieldState: FieldState
  codeFieldState: FieldState
}

function toFieldState(s: Status): FieldState {
  switch (s) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'idle':
    case 'pending':
    default:
      return 'default'
  }
}

function computeUI(params: ComputeUIParams): ComputeUIResult {
  const {
    verified,
    sendStatus,
    verifyStatus,
    codeSent,
    code,
    busy,
    identityValid,
  } = params
  const canSend =
    identityValid && !busy && !verified && sendStatus !== 'pending'
  const canVerify =
    !!codeSent &&
    !!code?.trim() &&
    !busy &&
    !verified &&
    verifyStatus !== 'pending'

  const fieldState: FieldState = verified ? 'success' : toFieldState(sendStatus)
  const codeFieldState: FieldState =
    verified ? 'success' : toFieldState(verifyStatus)
  return { canSend, canVerify, fieldState, codeFieldState }
}

type VerificationState = {
  token: string | null
  verified: boolean
  codeSent: boolean
  sendStatus: Status
  flowMessage: FlowMessage
  verifyStatus: Status
}

const INITIAL_STATE: VerificationState = {
  token: null,
  verified: false,
  codeSent: false,
  sendStatus: 'idle',
  flowMessage: IDLE_FLOW_MESSAGE,
  verifyStatus: 'idle',
}

type VerificationAction =
  | { type: 'IDENTITY_CHANGED' }
  | { type: 'RESET_VERIFY_STATE' }
  | { type: 'SEND_REQUEST' }
  | {
      type: 'SEND_SUCCESS'
      payload: { mode: 'first' | 'resend'; sent: string; resent: string }
    }
  | { type: 'SEND_FAILURE'; payload: { message: string } }
  | { type: 'VERIFY_REQUEST' }
  | { type: 'VERIFY_SUCCESS'; payload: { token: string; message: string } }
  | { type: 'VERIFY_FAILURE'; payload: { message: string } }
  | { type: 'EXPIRED'; payload: { message: string } }

function verificationReducer(
  state: VerificationState,
  action: VerificationAction
): VerificationState {
  switch (action.type) {
    case 'IDENTITY_CHANGED':
      return INITIAL_STATE

    case 'RESET_VERIFY_STATE':
      return {
        ...state,
        verified: false,
        token: null,
        verifyStatus: 'idle',
        flowMessage: IDLE_FLOW_MESSAGE,
      }
    case 'SEND_REQUEST':
      return {
        ...state,
        sendStatus: 'pending',
        flowMessage: IDLE_FLOW_MESSAGE,
      }
    case 'SEND_SUCCESS': {
      const message =
        action.payload.mode === 'resend'
          ? action.payload.resent
          : action.payload.sent
      return {
        ...state,
        sendStatus: 'success',
        flowMessage: { type: 'success', message, scope: 'send' },
        codeSent: true,
      }
    }
    case 'SEND_FAILURE':
      return {
        ...state,
        sendStatus: 'error',
        flowMessage: {
          type: 'error',
          message: action.payload.message,
          scope: 'send',
        },
      }

    case 'VERIFY_REQUEST':
      return {
        ...state,
        verifyStatus: 'pending',
        flowMessage: IDLE_FLOW_MESSAGE,
      }
    case 'VERIFY_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        verified: true,
        verifyStatus: 'success',
        flowMessage: {
          type: 'success',
          message: action.payload.message,
          scope: 'verify',
        },
      }
    case 'VERIFY_FAILURE':
      return {
        ...state,
        verified: false,
        token: null,
        verifyStatus: 'error',
        flowMessage: {
          type: 'error',
          message: action.payload.message,
          scope: 'verify',
        },
      }
    case 'EXPIRED':
      return {
        ...state,
        verified: false,
        token: null,
        verifyStatus: 'error',
        flowMessage: {
          type: 'error',
          message: action.payload.message,
          scope: 'expired',
        },
      }
    default:
      return state
  }
}

export function useVerificationFlow<TVerifyRes>({
  identity,
  code,
  ttlSec,
  busy,
  setBusy,
  clearErrors,
  setFieldError,
  identityFields,
  codeField,
  validateIdentity,
  send,
  verify,
  getToken,
  getSendErrorMessage,
  getVerifyErrorMessage,
  text,
}: UseVerificationFlowArgs<TVerifyRes>) {
  const timer = useCountdown(ttlSec)
  const timerRef = useRef(timer)
  timerRef.current = timer

  const [state, dispatch] = useReducer(verificationReducer, INITIAL_STATE)

  const {
    token,
    verified,
    codeSent,
    sendStatus,
    flowMessage,
    verifyStatus,
  } = state

  const resetAll = useCallback(() => {
    dispatch({ type: 'IDENTITY_CHANGED' })
    timerRef.current.reset()
  }, [])

  useEffect(() => {
    resetAll()
  }, [identity, resetAll])

  function resetVerifyState() {
    dispatch({ type: 'RESET_VERIFY_STATE' })
  }

  function applyIdentityValidationError(v: ValidationResult) {
    const msg = v.message ?? text.identityInvalid
    if (v.fieldErrors) {
      ;(
        Object.entries(v.fieldErrors) as [Path<SignupFormData>, string][]
      ).forEach(([k, m]) => setFieldError(k, m))
    } else {
      identityFields.forEach((f) => setFieldError(f, msg))
    }
  }

  async function withBusy<T>(fn: () => Promise<T>): Promise<T> {
    setBusy(true)
    try {
      return await fn()
    } finally {
      setBusy(false)
    }
  }

  const identityValid = useMemo(
    () => validateIdentity(identity).ok,
    [identity, validateIdentity]
  )

  const ui = useMemo(
    () =>
      computeUI({
        verified,
        sendStatus,
        verifyStatus,
        codeSent,
        code,
        busy,
        identityValid,
      }),
    [verified, sendStatus, verifyStatus, codeSent, code, busy, identityValid]
  )

  const onSendCode = async () => {
    clearErrors([...identityFields, codeField])

    const v = validateIdentity(identity)
    if (!v.ok) {
      applyIdentityValidationError(v)
      timerRef.current.reset()
      return
    }

    if (busy || sendStatus === 'pending') return

    resetVerifyState()
    dispatch({ type: 'SEND_REQUEST' })

    const isResend = codeSent
    await withBusy(async () => {
      try {
        await send(identity)
        dispatch({
          type: 'SEND_SUCCESS',
          payload: {
            mode: isResend ? 'resend' : 'first',
            sent: text.sent,
            resent: text.resent,
          },
        })
        timerRef.current.start()
      } catch (err) {
        const message = getSendErrorMessage(err)
        dispatch({ type: 'SEND_FAILURE', payload: { message } })
        timerRef.current.reset()
      }
    })
  }

  const onVerifyCode = async () => {
    clearErrors(codeField)

    if (!code?.trim()) {
      setFieldError(codeField, text.codeRequired)
      return
    }

    if (!timerRef.current.isRunning) {
      resetVerifyState()
      dispatch({ type: 'EXPIRED', payload: { message: text.expired } })
      return
    }

    if (busy || verifyStatus === 'pending') return

    await withBusy(async () => {
      dispatch({ type: 'VERIFY_REQUEST' })
      try {
        const res = await verify(identity, code.trim())
        const tokenValue = getToken(res)
        dispatch({
          type: 'VERIFY_SUCCESS',
          payload: {
            token: tokenValue,
            message: text.verifySuccess,
          },
        })
        timerRef.current.reset()
      } catch (err) {
        const message = getVerifyErrorMessage(err)
        dispatch({ type: 'VERIFY_FAILURE', payload: { message } })
      }
    })
  }

  return {
    token,
    verified,
    codeSent,

    sendStatus,
    flowMessage,
    verifyStatus,

    timer,

    ui,

    toFieldState,

    actions: {
      onSendCode,
      onVerifyCode,
    },
  }
}
