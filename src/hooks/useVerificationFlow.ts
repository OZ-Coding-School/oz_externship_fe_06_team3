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

  // 식별자 바뀌면 상태 초기화
  useEffect(() => {
    setSendStatus('idle')
    setSendMsg(null)

    setVerified(false)
    setToken(null)

    setVerifyStatus('idle')
    setVerifyMsg(null)

    setCodeSent(false)
    timer.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity])

  const toFieldState = (s: Status) =>
    s === 'success' ? 'success' : s === 'error' ? 'error' : 'default'

  const fieldState = useMemo(() => {
    // 식별자 input border 색 변경
    return verified
      ? 'success'
      : sendStatus === 'error'
        ? 'error'
        : sendStatus === 'success'
          ? 'success'
          : 'default'
  }, [verified, sendStatus])

  const codeFieldState = useMemo(() => {
    // 인증코드 input border 색 변경
    return verified ? 'success' : verifyStatus === 'error' ? 'error' : 'default'
  }, [verified, verifyStatus])

  const sendLabel = codeSent ? '재전송' : '전송'
  const canSend = useMemo(() => {
    return validateIdentity(identity).ok && !busy && !verified
  }, [identity, busy, verified, validateIdentity])

  const canVerify = useMemo(() => {
    return !!codeSent && !!code?.trim() && !busy && !verified
  }, [codeSent, code, busy, verified])

  const onSendCode = async () => {
    clearErrors([...identityFields, codeField])

    // 재전송/변경 시 인증 상태 초기화
    setVerified(false)
    setToken(null)
    setVerifyStatus('idle')
    setVerifyMsg(null)

    const v = validateIdentity(identity)
    if (!v.ok) {
      const msg = v.message ?? text.identityInvalid
      setSendStatus('error')
      setSendMsg(msg)

      if (v.fieldErrors) {
        Object.entries(v.fieldErrors).forEach(([k, m]) => setFieldError(k, m))
      } else {
        identityFields.forEach((f) => setFieldError(f, msg))
      }

      setCodeSent(false)
      timer.reset()
      return
    }

    setBusy(true)
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
    } finally {
      setBusy(false)
    }
  }

  const onVerifyCode = async () => {
    clearErrors(codeField)

    if (!code?.trim()) {
      setFieldError(codeField, text.codeRequired)
      return
    }

    if (!timer.isRunning) {
      setVerified(false)
      setToken(null)
      setVerifyStatus('error')
      setVerifyMsg(text.expired)
      return
    }

    setBusy(true)
    try {
      const res = await verify(identity, code.trim())
      setToken(getToken(res))
      setVerified(true)
      setVerifyStatus('success')
      setVerifyMsg(text.verifySuccess)
      timer.reset()
    } catch (err) {
      const msg = getVerifyErrorMessage(err)
      setVerified(false)
      setToken(null)
      setVerifyStatus('error')
      setVerifyMsg(msg)
      setFieldError(codeField, msg)
    } finally {
      setBusy(false)
    }
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

    ui: {
      sendLabel,
      canSend,
      canVerify,
      fieldState,
      codeFieldState,
      toFieldState,
    },

    actions: {
      onSendCode,
      onVerifyCode,
    },
  }
}
