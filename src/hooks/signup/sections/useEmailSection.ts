import { useMemo } from 'react'
import type { FieldState } from '@/components/common/CommonInput'
import type {
  VerificationFlowReturn,
  EmailSectionActions,
  EmailSectionMessages,
  EmailSectionUI,
  EmailSectionValues,
} from './types'

export type UseEmailSectionArgs = {
  emailFlow: VerificationFlowReturn
  email: string
  emailCode: string
}

export function useEmailSection(args: UseEmailSectionArgs) {
  const { emailFlow, email, emailCode } = args

  const values: EmailSectionValues = useMemo(
    () => ({ email, emailCode }),
    [email, emailCode]
  )

  const ui: EmailSectionUI = useMemo(
    () => ({
      emailVerified: emailFlow.verified,
      emailCodeSent: emailFlow.codeSent,
      emailFieldState: emailFlow.ui.fieldState as FieldState,
      emailCodeFieldState: emailFlow.ui.codeFieldState as FieldState,
      emailTimer: emailFlow.timer,
      emailSendLabel: emailFlow.codeSent ? '재전송' : '인증코드전송',
      canSendEmail: emailFlow.ui.canSend,
      canVerifyEmail: emailFlow.ui.canVerify,
    }),
    [emailFlow]
  )

  const messages: EmailSectionMessages = useMemo(
    () => ({
      emailSendMsg: emailFlow.sendMsg,
      emailVerifyMsg: emailFlow.verifyMsg,
    }),
    [emailFlow.sendMsg, emailFlow.verifyMsg]
  )

  const actions: EmailSectionActions = useMemo(
    () => ({
      onSendEmailCode: emailFlow.actions.onSendCode,
      onVerifyEmailCode: emailFlow.actions.onVerifyCode,
    }),
    [emailFlow.actions.onSendCode, emailFlow.actions.onVerifyCode]
  )

  return { values, ui, messages, actions }
}
