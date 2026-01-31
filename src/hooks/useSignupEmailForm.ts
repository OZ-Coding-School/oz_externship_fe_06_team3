import { useCallback, type BaseSyntheticEvent } from 'react'
import type { SignupFormData } from '@/schemas/auth'
import type { Path } from 'react-hook-form'

import { AUTH_MESSAGES } from '@/constants/authMessages'
import { useSignupFormLogic } from '@/hooks/signup/useSignupFormLogic'
import {
  useNicknameSection,
  useEmailSection,
  useSmsSection,
  usePasswordSection,
  useSubmitSection,
} from '@/hooks/signup/sections'

import type { NicknameSectionProps } from '@/components/signup/NicknameSection'
import type { EmailSectionProps } from '@/components/signup/EmailSection'
import type { PhoneSectionProps } from '@/components/signup/PhoneSection'
import type { PasswordSectionProps } from '@/components/signup/PasswordSection'
import type { ButtonVariantProps } from '@/components/common/buttonVariants'

export type SignupSubmitProps = {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  label: string
  formError: string | null
  button: {
    disabled: boolean
    variant: ButtonVariantProps['variant']
  }
}

export function useSignupEmailForm() {
  const logic = useSignupFormLogic()
  const v = logic.watchValues

  const nicknameSection = useNicknameSection({
    nickname: v.nickname,
    nicknameChecked: logic.nicknameChecked,
    nicknameFlowMessage: logic.nicknameFlowMessage,
    nicknameFieldState: logic.nicknameFieldState,
    busy: logic.busy,
    onCheckNickname: logic.onCheckNickname,
  })

  const emailSection = useEmailSection({
    emailFlow: logic.emailFlow,
    email: v.email,
    emailVerificationCode: v.emailVerificationCode,
  })

  const smsSection = useSmsSection({
    smsFlow: logic.smsFlow,
    phone1: v.phone1,
    phone2: v.phone2,
    phone3: v.phone3,
    phoneVerificationCode: v.phoneVerificationCode,
    phoneNumber: v.phoneNumber,
  })

  const triggerForForm = useCallback(
    (name: Path<SignupFormData>) => logic.trigger(name),
    [logic]
  )

  const passwordSection = usePasswordSection({
    password: v.password,
    passwordConfirm: v.passwordConfirm,
    trigger: triggerForForm,
  })

  const submitSection = useSubmitSection({
    formValid: logic.formState.isValid,
    busy: logic.busy,
    nicknameChecked: nicknameSection.ui.nicknameChecked,
    emailVerified: emailSection.ui.emailVerified,
    smsVerified: smsSection.ui.smsVerified,
    passwordFieldState: passwordSection.ui.passwordFieldState,
    passwordConfirmState: passwordSection.ui.passwordConfirmState,
    onSubmit: logic.onSubmit,
  })

  const nicknameProps: NicknameSectionProps = {
    nicknameFieldState: nicknameSection.ui.nicknameFieldState,
    flowMessage: nicknameSection.messages.flowMessage,
    nicknameChecked: nicknameSection.ui.nicknameChecked,
    nickname: nicknameSection.values.nickname,
    canCheckNickname: nicknameSection.ui.canCheckNickname,
    busy: logic.busy,
    onCheckNickname: nicknameSection.actions.onCheckNickname,
  }

  const emailProps: EmailSectionProps = {
    emailFieldState: emailSection.ui.emailFieldState,
    emailVerificationCodeFieldState:
      emailSection.ui.emailVerificationCodeFieldState,
    flowMessage: emailSection.messages.flowMessage,
    emailVerified: emailSection.ui.emailVerified,
    emailCodeSent: emailSection.ui.emailCodeSent,
    emailTimer: emailSection.ui.emailTimer,
    emailSendLabel: emailSection.ui.emailSendLabel,
    canSendEmail: emailSection.ui.canSendEmail,
    canVerifyEmail: emailSection.ui.canVerifyEmail,
    onSendEmailCode: emailSection.actions.onSendEmailCode,
    onVerifyEmailCode: emailSection.actions.onVerifyEmailCode,
  }

  const phoneProps: PhoneSectionProps = {
    phone1: smsSection.values.phone1,
    phoneDigitsState: smsSection.ui.phoneDigitsState,
    phoneVerificationCodeFieldState:
      smsSection.ui.phoneVerificationCodeFieldState,
    flowMessage: smsSection.messages.flowMessage,
    smsVerified: smsSection.ui.smsVerified,
    smsCodeSent: smsSection.ui.smsCodeSent,
    smsTimer: smsSection.ui.smsTimer,
    smsSendLabel: smsSection.ui.smsSendLabel,
    canSendSms: smsSection.ui.canSendSms,
    canVerifySms: smsSection.ui.canVerifySms,
    onSendSmsCode: smsSection.actions.onSendSmsCode,
    onVerifySmsCode: smsSection.actions.onVerifySmsCode,
  }

  const passwordProps: PasswordSectionProps = {
    passwordFieldState: passwordSection.ui.passwordFieldState,
    passwordConfirmState: passwordSection.ui.passwordConfirmState,
    passwordConfirmMsg: passwordSection.messages.passwordConfirmMsg,
  }
  
  const submitProps: SignupSubmitProps = {
    onSubmit: submitSection.actions.onSubmit,
    label: logic.busy
      ? AUTH_MESSAGES.common.submitBusy
      : AUTH_MESSAGES.common.submitLabel,
    formError: logic.formError,
    button: {
      disabled: !submitSection.ui.canSubmit,
      variant: submitSection.ui.canSubmit ? 'primary' : 'disabled',
    },
  }

  return {
    methods: logic.methods,
    sections: {
      nickname: nicknameProps,
      email: emailProps,
      sms: phoneProps,
      password: passwordProps,
      submit: submitProps,
    },
  }
}
