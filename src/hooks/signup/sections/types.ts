import type { FieldState } from '@/components/common/CommonInput'
import type { Status } from '@/hooks/useVerificationFlow'

export type CountdownTimer = {
  remain: number
  mmss: string
  isRunning: boolean
  start: () => void
  reset: () => void
}

/** Return shape of useVerificationFlow (used by email/sms flows) */
export type VerificationFlowReturn = {
  token: string | null
  verified: boolean
  codeSent: boolean
  sendStatus: Status
  sendMsg: string | null
  verifyStatus: Status
  verifyMsg: string | null
  timer: CountdownTimer
  ui: {
    sendLabel: string
    canSend: boolean
    canVerify: boolean
    fieldState: string
    codeFieldState: string
    toFieldState: (s: Status) => 'success' | 'error' | 'default'
  }
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
export type NicknameSectionMessages = { nicknameMsg: string | null }
export type NicknameSectionActions = { onCheckNickname: () => Promise<void> }

export type EmailSectionValues = { email: string; emailCode: string }
export type EmailSectionUI = {
  emailVerified: boolean
  emailCodeSent: boolean
  emailFieldState: FieldState
  emailCodeFieldState: FieldState
  emailTimer: CountdownTimer
  emailSendLabel: string
  canSendEmail: boolean
  canVerifyEmail: boolean
}
export type EmailSectionMessages = {
  emailSendMsg: string | null
  emailVerifyMsg: string | null
}
export type EmailSectionActions = {
  onSendEmailCode: () => Promise<void>
  onVerifyEmailCode: () => Promise<void>
}

export type SmsSectionValues = {
  phone1: string
  phone2: string
  phone3: string
  smsCode: string
  phoneNumber: string
}
export type SmsSectionUI = {
  smsVerified: boolean
  smsCodeSent: boolean
  phoneDigitsState: FieldState
  smsCodeFieldState: FieldState
  smsTimer: CountdownTimer
  smsSendLabel: string
  canSendSms: boolean
  canVerifySms: boolean
  phoneSendStatus: Status
}
export type SmsSectionMessages = {
  phoneSendMsg: string | null
  smsVerifyMsg: string | null
}
export type SmsSectionActions = {
  onSendSmsCode: () => Promise<void>
  onVerifySmsCode: () => Promise<void>
}

export type PasswordSectionValues = { password: string; passwordConfirm: string }
export type PasswordSectionUI = {
  passwordFieldState: FieldState
  passwordConfirmState: FieldState
}
export type PasswordSectionMessages = { passwordConfirmMsg: string | null }

export type SubmitSectionUI = { canSubmit: boolean }
export type SubmitSectionActions = {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
}
