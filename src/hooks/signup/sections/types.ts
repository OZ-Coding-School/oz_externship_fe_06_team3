import type { FieldState } from '@/components/common/CommonInput'
import type { Status } from '@/hooks/useVerificationFlow'
import type { FlowMessage } from '@/utils/formMessage'

export type CountdownTimer = {
  remain: number
  mmss: string
  isRunning: boolean
  start: () => void
  reset: () => void
}

export type VerificationFlowReturn = {
  token: string | null
  verified: boolean
  codeSent: boolean
  sendStatus: Status
  flowMessage: FlowMessage
  verifyStatus: Status
  timer: CountdownTimer
  ui: {
    canSend: boolean
    canVerify: boolean
    fieldState: FieldState
    codeFieldState: FieldState
  }
  toFieldState: (s: Status) => 'success' | 'error' | 'default'
  actions: {
    onSendCode: () => Promise<void>
    onVerifyCode: () => Promise<void>
  }
}

export type NicknameSectionValues = { nickname: string }
export type NicknameSectionUI = {
  nicknameChecked: boolean
  canCheckNickname: boolean
  nicknameFieldState: FieldState
}
export type NicknameSectionMessages = { flowMessage: FlowMessage }
export type NicknameSectionActions = { onCheckNickname: () => Promise<void> }

export type EmailSectionValues = { email: string; emailVerificationCode: string }
export type EmailSectionUI = {
  emailVerified: boolean
  emailCodeSent: boolean
  emailFieldState: FieldState
  emailVerificationCodeFieldState: FieldState
  emailTimer: CountdownTimer
  emailSendLabel: string
  canSendEmail: boolean
  canVerifyEmail: boolean
}
export type EmailSectionMessages = { flowMessage: FlowMessage }
export type EmailSectionActions = {
  onSendEmailCode: () => Promise<void>
  onVerifyEmailCode: () => Promise<void>
}

export type SmsSectionValues = {
  phone1: string
  phone2: string
  phone3: string
  phoneVerificationCode: string
  phoneNumber: string
}
export type SmsSectionUI = {
  smsVerified: boolean
  smsCodeSent: boolean
  phoneDigitsState: FieldState
  phoneVerificationCodeFieldState: FieldState
  smsTimer: CountdownTimer
  smsSendLabel: string
  canSendSms: boolean
  canVerifySms: boolean
  phoneSendStatus: Status
}
export type SmsSectionMessages = { flowMessage: FlowMessage }
export type SmsSectionActions = {
  onSendSmsCode: () => Promise<void>
  onVerifySmsCode: () => Promise<void>
}

export type PasswordSectionValues = {
  password: string
  passwordConfirm: string
}
export type PasswordSectionUI = {
  passwordFieldState: FieldState
  passwordConfirmState: FieldState
}
export type PasswordSectionMessages = { passwordConfirmMsg: string | null }

export type SubmitSectionUI = { canSubmit: boolean }
export type SubmitSectionActions = {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}
