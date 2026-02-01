import type { FieldState } from '@/components/common/CommonInput'
import { AUTH_MESSAGES } from '@/constants/authMessages'
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
  phoneVerificationCode: string
  phoneNumber: string
}

export function useSmsSection(args: UseSmsSectionArgs) {
  const { smsFlow, phone1, phone2, phone3, phoneVerificationCode, phoneNumber } = args

  const values: SmsSectionValues = { phone1, phone2, phone3, phoneVerificationCode, phoneNumber }

  const phoneDigitsState: FieldState =
    smsFlow.verified ? 'success'
    : smsFlow.sendStatus === 'error' ? 'error'
    : smsFlow.sendStatus === 'success' ? 'success'
    : 'default'

  const ui: SmsSectionUI = {
    smsVerified: smsFlow.verified,
    smsCodeSent: smsFlow.codeSent,
    phoneDigitsState,
    phoneVerificationCodeFieldState: smsFlow.ui.codeFieldState,
    smsTimer: smsFlow.timer,
    smsSendLabel: smsFlow.codeSent ? AUTH_MESSAGES.buttons.resend : AUTH_MESSAGES.buttons.smsSend,
    canSendSms: smsFlow.ui.canSend,
    canVerifySms: smsFlow.ui.canVerify,
    phoneSendStatus: smsFlow.sendStatus,
  }

  const messages: SmsSectionMessages = {
    flowMessage: smsFlow.flowMessage,
  }

  const actions: SmsSectionActions = {
    onSendSmsCode: smsFlow.actions.onSendCode,
    onVerifySmsCode: smsFlow.actions.onVerifyCode,
  }

  return { values, ui, messages, actions }
}
