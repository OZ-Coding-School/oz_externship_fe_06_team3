import type { FieldState } from '@/components/common/CommonInput'
import { useSignupFormLogic } from '@/hooks/signup/useSignupFormLogic'
import { useSignupFormVM } from '@/hooks/signup/useSignupFormVM'

export function useSignupEmailForm() {
  const logic = useSignupFormLogic()

  const vm = useSignupFormVM({
    password: logic.watchValues.password,
    passwordConfirm: logic.watchValues.passwordConfirm,
    trigger: (name: string) => logic.trigger(name as Parameters<typeof logic.trigger>[0]),
    nicknameStatus: logic.nicknameStatus,
    nicknameChecked: logic.nicknameChecked,
    nickname: logic.watchValues.nickname,
    busy: logic.busy,
    formValid: logic.formState.isValid,
    emailVerified: logic.emailFlow.verified,
    smsVerified: logic.smsFlow.verified,
    smsSendStatus: logic.smsFlow.sendStatus,
  })

  return {
    methods: logic.methods,

    values: logic.watchValues,

    ui: {
      busy: logic.busy,

      nicknameChecked: logic.nicknameChecked,
      canCheckNickname: vm.canCheckNickname,
      nicknameFieldState: vm.nicknameFieldState,

      emailVerified: logic.emailFlow.verified,
      emailCodeSent: logic.emailFlow.codeSent,
      emailFieldState: logic.emailFlow.ui.fieldState as FieldState,
      emailCodeFieldState: logic.emailFlow.ui.codeFieldState as FieldState,
      emailTimer: logic.emailFlow.timer,
      emailSendLabel: logic.emailFlow.codeSent ? '재전송' : '인증코드전송',
      canSendEmail: logic.emailFlow.ui.canSend,
      canVerifyEmail: logic.emailFlow.ui.canVerify,

      smsVerified: logic.smsFlow.verified,
      smsCodeSent: logic.smsFlow.codeSent,
      phoneDigitsState: vm.phoneDigitsState,
      smsCodeFieldState: logic.smsFlow.ui.codeFieldState as FieldState,
      smsTimer: logic.smsFlow.timer,
      smsSendLabel: logic.smsFlow.codeSent ? '재전송' : '인증번호 받기',
      canSendSms: logic.smsFlow.ui.canSend,
      canVerifySms: logic.smsFlow.ui.canVerify,
      phoneSendStatus: logic.smsFlow.sendStatus,

      passwordFieldState: vm.passwordFieldState,
      passwordConfirmState: vm.passwordConfirmState,

      canSubmit: vm.canSubmit,
    },

    messages: {
      nicknameMsg: logic.nicknameMsg,

      emailSendMsg: logic.emailFlow.sendMsg,
      emailVerifyMsg: logic.emailFlow.verifyMsg,

      phoneSendMsg: logic.smsFlow.sendMsg,
      smsVerifyMsg: logic.smsFlow.verifyMsg,

      passwordConfirmMsg: vm.passwordConfirmMsg,

      formError: logic.formError,
    },

    actions: {
      onCheckNickname: logic.onCheckNickname,

      onSendEmailCode: logic.emailFlow.actions.onSendCode,
      onVerifyEmailCode: logic.emailFlow.actions.onVerifyCode,

      onSendSmsCode: logic.smsFlow.actions.onSendCode,
      onVerifySmsCode: logic.smsFlow.actions.onVerifyCode,

      onSubmit: logic.onSubmit,
    },
  }
}
