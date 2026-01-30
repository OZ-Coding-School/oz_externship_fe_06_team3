import { useEffect, useMemo, useReducer, useCallback, useRef } from 'react'
import { useCountdown } from '@/hooks/useCountdown'

export type Status = 'idle' | 'pending' | 'error' | 'success'

type FieldErrorMap = Record<string, string>

type ValidationResult = {
  ok: boolean
  message?: string
  fieldErrors?: FieldErrorMap
}

type UseVerificationFlowArgs<TVerifyRes> = {
  identity: string
  code: string
  ttlSec: number
  busy: boolean
  setBusy: (v: boolean) => void
  clearErrors: (names: string | string[]) => void
  setFieldError: (name: string, message: string) => void

  identityFields: string[]
  codeField: string

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
  sendLabel: string
  canSend: boolean
  canVerify: boolean
  fieldState: 'success' | 'error' | 'default'
  codeFieldState: 'success' | 'error' | 'default'
}

function toFieldState(s: Status): 'success' | 'error' | 'default' {
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
  const sendLabel = codeSent ? '재전송' : '전송'
  const canSend =
    identityValid && !busy && !verified && sendStatus !== 'pending'
  const canVerify =
    !!codeSent &&
    !!code?.trim() &&
    !busy &&
    !verified &&
    verifyStatus !== 'pending'

  const fieldState = verified ? 'success' : toFieldState(sendStatus)
  const codeFieldState = verified ? 'success' : toFieldState(verifyStatus)
  return { sendLabel, canSend, canVerify, fieldState, codeFieldState }
}

type VerificationState = {
  token: string | null
  verified: boolean
  codeSent: boolean
  sendStatus: Status
  sendMsg: string | null
  verifyStatus: Status
  verifyMsg: string | null
}

const INITIAL_STATE: VerificationState = {
  token: null,
  verified: false,
  codeSent: false,
  sendStatus: 'idle',
  sendMsg: null,
  verifyStatus: 'idle',
  verifyMsg: null,
}

type VerificationAction =
  | { type: 'IDENTITY_CHANGED' }
  | { type: 'RESET_VERIFY_STATE' }
  | { type: 'SEND_REQUEST' }
  | {
      type: 'SEND_SUCCESS'
      payload: { mode: 'first' | 'resend'; sent: string; resent: string }
    }
  | { type: 'SEND_FAILURE'; payload: { sendMsg: string } }
  | { type: 'VERIFY_REQUEST' }
  | { type: 'VERIFY_SUCCESS'; payload: { token: string; verifyMsg: string } }
  | { type: 'VERIFY_FAILURE'; payload: { verifyMsg: string } }
  | { type: 'EXPIRED'; payload: { verifyMsg: string } }

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
        verifyMsg: null,
      }
    case 'SEND_REQUEST':
      return {
        ...state,
        sendStatus: 'pending',
        sendMsg: null,
      }
    case 'SEND_SUCCESS': {
      const sendMsg =
        action.payload.mode === 'resend'
          ? action.payload.resent
          : action.payload.sent
      return {
        ...state,
        sendStatus: 'success',
        sendMsg,
        codeSent: true,
      }
    }
    case 'SEND_FAILURE':
      return {
        ...state,
        sendStatus: 'error',
        sendMsg: action.payload.sendMsg,
      }

    case 'VERIFY_REQUEST':
      return {
        ...state,
        verifyStatus: 'pending',
        verifyMsg: null,
      }
    case 'VERIFY_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        verified: true,
        verifyStatus: 'success',
        verifyMsg: action.payload.verifyMsg,
      }
    case 'VERIFY_FAILURE':
    case 'EXPIRED':
      return {
        ...state,
        verified: false,
        token: null,
        verifyStatus: 'error',
        verifyMsg: action.payload.verifyMsg,
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
    sendMsg,
    verifyStatus,
    verifyMsg,
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
    dispatch({ type: 'SEND_FAILURE', payload: { sendMsg: msg } })
    if (v.fieldErrors) {
      Object.entries(v.fieldErrors).forEach(([k, m]) => setFieldError(k, m))
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
        const msg = getSendErrorMessage(err)
        dispatch({ type: 'SEND_FAILURE', payload: { sendMsg: msg } })
        identityFields.forEach((f) => setFieldError(f, msg))
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
      dispatch({ type: 'EXPIRED', payload: { verifyMsg: text.expired } })
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
            verifyMsg: text.verifySuccess,
          },
        })
        timerRef.current.reset()
      } catch (err) {
        const msg = getVerifyErrorMessage(err)
        dispatch({ type: 'VERIFY_FAILURE', payload: { verifyMsg: msg } })
        setFieldError(codeField, msg)
      }
    })
  }

  return {
    token,
    verified,
    codeSent,

    sendStatus,
    sendMsg,
    verifyStatus,
    verifyMsg,

    timer,

    ui,

    toFieldState,

    actions: {
      onSendCode,
      onVerifyCode,
    },
  }
}
