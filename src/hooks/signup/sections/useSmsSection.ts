import { useMemo } from 'react'
import type { FieldState } from '@/components/common/CommonInput'
import type {
  VerificationFlowReturn,
  SmsSectionActions,
  SmsSectionMessages,
  SmsSectionUI,
  SmsSectionValues,
} from './types'

export type UseSmsSectionArgs = {
  smsFlow: VerificationFlowReturn
  phone1: string
  phone2: string
  phone3: string
  smsCode: string
  phoneNumber: string
}

export function useSmsSection(args: UseSmsSectionArgs) {
  const { smsFlow, phone1, phone2, phone3, smsCode, phoneNumber } = args

  const values: SmsSectionValues = useMemo(
    () => ({ phone1, phone2, phone3, smsCode, phoneNumber }),
    [phone1, phone2, phone3, smsCode, phoneNumber]
  )

  const phoneDigitsState: FieldState = useMemo(() => {
    if (smsFlow.verified) return 'success'
    if (smsFlow.sendStatus === 'error') return 'error'
    if (smsFlow.sendStatus === 'success') return 'success'
    return 'default'
  }, [smsFlow.verified, smsFlow.sendStatus])

  const ui: SmsSectionUI = useMemo(
    () => ({
      smsVerified: smsFlow.verified,
      smsCodeSent: smsFlow.codeSent,
      phoneDigitsState,
      smsCodeFieldState: smsFlow.ui.codeFieldState as FieldState,
      smsTimer: smsFlow.timer,
      smsSendLabel: smsFlow.codeSent ? '재전송' : '인증번호 받기',
      canSendSms: smsFlow.ui.canSend,
      canVerifySms: smsFlow.ui.canVerify,
      phoneSendStatus: smsFlow.sendStatus,
    }),
    [smsFlow, phoneDigitsState]
  )

  const messages: SmsSectionMessages = useMemo(
    () => ({
      phoneSendMsg: smsFlow.sendMsg,
      smsVerifyMsg: smsFlow.verifyMsg,
    }),
    [smsFlow.sendMsg, smsFlow.verifyMsg]
  )

  const actions: SmsSectionActions = useMemo(
    () => ({
      onSendSmsCode: smsFlow.actions.onSendCode,
      onVerifySmsCode: smsFlow.actions.onVerifyCode,
    }),
    [smsFlow.actions.onSendCode, smsFlow.actions.onVerifyCode]
  )

  return { values, ui, messages, actions }
}
