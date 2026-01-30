import { useEffect, useMemo, useState } from 'react'
import { useCountdown } from '@/hooks/useCountdown'

export type Status = 'idle' | 'error' | 'success'

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
  identity: string
  code: string
  busy: boolean
  validateIdentity: (identity: string) => ValidationResult
}

function toFieldState(s: Status): 'success' | 'error' | 'default' {
  return s === 'success' ? 'success' : s === 'error' ? 'error' : 'default'
}

function computeUI(params: ComputeUIParams) {
  const {
    verified,
    sendStatus,
    verifyStatus,
    codeSent,
    identity,
    code,
    busy,
    validateIdentity,
  } = params
  const sendLabel = codeSent ? '재전송' : '전송'
  const canSend = validateIdentity(identity).ok && !busy && !verified
  const canVerify =
    !!codeSent && !!code?.trim() && !busy && !verified
  const fieldState = verified
    ? 'success'
    : sendStatus === 'error'
      ? 'error'
      : sendStatus === 'success'
        ? 'success'
        : 'default'
  const codeFieldState = verified
    ? 'success'
    : verifyStatus === 'error'
      ? 'error'
      : 'default'
  return { sendLabel, canSend, canVerify, fieldState, codeFieldState }
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

  const [token, setToken] = useState<string | null>(null)
  const [codeSent, setCodeSent] = useState(false)
  const [sendStatus, setSendStatus] = useState<Status>('idle')
  const [sendMsg, setSendMsg] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<Status>('idle')
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null)

  function resetOnIdentityChange() {
    setSendStatus('idle')
    setSendMsg(null)
    setVerified(false)
    setToken(null)
    setVerifyStatus('idle')
    setVerifyMsg(null)
    setCodeSent(false)
    timer.reset()
  }

  function resetVerification() {
    setVerified(false)
    setToken(null)
    setVerifyStatus('idle')
    setVerifyMsg(null)
  }

  function applyIdentityValidationError(v: ValidationResult) {
    const msg = v.message ?? text.identityInvalid
    setSendStatus('error')
    setSendMsg(msg)
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

  useEffect(() => {
    resetOnIdentityChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity])

  const ui = useMemo(
    () =>
      ({
        ...computeUI({
          verified,
          sendStatus,
          verifyStatus,
          codeSent,
          identity,
          code,
          busy,
          validateIdentity,
        }),
        toFieldState,
      }) as ReturnType<typeof computeUI> & { toFieldState: typeof toFieldState },
    [
      verified,
      sendStatus,
      verifyStatus,
      codeSent,
      identity,
      code,
      busy,
      validateIdentity,
    ]
  )

  const onSendCode = async () => {
    clearErrors([...identityFields, codeField])
    resetVerification()

    const v = validateIdentity(identity)
    if (!v.ok) {
      applyIdentityValidationError(v)
      setCodeSent(false)
      timer.reset()
      return
    }

    await withBusy(async () => {
      try {
        await send(identity)
        setSendStatus('success')
        setSendMsg(codeSent ? text.resent : text.sent)
        setCodeSent(true)
        timer.start()
      } catch (err) {
        const msg = getSendErrorMessage(err)
        setSendStatus('error')
        setSendMsg(msg)
        identityFields.forEach((f) => setFieldError(f, msg))
        setCodeSent(false)
        timer.reset()
      }
    })
  }

  const onVerifyCode = async () => {
    clearErrors(codeField)

    if (!code?.trim()) {
      setFieldError(codeField, text.codeRequired)
      return
    }

    if (!timer.isRunning) {
      resetVerification()
      setVerifyStatus('error')
      setVerifyMsg(text.expired)
      return
    }

    await withBusy(async () => {
      try {
        const res = await verify(identity, code.trim())
        setToken(getToken(res))
        setVerified(true)
        setVerifyStatus('success')
        setVerifyMsg(text.verifySuccess)
        timer.reset()
      } catch (err) {
        const msg = getVerifyErrorMessage(err)
        resetVerification()
        setVerifyStatus('error')
        setVerifyMsg(msg)
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

    actions: {
      onSendCode,
      onVerifyCode,
    },
  }
}
