import { AUTH_MESSAGES } from '@/constants/authMessages'
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
  emailVerificationCode: string
}

export function useEmailSection(args: UseEmailSectionArgs) {
  const { emailFlow, email, emailVerificationCode } = args

  const values: EmailSectionValues = { email, emailVerificationCode }

  const ui: EmailSectionUI = {
    emailVerified: emailFlow.verified,
    emailCodeSent: emailFlow.codeSent,
    emailFieldState: emailFlow.ui.fieldState,
    emailVerificationCodeFieldState: emailFlow.ui.codeFieldState,
    emailTimer: emailFlow.timer,
    emailSendLabel: emailFlow.codeSent ? AUTH_MESSAGES.buttons.resend : AUTH_MESSAGES.buttons.emailSend,
    canSendEmail: emailFlow.ui.canSend,
    canVerifyEmail: emailFlow.ui.canVerify,
  }

  const messages: EmailSectionMessages = {
    flowMessage: emailFlow.flowMessage,
  }

  const actions: EmailSectionActions = {
    onSendEmailCode: emailFlow.actions.onSendCode,
    onVerifyEmailCode: emailFlow.actions.onVerifyCode,
  }

  return { values, ui, messages, actions }
}
